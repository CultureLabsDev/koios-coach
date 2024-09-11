import ActiveToggle from '@components/admin/ActiveToggle';
import CreditRemaining from '@components/admin/CreditRemaining';
import { User } from '@models/schema';

type Props = {
  user: User;
  credit_remaining: number;
  is_me: boolean;
  client_id: string;
};
export default ({ user, is_me, client_id, credit_remaining }: Props) => (
  <div class="max-w-3xl mt-10 flex gap-4">
    <div class="flex-1">
      <div id="user-header" class="flex flex-col lg:flex-row mb-2 lg:mb-8 justify-between">
        <div class="flex-1">
          <div class="text-3xl font-bold">{user.name} </div>
          <div class="text-xl">{user.email}</div>
        </div>
        {!is_me && <ActiveToggle user={user} />}
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex gap-4 items-center px-6 py-2 rounded-lg bg-base-100">
          <div class="text-xl w-20">Role</div>
          <div class="text-xl text-primary">{user.role}</div>
        </div>
        {user.role === 'client' && <CreditRemaining credit_remaining={credit_remaining} uid={user.uid} is_me={is_me} />}
        <button hx-post={`/admin/clients/${user.uid}/password`} hx-target="#modal" class="btn btn-primary btn-outline">
          Reset Password
        </button>
        {user.role === 'client' && (
          <>
            <hr class=" text-secondary my-4" />
            <div id="assistant_section" hx-get={`/admin/clients/${client_id}/assistant`} hx-trigger="load"></div>
          </>
        )}
      </div>
    </div>
  </div>
);
