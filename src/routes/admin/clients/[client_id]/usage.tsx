import CreditRemaining from '@components/admin/CreditRemaining';
import Toast from '@components/Toast';
import { getUser, updateUser } from '@models/db/users';
import { Context } from 'hono';

export const onRequestPatch = async (c: Context) => {
  const my_user = c.get('user');
  const client_id = c.req.param('client_id');
  const user = await getUser(c.env, client_id);
  if (!user) {
    return c.json({ error_message: 'user not found' }, 404);
  }
  const data = await c.req.formData();
  const credit_remaining = Number(data.get('credit_remaining'));
  const is_me = user.uid === my_user.uid;
  await updateUser(c.env, client_id, { credit_remaining });
  return c.html(
    <>
      <Toast type="alert-info">Credits updated</Toast>
      <CreditRemaining credit_remaining={credit_remaining} uid={user.uid} is_me={is_me} />
    </>
  );
};
