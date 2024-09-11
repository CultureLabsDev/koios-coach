import Toast from '@components/Toast';
import {uploadRAGFile, deleteRAGFile, createAssistant, getFileList} from '@models/phoebe';
import { Context } from 'hono';
import AssistantSection from './AssistantSection';
import { getUser } from '@models/db/users';

export const onRequestDelete = async (c: Context) => {
  const my_user = c.get('user');

  if (my_user.role !== 'admin') {
    return c.html(<Toast type="alert-error">You do not have permission</Toast>);
  }
  const client_id = c.req.param('client_id');
  const file_id = c.req.query('file_id');
  if (!file_id) {
    return c.html(<Toast type="alert-error">File ID not found</Toast>);
  }
  await deleteRAGFile(c, client_id, file_id);
  return c.html(<Toast type="alert-success">File deleted</Toast>);
};

export const onRequestPut = async (c: Context) => {
  const my_user = c.get('user');

  if (my_user.role !== 'admin') {
    return c.html(<Toast type="alert-error">You do not have permission</Toast>);
  }
  const client_id = c.req.param('client_id');
  const user = await getUser(c.env, client_id);
  if (!user) {
    return c.html(<Toast type="alert-error">User not found</Toast>);
  }
  const data = await c.req.formData();
  const file = data.get('file') as unknown as File;
  await uploadRAGFile(c, client_id, file);
  const files = await getFileList(c, client_id);
  return c.html(<AssistantSection assistant_id={user.assistant_id!} files={files} client_id={client_id} />);
};

export const onRequestPost = async (c: Context) => {
  const my_user = c.get('user');

  if (my_user.role !== 'admin') {
    return c.html(<Toast type="alert-error">You do not have permission</Toast>);
  }
  const client_id = c.req.param('client_id');
  const assistant_id = await createAssistant(c, client_id);
  return c.html(
    <>
      <Toast type="alert-error">
        <div>Assistant Created {assistant_id}</div>
      </Toast>
      <AssistantSection assistant_id={assistant_id} client_id={client_id} />
    </>
  );
};

export const onRequestGet = async (c: Context) => {
  const my_user = c.get('user');

  if (my_user.role !== 'admin') {
    return c.html(<Toast type="alert-error">You do not have permission</Toast>);
  }
  const client_id = c.req.param('client_id');
  const user = await getUser(c.env, client_id);
  if (user?.assistant_id) {
    const files = await getFileList(c, client_id);
    return c.html(<AssistantSection assistant_id={user.assistant_id} files={files} client_id={client_id} />);
  }

  return c.html(
    <button hx-post={`/admin/clients/${client_id}/assistant`} hx-swap="outerHTML" class="btn btn-secondary text-xl">
      Create Assistant
    </button>
  );
};
