import InfoPane from '@components/recording/InfoPane';
import SpinnerOverlay from '@components/SpinnerOverlay';
import { getAssessment } from '@models/db/assessments';
import { Waiting } from '@components/recording/Waiting';
import RecordingHints from '@components/recording/RecordingHints';
import Toast from '@components/Toast';
import RecordingReady from '@components/recording/RecordingReady';
import RetryMessage from '@components/recording/RetryMessage';
import { Context } from 'hono';
import { handleRequest } from '@models/handler';
import { log } from '@models/db/logs';
import { User } from '@models/schema';

export const onRequestPatch = async (c: Context) => {
  const user: User = c.get('user');
  if (!user.assessment_id) {
    c.header('HX-Redirect', '/');
    return c.html('');
  }
  const assessment = await getAssessment(c.env, user.assessment_id);
  if (assessment?.status === 'done') {
    c.header('HX-Redirect', '/user/chat');
    return c.html('');
  } else if (assessment?.status === 'error') {
    return c.html(<RetryMessage href="/user/personality/assess" />);
  } else {
    return c.html(<Waiting status="Processing your results..." />);
  }
};

export const onRequestPost = async (c: Context) => {
  const user: User = c.get('user');
  if (user.assessment_id) {
    return c.html(<Toast type="alert-error">Assessment already exists</Toast>);
  }
  const formData = await c.req.formData();
  const file = formData.get('audio') as unknown as File;
  if (!file) {
    await log(c.env, user.uid, '', 'record', 'audio file is missing', 'error');
    return c.html(<Toast type="alert-error">Audio file is missing</Toast>);
  }
  const first_name = user.name.split(' ')[0];
  const response = await handleRequest(c, file, user.uid, first_name);
  if (!response) {
    return c.html(<Toast type="alert-error">Error processing audio</Toast>);
  }
  return c.html(<Waiting status="Processing your results..." />);
};

export const onRequestGet = async (c: Context) => {
  const user: User = c.get('user');
  if (user?.assessment_id) {
    return c.render(
      <div id="page" class="flex flex-col items-center justify-center">
        <div hx-patch="/user/personality" hx-trigger="load">
          <SpinnerOverlay text="Loading.." />
        </div>
      </div>
    );
  }
  return c.html(
    <div
      class="flex flex-col items-center justify-center"
      id="page"
      x-data="recordingApp('/user/personality')"
    >
      <div x-show="!uploading" class="max-w-xl">
        <div x-show="!readyToUpload">
          <div x-show="showInfo">
            <InfoPane name={user.known_as!} />
          </div>
          <div x-show="!showInfo">
            <RecordingHints />
          </div>
        </div>
        <div x-show="readyToUpload" id="uploadControls">
          <RecordingReady />
        </div>
      </div>
      <div x-show="uploading" class="spinner">
        <SpinnerOverlay text="Uploading Audio.." />
      </div>
    </div>
  );
};
