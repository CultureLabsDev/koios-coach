import Breadcrumbs from '@components/Breadcrumbs';
import Spinner from '@components/Spinner';
import { Context } from 'hono';

export const onRequestGet = async (c: Context) => {
  const user = c.get('user');
  return c.render(
    <div class="pt-8 px-4 lg:px-8">
      <Breadcrumbs crumbs={[{ title: 'Home', href: '/admin' }, { title: 'Settings' }]} />
      <div hx-post={`/admin/clients/${user.uid}`} hx-trigger="load">
        <Spinner message="Loading settings..." />
      </div>
    </div>
  );
};
