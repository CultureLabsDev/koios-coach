import { createId } from '@paralleldrive/cuid2';
import ActiveToggle from '@components/admin/ActiveToggle';
import Breadcrumbs from '@components/Breadcrumbs';
import Spinner from '@components/Spinner';
import Toast from '@components/Toast';
import ClientPage from './ClientPage';
import { deleteUser, getUser, updateUser } from '@models/db/users';
import { Context } from 'hono';
import Icon from '@components/Icon';

export const onRequestDelete = async (c: Context) => {
  const my_user = c.get('user');
  if (my_user.role !== 'admin') {
    return;
  }
  const client_id = c.req.param('client_id');
  await deleteUser(c.env, client_id, my_user.uid);
  return c.newResponse(null, { status: 303, headers: { 'HX-Location': '/admin/clients' } });
};

export const onRequestPatch = async (c: Context) => {
  const my_user = c.get('user');
  if (my_user.role !== 'admin') {
    return;
  }
  const client_id = c.req.param('client_id');
  let user = await getUser(c.env, client_id);
  if (!user) {
    return c.json({ error_message: 'user not found' }, 404);
  }
  user = await updateUser(c.env, client_id, {
    user_active: !user.user_active,
  });
  return c.html(<ActiveToggle user={user} />);
};

export const onRequestPut = async (c: Context) => {
  const my_user = c.get('user');
  if (my_user.role !== 'admin') {
    return;
  }
  const api_key = createId();
  await updateUser(c.env, c.req.param('client_id'), { api_key });
  return c.html(
    <>
      <div>{api_key}</div>
      <div>
        <a
          hx-post="/toaster?message=API Key copied to clipboard&color=success"
          hx-target="#toaster"
          data-tip="Copy API Key to clipboard"
          class="text-primary cursor-pointer hover:scale-110 hover:text-secondary tooltip"
          _={`on click call navigator.clipboard.writeText("${api_key}")`}
        >
          <Icon id="copy" />
        </a>
      </div>
      <Toast type="alert-info">API Key regenerated</Toast>
    </>
  );
};

export const onRequestPost = async (c: Context) => {
  const my_user = c.get('user');
  const client_id = c.req.param('client_id');
  const user = await getUser(c.env, client_id);
  if (!user) {
    return c.json({ error_message: 'user not found' }, 404);
  }
  return c.html(
    <ClientPage
      user={user}
      credit_remaining={user.credit_remaining}
      client_id={client_id}
      is_me={client_id === my_user.uid}
    />
  );
};

export const onRequestGet = async (c: Context) => {
  const client_id = c.req.param('client_id');
  return c.render(
    <div class="pt-8 px-4 lg:px-8">
      <Breadcrumbs
        crumbs={[
          { title: 'Home', href: '/admin' },
          { title: 'Clients', href: '/admin/clients' },
          { title: client_id.slice(0, 10) + '...' },
        ]}
      />
      <div hx-post={`/admin/clients/${client_id}`} hx-trigger="load">
        <Spinner message="Loading client..." />
      </div>
    </div>
  );
};
