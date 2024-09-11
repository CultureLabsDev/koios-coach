import Spinner from '@components/Spinner';

export const Status = (status: string) => (
  <div id="spinner-message" hx-swap-oob="true">
    {status}
  </div>
);

export const Waiting = ({ status }: { status: string }) => (
  <div class="flex flex-col items-center w-full">
    <div
      hx-post="/user/personality/assess"
      hx-trigger="every 3s"
    >
      <Spinner message={status} />
    </div>
  </div>
)
