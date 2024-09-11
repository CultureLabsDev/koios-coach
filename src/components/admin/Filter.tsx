import Icon from '@components/Icon';

export default ({ postUrl }: { postUrl: string }) => (
  <div id="searchForm" className="w-full max-w-md mx-auto">
    <div className="relative">
      <input
        id="search"
        name="search"
        className="w-full input input-bordered bg-base-100 text-dark placeholder-neutral focus:border-primary pl-12"
        placeholder="Filter users"
        hx-post={postUrl}
        hx-target="#users-list"
        hx-trigger="keyup changed delay:500ms"
        hx-swap="innerHTML"
        autocomplete="off"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral">
        <Icon id="search" size={20} />
      </div>
      <button
        type="button"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral hover:text-primary transition-colors duration-300"
        _="on click set #search's value to '' then trigger keyup on #search
           on keyup[key is 'Escape'] from the body set #search's value to '' then trigger keyup on #search"
      >
        <Icon id="x" size={20} />
      </button>
    </div>
  </div>
);