export default ({ href }: { href: string }) => (
  <div id="page" hx-swap-oob="true" class="flex flex-col items-center max-w-xl pt-8 px-4">
    <div class="text-xl font-bold mb-6 text-center">Oops looks like something has gone wrong</div>
    <div class="text-md mb-4 text-center">We've encountered an issue processing your insights.</div>
    <button
      hx-delete={href}
      class="btn btn-secondary rounded-none w-full text-white mb-2"
      hx-target="#page"
      hx-swap="outerHTHML"
      hx-indicator="#spinner"
    >
      Click here to try again
    </button>
  </div>
);
