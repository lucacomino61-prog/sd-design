// A film strip of one moving part: scrolls through a pinned scene in small steps and saves a picture of one element
// at each step, so a transition can be looked at frame by frame.
//   node tools/strip.mjs <outDir> <scene=.story-scene> <element=.mock> [size=1440x900] [from=0] [to=1] [frames=16] [base=http://localhost:3760] [path=/]
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const [out, scene = '.story-scene', element = '.mock', size = '1440x900', from = '0', to = '1', frames = '16', base = 'http://localhost:3760', where = '/'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const dir = path.resolve(out);
fs.mkdirSync(dir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const phone = w < 760;
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=d3d11'] });
const page = await browser.newPage();
await page.setViewport({ width: w, height: h, deviceScaleFactor: phone ? 2 : 1, isMobile: phone, hasTouch: phone });
await page.goto(base + where, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await sleep(2400);
const n = Number(frames);
for (let i = 0; i < n; i++) {
  const part = Number(from) + ((Number(to) - Number(from)) * i) / Math.max(1, n - 1);
  await page.evaluate((sel, part) => {
    const el = document.querySelector(sel), pin = el.querySelector('.pin');
    scrollTo({ top: el.getBoundingClientRect().top + scrollY + (el.offsetHeight - pin.offsetHeight) * part, behavior: 'instant' });
  }, scene, part);
  await sleep(650);
  const box = await page.evaluate((sel) => { const r = document.querySelector(sel).getBoundingClientRect(); return { x: Math.max(0, r.left) + scrollX, y: Math.max(0, r.top) + scrollY, width: Math.min(innerWidth, r.right) - Math.max(0, r.left), height: Math.min(innerHeight, r.bottom) - Math.max(0, r.top) }; }, element); // a clip is measured from the top of the page
  if (box.width < 2 || box.height < 2) { console.log('not on screen at', part.toFixed(2), JSON.stringify(box)); continue; }
  await page.screenshot({ path: path.join(dir, `${String(i).padStart(2, '0')}-${part.toFixed(2)}.jpg`), type: 'jpeg', quality: 82, clip: box, captureBeyondViewport: false });
}
await browser.close();
console.log('wrote', n, 'frames to', dir);
