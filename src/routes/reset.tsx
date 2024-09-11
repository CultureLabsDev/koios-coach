import SetPassword from '@components/admin/SetPassword';
import { getMyUser, updateUser } from '@models/db/users';
import { Context } from 'hono';

export const onRequestPost = async (c: Context) => {
  const user = await getMyUser(c);
  if (!user) {
    c.header('HX-Location', '/');
    return c.html('');
  }
  console.log('user', user);
  const data = await c.req.formData();
  const password = data.get('password') as string;
  const password2 = data.get('password2') as string;
  if (password !== password2) {
    return c.html(<div class="text-red-500">Passwords do not match</div>);
  }
  const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  const hashBase64 = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  await updateUser(c.env, user.uid, { password: hashBase64, password_reset: false });
  const route = user.role === 'admin' || user.role === 'client' ? '/admin' : '/user';
  return c.newResponse(null, { status: 303, headers: { 'HX-Location': `${route}?toast="Password updated"` } });
};

export const onRequestGet = async (c: Context) => {
  const user = await getMyUser(c);
  if (!user) {
    return c.redirect('/');
  }
  console.log('user', user);
  if (user.password_reset) {
    return c.render(<SetPassword />);
  }
  return c.redirect('/admin');
};
