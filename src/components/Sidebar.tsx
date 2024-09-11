import Icon from './Icon';
import { User } from '@models/schema';

type Props = {
  user: User;
  pathname: string;
};

export default async ({ user, pathname }: Props) => {
  const is_admin = user.role === 'admin';
  const is_client = user.role === 'client';
  const active = 'text-white bg-gradient rounded-r-full';
  const inactive = 'text-dark hover:bg-base-200 rounded-r-full transition-colors duration-200';
  const items = [
    {
      name: 'Home',
      icon: 'home',
      link: '/admin',
    },
    {
      name: 'Clients',
      icon: 'users',
      link: '/admin/clients',
      hide: !is_admin,
    },
    {
      name: 'Delegates',
      icon: 'users',
      link: '/admin/delegates',
      hide: !is_client,
    },
    {
      name: 'Settings',
      icon: 'settings',
      link: '/admin/settings',
      hide: !is_admin,
    },
  ];

  return (
    <div
      id="sidebar"
      role="navigation"
      class="bg-base-100 text-dark w-18 lg:w-72 flex flex-col justify-between pt-4 shadow-md"
    >
      <div>
        <div class="p-8 text-3xl font-extrabold mb-10">
          <a href="/" class="flex flex-col items-center">
            <img src="/static/img/arcadia_icon.png" width={80} alt="Arcadia logo" class="mr-2" />
            <div>
              <span class="text-primary">Arcadia</span>
              <span class="text-neutral">Phoebe</span>
            </div>
          </a>
        </div>
        <nav>
          <ul class="text-lg lg:pr-8">
            {items.map((item) =>
              item.hide ? null : (
                <li>
                  <a href={item.link} aria-label={item.name}>
                    <div
                      class={`py-3 pl-3 lg:pl-8 mb-2 flex items-center gap-4 ${
                        pathname === item.link ? active : inactive
                      }`}
                    >
                      <Icon id={item.icon}/>
                      <span class="hidden lg:block">{item.name}</span>
                    </div>
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
      <div class="w-full">
        <div class="text-neutral text-center mb-2">{user.email}</div>
        <div class="p-2">
          <a href="/sign_out" class="btn-gradient-outline w-full flex items-center justify-center py-2 px-4 rounded">
            <Icon id="log-out" />
            Log Out
          </a>
        </div>
      </div>
    </div>
  );
};