// Looks at the site the way a visitor would, on a desktop and on a phone, and checks what a search engine reads.
//   node tools/check-site.mjs <outDir> [base=http://localhost:3760] [what=all|look|seo] [paths=/,/en/,...]
// For 'seo', base may also be a built folder, written as dir:<path> (e.g. dir:dist): the files are read directly.
// "look": console errors, sideways scroll, one h1, images with sizes and alt, tap targets, then a screenshot per
//         scroll step (written to <outDir>, which should be outside the project).
// "seo":  every page in the table: title and description lengths, canonical, hreflang both ways, one h1, structured
//         data that parses, the words present with JavaScript off, links that resolve, robots.txt, sitemap, 404.
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { LANGS, PAGES } from '../src/data/site.js';
import { SITES } from '../src/data/sites.js';

const out = path.resolve(process.argv[2] || '../sd-check');
const base = process.argv[3] || 'http://localhost:3760';
const what = process.argv[4] || 'all';
const every = Object.values(PAGES).flatMap((p) => LANGS.map((l) => p[l]));
const paths = process.argv[5] ? process.argv[5].split(',') : every;
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new',
  args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=d3d11', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
});
const fails = [], warns = [];
const fail = (where, msg) => { fails.push(`${where}: ${msg}`); };
const warn = (where, msg) => { warns.push(`${where}: ${msg}`); };
const slug = (p) => (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));

