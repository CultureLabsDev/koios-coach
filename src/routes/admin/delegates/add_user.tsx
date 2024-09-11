import Toast from '@components/Toast';
import { signUp } from '@models/db/users';
import { Context } from 'hono';
import CloseModal from '@components/CloseModal';
import AddDelegateModal from './AddDelegateModal';
import PasswordModal from '@components/admin/PasswordModal';
import DelegateCard from './DelegateCard';

export const onRequestPost = async (c: Context) => {
  const my_user = c.get('user');
  const data = await c.req.formData();
  const email = data.get('email') as string;
  const name = data.get('name') as string;
  try {
    const response = await signUp(c.env, name, email, 'delegate', my_user.uid);
    if (!response) {
      return c.html(<Toast type="alert-error">Failed to sign up</Toast>);
    }
    const { password, user } = response;
    return c.html(
      <>
        <DelegateCard my_user={my_user!} client={user} />
        <Toast type="alert-success">New user created</Toast>
        <PasswordModal password={password} />
        <CloseModal />
      </>
    );
  } catch (e) {
    return c.html(<Toast type="alert-error">{String(e)}</Toast>);
  }
};

export const onRequestGet = async (c: Context) => {
  return c.render(<AddDelegateModal />);
};
