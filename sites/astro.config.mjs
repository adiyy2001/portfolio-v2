import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

export default defineConfig({
  site: 'https://adiyy2001.github.io',
  base: '/portfolio-v2/wzornik',
  trailingSlash: 'always',
  cacheDir: './.astro-cache',
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  integrations: [preact()],
  vite: { cacheDir: './.vite-cache' },
});
