import { PutObjectCommand } from '@aws-sdk/client-s3';
import { createId } from '@paralleldrive/cuid2';
import { addAssessment } from '@models/db/assessments';
import { getR2Client } from '@models/r2';
import { Context } from 'hono';
import { log } from './db/logs';
import { updateUser } from './db/users';

export const handleRequest = async (c: Context, file: File, uid: string, name: string) => {
  console.log('endpoint called');
  try {
    const ext = file.name.split('.').pop();
    const objectName = createId();
    const filename = objectName + '.' + ext;
    await getR2Client(c.env).send(
      new PutObjectCommand({
        Bucket: 'koios-audio',
        Key: filename,
        Body: file,
      })
    );
    const assessment_id = createId();
    await log(c.env, uid, assessment_id, 'queueing', 'assessment', 'info');
    console.log('adding assessment');
    await updateUser(c.env, uid, { assessment_id });
    await addAssessment(c.env, {
      assessment_id,
      name,
      filename,
      status: 'processing',
    });
    await c.env.QUEUE.send({ uid, assessment_id });
    return true;
  } catch (e) {
    console.error(e);
    await log(c.env, uid, '', 'record', String(e), 'error');
    return false;
  }
};
