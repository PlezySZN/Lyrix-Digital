import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

import react from '@astrojs/react';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://lyrixdigital.com',
  output: 'static',
  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Inline CSS smaller than 10KB to reduce render-blocking requests
      cssCodeSplit: true,
      // Optimize chunk splitting for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            'framer': ['framer-motion'],
            'react-vendor': ['react', 'react-dom'],
          },
        },
      },
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: true,
    },
  },

  integrations: [react(), sitemap()],
});