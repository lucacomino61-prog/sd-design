import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { SITE, VISITS } from './src/data/site.js';
import { FEATURES } from './src/data/features.js';

// SD Design: a static site, every word in the HTML. The domain is "url" in src/data/owner.json (read here as
// SITE.url); until it is filled in, the pages say "noindex" and the sitemap stays empty.
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
      directives: ["default-src 'self'", "img-src 'self' data:", "media-src 'self'", "font-src 'self'", `connect-src 'self'${SITE.formOrigin ? ` ${SITE.formOrigin}` : ''}${VISITS ? ' https://cloudflareinsights.com' : ''}`, "object-src 'none'", "base-uri 'self'", "form-action 'self'"],
      scriptDirective: { resources: ["'self'", "'inline-speculation-rules'", ...(VISITS ? ['https://static.cloudflareinsights.com'] : [])] },
      styleDirective: { resources: ["'self'"] },
    },
  },
  // a switch the page's script needs is handed to it as a constant, so that code that is switched off is left out
  vite: { build: { target: 'es2022' }, define: { 'import.meta.env.SD_SOURCE': JSON.stringify(FEATURES.source) } },
});
