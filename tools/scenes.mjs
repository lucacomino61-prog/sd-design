// Proves what the scroll moves, on a desktop and on a phone, and takes a picture of each moment:
// the counter on the first screen, the page changing ground, the three numbers, the story of the draft step by
// step, the gallery of client sites (pinned on a desktop, a strip to swipe on a phone), the line of big type,
// and that all of it stops with the switch, with the system's "reduce motion" setting and without JavaScript.
//   node tools/scenes.mjs <outDir> [base=http://localhost:3760] [path=/]
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { OFFER, left } from '../src/data/offer.js';

const out = path.resolve(process.argv[2] || '../sd-scenes');
const base = process.argv[3] || 'http://localhost:3760';
const where = process.argv[4] || '/';
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new',
  args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=d3d11', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
});
const fails = [];
const must = (ok, msg) => { if (!ok) fails.push(msg); console.log(ok ? 'ok  ' : 'FAIL', msg); };
const DESK = { width: 1440, height: 900 }, PHONE = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

async function open(view, { js = true, reduce = false, frames = true } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => logs.push(String(e).slice(0, 160)));
  await page.setViewport(view);
  if (!js) await page.setJavaScriptEnabled(false);
  // a browser that never runs an animation frame (some embedded views do this)
  if (!frames) await page.evaluateOnNewDocument(() => { window.requestAnimationFrame = () => 0; });
  if (reduce) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto(base + where, { waitUntil: 'load' });
  await sleep(js ? 2600 : 600);
  return { ctx, page, logs };
}
// scroll so that a scene is at a given part (0..1) of its pinned travel
const toScene = (page, sel, part) => page.evaluate((sel, part) => {
  const el = document.querySelector(sel), pin = el.querySelector('.pin');
  const top = el.getBoundingClientRect().top + scrollY;
  scrollTo({ top: top + (el.offsetHeight - pin.offsetHeight) * part, behavior: 'instant' });
}, sel, part);
const toMiddle = (page, sel) => page.evaluate((sel) => { const r = document.querySelector(sel).getBoundingClientRect(); scrollTo({ top: scrollY + r.top + r.height / 2 - innerHeight / 2, behavior: 'instant' }); }, sel);
const ground = (page) => page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--ground').trim());

