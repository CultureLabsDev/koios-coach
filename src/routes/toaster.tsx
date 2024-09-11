import Toast, { ToastType } from '@components/Toast';
import { Context } from 'hono';

export const onRequestPost = async (c: Context) => {
  const message = c.req.query('message') || '';
  const color = c.req.query('color');
  const className = `alert-${color}` as ToastType;
  return c.html(<Toast type={className}>{message}</Toast>);
};
