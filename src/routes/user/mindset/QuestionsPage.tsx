import { html, raw } from "hono/html";
import QuestionRow, { Question } from "./Question";

type Props = {
  currentPage: number;
  pageCount: number;
  questions: Question[];
};

export default ({ currentPage, pageCount, questions }: Props) => {
  return (
  <>
    <div class="w-full font-bold text-primary text-2xl mb-6 select-none">
      Question <span>{currentPage + 1}</span> of <span>{pageCount}</span>
    </div>
    {questions.map((question) => <QuestionRow question={question} />)}
    <div class="flex flex-col lg:flex-row gap-2 justify-between mt-4 my-indicator-hide w-full">
      <button
        hx-post="/user/mindset"
        hx-target="form"
        name="prevPage"
        tabindex={1}
        class="btn btn-outline w-full lg:w-48 hover:scale-95"
        disabled={currentPage === 0}>
        Previous
      </button>
      <button
        hx-post="/user/mindset"
        hx-target="form"
        name="nextPage"
        tabindex={0}
        class="btn btn-gradient w-full lg:w-48 hover:scale-95">
        Next
      </button>
    </div>
    {raw(html`<script>
      document.getElementById('${questions[0]?.id}').focus();
      </script>`)}
    </>
  );
};
