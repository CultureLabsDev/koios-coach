import HomePage from './HomePage';
import Spinner from '@components/Spinner';
import Toast from '@components/Toast';
import { getLogs } from '@models/db/logs';
import { Context } from 'hono';

export const onRequestPatch = async (c: Context) => {
  const user = c.get('user');
  if (user.role !== 'admin') {
    return c.html(<Toast type="alert-error">Unauthorized</Toast>);
  }
  // console.log('loggings', loggings);
  return c.html(<div>Some info</div>);
};

export const onRequestPost = async (c: Context) => {
  const user = c.get('user');
  if (user.role !== 'admin') {
    return c.html(<Toast type="alert-error">Unauthorized</Toast>);
  }
  const loggings = await getLogs(c.env, 0);
  // console.log('loggings', loggings);
  return c.html(
    <div>
      <div class="flex gap-2 ml-4 text-primary font-bold">
        <div class="w-44 whitespace-nowrap">Time</div>
        <div class="w-44 whitespace-nowrap">User Id</div>
        <div class="w-44 whitespace-nowrap">Assessment Id</div>
        <div class="w-44 whitespace-nowrap">Event</div>
      </div>
      <div class="overflow-y-auto h-[40rem]">
        <div class="flex flex-col gap-1 join join-vertical rounded-lg">
          {loggings.map((log) => (
            <div class="collapse collapse-arrow join-item bg-base-100">
              <input type="radio" name="log-accordion" />
              <div class="flex gap-2 collapse-title">
                <div class="text-neutral-600 text-sm w-44 whitespace-nowrap truncate">{log.created_at}</div>
                <div class="text-primary text-sm w-44 whitespace-nowrap truncate">{log.uid}</div>
                <div class="text-secondary text-sm w-44 whitespace-nowrap truncate">{log.assessment_id}</div>
                <div
                  class={`${
                    log.event === 'error' ? 'text-red-600' : 'text-green-600'
                  } text-sm w-44 whitespace-nowrap truncate`}
                >
                  {log.event}
                </div>
              </div>
              <div class="flex-1 text-sm collapse-content">{log.message}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const onRequestGet = async (c: Context) => {
  const user = c.get('user');
  const toast = c.req.query('toast');
  const is_admin = user.role === 'admin';
  return c.render(
    <>
      {toast && <Toast type="alert-info">{toast}</Toast>}
      {is_admin ? (
        <HomePage />
      ) : (
        <div class="pt-8 px-4 lg:px-8">
          <div hx-post={`/admin/clients/${user.uid}`} hx-trigger="load">
            <Spinner message="Loading profile..." />
          </div>
        </div>
      )}
    </>
  );
};
