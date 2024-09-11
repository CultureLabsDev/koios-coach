import { User } from '@models/schema';
import { initials } from '@utils';

type Props = { my_user: User; client: User };

export default ({ my_user, client }: Props) => {
  const name = client.name;
  const myAccount = my_user.uid === client.uid;

  return (
    <div
      id={`user-${client.uid}`}
      class="bg-base-100 rounded-lg shadow-md transform-gpu transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:bg-gradient group"
    >
      <a href={`/admin/clients/${client.uid}`}>
        <div class="p-6">
          <div class="flex justify-between items-center tooltip" data-tip={client.name.length > 17 ? name : null}>
            <div class="text-2xl font-extrabold text-dark flex-1 truncate text-left group-hover:text-white">{name}</div>
            <div
              class={`ml-3 text-white ${
                myAccount ? 'bg-primary' : 'bg-secondary'
              } group-hover:bg-white group-hover:text-primary rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold`}
            >
              {initials(name)}
            </div>
          </div>
          <div class="flex justify-between items-center mt-4">
            <div class="text-sm font-medium text-neutral group-hover:text-base-200">{client.email}</div>
            <div class="bg-base-200 text-primary rounded-full py-1 px-4 text-xs font-medium group-hover:bg-white">
              client
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};