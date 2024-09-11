import PasswordModal from '@components/admin/PasswordModal';
import { resetPassword } from '@models/db/users';
import { Context } from 'hono';

export const onRequestPost = async (c: Context) => {
  const my_user = c.get('user');
  const client_id = c.req.param('client_id');
  const password = await resetPassword(c.env, client_id);
  if (my_user?.uid === client_id) {
    return c.newResponse(null, { status: 303, headers: { 'HX-Location': '/reset' } });
  }
  return c.html(<PasswordModal password={password} />);
};
