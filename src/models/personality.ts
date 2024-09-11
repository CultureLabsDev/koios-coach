import { PredictionResponse, Env } from '@interfaces';
import * as jose from 'jose';
import { createId } from '@paralleldrive/cuid2';

const TWO_MINUTES = 2 * 60 * 1000;

export const getPredictions = async (env: Env, transcript: string, audio_url: string) => {
  const userId = createId();
  const formData = new FormData();
  const secret = new TextEncoder().encode(env.JWT_SECRET);

  const token = await new jose.SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('10m')
    .sign(secret);
  formData.append('token', token);
  formData.append('transcript', transcript);
  formData.append('audio_url', audio_url);
  const controller = new AbortController();
  const { signal } = controller;
  const fetchPromise = fetch(env.PREDICTION_API_URL, {
    method: 'POST',
    body: formData,
    signal,
  });
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      controller.abort(); // This will abort the fetch
      reject(new Error('Prediction API: timed out'));
    }, TWO_MINUTES);
  });
  const response = await Promise.race([fetchPromise, timeoutPromise]);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`${response.status}: ${error}`);
  }
  const json = (await response.json()) as PredictionResponse;
  const { agreeableness, conscientiousness, extraversion, neuroticism, openness } = json.assessment;
  return { agreeableness, conscientiousness, extraversion, neuroticism, openness };
};
