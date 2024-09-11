const bars = [
  { color: 'bg-[#da5597]', delay: 100 }, // pink
  { color: 'bg-[#EC5697]', delay: 200 },
  { color: 'bg-[#ff5757]', delay: 300 }, // red
  { color: 'bg-[#ff8c57]', delay: 400 }, // yellow
  { color: 'bg-[#e87b35]', delay: 500 }, // orange
  { color: 'bg-[#A686EE]', delay: 600 }, // blue
  { color: 'bg-[#4e80ee]', delay: 700 }, // blue
  { color: 'bg-[#6D80F6]', delay: 800 }, // blue
  { color: 'bg-[#8c52ff]', delay: 900 }, // purple
];

type BarData = { color: string; delay: number };

const SlidingBar = ({ color, delay }: BarData) => (
  <div
    class={`h-4 ${color} rounded-l-full relative" style="animation: ripple 1s infinite; animation-delay: ${delay}ms;`}
  >
    <div class="h-4 w-2 rounded-r-full absolute left-2"></div>
  </div>
);

export default () => (
  <div class="flex-1 rotate-90">
    <div class=" mt-4 flex flex-col justify-end">{bars.map(SlidingBar).join('\n')}</div>
  </div>
);
