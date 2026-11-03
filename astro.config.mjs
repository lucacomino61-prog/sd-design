import { defineConfig } from 'astro/config';

// SD Design: a static site; the studio scene is plain three.js driven from one GSAP ticker.
export default defineConfig({
  server: { port: 3760 },
  devToolbar: { enabled: false },
  vite: { build: { target: 'es2022' } },
});
