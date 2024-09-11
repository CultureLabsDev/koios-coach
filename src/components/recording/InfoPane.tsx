export default ({ name }: { name: string }) => (
  <>
    <div class="flex flex-col items-center justify-center">
      <div class="text-center text-3xl font-bold mb-4 px-6">Hey {name}, it's great to meet you.</div>
      <div class="mb-4 text-md text-center px-6">
        Let's get a little more personal. It's time to find out all about your personality
      </div>
      <div>
        <div class="mt-2 text-left mb-8 bg-gray-200 text-gray-500 rounded-3xl p-6">
          In a moment, you'll record yourself speaking. Don't worry about occasional "umms" or silence when thinking about
          what you want to say! Just be as natural as possible!
          <br />
          <br />
          If you don’t like your recording, you can record yourself once again!
          <br />
          Or as many times as you want.
          <br />
        </div>
      </div>
    </div>
    <button x-on:click="showInfo = false" class="btn btn-gradient w-full">
      Proceed
    </button>
  </>
);
