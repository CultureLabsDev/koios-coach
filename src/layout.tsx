import Sidebar from '@components/Sidebar';
import { User } from '@models/schema';
import { Hono, Env } from 'hono';
import { PropsWithChildren } from 'hono/jsx';
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer';

export const RootLayout = jsxRenderer(({ children }: PropsWithChildren) => (
  <html lang="en">
    <head>
      <title>Koios Arcadia</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Koios Arcadia" />
      <script src="/static/js/htmx.min.js"></script>
      <script src="/static/js/head-support.js"></script>
      <script src="/static/js/hyperscript.min.js"></script>
      <script src="/static/js/htmx-ext-ws.js"></script>
      <script src="/static/js/marked.min.js"></script>
      <script src="/static/js/parse-md.js"></script>
      <script src="/static/js/screen-fix.js"></script>
      <script defer src="/static/js/alpinejs_3.min.js"></script>
      <script src="/static/js/recording-app.js"></script>
      <script src="/static/js/wavesurfer.js"></script>
      <script src="/static/js/wavesurfer_record.min.js"></script>
      <link href="/static/tailwind.css" rel="stylesheet" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Inter:100,200,300,regular,500,600,700,800,900,extrabold&display=swap"
        media="all"
      />
      <link rel="icon" type="image/x-icon" href="/static/img/wave-logo.png" />
    </head>
    <body class="h-screen w-full bg-base-200" hx-ext="head-support">
      <div hx-boost="true">
        {children}
      </div>
      <div id="toaster"></div>
      <div id="modal"></div>
      <div class="absolute bottom-0 right-0"><img src="/static/img/koios-logo.png" alt="Koios Arcadia" width="120" /></div>
    </body>
  </html>
));

const DashLayout = jsxRenderer(
  ({ children, Layout }) => {
    const c = useRequestContext();
    const user: User = c.get('user');
    const pathname: string = c.get('pathname');

    return (
      <Layout>
        <div class="h-screen w-full flex">
          <Sidebar user={user} pathname={pathname} />
          <div class="flex-1">{children}</div>
        </div>
      </Layout>
    );
  },
  { stream: true }
);

export const applyLayouts = <T extends Env>(app: Hono<T>) => {
  app.use(RootLayout);
  app.use('/admin/*', DashLayout);
};
