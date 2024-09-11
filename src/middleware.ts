import { getMyUser } from '@models/db/users';
import { Hono, MiddlewareHandler, Env } from 'hono';

const UserMiddleware: MiddlewareHandler = async (c, next) => {
  const user = await getMyUser(c);
  const url = new URL(c.req.url);
  const isHXRequest = c.req.header('HX-Request') === 'true';

  if (!user || !user.user_active) {
    console.log(user);
    if (isHXRequest) {
      c.header('HX-Redirect', '/');
      return c.html('');
    }
    return c.redirect('/');
  }
  if (user.password_reset && url.pathname !== '/reset') {
    if (isHXRequest) {
      c.header('HX-Redirect', '/reset');
      return c.html('');
    }
    return c.redirect('/reset');
  }

  const pathname = new URL(c.req.url).pathname;
  c.set('user', user);
  c.set('pathname', pathname);
  await next();
};

export const applyMiddleware = <T extends Env>(app: Hono<T>) => {
  app.use('/admin/*', UserMiddleware);
  app.use('/user/*', UserMiddleware);
};
