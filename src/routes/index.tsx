import Icon from '@components/Icon';
import { signIn } from '@models/db/users';
import { Context } from 'hono';

export const onRequestPost = async (c: Context) => {
  const data = await c.req.formData();
  const email = data.get('email') as string;
  const password = data.get('password') as string;
  const user = await signIn(c, email, password);
  console.log('user', email, password, user?.role);
  if (!user) {
    return c.html(
      <div className="mt-4 text-[#ec6559] flex items-center justify-center">
        <Icon id="alert-circle" size={16} />
        <span className="ml-2">Login failed. Please try again.</span>
      </div>
    );
  }
  const route = user.role === 'admin' || user.role === 'client' ? '/admin' : '/user';
  c.res.headers.set('HX-Location', route);
  return c.html('');
};

export const onRequestGet = async (c: Context) => {
  return c.render(
    <div className="h-screen flex items-center justify-center">
      <div className="box w-full max-w-md bg-base-100 rounded-lg shadow-md p-8">
        <div className="mb-8 text-center">
          <img src="/static/img/arcadia_logo.png" alt="Arcadia Logo" className="mx-auto mb-4 h-28" />
          <h2 className="text-2xl font-extrabold text-dark">Login to Phoebe</h2>
        </div>
        <form hx-post="#" hx-target="#error">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-dark mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="input w-full"
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-dark mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="input w-full"
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="w-full btn-gradient py-2 px-4 rounded font-medium">
            Log in
          </button>
        </form>
        <div id="error"></div>
      </div>
    </div>
  );
};
