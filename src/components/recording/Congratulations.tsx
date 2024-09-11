export default () => (
  <div id="page" hx-swap-oob="true" class="flex flex-col items-center justify-center"
>
    <div>
      <img src="/static/img/congratulations.svg" alt="party-popper" width="100" />
    </div>
    <div class="text-2xl text-accent font-bold mb-4">Congratulations ... your assessment is complete!</div>
    <button class="btn btn-gradient w-full" hx-get="/user/mindset" hx-target="#page" hx-swap="outerHTML">Continue</button>
  </div>
);
