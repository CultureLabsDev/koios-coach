import RecordingHints from './RecordingHints';

export default ({ name }: { name: string }) => (
  <>
    <div class="text-3xl font-bold mb-4">Hi {name}!</div>
    <div class="text-lg text-left font-bold">
      Just record yourself speaking for 90 seconds
      <br />
      (and maximum 10 minutes)
    </div>
    <div class="text-sm mb-4 ">get your results in a matter of minutes.</div>
    <div class="mt-2 text-left mb-4">
      Your recording should contain only speech. Don’t worry about occasional “umms” or silence when thinking about what
      you want to say! Just be as natural as possible.
    </div>
    <RecordingHints />
  </>
);
