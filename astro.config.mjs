// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://wenorthsolutions.com',
  output: 'static',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    preact({ compat: true }),
    sitemap(),
  ],
  image: {
    domains: ['cdn.shopify.com'],
  },
});
