// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // Your live address. Used for the sitemap, link-preview cards and Google data.
  // If you change the Vercel domain, change it here too (and in public/robots.txt).
  site: 'https://chayangulgulia.vercel.app',
  trailingSlash: 'ignore',
  // Every page is still pre-built as static HTML. The adapter only adds the one live
  // function (src/pages/api/now-playing.ts) that asks Spotify what's playing.
  adapter: vercel(),
  integrations: [sitemap({ filter: (page) => !page.includes('/og/') && !page.endsWith('/404/') })],
  vite: {
    // Native image renderer used at build time for link-preview cards; keep it out of the bundle.
    ssr: { external: ['@resvg/resvg-js'] },
    optimizeDeps: { exclude: ['@resvg/resvg-js'] },
  },
});
