import { MyJWTPayload } from '@interfaces';
import { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { verify, sign } from 'hono/jwt';

const cookieName = 'koios-auth--user-token';

export const getSession = async (c: Context) => {
  const cookie = getCookie(c, cookieName);
  if (!cookie) {
    return null;
  }
  return verify(cookie, c.env.JWT_SECRET) as Promise<MyJWTPayload>;
};

export const setSession = async (c: Context, data: { uid: string }) => {
  const token = await sign(data, c.env.JWT_SECRET);
  const url = new URL(c.req.url);
  setCookie(c, cookieName, token, {
    path: '/',
    maxAge: 1000,
    expires: new Date(Date.now() + 1000),
    httpOnly: true,
    secure: url.protocol === 'https:',
  });
  return token;
};
