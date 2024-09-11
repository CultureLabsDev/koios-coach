export type Question = {
  label: string;
  id: string;
  value: number;
};
export default ({ question }: { question: Question }) => (
  <div>
    <label class="lg:text-lg text-secondary lg:font-bold select-none" for={question.id}>
      {question.label}
    </label>
    <div class="w-full">
      <input
        id={question.id}
        name={question.id}
        value={question.value}
        class="range range-secondary"
        type="range"
        min="1"
        max="5"
        step="1"
        tabindex={0}
        required
      />
      <div class="w-full flex justify-between text-xs px-2 select-none">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
    </div>
    <div class="flex justify-between w-full">
      <span class="text-xs lg:text-md lg:font-bold text-accent select-none">Inaccurate</span>
      <span class="text-xs lg:text-md lg:font-bold text-secondary select-none">Accurate</span>
    </div>
    <br />
  </div>
);
