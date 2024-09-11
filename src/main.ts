import { Hono } from 'hono';
import { Env, QueueMessage } from '@interfaces';
import { serveStatic } from 'hono/cloudflare-workers';
import { applyLayouts } from '@layout';
import manifest from '__STATIC_CONTENT_MANIFEST';
import { loadRoutes } from '@router';
import { applyMiddleware } from '@middleware';
import { processAudio } from '@models/process';

const app = new Hono<{ Bindings: Env }>();
app.get('/static/*', serveStatic({ root: './', manifest }));

applyLayouts(app);
applyMiddleware(app);
loadRoutes(app);

export default {
  ...app,
  async queue(batch: MessageBatch<QueueMessage>, env: Env): Promise<void> {
    console.log('queue called');
    const tasks = batch.messages.map(async (message) => {
      await processAudio(env, message.body.uid, message.body.assessment_id);
    });
    await Promise.all(tasks);
  },
};
