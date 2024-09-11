import Icon from '@components/Icon';

export default () => (
  <div class="modal modal-open" id="team-dialog">
    <div class="modal-box bg-white p-12 max-w-xl" _="on click elsewhere remove #team-dialog">
      <div class="absolute right-0 top-2">
        <button type="button" class="text-primary p-4 hover:opacity-50" _="on click remove #team-dialog">
          <Icon id="x" size={40} />
        </button>
      </div>
      <form hx-post="/admin/clients/add_user" hx-target="#users-list" hx-swap="afterbegin">
        <h3 class="text-3xl font-bold text-dark mt-4 mb-4">Create new client</h3>
        <label for="name" class="label label-text text-lg">
          Client name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autocomplete="off"
          autofocus
          title="Cannot be empty"
          placeholder="Client's name"
          class="input w-full text-xl bg-white border-2 border-[#F0F0F0] my-2"
        />
        <input
          id="name"
          name="email"
          type="email"
          required
          autocomplete="off"
          title="Cannot be empty"
          placeholder="Client's email"
          class="input w-full text-xl bg-white border-2 border-[#F0F0F0] my-2"
        />
        <div class="modal-action">
          <button type="submit" class="btn btn-md btn-gradient w-full">
            Create Client
          </button>
        </div>
      </form>
    </div>
  </div>
);
