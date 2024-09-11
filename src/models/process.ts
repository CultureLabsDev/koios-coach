import { Env, DeepgramResponse } from '@interfaces';
import { updateAssessment } from '@models/db/assessments';
import { log } from '@models/db/logs';
import { signedUrlGet } from './r2';
import { getPredictions } from './personality';
import { getUser } from './db/users';
import { Assessment } from './schema';
import { Status } from '@components/recording/Waiting';
import RetryMessage from '@components/recording/RetryMessage';
import Congratulations from '@components/recording/Congratulations';

const transcribeAudio = async (env: Env, assessment_id: string, uid: string) => {
  const assessment = await updateAssessment(env, assessment_id, { status: 'transcribing' });
  if (!assessment) {
    throw new Error('Assessement is undefined');
  }
  const audio_url = await signedUrlGet(env, 'koios-audio', assessment.filename!, 1);
  await log(
    env,
    uid,
    assessment.assessment_id,
    'transcription request',
    `filename: ${assessment.filename}, url: ${audio_url}`,
    'info'
  );
  const deepUrl = new URL(env.DEEPGRAM_URL);
  const search = new URLSearchParams({
    model: 'nova-2',
    smart_format: 'true',
    paragraphs: 'true',
    diarize: 'true',
    filler_words: 'true',
    language: 'en-GB',
  });
  deepUrl.search = search.toString();
  const transcribe = await fetch(deepUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${env.DEEPGRAM_KEY}`,
    },
    body: JSON.stringify({ url: audio_url }),
  });
  const json = (await transcribe.json()) as DeepgramResponse;
  const transcript = json.results.channels[0].alternatives[0].transcript;
  const paragraphs = json.results.channels[0].alternatives[0].paragraphs.paragraphs;
  await updateAssessment(env, assessment.assessment_id, { transcript });
  return { transcript, paragraphs, audio_url };
};

const predictPersonality = async (env: Env, assessment_id: string, uid: string, transcript: string) => {
  const assessment = await updateAssessment(env, assessment_id, { status: 'processing' });
  if (!assessment) {
    throw new Error('Assessement not found');
  }
  const startTime = performance.now();
  await log(env, uid, assessment_id, 'prediction request', 'sending', 'info');
  console.log('transcript', transcript);
  console.log('filename', assessment.filename);
  const predictions = await getPredictions(env, transcript, assessment.filename);
  log(
    env,
    uid,
    assessment_id,
    'prediction response',
    JSON.stringify(
      {
        agreeableness: predictions.agreeableness,
        conscientiousness: predictions.conscientiousness,
        extraversion: predictions.extraversion,
        neuroticism: predictions.neuroticism,
        openness: predictions.openness,
      },
      null,
      2
    ),
    'info'
  );
  await updateAssessment(env, assessment_id, predictions);
  await log(env, uid, assessment_id, 'prediction', `took: ${performance.now() - startTime}ms`, 'info');
};

const processCredits = async (env: Env, assessment_id: string, uid: string) => {
  const user = await getUser(env, uid);
  if (!user) {
    throw new Error('User is undefined');
  }
  const { credit_remaining } = user;
  const price = 1;
  if (credit_remaining < price) {
    await log(env, uid, assessment_id, 'credits', 'out of credits', 'info');
  }
  await env.DB.prepare('UPDATE users SET credit_remaining = ? WHERE uid = ?')
    .bind(credit_remaining - price, uid)
    .run();
};

export const getAssessmentStatus = async (href: string, method: string, assessment?: Assessment) => {
  switch (assessment?.status) {
    case 'pending':
      return Status('Pending Processing..');
    case 'transcribing':
      return Status('Transcribing Audio..');
    case 'processing':
      return Status('Processing Audio..');
    case 'done': {
      return Congratulations();
    }
    default:
      return RetryMessage({ href });
  }
};

export const processAudio = async (env: Env, uid: string, assessment_id: string) => {
  try {
    const { transcript } = await transcribeAudio(env, assessment_id, uid);
    console.log('transcription completed');

    await predictPersonality(env, assessment_id, uid, transcript);
    console.log('personality predicted');

    await processCredits(env, assessment_id, uid);
    console.log('credits processed');

    await updateAssessment(env, assessment_id, { status: 'done' });
    console.log('assessment done');

    await log(env, uid, assessment_id, 'processAudio', 'complete', 'info');
  } catch (e) {
    await log(env, uid, assessment_id, 'error', `Error processing: ${e}`, 'error');
    await updateAssessment(env, assessment_id!, { status: 'error', error: String(e) });
  }
};
