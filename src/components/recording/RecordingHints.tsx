export default () => (
  <>
    <div class="flex flex-col items-center justify-center">
      <div class="mb-2 text-2xl font-semibold text-center px-8">We know it's hard to speak about yourself</div>
      <div class="mb-6 text-md text-center px-8">So here's some hints to help you:</div>
      <div class=" bg-gray-200 text-gray-500 rounded-3xl pl-8 pr-4 py-6">
        <ul class="list list-disc list-inside lg:font-bold">
          <li class="list-item">Introduce yourself!</li>
          <li class="list-item">Tell us about your career to date.</li>
          <li class="list-item">What are your future career goals?</li>
          <li class="list-item">Go crazy! What would be your dream job? Why?</li>
          <li class="list-item">Tell us about a challenge or conflict you’ve faced at work and how you managed it.</li>
        </ul>
      </div>
    </div>
    <div id="audio-level" class="w-full mb-4"></div>
    <audio id="beepAudio"></audio>
    <button x-on:click="toggleRecording" class="btn btn-gradient w-full" x-text="buttonText"></button>
  </>
);
