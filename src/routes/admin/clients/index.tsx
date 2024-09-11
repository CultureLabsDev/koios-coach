import Breadcrumbs from '@components/Breadcrumbs';
import Filter from '@components/admin/Filter';
import Spinner from '@components/Spinner';
import ClientCard from './ClientCard';
import { getAllUsers } from '@models/db/users';
import { Context } from 'hono';

export const onRequestPost = async (c: Context) => {
  const my_user = c.get('user');
  const clients = await getAllUsers(c.env, 'client', my_user.uid);
  return c.html(
    <div class="w-full lg:max-w-4xl mt-6">
      <div id="user-header" class="flex flex-col lg:flex-row mb-2 lg:mb-8 justify-between">
        <div class="flex-1">
          <div class="text-3xl font-bold">Clients</div>
          <div class="text-sm">People using Phoebe</div>
        </div>
        <button hx-get="/admin/clients/add_user" hx-target="#modal" class="btn btn-primary">
          New Client
        </button>
      </div>
      <div>
        <div>
          <Filter postUrl="/admin/clients/search" />
        </div>
        <div class="my-4 overflow-y-auto scroll-smooth overflow-x-hidden" style="max-height: calc(100vh - 300px);">
          <div id="users-list" class="grid lg:grid-cols-2 gap-3 overflow-y-auto scroll-smooth p-2 lg:p-8 pb-40">
            {clients?.map((client) => (
              <ClientCard my_user={my_user} client={client} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const onRequestGet = (c: Context) =>
  c.render(
    <div class="pt-8 px-4 lg:px-8">
      <Breadcrumbs crumbs={[{ title: 'Home', href: '/admin' }, { title: 'Clients' }]} />
      <div hx-post="/admin/clients" hx-trigger="load">
        <Spinner message="Loading clients..." />
      </div>
    </div>
  );
