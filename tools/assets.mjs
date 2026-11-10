// Makes the pictures the site itself needs, from what is already in the project:
//   1. half-width copies of the desktop screenshots (public/work/*-720.webp), for phones and small slots;
//   2. the icon set (public/favicon.ico, public/icons/*): the SD mark on the site's dark ground;
//   3. one share image per page and language (public/og/<page>-<lang>.jpg, 1200x630): the page's own headline in the
//      site's type over a red halftone of a client's site.
// Run it again whenever the headlines or the screenshots change:   node tools/assets.mjs [shots|icons|og]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';
import ffmpeg from 'ffmpeg-static';
import sq from '../src/i18n/sq.js';
import en from '../src/i18n/en.js';
import it from '../src/i18n/it.js';
import { SERVICES } from '../src/data/site.js';
import { S_PATH, BUBBLE } from '../src/data/mark.js';
import { SITES } from '../src/data/sites.js';

const only = process.argv[2];
const pub = path.resolve('public');
const GROUND = '#1a1c1c', INK = '#f9f4eb', RED = '#ff4d36';

// ---------- 1. smaller screenshots ----------
if (!only || only === 'shots') {
  for (const s of Object.values(SITES)) {
    if (!s.shot) continue;
    const from = path.join(pub, s.shot), to = from.replace('.webp', '-720.webp');
    execFileSync(ffmpeg, ['-y', '-loglevel', 'error', '-i', from, '-vf', 'scale=720:-2:flags=lanczos', '-c:v', 'libwebp', '-quality', '80', to]);
    console.log('shot', path.basename(to), fs.statSync(to).size);
  }
}
if (only === 'shots') process.exit(0);

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
page.on('pageerror', (e) => console.error('page error:', String(e).slice(0, 300)));
page.on('console', (m) => { if (m.type() === 'error') console.error('console:', m.text().slice(0, 300)); });
const data = (file, type) => `data:${type};base64,${fs.readFileSync(path.join(pub, file)).toString('base64')}`;
const font = (f) => data(`fonts/${f}`, 'font/woff2'); // a page made with setContent may not read local files
const markSvg = (size, s = INK, b = RED) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -8 707 500" width="${size}"><path fill="${s}" d="${S_PATH}"/><path fill="${b}" d="${BUBBLE}"/></svg>`;

// ---------- 2. icons ----------
if (!only || only === 'icons') {
  fs.mkdirSync(path.join(pub, 'icons'), { recursive: true });
  const icon = async (file, px, inner) => {
    await page.setViewport({ width: px, height: px, deviceScaleFactor: 1 });
    await page.setContent(`<!doctype html><style>html,body{margin:0;height:100%;background:${GROUND}}body{display:grid;place-items:center}</style>${markSvg(Math.round(px * inner))}`);
    const buf = await page.screenshot({ type: 'png', captureBeyondViewport: false });
    fs.writeFileSync(path.join(pub, file), buf);
    console.log('icon', file, buf.length);
    return buf;
  };
  await icon('icons/icon-192.png', 192, 0.66);
  await icon('icons/icon-512.png', 512, 0.66);
  await icon('icons/icon-maskable-512.png', 512, 0.5); // the whole mark inside the safe circle
  await icon('icons/apple-touch-icon.png', 180, 0.66);
  // favicon.ico: one 32 px PNG in an ICO wrapper, for the places that still ask for /favicon.ico
  const png = await icon('icons/favicon-32.png', 32, 0.78);
  const head = Buffer.alloc(22);
  head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
  head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt8(0, 8); head.writeUInt8(0, 9);
  head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(png.length, 14); head.writeUInt32LE(22, 18);
  fs.writeFileSync(path.join(pub, 'favicon.ico'), Buffer.concat([head, png]));
  fs.unlinkSync(path.join(pub, 'icons/favicon-32.png'));
  console.log('icon favicon.ico');
}

