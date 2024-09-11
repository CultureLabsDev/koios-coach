import Toast from '@components/Toast';
import DelegateCard from './DelegateCard';
import { searchUsers } from '@models/db/users';
import { Context } from 'hono';

export const onRequestPost = async (c: Context) => {
  const my_user = c.get('user');
  if (my_user.role === 'delegate') {
    return c.html(<Toast type="alert-error">You do not have permission</Toast>);
  }
  const data = await c.req.formData();
  const search = data.get('search') as string;
  const delegates = await searchUsers(c.env, search, 'delegate', my_user.uid);
  return c.html(
    <>
      {delegates.length > 0 ? (
        delegates?.map((client) => <DelegateCard my_user={my_user} client={client} />)
      ) : (
        <Toast type="alert-info">No delegates found</Toast>
      )}
    </>
  );
};
