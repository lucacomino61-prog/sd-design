// sitemap.xml: every page that may be indexed, each with its versions in the other languages. It is built from the
// same table as the pages themselves, so it can never list an address that does not exist. Empty while the site is
// a draft (no domain yet).
import { SITE, DRAFT, LANGS, PAGES } from '../data/site.js';

export function GET() {
  const rows = DRAFT ? [] : Object.values(PAGES).flatMap((byLang) => LANGS.map((lang) => {
    const alts = [...LANGS.map((l) => [l, byLang[l]]), ['x-default', byLang.sq]];
    return `  <url>\n    <loc>${SITE.url}${byLang[lang]}</loc>\n${alts.map(([l, p]) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${SITE.url}${p}"/>`).join('\n')}\n  </url>`;
  }));
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...(DRAFT ? ['  <!-- Draft: set SITE.url in src/data/site.js and every page is listed here. -->'] : rows),
    '</urlset>',
  ].join('\n');
  return new Response(xml + '\n', { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
