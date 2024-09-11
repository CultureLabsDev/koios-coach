import { Context } from 'hono';
import { deleteCookie } from 'hono/cookie';

export const onRequestGet = async (c: Context) => {
  deleteCookie(c, 'login_cookie');
  return c.redirect('/');
};
