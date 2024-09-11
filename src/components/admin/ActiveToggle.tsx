import { User } from '@models/schema';

export default ({ user }: { user: User }) => (
  <label id="toggle" class="cursor-pointer label">
    <span class="label-text text-primary mr-4">{user.user_active ? 'Enabled' : 'Disabled'}</span>
    <input
      type="checkbox"
      class="toggle toggle-primary"
      hx-patch={`/admin/clients/${user.uid}`}
      hx-trigger="change"
      hx-target="#toggle"
      hx-swap="outerHTML"
      checked={user.user_active}
    />
  </label>
);
