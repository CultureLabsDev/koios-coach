export default () => (
  <form hx-post="/reset" hx-target="#error" class="h-screen flex items-center justify-center">
    <div class="bg-radial-pink rounded-lg px-8 py-40 shadow-lg max-w-lg">
      <div class="text-white mb-8 text-2xl text-center">Koios API - Set a new password</div>
      <input type="password" name="password" class="w-full input mb-4" required placeholder="Enter your password" />
      <input type="password" name="password2" class="w-full input mb-8" required placeholder="Confirm your password" />
      <button type="submit" class="w-full btn btn-primary">
        Set Password
      </button>
      <div id="error" class="mt-2"></div>
    </div>
  </form>
);
