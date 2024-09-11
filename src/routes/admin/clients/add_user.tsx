import Toast from '@components/Toast';
import { signUp } from '@models/db/users';
import { Context } from 'hono';
import ClientCard from './ClientCard';
import CloseModal from '@components/CloseModal';
import AddClientModal from './AddClientModal';
import PasswordModal from '@components/admin/PasswordModal';

export const onRequestPost = async (c: Context) => {
  const my_user = c.get('user');
  const data = await c.req.formData();
  const email = data.get('email') as string;
  const name = data.get('name') as string;
  const response = await signUp(c.env, name, email, 'client', my_user.uid);
  if (!response) {
    return c.html(<Toast type="alert-error">Failed to sign up</Toast>);
  }
  const { password, user } = response;
  return c.html(
    <>
      <ClientCard my_user={my_user!} client={user} />
      <Toast type="alert-success">New user created</Toast>
      <PasswordModal password={password} />
      <CloseModal />
    </>
  );
};

export const onRequestGet = async (c: Context) => {
  return c.render(<AddClientModal />);
};
