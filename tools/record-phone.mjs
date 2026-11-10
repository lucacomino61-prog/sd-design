// Record the clients' live sites as they look on a phone: a slow scroll down and back, looped.
//   node tools/record-phone.mjs [ids...]   -> public/phone/<id>.mp4 + <id>.jpg (first frame, the poster)
// Consent dialogs are answered with the most private choice (essential only / cancel), never "accept all".
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import ffmpeg from 'ffmpeg-static';

const SITES = [
  { id: 'martiri', url: 'https://barmartiri.com/' },
  { id: 'kater', url: 'https://kater4burgers.vercel.app/' },
  { id: 'elixir', url: 'https://elixir.al/' },
  { id: 'greta', url: 'https://www.dressesbygreta.workers.dev/' },
  { id: 'beed', url: 'https://beed-energy.stefanodoko-radari.workers.dev/' },
];
const OUT = path.resolve('public/phone'); fs.mkdirSync(OUT, { recursive: true });
const TMP = path.resolve('assets-src/phone-frames');
const only = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new',
  args: ['--mute-audio', '--use-angle=d3d11', '--enable-gpu', '--ignore-gpu-blocklist', '--hide-scrollbars', '--lang=sq-AL'],
  protocolTimeout: 180000,
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (const site of SITES.filter((s) => !only.length || only.includes(s.id))) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1');
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  // the sites are shown as an Albanian visitor sees them
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'sq-AL,sq;q=0.9' });
  await page.evaluateOnNewDocument(() => { Object.defineProperty(navigator, 'language', { get: () => 'sq-AL' }); Object.defineProperty(navigator, 'languages', { get: () => ['sq-AL', 'sq'] }); });
  await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 90000 }).catch(() => {});
  await sleep(4000);
  await page.evaluate(() => {
    for (const b of document.querySelectorAll('button, [role="button"]')) { if (/Shqip/.test((b.textContent || '').trim())) { b.click(); break; } }
    for (const s of document.querySelectorAll('select')) { const o = [...s.options].find((x) => /albanian|shqip/i.test(x.textContent)); if (o) { s.value = o.value; s.dispatchEvent(new Event('change', { bubbles: true })); } }
  }).catch(() => {});
  await sleep(900);
  // the most private answer to any consent or welcome dialog, then make sure nothing covers the page
  await page.evaluate(() => {
    const want = /^(vetëm thelbësore|only essential|necessary only|anulo|refuzo|reject( all)?|decline|mbyll|close|×)$/i;
    for (const b of document.querySelectorAll('button, [role="button"], a')) { if (want.test((b.textContent || '').trim())) { b.click(); } }
  }).catch(() => {});
  await sleep(1500);
  await page.evaluate(() => { for (const el of document.querySelectorAll('body *')) { const cs = getComputedStyle(el); const id = (el.id + ' ' + el.className).toString(); if ((cs.position === 'fixed' && /cookie|consent|gdpr|cmp|welcome/i.test(id)) || el.tagName === 'DIALOG' && el.open) el.remove(); } for (const el of [document.documentElement, document.body]) { el.style.setProperty('overflow', 'auto', 'important'); el.style.setProperty('position', 'static', 'important'); el.classList.remove('no-scroll', 'overflow-hidden', 'modal-open', 'is-locked', 'lock'); } }).catch(() => {});
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(800);
  const cdp = await page.createCDPSession();
  const frames = [];
  cdp.on('Page.screencastFrame', async (f) => { frames.push({ t: f.metadata.timestamp, data: f.data }); cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }).catch(() => {}); });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
  // hold, glide down two and a bit screens, hold, glide back: the loop closes on the first frame
  await page.evaluate(() => new Promise((done) => {
    // some sites scroll an inner container instead of the window: find whichever really scrolls
    let box = document.scrollingElement; if (box.scrollHeight - innerHeight < 40) { let best = null; for (const el of document.querySelectorAll('body *')) { const cs = getComputedStyle(el); if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight - el.clientHeight > 200 && (!best || el.scrollHeight > best.scrollHeight)) best = el; } if (best) box = best; }
    const scrollTo = (y) => (box === document.scrollingElement ? window.scrollTo({ top: y, behavior: 'instant' }) : (box.scrollTop = y));
    const H = innerHeight, max = Math.min(box.scrollHeight - box.clientHeight, H * 2.3);
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
    const legs = [[900, 0, 0], [4200, 0, max], [900, max, max], [2800, max, 0], [700, 0, 0]];
    let i = 0, t0 = performance.now();
    (function step(now) { const [d, a, b] = legs[i]; const k = Math.min(1, (now - t0) / d); scrollTo(a + (b - a) * ease(k)); if (k >= 1) { i++; t0 = now; if (i >= legs.length) return done(); } requestAnimationFrame(step); })(t0);
  }));
  await cdp.send('Page.stopScreencast');
  await sleep(300);
  // resample to a steady 30 fps by timestamp
  const dir = path.join(TMP, site.id); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  if (frames.length < 2) { console.log(site.id, 'did not scroll (only', frames.length, 'frame); skipped'); await ctx.close(); continue; }
  const t0 = frames[0].t, t1 = frames[frames.length - 1].t, n = Math.floor((t1 - t0) * 30);
  let j = 0;
  for (let k = 0; k < n; k++) { const t = t0 + k / 30; while (j + 1 < frames.length && frames[j + 1].t <= t) j++; fs.writeFileSync(path.join(dir, `${String(k).padStart(5, '0')}.jpg`), Buffer.from(frames[j].data, 'base64')); }
  execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-framerate', '30', '-i', path.join(dir, '%05d.jpg'), '-vf', 'scale=390:-2:flags=lanczos', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'slow', '-movflags', '+faststart', path.join(OUT, `${site.id}.mp4`)]);
  fs.copyFileSync(path.join(dir, '00000.jpg'), path.join(OUT, `${site.id}.jpg`));
  // the poster the pages use: the first frame as WebP, at the size of the recording
  execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', path.join(dir, '00000.jpg'), '-vf', 'scale=390:-2:flags=lanczos', '-c:v', 'libwebp', '-quality', '82', path.join(OUT, `${site.id}.webp`)]);
  console.log(site.id, `${frames.length} frames captured, ${n} written`, Math.round(fs.statSync(path.join(OUT, `${site.id}.mp4`)).size / 1024) + ' KB');
  await ctx.close();
}
await browser.close();
