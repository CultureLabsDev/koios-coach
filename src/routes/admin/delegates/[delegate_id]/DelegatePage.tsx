import ActiveToggle from '@components/admin/ActiveToggle';
import Icon from '@components/Icon';
import { User } from '@models/schema';

type Props = {
  user: User;
  is_me: boolean;
};
export default ({ user, is_me }: Props) => (
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
        <div class="flex items-center px-6 py-2 rounded-lg bg-base-100 gap-4">
          <div class="text-xl w-40">Role</div>
          <div class="text-xl text-primary">{user.role}</div>
        </div>
        <div class="flex items-center px-6 py-2 rounded-lg bg-base-100 gap-4">
          <div class="text-xl w-40">Known As</div>
          <div class="text-xl text-primary">{user.known_as}</div>
        </div>
        <div class="flex items-center px-6 py-2 rounded-lg bg-base-100 gap-4">
          <div class="text-xl w-40">Mindset</div>
          <div id="mindset_score" class="text-xl text-primary">{user.mindset_score !== null ? <span class="text-green-500"><Icon id="check" /></span> : <span class="text-red-500"><Icon id="x" /></span>}</div>
          <button hx-post={`/admin/delegates/${user.uid}/reset_mindset`} hx-target="#mindset_score" class="btn btn-sm btn-error btn-outline justify-end">Reset</button>
        </div>
        <div class="flex items-center px-6 py-2 rounded-lg bg-base-100 gap-4">
          <div class="text-xl w-40">Personality</div>
          <div id="personality_score" class="text-xl text-primary">{user.assessment_id !== null ? <span class="text-green-500"><Icon id="check" /></span> : <span class="text-red-500"><Icon id="x" /></span>}</div>
          <button hx-post={`/admin/delegates/${user.uid}/reset_personality`} hx-target="#personality_score" class="btn btn-sm btn-error btn-outline justify-end">Reset</button>
        </div>
        <button hx-post={`/admin/delegates/${user.uid}/password`} hx-target="#modal" class="btn btn-primary btn-outline">
          Reset Password
        </button>
      </div>
    </div>
  </div>
);
