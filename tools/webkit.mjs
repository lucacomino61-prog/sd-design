// The same pages in Safari's engine (WebKit, through Playwright): script errors, the pinned story and gallery, the
// changing ground, and a few pictures to look at. Playwright is not a dependency of this project: point PLAYWRIGHT_FROM
// at a folder whose node_modules has it (default: ../holdings).
// On Windows, Playwright's WebKit has no variable fonts, so the type looks different; this checks behaviour and layout.
//   node tools/webkit.mjs <outDir> [base=http://localhost:3760]
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const from = path.resolve(process.env.PLAYWRIGHT_FROM || '../holdings');
const { webkit } = createRequire(path.join(from, 'package.json'))('playwright');
const out = path.resolve(process.argv[2] || '../sd-webkit');
const base = process.argv[3] || 'http://localhost:3760';
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await webkit.launch();
let bad = 0;
const must = (ok, msg) => { if (!ok) bad++; console.log(ok ? 'ok  ' : 'FAIL', msg); };

for (const [name, view] of [['desk', { viewport: { width: 1440, height: 900 } }], ['phone', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }]]) {
  for (const where of ['/', '/draft-falas/', '/restorante/']) {
    const tag = `${name} ${where}`;
    const ctx = await browser.newContext(view);
    const page = await ctx.newPage();
    const logs = [];
    // Two messages are expected and are not the page's: Safari does not know the 'inline-speculation-rules' keyword in
    // the security policy and says so (it then ignores it); and each picture Playwright takes adds a style of its own,
    // which the page's policy refuses.
    page.on('console', (m) => { if (m.type() === 'error' && !/inline-speculation-rules|Refused to apply a stylesheet/.test(m.text())) logs.push(m.text().slice(0, 160)); });
    page.on('pageerror', (e) => logs.push(String(e).slice(0, 160)));
    await page.goto(base + where, { waitUntil: 'load' });
    await sleep(2500);
    const slug = where === '/' ? 'home' : where.replace(/\//g, '');
    await page.screenshot({ path: path.join(out, `${name}-${slug}-0.png`), caret: 'initial' });
    // the halftone behind the first screen is still drawn once the recording has started (Safari hands over empty
    // video frames for a recording that is not shown; the dots must then come from the still picture)
    const dots = await page.evaluate(() => { const c = document.querySelector('canvas.hero-tone'); if (!c || !c.width) return -1; const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 0) n++; return n; });
    must(dots !== 0, `${tag}: the halftone of the first screen is drawn (${dots} painted samples)`);
    const at = await page.evaluate(() => ({ move: document.documentElement.classList.contains('move'), fade: document.documentElement.classList.contains('fade'), sideways: document.documentElement.scrollWidth > innerWidth + 1, left: document.querySelector('[data-left]')?.textContent }));
    must(at.move && at.fade && !at.sideways, `${tag}: the script runs, the scenes are on, no sideways scroll (${JSON.stringify(at)})`);
    if (where === '/') {
      // the story: scroll to three places in it
      for (const part of [0.3, 0.6, 0.9]) {
        await page.evaluate((part) => { const el = document.querySelector('.story-scene'), pin = el.querySelector('.pin'); scrollTo(0, el.getBoundingClientRect().top + scrollY + (el.offsetHeight - pin.offsetHeight) * part); }, part);
        await sleep(900);
        const s = await page.evaluate(() => { const el = document.querySelector('.story-scene'); const list = el.querySelector('.chat-list').getBoundingClientRect(); return { step: Number(el.dataset.step), p: Number(el.style.getPropertyValue('--p')), pinTop: Math.round(el.querySelector('.pin').getBoundingClientRect().top), shown: [...el.querySelectorAll('.chat-m')].filter((m) => Number(getComputedStyle(m).opacity) > 0.9).length, over: [...el.querySelectorAll('.chat-m')].some((m) => Number(getComputedStyle(m).opacity) > 0.5 && m.getBoundingClientRect().left < list.left - 1) }; });
        must(Math.abs(s.p - part) < 0.04 && s.pinTop === 0 && s.step === Math.min(4, Math.floor(part * 4) + 1) && !s.over, `${tag}: story at ${part} (${JSON.stringify(s)})`);
        await page.screenshot({ path: path.join(out, `${name}-${slug}-story-${part}.png`), caret: 'initial' });
      }
      // the gallery
      await page.evaluate(() => { const el = document.querySelector('.reel-scene'), pin = el.querySelector('.pin'); scrollTo(0, el.getBoundingClientRect().top + scrollY + Math.max(0, el.offsetHeight - pin.offsetHeight) * 0.4 + (el.classList.contains('pinned') ? 0 : -120)); });
      await sleep(1500);
      const g = await page.evaluate(() => ({ pinned: document.querySelector('.reel-scene').classList.contains('pinned'), x: Math.round(document.querySelector('.reel').getBoundingClientRect().left), ground: getComputedStyle(document.body).getPropertyValue('--ground').trim(), on: document.querySelector('.slide.on')?.className }));
      must(g.pinned === (name === 'desk') && g.ground !== '' && g.ground !== 'rgb(26, 28, 28)' && g.ground !== '#1a1c1c', `${tag}: gallery (${JSON.stringify(g)})`);
      await page.screenshot({ path: path.join(out, `${name}-${slug}-gallery.png`), caret: 'initial' });
      // the light section
      await page.evaluate(() => document.querySelector('.stairs').scrollIntoView({ block: 'center' }));
      await sleep(1400);
      must((await page.evaluate(() => document.body.dataset.ground)) === 'light', `${tag}: the page turns light for the levels`);
      await page.screenshot({ path: path.join(out, `${name}-${slug}-levels.png`), caret: 'initial' });
    }
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
    await sleep(1200);
    await page.screenshot({ path: path.join(out, `${name}-${slug}-end.png`), caret: 'initial' });
    must(logs.length === 0, `${tag}: no script errors${logs.length ? ' (' + logs.join(' | ') + ')' : ''}`);
    await ctx.close();
  }
}
await browser.close();
console.log(`\n${bad} failures`);
process.exit(bad ? 1 : 0);
