export default () => (
  <>
    <h2 className="card-title mb-4">Submit your answers</h2>
    <div class="flex flex-col lg:flex-row gap-2 justify-between mt-4 my-indicator-hide w-full">
      <button
        hx-post="/user/mindset"
        hx-target="form"
        name="prevPage"
        tabindex={1}
        class="btn btn-outline w-full lg:w-48 hover:scale-95">
        Go back
      </button>
      <button
        hx-put="/user/mindset"
        hx-target="form"
        hx-indicator="#processing"
        name="submitForm"
        tabindex={0}
        class="btn btn-gradient w-full lg:w-48 hover:scale-95">
        Submit
      </button>
    </div> 
  </>
)