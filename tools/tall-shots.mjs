// A tall picture of each client's site as a phone shows it: four screens, top to bottom, in one image. The gallery
// moves these inside its phones as the visitor scrolls. Public pages only; consent dialogs get the most private
// answer; nothing is typed or sent.
//   node tools/tall-shots.mjs [ids...]      -> public/work/tall-<id>.webp      (run unsandboxed: it needs the network)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import ffmpeg from 'ffmpeg-static';

const SITES = {
  martiri: 'https://barmartiri.com/',
  kater: 'https://kater4burgers.vercel.app/',
  elixir: 'https://elixir.al/',
  greta: 'https://www.dressesbygreta.workers.dev/',
  beed: 'https://beed-energy.stefanodoko-radari.workers.dev/',
};
const TILES = 4, W = 390, H = 844, SCALE = 1.5;
const only = process.argv.slice(2);
const OUT = path.resolve('public/work');
const TMP = path.resolve('assets-src/tall');
fs.mkdirSync(TMP, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--mute-audio', '--hide-scrollbars', '--lang=sq-AL'] });

for (const [id, url] of Object.entries(SITES).filter(([k]) => !only.length || only.includes(k))) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'sq-AL,sq;q=0.9' });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: W, height: H, deviceScaleFactor: SCALE, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => { Object.defineProperty(navigator, 'language', { get: () => 'sq-AL' }); Object.defineProperty(navigator, 'languages', { get: () => ['sq-AL', 'sq'] }); });
  for (let i = 1; i <= 4; i++) { try { await page.goto(url, { waitUntil: 'networkidle2', timeout: 70000 }); break; } catch (e) { if (i === 4) console.log(id, 'load:', String(e).slice(0, 80)); await sleep(4000); } }
  await sleep(3500);
  // Albanian where the site offers it, and the most private answer to any consent or welcome dialog
  await page.evaluate(() => {
    const tap = (re) => { for (const b of document.querySelectorAll('button, [role="button"]')) { if (re.test((b.textContent || '').trim())) { b.click(); return true; } } return false; };
    tap(/Shqip/);
    for (const s of document.querySelectorAll('select')) { const o = [...s.options].find((x) => /albanian|shqip/i.test(x.textContent)); if (o) { s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); } }
  }).catch(() => {});
  await sleep(700);
  await page.evaluate(() => {
    const want = /^(vetëm thelbësore|only essential|necessary only|anulo|refuzo|reject( all)?|decline|mbyll|close|×)$/i;
    for (const b of document.querySelectorAll('button, [role="button"], a')) { if (want.test((b.textContent || '').trim())) b.click(); }
  }).catch(() => {});
  await sleep(1800);
  const lang = await page.evaluate(() => document.documentElement.lang);
  const files = [];
  // Which element really scrolls (some sites scroll an inner box between a bar above and a bar below), and how far.
  const box = await page.evaluate(() => {
    // whichever can scroll the furthest is the one a thumb moves: the page itself, or a box inside it
    let el = document.scrollingElement, inner = false, range = el.scrollHeight - innerHeight;
    for (const c of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(c), far = c.scrollHeight - c.clientHeight;
      if (/(auto|scroll)/.test(cs.overflowY) && c.clientHeight > innerHeight * 0.5 && far > range + 200) { el = c; inner = true; range = far; }
    }
    window.__box = el; window.__inner = inner;
    const r = inner ? el.getBoundingClientRect() : { top: 0, height: innerHeight };
    return { inner, top: Math.round(r.top), height: Math.round(r.height), max: el.scrollHeight - el.clientHeight };
  });
  // whatever is pinned to the glass (chat buttons, bottom bars, pop-ups) would repeat in every tile: only the first
  // tile keeps the bar at the top
  const unpin = (first) => page.evaluate((first) => {
    const all = [];
    (function walk(root) { for (const el of root.querySelectorAll('*')) { all.push(el); if (el.shadowRoot) walk(el.shadowRoot); } })(document);
    // when a box inside the page scrolls, the bars laid over it are its siblings: a top strip, a bottom navigation
    if (window.__inner) {
      for (const el of window.__box.parentElement.children) {
        if (el === window.__box || getComputedStyle(el).position === 'static') continue;
        const r = el.getBoundingClientRect();
        if (r.height < 170 && (r.bottom > innerHeight - 8 || !first)) el.style.setProperty('visibility', 'hidden', 'important');
      }
    }
    for (const el of all) {
      const pos = getComputedStyle(el).position;
      if (pos !== 'fixed' && pos !== 'sticky') continue;
      const r = el.getBoundingClientRect();
      const bar = r.width > innerWidth * 0.6 && r.height < 170;
      const atTop = bar && r.top < 60, atBottom = bar && r.bottom > innerHeight - 8;
      // a sticky block that is not a bar is part of the page (a pinned scene): it stays
      if (pos === 'sticky' && !atTop && !atBottom) continue;
      if (!first || !atTop || /cookie|consent|gdpr|cmp|welcome|follow/i.test(el.id + ' ' + el.className)) el.style.setProperty('visibility', 'hidden', 'important');
    }
  }, first);
  let y = 0;
  for (let i = 0; i < TILES; i++) {
    const target = Math.min(i * box.height, box.max);
    // glide there in small steps, as a thumb would, so that content which appears on scroll has appeared
    for (let k = 1; k <= 14 && i > 0; k++) {
      const to = y + (target - y) * k / 14;
      await page.evaluate((to) => (window.__inner ? (window.__box.scrollTop = to) : window.scrollTo({ top: to, behavior: 'instant' })), to);
      await sleep(70);
    }
    y = target;
    await sleep(1300);
    await unpin(i === 0);
    await sleep(150);
    const file = path.join(TMP, `${id}-${i}.png`);
    // an inner scroller: the first tile keeps the bar above it, later tiles are only what scrolled
    const clip = box.inner ? (i === 0 ? { x: 0, y: 0, width: W, height: box.top + box.height } : { x: 0, y: box.top, width: W, height: box.height }) : undefined;
    await page.screenshot({ path: file, captureBeyondViewport: false, ...(clip && { clip }) });
    files.push(file);
    if (target >= box.max) break;
  }
  const out = path.join(OUT, `tall-${id}.webp`);
  const inputs = files.flatMap((f) => ['-i', f]);
  const stack = files.length > 1 ? ['-filter_complex', `vstack=inputs=${files.length}`] : [];
  execFileSync(ffmpeg, ['-y', '-loglevel', 'error', ...inputs, ...stack, '-c:v', 'libwebp', '-quality', '74', out]);
  console.log(id.padEnd(8), lang.padEnd(6), files.length, 'screens', Math.round(fs.statSync(out).size / 1024) + ' KB');
  await ctx.close();
}
await browser.close();
