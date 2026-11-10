// Measures the spacing of a page, so it can be checked for evenness instead of judged by eye:
//   for every section, the empty space above its first content and below its last, the gap to the next section's
//   content, and how far its content sits from the left and the right edge of the screen.
//   node tools/spacing.mjs [base=http://localhost:3760] [path=/] [sizes=1440x900,390x844]
import puppeteer from 'puppeteer-core';

const base = process.argv[2] || 'http://localhost:3760';
const where = process.argv[3] || '/';
const sizes = (process.argv[4] || '1440x900,390x844').split(',').map((s) => s.split('x').map(Number));
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
for (const [w, h] of sizes) {
  const page = await browser.newPage();
  const phone = w < 760;
  await page.setViewport({ width: w, height: h, isMobile: phone, hasTouch: phone });
  await page.goto(base + where, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 2200));
  const rows = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const abs = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right, w: r.width, h: r.height }; };
    // what a visitor sees as content: text and pictures that take up room (the pinned stages count as one block)
    const leaves = (root) => [...root.querySelectorAll('h1, h2, h3, p, li, img, canvas, a.cta, .pin, form, figure, .meter, summary')].filter((el) => {
      if (el.closest('.sr, [hidden], .tone') || el.matches('.tone')) return false;
      const cs = getComputedStyle(el), r = el.getBoundingClientRect();
      return r.width > 4 && r.height > 4 && cs.visibility !== 'hidden' && cs.position !== 'fixed';
    }).map(abs);
    const parts = [...document.querySelectorAll('main > *, footer')];
    return parts.map((el, i) => {
      const box = abs(el), inside = leaves(el);
      const top = Math.min(...inside.map((r) => r.top)), bottom = Math.max(...inside.map((r) => r.bottom));
      const inView = inside.filter((r) => r.w < vw * 1.5);
      const left = Math.min(...inView.map((r) => r.left)), right = vw - Math.max(...inView.map((r) => Math.min(r.right, vw)));
      return { name: (el.id || el.className.split(' ')[0] || el.tagName).slice(0, 12), height: Math.round(box.h), above: Math.round(top - box.top), below: Math.round(box.bottom - bottom), left: Math.round(left), right: Math.round(right), contentTop: top, contentBottom: bottom };
    }).map((row, i, all) => ({ ...row, gapToNext: all[i + 1] ? Math.round(all[i + 1].contentTop - row.contentBottom) : null }));
  });
  console.log(`\n${w}x${h}  ${where}`);
  console.log('section       height  above  below  gap-to-next  left  right');
  for (const r of rows) console.log(r.name.padEnd(13), String(r.height).padStart(6), String(r.above).padStart(6), String(r.below).padStart(6), String(r.gapToNext ?? '-').padStart(12), String(r.left).padStart(5), String(r.right).padStart(6));
  await page.close();
}
await browser.close();
