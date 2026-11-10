import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { SITE } from './src/data/site.js';

// SD Design: a static site, every word in the HTML. The domain lives in src/data/site.js (SITE.url); until it is
// filled in, the pages say "noindex" and the sitemap stays empty.
const studio = process.env.STUDIO === '1';

// The parked 3D studio (/studio) can still be opened while developing, but it is not part of the site that ships:
// its page is only added in dev (or with STUDIO=1), and its models and textures are dropped from the build.
const finish = {
  name: 'sd-finish',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev' || studio) injectRoute({ pattern: '/studio', entrypoint: './src/studio/studio.astro' });
    },
    'astro:build:done': ({ dir }) => {
      if (studio) return;
      const out = fileURLToPath(dir);
      for (const p of ['models', 'hdri', 'textures', 'fonts/geist-latin-wght-normal.woff2']) fs.rmSync(path.join(out, p), { recursive: true, force: true });
      // originals kept beside the WebP copies the site uses
      for (const d of ['work', 'phone']) for (const f of fs.readdirSync(path.join(out, d))) if (/\.(jpe?g|png)$/.test(f)) fs.rmSync(path.join(out, d, f));
    },
  },
};

export default defineConfig({
  site: SITE.url ?? undefined,
  trailingSlash: 'always',
  server: { port: 3760 },
  devToolbar: { enabled: false },
  integrations: [finish],
  // the whole stylesheet travels inside the page: one request less before the first paint
  build: { inlineStylesheets: 'always' },
  // A content security policy with a hash for every script and style the build produces. The page has no inline
  // style attributes and no inline event handlers, so nothing needs 'unsafe-inline'.
  security: {
    csp: {
      directives: ["default-src 'self'", "img-src 'self' data:", "media-src 'self'", "font-src 'self'", `connect-src 'self'${SITE.formOrigin ? ` ${SITE.formOrigin}` : ''}`, "object-src 'none'", "base-uri 'self'", "form-action 'self'"],
      scriptDirective: { resources: ["'self'", "'inline-speculation-rules'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  vite: { build: { target: 'es2022' } },
});
