interface Props {
  text: string;
}
export default ({ text }: Props) => (
  <div class="fixed inset-0 h-screen w-full bg-black bg-opacity-70">
    <div class="flex h-full flex-col items-center justify-center">
      <div class="text-accent mb-4 mt-10 text-xl font-bold" id="spinner-text">
        {text}
      </div>
      <div class="border-primary relative h-44 w-44 animate-spin rounded-full border-l-8"></div>
    </div>
  </div>
);
