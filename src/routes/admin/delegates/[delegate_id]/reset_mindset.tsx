  import Icon from '@components/Icon';
import { getUser, updateUser } from '@models/db/users';
import { Context } from 'hono';

export const onRequestPost = async (c: Context) => {
  const delegate_id = c.req.param('delegate_id');
  const user = await getUser(c.env, delegate_id);
  if (!user) {
    throw new Error('user not found');
  }
  await updateUser(c.env, delegate_id, { mindset_score: null });
  return c.html(<span class="text-red-500"><Icon id="x" /></span>);
};  