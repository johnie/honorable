import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';

const app = new Hono();

app.use('/static/*', serveStatic({ root: './dist' }));

app.use('/assets/*', serveStatic({ root: './dist' }));

const routes = app.get('/api/clock', (c) => {
  return c.json({
    time: new Date().toLocaleTimeString(),
  });
});

export type AppType = typeof routes;

app.get('/', (c) => {
  return c.html(
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        {import.meta.env.PROD ? (
          <script type="module" src="/static/client.js" />
        ) : (
          <script type="module" src="/src/client.tsx" />
        )}
        {import.meta.env.PROD ? (
          <link rel="stylesheet" href="/static/style.css" />
        ) : (
          <link rel="stylesheet" href="/src/styles/style.scss" />
        )}
      </head>
      <body>
        <div id="root" />
      </body>
    </html>
  );
});

export default app;
