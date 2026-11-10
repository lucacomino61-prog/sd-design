// The web manifest: the name, colours and icons a phone uses when the site is saved to the home screen.
import sq from '../i18n/sq.js';
import { SITE } from '../data/site.js';

export function GET() {
  const manifest = {
    name: SITE.name, short_name: SITE.name, description: sq.meta.home.desc, lang: 'sq', dir: 'ltr',
    start_url: '/', scope: '/', display: 'minimal-ui', background_color: '#1a1c1c', theme_color: '#1a1c1c',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return new Response(JSON.stringify(manifest, null, 2) + '\n', { headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' } });
}
