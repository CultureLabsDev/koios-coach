export default () => (
  <div class="pt-8 px-4 lg:px-8">
    <div class="mt-6 w-full">
      <div id="user-header">
        <div class="mb-8">
          <div class="text-3xl font-bold">Home</div>
          <div class="text-sm">Recent activty for Koios API</div>
        </div>

        <div hx-patch="/admin" hx-trigger="load" class="max-w-2xl mb-2">
          ...
        </div>
        <div class="bg-radial-pink p-6 rounded-xl w-full" hx-post="/admin" hx-trigger="load">
          ...
        </div>
      </div>
    </div>
  </div>
);