// ---------- 3. share images ----------
if (!only || only === 'og') {
  fs.mkdirSync(path.join(pub, 'og'), { recursive: true });
  // which client's site sits behind which page's headline
  const BEHIND = { home: 'kater', offer: null, food: 'martiri', hotel: 'divjaka', shop: 'greta', clinic: null };
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  for (const t of [sq, en, it]) {
    for (const key of ['home', 'offer', ...SERVICES]) {
      const lines = key === 'home' ? t.home.h1 : key === 'offer' ? [t.offer.h1] : [t.services[key].h1];
      const title = lines.map((l) => l.replace(/\*([^*]+)\*/g, '<b>$1</b>')).join(key === 'home' ? '<br>' : ' ');
      const site = BEHIND[key] && SITES[BEHIND[key]];
      const img = site ? data(site.poster ?? site.card, 'image/webp') : '';
      const label = key === 'home' ? t.foot.line : key === 'offer' ? t.bar[2] : `${t.kinds[key]} · ${t.foot.line.split(' · ')[1]}`;
      await page.setContent(`<!doctype html><html lang="${t.lang}"><style>
        @font-face{font-family:A;src:url("${font('archivo-latin-wdth-normal.woff2')}");font-weight:100 900;font-stretch:62% 125%}
        @font-face{font-family:M;src:url("${font('sometype-mono-latin-wght-normal.woff2')}");font-weight:400 700}
        html,body{margin:0;width:1200px;height:630px;background:${GROUND};color:${INK};overflow:hidden}
        canvas{position:absolute;inset:0}
        .scrim{position:absolute;inset:0;background:linear-gradient(90deg,${GROUND} 0%,rgb(26 28 28/.9) 34%,rgb(26 28 28/.35) 70%,transparent),linear-gradient(0deg,${GROUND} 0%,transparent 46%)}
        .in{position:absolute;inset:0;display:grid;grid-template-rows:auto 1fr auto;padding:54px 60px 50px}
        h1{align-self:end;margin:0 0 30px;max-width:1040px;font:800 100px/.94 A;font-stretch:125%;letter-spacing:-.035em;text-transform:uppercase}
        h1 b{font-weight:800;color:${RED}}
        p{margin:0;padding-top:20px;border-top:1px solid rgb(249 244 235/.34);font:500 19px/1 M;letter-spacing:-.02em;text-transform:uppercase;display:flex;justify-content:space-between}
      </style><body><canvas width="1200" height="630"></canvas><div class="scrim"></div>
      <div class="in"><div>${markSvg(92)}</div><h1>${title}</h1><p><span>SD Design</span><span>${label}</span></p></div>
      <script>
        (async () => {
          await document.fonts.ready;
          const h1 = document.querySelector('h1'); let size = 100;
          while ((h1.scrollHeight > 330 || h1.scrollWidth > 1040) && size > 40) { size -= 2; h1.style.fontSize = size + 'px'; }
          const c = document.querySelector('canvas'), x = c.getContext('2d'), cell = 10, cols = 120, rows = 63;
          const s = document.createElement('canvas'); s.width = cols; s.height = rows; const sx = s.getContext('2d');
          sx.fillStyle = '#fff'; sx.fillRect(0, 0, cols, rows);
          const src = ${JSON.stringify(img)};
          if (src) { const im = new Image(); im.src = src; await im.decode(); const k = Math.max(cols * 0.62 / im.naturalWidth, rows / im.naturalHeight); const dw = im.naturalWidth * k, dh = im.naturalHeight * k; sx.drawImage(im, cols - dw, (rows - dh) * 0.24, dw, dh); }
          else { const k = rows * 0.9 / 494; sx.translate(cols * 0.72 - 707 * k / 2, rows * 0.05); sx.scale(k, k); sx.fillStyle = '#000'; sx.fill(new Path2D(${JSON.stringify(S_PATH)})); sx.fill(new Path2D(${JSON.stringify(BUBBLE)})); sx.setTransform(1, 0, 0, 1, 0, 0); }
          const d = sx.getImageData(0, 0, cols, rows).data; const v = []; let sum = 0;
          for (let i = 0; i < cols * rows; i++) { v[i] = 1 - (d[i * 4] * 0.2126 + d[i * 4 + 1] * 0.7152 + d[i * 4 + 2] * 0.0722) / 255; sum += v[i]; }
          const inv = sum / v.length > 0.5;
          x.fillStyle = '${RED}';
          for (let y = 0, i = 0; y < rows; y++) for (let xx = 0; xx < cols; xx++, i++) { let a = inv ? 1 - v[i] : v[i]; a = a < 0.12 ? 0 : Math.min(1, (a - 0.12) * 1.45); if (a < 0.03) continue; const w = a * cell * 0.88; x.fillRect(xx * cell + (cell - w) / 2, y * cell + (cell - w) / 2, w, w); }
          document.title = 'ready';
        })();
      </script></body></html>`);
      await page.waitForFunction(() => document.title === 'ready', { timeout: 20000 });
      const file = path.join(pub, 'og', `${key}-${t.lang}.jpg`);
      await page.screenshot({ path: file, type: 'jpeg', quality: 84, captureBeyondViewport: false });
      console.log('og', path.basename(file), fs.statSync(file).size);
    }
  }
}
await browser.close();