for (const phone of [false, true]) {
  const tag = phone ? 'phone' : 'desk';
  const { ctx, page, logs } = await open(phone ? PHONE : DESK);
  const shot = (name) => page.screenshot({ path: path.join(out, `${tag}-${name}.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });

  // the first screen: the button, the counter and who answers are all on it
  await shot('00-first');
  const first = await page.evaluate(() => {
    const box = (s) => { const r = document.querySelector(s).getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight && r.width > 0; };
    return { cta: box('.hero .cta-big'), meter: box('.hero .meter-row'), who: box('.hero .who'), left: document.querySelector('.hero [data-left]').textContent, ticks: document.querySelectorAll('.hero .meter-ticks i.on').length, move: document.documentElement.classList.contains('move') };
  });
  must(first.cta, `${tag}: the big button is on the first screen`);
  must(first.meter && first.who, `${tag}: the counter and the name are on the first screen too`);
  must(Number(first.left) === left() && first.ticks === left(), `${tag}: the counter shows ${left()} of ${OFFER.perWeek} (it shows ${first.left}, ${first.ticks} squares)`);
  must(first.move, `${tag}: the scroll scenes are on`);

  // the three numbers, on the red ground
  await toMiddle(page, '.poster');
  await sleep(1700);
  must((await page.evaluate(() => document.body.dataset.ground)) === 'red' && (await ground(page)) === 'rgb(255, 77, 54)', `${tag}: the page turns red for the three numbers`);
  must((await page.$$eval('[data-count]', (els) => els.map((el) => el.textContent).join(','))) === `${OFFER.hours},${OFFER.perWeek},0`, `${tag}: the numbers have counted to ${OFFER.hours}, ${OFFER.perWeek}, 0`);
  await shot('01-numbers');

  // the story: four steps, and in the phone the conversation, the link, the draft
  const parts = [[0.06, 1], [0.2, 1], [0.34, 2], [0.47, 2], [0.57, 3], [0.7, 3], [0.82, 4], [0.97, 4]];
  for (const [part, step] of parts) {
    await toScene(page, '.story-scene', part);
    await sleep(900);
    const s = await page.evaluate(() => {
      const el = document.querySelector('.story-scene'), lines = [...el.querySelectorAll('.chat-m')].filter((m) => Number(getComputedStyle(m).opacity) > 0.9).length;
      const pg = el.querySelector('.page').getBoundingClientRect(), sc = el.querySelector('.mock-s').getBoundingClientRect();
      const act = [...el.querySelectorAll('.beat')].findIndex((b) => Number(getComputedStyle(b).opacity) > 0.9) + 1;
      return { step: Number(el.dataset.step), p: Number(el.style.getPropertyValue('--p')), lines, open: +((sc.bottom - pg.top) / sc.height).toFixed(2), act, pinTop: Math.round(el.querySelector('.pin').getBoundingClientRect().top) };
    });
    must(s.step === step && s.act === step && Math.abs(s.p - part) < 0.03 && s.pinTop === 0, `${tag}: story at ${part} -> step ${s.step}, lines ${s.lines}, draft open ${s.open} ${JSON.stringify(s)}`);
    await shot(`02-story-${String(Math.round(part * 100)).padStart(2, '0')}`);
  }
  must(await page.evaluate(() => getComputedStyle(document.body).getPropertyValue('--ground').trim() === 'rgb(26, 28, 28)'), `${tag}: the page is dark again for the story`);

  // the gallery
  const pinned = await page.$eval('.reel-scene', (el) => el.classList.contains('pinned'));
  must(pinned === !phone, `${tag}: the gallery is ${phone ? 'a strip to swipe' : 'pinned'}`);
  if (!phone) {
    let last = 1;
    const tones = new Set();
    for (const part of [0.02, 0.2, 0.4, 0.6, 0.8, 0.995]) {
      await toScene(page, '.reel-scene', part);
      await sleep(1300);
      const g = await page.evaluate(() => {
        const el = document.querySelector('.reel-scene'), reel = el.querySelector('.reel');
        const on = el.querySelector('.slide.on');
        return { x: Math.round(reel.getBoundingClientRect().left), on: on?.className, tone: on?.dataset.tone, ground: getComputedStyle(document.body).getPropertyValue('--ground').trim(), inner: on?.querySelector('.tall')?.style.translate || '', pinTop: Math.round(el.querySelector('.pin').getBoundingClientRect().top), right: Math.round(reel.getBoundingClientRect().right - innerWidth) };
      });
      tones.add(g.ground);
      must(g.x < last && g.pinTop === 0, `desk: gallery at ${part} -> row at ${g.x}px, ${g.on}, ground ${g.ground}, site ${g.inner}`);
      last = g.x;
      await shot(`03-gallery-${String(Math.round(part * 100)).padStart(2, '0')}`);
      if (part === 0.995) must(Math.abs(g.right) < 60, `desk: at the end the row's last slide is fully on screen (${g.right}px past the edge)`);
    }
    must(tones.size >= 5, `desk: the page took ${tones.size} different grounds across the gallery`);
  } else {
    await toMiddle(page, '.reel-wrap');
    await sleep(1600);
    const a = await page.evaluate(() => ({ on: document.querySelector('.slide.on')?.className, ground: getComputedStyle(document.body).getPropertyValue('--ground').trim() }));
    await sleep(3000);
    const moved = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('.slide.on .tall')).translate.split(' ')[1]) || 0);
    must(moved < -4, `phone: the site in the middle scrolls by itself (${Math.round(moved)}px)`);
    await shot('03-gallery-0');
    await page.$eval('.reel-wrap', (w) => { const s = w.querySelectorAll('.slide')[2]; w.scrollTo({ left: s.offsetLeft - 16, behavior: 'instant' }); });
    await sleep(1700);
    const b = await page.evaluate(() => ({ on: document.querySelector('.slide.on')?.className, ground: getComputedStyle(document.body).getPropertyValue('--ground').trim() }));
    must(a.on !== b.on && a.ground !== b.ground, `phone: swiping changes the site in the middle and the ground (${a.ground} -> ${b.ground})`);
    await shot('03-gallery-2');
  }

  // the list under the gallery still opens
  await page.$eval('#elixir', (el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.$eval('#elixir > summary', (el) => el.click());
  await sleep(1500);
  must(await page.$eval('#elixir', (el) => el.open), `${tag}: a row of the list opens`);
  await shot('04-row');

  // the light section: the line of big type has moved, the three levels and the kinds of business
  await page.$eval('.levels', (el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await sleep(1500);
  must((await page.evaluate(() => document.body.dataset.ground)) === 'light', `${tag}: the page turns light for the levels`);
  must(await page.$eval('[data-band] > span', (el) => parseFloat(el.style.translate) < -20), `${tag}: the line of big type has slid`);
  await shot('05-levels-0');
  await page.$eval('.stairs', (el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await sleep(1300);
  await shot('05-levels-1');
  await page.$eval('.kinds-b', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await sleep(1100);
  await shot('05-levels-2');
  await page.$eval('.why', (el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await sleep(1300);
  await shot('06-why');
  await page.$eval('.faq', (el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await sleep(1300);
  await shot('07-faq');
  await page.$eval('.close', (el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await sleep(1500);
  must((await page.evaluate(() => document.body.dataset.ground)) === 'red', `${tag}: the page turns red for the close`);
  await shot('08-close');
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await sleep(1200);
  await shot('09-foot');

  // the switch: everything stops, the page keeps its place, and the scenes become plain blocks
  await toScene(page, '.story-scene', 0.5);
  await sleep(700);
  await page.$eval('[data-still]', (el) => el.click());
  await sleep(700);
  const still = await page.evaluate(() => {
    const story = document.querySelector('.story-scene');
    return { move: document.documentElement.classList.contains('move'), tall: story.offsetHeight / innerHeight, pinned: document.querySelector('.reel-scene').classList.contains('pinned'), videos: [...document.querySelectorAll('video')].every((v) => v.paused), inView: story.getBoundingClientRect().top < innerHeight && story.getBoundingClientRect().bottom > 0, beats: [...story.querySelectorAll('.beat')].every((b) => Number(getComputedStyle(b).opacity) === 1 && b.querySelector('p').getBoundingClientRect().height > 10) };
  });
  must(!still.move && still.tall < 2.6 && !still.pinned && still.videos && still.beats, `${tag}: the switch stops the scenes (${JSON.stringify(still)})`);
  must(still.inView, `${tag}: after the switch the story is still on screen`);
  await shot('10-still-story');
  await toMiddle(page, '.reel-wrap');
  await sleep(900);
  await shot('10-still-gallery');
  await page.$eval('[data-still]', (el) => el.click());
  await sleep(700);
  must(await page.evaluate(() => document.documentElement.classList.contains('move') && document.querySelector('.story-scene').offsetHeight > innerHeight * 3), `${tag}: the switch turns them on again`);
  must(logs.length === 0, `${tag}: no console errors${logs.length ? ' (' + logs.join(' | ') + ')' : ''}`);
  await ctx.close();

  // the system's "reduce motion": the same plain page from the start
  const r = await open(phone ? PHONE : DESK, { reduce: true });
  must(await r.page.evaluate(() => !document.documentElement.classList.contains('move') && document.querySelector('[data-still]').getAttribute('aria-pressed') === 'true'), `${tag}: with "reduce motion" the scenes never start`);
  await toMiddle(r.page, '.story-scene');
  await sleep(700);
  await r.page.screenshot({ path: path.join(out, `${tag}-11-reduced-story.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });
  await r.ctx.close();

  // a browser that runs the script but never an animation frame: nothing is pinned, so nothing can get stuck
  const f = await open(phone ? PHONE : DESK, { frames: false });
  const stuck = await f.page.evaluate(() => ({ move: document.documentElement.classList.contains('move'), tall: document.querySelector('.story-scene').offsetHeight / innerHeight, pinned: document.querySelector('.reel-scene').classList.contains('pinned'), beats: [...document.querySelectorAll('.beat')].every((b) => Number(getComputedStyle(b).opacity) === 1), numbers: [...document.querySelectorAll('[data-count]')].map((el) => el.textContent).join(',') }));
  must(!stuck.move && stuck.tall < 2.6 && !stuck.pinned && stuck.beats && stuck.numbers === `${OFFER.hours},${OFFER.perWeek},0`, `${tag}: without animation frames the page stays plain and whole (${JSON.stringify(stuck)})`);
  await f.ctx.close();

  // without JavaScript: every word, the list of steps, the strip of phones
  const n = await open(phone ? PHONE : DESK, { js: false });
  const plain = await n.page.evaluate(() => ({ steps: document.querySelectorAll('.beat h3').length, slides: document.querySelectorAll('.slide').length, sideways: document.documentElement.scrollWidth > innerWidth + 1, light: getComputedStyle(document.querySelector('.levels')).backgroundColor, red: getComputedStyle(document.querySelector('.poster')).backgroundColor }));
  must(plain.steps === 4 && plain.slides >= 6 && !plain.sideways && plain.light === 'rgb(249, 244, 235)' && plain.red === 'rgb(255, 77, 54)', `${tag}: without JavaScript the page is whole (${JSON.stringify(plain)})`);
  await toMiddle(n.page, '.story-scene');
  await n.page.screenshot({ path: path.join(out, `${tag}-12-nojs-story.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });
  await toMiddle(n.page, '.reel-wrap');
  await n.page.screenshot({ path: path.join(out, `${tag}-12-nojs-gallery.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });
  await toMiddle(n.page, '.poster');
  await n.page.screenshot({ path: path.join(out, `${tag}-12-nojs-numbers.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });
  await n.ctx.close();
}
await browser.close();
console.log(`\n${fails.length} failures`);
process.exit(fails.length ? 1 : 0);
