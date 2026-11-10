// Does the type fit? Two checks.
//   1. The home headline, in the three languages, at the common desktop and laptop sizes and at four phone widths:
//      it must not run under the glass phone, off the screen or into the bar, and the big button must be on the
//      first screen.
//   2. Every page: no word of a heading or a button may be cut off at the edge of the screen (a long word in big
//      type is the usual cause), at one desktop size and at three phone widths.
//   node tools/hero-fit.mjs [base=http://localhost:3760]
import puppeteer from 'puppeteer-core';
import { LANGS, PAGES } from '../src/data/site.js';

const base = process.argv[2] || 'http://localhost:3760';
const VIEWS = [[1920, 1080], [1536, 864], [1440, 900], [1366, 768], [1280, 720], [1280, 600], [1024, 768], [820, 1180], [430, 932], [390, 844], [360, 740], [320, 568]];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let bad = 0;

for (const p of ['/', '/en/', '/it/']) {
  for (const [w, h] of VIEWS) {
    await page.setViewport({ width: w, height: h, isMobile: w < 760, hasTouch: w < 760 });
    await page.goto(base + p, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await sleep(1900);
    const r = await page.evaluate(() => {
      const box = (el) => { const b = el.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, on: b.width > 4 && b.height > 4 }; };
      const hit = (a, b) => a.on && b.on && a.l < b.r - 1 && b.l < a.r - 1 && a.t < b.b - 1 && b.t < a.b - 1;
      const words = [...document.querySelectorAll('.big .w > span')].map(box);
      const live = [...document.querySelectorAll('.live > *')].map(box);
      const bar = box(document.querySelector('.bar'));
      const tag = box(document.querySelector('.hero h1 .tag'));
      const cta = box(document.querySelector('.hero .cta-big'));
      const label = document.querySelector('.hero .cta-big');
      return {
        under: words.some((a) => live.some((b) => hit(a, b))),
        off: words.some((a) => a.r > innerWidth - 8 || a.l < 8),
        barHit: [tag, ...words].some((a) => hit(a, bar)) || live.some((b) => hit(b, bar)),
        lines: new Set(words.map((a) => Math.round(a.t))).size,
        heroH: Math.round(document.querySelector('.hero').getBoundingClientRect().height),
        cta: cta.b <= innerHeight - 44 && cta.t > 0,
        ctaLines: Math.round(label.getBoundingClientRect().height),
        sideways: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    const ok = !r.under && !r.off && !r.barHit && !r.sideways && r.cta;
    if (!ok) bad++;
    console.log(ok ? 'ok  ' : 'FAIL', p.padEnd(5), `${w}x${h}`.padEnd(10), JSON.stringify(r));
  }
}

console.log('\nwords at the edge of the screen:');
const every = Object.values(PAGES).flatMap((byLang) => LANGS.map((l) => byLang[l]));
for (const [w, h] of [[1440, 900], [1024, 768], [390, 844], [360, 740], [320, 568]]) {
  for (const p of every) {
    await page.setViewport({ width: w, height: h, isMobile: w < 760, hasTouch: w < 760 });
    await page.goto(base + p, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await sleep(500);
    const cut = await page.evaluate(() => {
      const out = [];
      const vw = document.documentElement.clientWidth;
      // the gallery's row and the sliding line are meant to run off the side
      const skip = (el) => el.closest('.reel, .band, .mock, [hidden]');
      for (const el of document.querySelectorAll('h1 .w > span, h2 .w > span, h1, h2, h3, .cta, .lnk, .slide-name, .more-list .display, .poster-lines b')) {
        if (skip(el) || el.children.length > 2) continue;
        const range = document.createRange();
        range.selectNodeContents(el);
        for (const r of range.getClientRects()) if (r.width > 2 && (r.right > vw + 1 || r.left < -1)) { out.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 18)} "${el.textContent.trim().slice(0, 26)}" ${Math.round(r.left)}..${Math.round(r.right)}`); break; }
      }
      // on a desktop the big button says its line on one line
      if (vw >= 1000) for (const b of document.querySelectorAll('.cta-big')) if (b.offsetHeight > 82) out.push(`a.cta-big wraps${b.closest('.reel') ? ' (gallery)' : ''}: "${b.textContent.trim().slice(0, 34)}"`);
      return [...new Set(out)].slice(0, 6);
    });
    if (cut.length) { bad++; console.log('FAIL', p.padEnd(22), `${w}x${h}`.padEnd(9), cut.join(' | ')); }
  }
  console.log(`  ${w}x${h}: ${every.length} pages checked`);
}
await browser.close();
console.log(`\n${bad} failures`);
process.exit(bad ? 1 : 0);
