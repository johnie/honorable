import path from 'path';
import devServer, { defaultOptions } from '@hono/vite-dev-server';
import { defineConfig, loadEnv } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import build from '@hono/vite-build/node';
import nodeAdapter from '@hono/vite-dev-server/node';
import tailwindcss from '@tailwindcss/vite';

const API_SERVER_PORT = 3000;

const sharedPlugins = [tsconfigPaths(), tailwindcss()];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (mode === 'client')
    return {
      esbuild: {
        jsxImportSource: 'hono/jsx/dom',
      },
      build: {
        rollupOptions: {
          input: {
            client: path.resolve(__dirname, 'src/client.tsx'),
            style: path.resolve(__dirname, 'src/style.css'),
          },
          output: {
            entryFileNames: 'static/[name].js',
            chunkFileNames: 'static/[name].js',
            assetFileNames: 'static/[name].[ext]',
          },
        },
      },
      plugins: [...sharedPlugins],
    };

  return {
    ssr: {
      external: ['react', 'react-dom'],
    },
    plugins: [
      ...sharedPlugins,
      build({
        entry: 'src/server.tsx',
      }),
      devServer({
        adapter: nodeAdapter,
        entry: 'src/server.tsx',
        exclude: ['/src/styles/*', ...defaultOptions.exclude],
      }),
    ],
    server: {
      port: Number(env.VITE_DEV_PORT) || API_SERVER_PORT,
    },
  };
});
