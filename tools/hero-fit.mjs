// Does the home headline ever run under the glass phone, or off the screen? Checks the three languages at the
// common desktop and laptop sizes and at three phone widths.   node tools/hero-fit.mjs [base=http://localhost:3760]
import puppeteer from 'puppeteer-core';

const base = process.argv[2] || 'http://localhost:3760';
const VIEWS = [[1920, 1080], [1536, 864], [1440, 900], [1366, 768], [1280, 720], [1280, 600], [1024, 768], [820, 1180], [430, 932], [390, 844], [360, 740], [320, 568]];
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
let bad = 0;
for (const p of ['/', '/en/', '/it/']) {
  for (const [w, h] of VIEWS) {
    await page.setViewport({ width: w, height: h, isMobile: w < 760, hasTouch: w < 760 });
    await page.goto(base + p, { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await new Promise((r) => setTimeout(r, 1700));
    const r = await page.evaluate(() => {
      const box = (el) => { const b = el.getBoundingClientRect(); return { l: b.left, t: b.top, r: b.right, b: b.bottom, on: b.width > 4 && b.height > 4 }; };
      const hit = (a, b) => a.on && b.on && a.l < b.r - 1 && b.l < a.r - 1 && a.t < b.b - 1 && b.t < a.b - 1;
      const words = [...document.querySelectorAll('.big .w > span')].map(box);
      const live = [...document.querySelectorAll('.live > *')].map(box);
      const bar = box(document.querySelector('.bar'));
      const tag = box(document.querySelector('.hero h1 .tag'));
      return {
        under: words.some((a) => live.some((b) => hit(a, b))),
        off: words.some((a) => a.r > innerWidth - 8 || a.l < 8),
        barHit: [tag, ...words].some((a) => hit(a, bar)) || live.some((b) => hit(b, bar)),
        lines: new Set(words.map((a) => Math.round(a.t))).size,
        heroH: Math.round(document.querySelector('.hero').getBoundingClientRect().height),
        sideways: document.documentElement.scrollWidth > innerWidth + 1,
      };
    });
    const ok = !r.under && !r.off && !r.barHit && !r.sideways;
    if (!ok) bad++;
    console.log(ok ? 'ok  ' : 'FAIL', p.padEnd(5), `${w}x${h}`.padEnd(10), JSON.stringify(r));
  }
}
await browser.close();
console.log(`\n${bad} failures`);
process.exit(bad ? 1 : 0);
