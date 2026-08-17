// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import tailwind from '@astrojs/tailwind';

const __dirname = dirname(fileURLToPath(import.meta.url));
/** @param {string} p */
const r = (p) => resolve(__dirname, p);

// https://astro.build/config
export default defineConfig({
  site: 'https://bocatitos.es',
  trailingSlash: 'never',
  output: 'static',
  devToolbar: {
    enabled: false,
  },
  build: {
    inlineStylesheets: 'auto',
    assets: '_assets',
  },
  image: {
    domains: ['images.unsplash.com'],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    resolve: {
      alias: {
        '@': r('src'),
        '@components': r('src/components'),
        '@layouts': r('src/layouts'),
        '@lib': r('src/lib'),
        '@styles': r('src/styles'),
        '@content': r('src/content'),
        '@i18n': r('src/i18n'),
      },
    },
  },
});
