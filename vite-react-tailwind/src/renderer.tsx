import { createMiddleware } from 'hono/factory';
import type { JSX } from 'react';
import { renderToReadableStream } from 'react-dom/server.edge';

declare module 'hono' {
  interface ContextRenderer {
    (content: JSX.Element): Response | Promise<Response>;
  }
}

export const renderer = createMiddleware(async (c, next) => {
  c.setRenderer(async (content) => {
    return c.body(
      await renderToReadableStream(
        <html>
          <head>
            <meta charSet="utf-8" />
            <meta
              content="width=device-width, initial-scale=1"
              name="viewport"
            />
            {import.meta.env.PROD ? (
              <script type="module" src="/static/client.js"></script>
            ) : (
              <script type="module" src="/src/client.tsx"></script>
            )}
            {import.meta.env.PROD ? (
              <link rel="stylesheet" href="/static/style.css" />
            ) : (
              <link rel="stylesheet" href="/src/style.css" />
            )}
          </head>
          <body className="bg-gray-100">{content}</body>
        </html>
      ),
      {
        headers: {
          'Transfer-Encoding': 'chunked',
          'Content-Type': 'text/html; charset=UTF-8',
        },
      }
    );
  });
  await next();
});
