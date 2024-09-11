import { Context } from 'hono';
import { updateUser } from '@models/db/users';
import { deleteAssessment, getAssessment } from '@models/db/assessments';
import { getAssessmentStatus } from '@models/process';
import Toast from '@components/Toast';
import { Waiting } from '@components/recording/Waiting';
import { User } from '@models/schema';

export const onRequestDelete = async (c: Context) => {
  const user: User = c.get('user');
  await updateUser(c.env, user.uid, { assessment_id: null });
  await deleteAssessment(c.env, user.assessment_id!);
  c.header('HX-Redirect', '/user/personality');
  return c.html(<Toast type="alert-info">Assessment deleted</Toast>);
};


export const onRequestPut = async (c: Context) => {
  const user: User = c.get('user');
  const assessment_id = user?.assessment_id;
  if (!user || !assessment_id) {
    return c.html(<Toast type="alert-error">User not found</Toast>);
  }
  const assessment = await getAssessment(c.env, assessment_id);
  if (!assessment) {
    return c.html(<Toast type="alert-error">Assessment not found</Toast>);
  }
  console.log('sending message to queue', assessment.filename);
  await c.env.QUEUE.send({ uid: user.uid, assessment_id });
  return c.html(
    <div class="p-8 pt-4 h-screen">
      <div class="flex flex-col items-center justify-center mt-6 lg:mt-20">
        <div id="page">
          <Waiting status="Processing your results..." />
        </div>
      </div>
    </div>
  );
};

export const onRequestPost = async (c: Context) => {
  const user: User = c.get('user');
  if (user?.assessment_id) {
    const assessment = await getAssessment(c.env, user.assessment_id);
    const output = await getAssessmentStatus('/user/personality/assess', 'POST', assessment);
    console.log(assessment?.assessment_id, assessment?.status);
    return c.html(output);
  }
  return c.html(<Toast type="alert-error">Assessment not found</Toast>);
};
