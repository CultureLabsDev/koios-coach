import Toast from '@components/Toast';
import ClientCard from './ClientCard';
import { searchUsers } from '@models/db/users';
import { Context } from 'hono';

export const onRequestPost = async (c: Context) => {
  const my_user = c.get('user');
  if (my_user.role !== 'admin') {
    return c.html(<Toast type="alert-error">You do not have permission</Toast>);
  }
  const data = await c.req.formData();
  const search = data.get('search') as string;
  const clients = await searchUsers(c.env, search, 'client', my_user.uid);
  return c.html(
    <>
      {clients.length > 0 ? (
        clients?.map((client) => <ClientCard my_user={my_user} client={client} />)
      ) : (
        <Toast type="alert-error">No clients found</Toast>
      )}
    </>
  );
};
