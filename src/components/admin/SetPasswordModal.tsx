import Icon from '../Icon';

export default () => (
  <div class="modal modal-open" id="team-dialog">
    <div class="modal-box bg-white p-12 max-w-xl" _="on click elsewhere remove #team-dialog">
      <div class="absolute right-0 top-2">
        <button type="button" class="text-primary p-4 hover:opacity-50" _="on click remove #team-dialog">
          <Icon id="x" size={40} />
        </button>
      </div>
      <form hx-post="#" hx-target="#toaster" class="flex items-center justify-center">
        <div class="px-8 py-10 max-w-lg">
          <div class="text-black mb-8 text-2xl text-center">Koios API - Set a new password</div>
          <input type="password" name="password" class="w-full input mb-4" required placeholder="Enter your password" />
          <input
            type="password"
            name="password2"
            class="w-full input mb-8"
            required
            placeholder="Confirm your password"
          />
          <button type="submit" class="w-full btn btn-primary">
            Set Password
          </button>
        </div>
      </form>
    </div>
  </div>
);
