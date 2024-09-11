export default () => (
  <div class="flex flex-col items-center justify-center">
    <div class="text-2xl font-bold mb-4 w-full text-center">Listen to your recording here...</div>
    <div id="waveform" class="w-full mb-8"></div>
    <div x-show="showWarning" class="mb-4 text-center text-error">
      Processing a recording this short can lead to innaccuracies
    </div>
    <button x-on:click="uploadAudio" class="btn btn-gradient w-full mb-2 mt-6">
      I'm Happy With This
    </button>
    <button x-on:click="redoRecording" class="btn btn-outline w-full">
      Record It Again
    </button>
  </div>
);
