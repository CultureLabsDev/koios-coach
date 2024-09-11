import { updateUser } from '@models/db/users';
import { Context } from 'hono';

export const onRequestPost = async (c: Context) => {
  const my_user = c.get('user');
  const uid = c.req.param('uid');
  if (my_user.role !== 'admin') {
    return;
  }
  const data = await c.req.formData();
  const notes = data.get('notes') || '';

  const user = await updateUser(c.env, uid, { notes });

  return c.html(
    <textarea
      id="notes-widget"
      class="textarea textarea-bordered textarea-primary text-primary font-mono text-lg w-full bg-neutral-700"
      name="notes"
      placeholder="Billing Notes"
      hx-post={`/admin/clients/${uid}/notes`}
      hx-trigger="keyup changed delay:500ms"
      hx-target="#notes-widget"
    >
      {user.notes}
    </textarea>
  );
};
