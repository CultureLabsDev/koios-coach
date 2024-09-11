import Icon from "./Icon";

export const TaskCard = ({ title, done, href }: { title: string; done: boolean; href: string }) => {
  const classes = done
    ? 'border-green-400 border-2'
    : 'hover:-translate-y-1.5 hover:shadow-lg hover:scale-105 transition-all duration-500 cursor-pointer';
  return (
    <a
      href={done ? undefined : href}
      class={`bg-gradient p-10 text-2xl rounded-2xl w-96 flex items-center gap-4 ${classes}`}
    >
      <div class={done ? 'text-green-400' : 'text-white opacity-10'}>
        <Icon id="check-circle" size={30} />
      </div>
      {title}
      {done ? null : <Icon id="chevron-right" size={40} />}
    </a>
  );
};

export const NavigationCard = ({ title, active, href }: { title: string; active: boolean; href: string }) => {
  const classes = active
    ? 'hover:-translate-y-1.5 hover:shadow-lg hover:scale-105 transition-all duration-500 cursor-pointer'
    : 'opacity-50';
  return (
    <a
      href={active ? href : undefined}
      class={`bg-gradient p-10 text-2xl rounded-2xl w-96 flex items-center gap-4 ${classes}`}
    >
      {title}
      <Icon id="chevron-right" size={40} />
    </a>
  );
};