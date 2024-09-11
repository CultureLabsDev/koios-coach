import { raw } from 'hono/html';

export default ({ url }: { url: string }) => raw(<script>window.location = '${url}';</script>);