// ---------- look ----------
if (what === 'all' || what === 'look') {
  for (const p of paths) {
    for (const phone of [false, true]) {
      const tag = `${slug(p)}-${phone ? 'phone' : 'desk'}`;
      const ctx = await browser.createBrowserContext();
      const page = await ctx.newPage();
      const logs = [];
      page.on('console', (m) => { if (['error', 'warn', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
      page.on('pageerror', (e) => logs.push(`pageerror: ${String(e).slice(0, 200)}`));
      page.on('requestfailed', (r) => { if (!/ERR_ABORTED/.test(r.failure()?.errorText || '')) logs.push(`failed: ${r.url().slice(0, 120)}`); });
      page.on('response', (r) => { if (r.status() >= 400) logs.push(`${r.status()}: ${r.url().slice(0, 120)}`); });
      const view = phone ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900 };
      await page.setViewport(view);
      const shot = (name) => page.screenshot({ path: path.join(out, `${tag}-${name}.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });
      await page.goto(base + p, { waitUntil: 'load', timeout: 60000 });
      if (!phone && p === paths[0]) for (const [i, ms] of [[0, 200], [1, 350], [2, 450], [3, 600]]) { await sleep(ms); await shot(`load${i}`); }
      await sleep(3200);
      await shot('0');
      const info = await page.evaluate(() => {
        const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden'; };
        return {
          docH: document.documentElement.scrollHeight,
          overflow: document.documentElement.scrollWidth > innerWidth + 1,
          h1: document.querySelectorAll('h1').length,
          noAlt: [...document.querySelectorAll('img:not([alt])')].length,
          noSize: [...document.querySelectorAll('img:not([width]), img:not([height])')].length,
          small: [...document.querySelectorAll('a, button, summary, input, textarea')].filter(vis).filter((el) => { const r = el.getBoundingClientRect(); return r.width < 24 || r.height < 24; }).map((el) => `${el.tagName.toLowerCase()}.${el.className || el.id} ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`).slice(0, 8),
          playing: [...document.querySelectorAll('video')].filter((v) => !v.paused).length,
        };
      });
      if (info.overflow) fail(tag, 'the page scrolls sideways');
      if (info.h1 !== 1) fail(tag, `${info.h1} h1 elements`);
      if (info.noAlt) fail(tag, `${info.noAlt} images without alt`);
      if (info.noSize) fail(tag, `${info.noSize} images without width and height`);
      if (info.small.length) warn(tag, `small targets: ${info.small.join(' | ')}`);
      const step = view.height * 0.94, steps = Math.min(14, Math.ceil(info.docH / step) - 1);
      for (let i = 1; i <= steps; i++) {
        await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), Math.round(i * step));
        await sleep(900);
        await shot(String(i));
      }
      for (const l of logs) fail(tag, l);
      console.log(tag, JSON.stringify({ docH: info.docH, playing: info.playing, logs: logs.length }));
      await ctx.close();
    }
  }
}

// ---------- seo ----------
if (what === 'all' || what === 'seo') {
  // a page from the running server, or straight from a built folder
  const root = base.startsWith('dir:') ? path.resolve(base.slice(4)) : null;
  const get = async (p) => {
    if (!root) { const r = await fetch(base + p); return { status: r.status, text: await r.text() }; }
    const clean = decodeURIComponent(p.split(/[?#]/)[0]), file = path.join(root, clean.endsWith('/') ? clean + 'index.html' : clean);
    return fs.existsSync(file) && fs.statSync(file).isFile() ? { status: 200, text: fs.readFileSync(file, 'utf8') } : { status: 404, text: '' };
  };
  const pick = (html, re) => (html.match(re) || [])[1];
  const all = (html, re) => [...html.matchAll(re)].map((m) => m[1]);
  const draft = !(await get('/robots.txt')).text.includes('Sitemap:');
  const titles = new Map(), descs = new Map(), internal = new Set();
  for (const [key, byLang] of Object.entries(PAGES)) {
    for (const lang of LANGS) {
      const p = byLang[lang], r = await get(p), html = r.text;
      if (r.status !== 200) { fail(p, `status ${r.status}`); continue; }
      const title = pick(html, /<title>([^<]*)<\/title>/), desc = pick(html, /<meta name="description" content="([^"]*)"/);
      if (!title) fail(p, 'no title'); else { if (title.length > 65) warn(p, `title is ${title.length} characters`); if (titles.has(title)) fail(p, `same title as ${titles.get(title)}`); titles.set(title, p); }
      if (!desc) fail(p, 'no description'); else { if (desc.length > 165 || desc.length < 70) warn(p, `description is ${desc.length} characters`); if (descs.has(desc)) fail(p, `same description as ${descs.get(desc)}`); descs.set(desc, p); }
      if (pick(html, /<html lang="([^"]*)"/) !== lang) fail(p, 'wrong html lang');
      const canon = pick(html, /<link rel="canonical" href="([^"]*)"/);
      if (!canon || !canon.endsWith(p)) fail(p, `canonical is ${canon}`);
      const alts = Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]*)" href="([^"]*)"/g)].map((m) => [m[1], m[2]]));
      for (const l of LANGS) if (!alts[l]?.endsWith(byLang[l])) fail(p, `hreflang ${l} is ${alts[l]}`);
      if (!alts['x-default']?.endsWith(byLang.sq)) fail(p, 'no x-default');
      const noindex = /<meta name="robots" content="noindex"/.test(html);
      if (noindex !== draft) fail(p, draft ? 'a draft page without noindex' : 'a live page with noindex');
      if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(p, 'not exactly one h1');
      for (const prop of ['og:title', 'og:description', 'og:image', 'og:locale']) if (!new RegExp(`<meta property="${prop}" content="[^"]+"`).test(html)) fail(p, `no ${prop}`);
      const og = pick(html, /<meta property="og:image" content="([^"]*)"/);
      if (og) { const r2 = await get(og.startsWith('http') ? new URL(og).pathname : og); if (r2.status !== 200) fail(p, `share image ${og} is ${r2.status}`); }
      try {
        const ld = JSON.parse(pick(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/));
        const types = ld['@graph'].map((n) => n['@type']);
        for (const need of ['Organization', 'WebSite', 'WebPage']) if (!types.includes(need)) fail(p, `structured data has no ${need}`);
        // what each kind of page must say about itself: a service, a client's site, a guide, the list of guides
        const own = key === 'home' || key === 'privacy' ? null : key.startsWith('work-') ? 'CreativeWork' : key === 'guides' ? 'ItemList' : key.startsWith('guide-') ? 'Article' : 'Service';
        if (own && !types.includes(own)) fail(p, `structured data has no ${own}`);
        if (own && !types.includes('BreadcrumbList')) fail(p, 'structured data has no BreadcrumbList');
      } catch (e) { fail(p, `structured data does not parse: ${String(e).slice(0, 80)}`); }
      // the page as a crawler that runs no scripts reads it: the words between the tags
      const words = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => w.length > 1).length;
      if (words < 150) fail(p, `only ${words} words without JavaScript`);
      if (/style="/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) fail(p, 'an inline style attribute (the content security policy would block it)');
      for (const h of all(html, /<a [^>]*href="([^"#][^"]*)"/g)) { if (h.startsWith('/')) internal.add(h.replace(/#.*$/, '')); }
      for (const src of all(html, /<img [^>]*src="([^"]*)"/g)) internal.add(src);
      console.log(p.padEnd(22), String(words).padStart(4), 'words ·', title?.length, '/', desc?.length);
    }
  }
  for (const h of internal) { const r = await get(h); if (r.status !== 200) fail(h, `linked from a page but answers ${r.status}`); }
  const robots = await get('/robots.txt');
  if (robots.status !== 200 || /Disallow: \/\s*$/m.test(robots.text)) fail('/robots.txt', 'missing, or it blocks the site');
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot']) if (!robots.text.includes(bot)) fail('/robots.txt', `${bot} is not named`);
  const map = await get('/sitemap.xml');
  const locs = all(map.text, /<loc>([^<]*)<\/loc>/g);
  if (map.status !== 200) fail('/sitemap.xml', `status ${map.status}`);
  if (!draft && locs.length !== every.length) fail('/sitemap.xml', `${locs.length} addresses for ${every.length} pages`);
  if (draft && locs.length) fail('/sitemap.xml', 'a draft sitemap lists pages');
  for (const p of ['/llms.txt', '/site.webmanifest', '/favicon.ico', '/favicon.svg', '/icons/apple-touch-icon.png', '/icons/icon-512.png']) { const r = await get(p); if (r.status !== 200) fail(p, `status ${r.status}`); }
  const lost = await get('/nuk-ekziston/');
  if (lost.status !== 404) warn('/nuk-ekziston/', `a missing page answers ${lost.status} (a dev server may; the host must answer 404)`);
  if ((await get('/404.html')).status !== 200 && root) fail('/404.html', 'the build has no 404 page');
  // the six client colours are written once in the data and once in the stylesheet: they must agree
  const css = fs.readFileSync('src/styles/site.css', 'utf8');
  for (const [id, s] of Object.entries(SITES)) if (!css.includes(`.t-${id} { --tone: ${s.tone}; }`)) fail('site.css', `the colour of ${id} differs from src/data/sites.js`);
  console.log(`seo: ${every.length} pages, ${internal.size} internal addresses, ${draft ? 'DRAFT (noindex, empty sitemap)' : 'LIVE'}`);
}

await browser.close();
console.log(`\n${fails.length} failures, ${warns.length} warnings`);
for (const f of fails) console.log('FAIL', f);
for (const w of warns) console.log('warn', w);
process.exit(fails.length ? 1 : 0);
