import Icon from '../Icon';

export default ({ password }: { password: string }) => (
  <div class="modal modal-open" id="team-dialog">
    <div class="modal-box bg-white p-12 max-w-xl" _="on click elsewhere remove #team-dialog">
      <div class="absolute right-0 top-2">
        <button type="button" class="text-primary p-4 hover:opacity-50" _="on click remove #team-dialog">
          <Icon id="x" size={40} />
        </button>
      </div>
      <h3 class="text-3xl font-bold text-dark mt-4 mb-4">Password Reset</h3>
      <div class="mb-4">The temporary password for the user is:</div>
      <div class="flex gap-4 items-center text-mono">
        <div class="text-xl text-primary">{password} </div>
        <div
          hx-post="/toaster?message=Temporary password copied to clipboard&color=success"
          hx-target="#toaster"
          data-tip="Copy password to clipboard"
          class="text-primary cursor-pointer hover:scale-110 hover:text-secondary tooltip"
          _={`on click call navigator.clipboard.writeText("${password}")`}
        >
          <Icon id="copy" />
        </div>
      </div>
    </div>
  </div>
);
