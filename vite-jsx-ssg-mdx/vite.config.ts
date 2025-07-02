import { cloudflare } from '@cloudflare/vite-plugin';
import { defineConfig } from 'vite';
import ssrPlugin from 'vite-ssr-components/plugin';
import contentCollections from '@content-collections/vite';

export default defineConfig({
  plugins: [cloudflare(), ssrPlugin(), contentCollections()],
});
