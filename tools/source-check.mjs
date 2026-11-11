// Proves the line that says where a visitor came from (src/scripts/source.js; the switch is `source`).
//   1. the reading itself, case by case: marks in the address, the page that linked here, and what must give nothing;
//   2. in a browser, on a build with a test WhatsApp number: a visit from Instagram, from a Google search and from
//      nowhere, and what the buttons and the form then write; nothing is stored on the device;
//   3. with the switch off: no line, and the reading is not in the page's script at all.
//   node tools/source-check.mjs [outDir=../sd-source-check]
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { arrivedFrom } from '../src/scripts/source.js';
import sq from '../src/i18n/sq.js';
import en from '../src/i18n/en.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(process.argv[2] || path.join(root, '..', 'sd-source-check'));
const PORT = 3795;
let checks = 0;
const fails = [];
const ok = (cond, what) => { checks++; if (!cond) fails.push(what); };

// ---------- 1. the reading ----------
const HERE = 'https://sd-design.test/draft-falas/';
for (const [address, referrer, want] of [
  [`${HERE}?utm_source=ig&utm_medium=social&utm_content=link_in_bio`, '', 'Instagram'],
  [`${HERE}?utm_source=Facebook`, '', 'Facebook'],
  [`${HERE}?utm_source=gmb`, '', 'Google Maps'],
  [`${HERE}?utm_source=fletushka-vere`, '', 'fletushka-vere'],
  [`${HERE}?utm_source=<script>alert(1)</script>`, '', ''],
  [`${HERE}?utm_source=${'a'.repeat(60)}`, '', ''],
  [`${HERE}?gclid=abc`, 'https://www.google.com/', 'Google Ads'],
  [`${HERE}?fbclid=abc`, '', 'Facebook / Instagram'],
  [`${HERE}?ttclid=abc`, '', 'TikTok'],
  [HERE, 'https://l.instagram.com/?u=x', 'Instagram'],
  [HERE, 'https://www.google.al/', 'Google'],
  [HERE, 'https://www.google.co.uk/search?q=x', 'Google'],
  [HERE, 'https://m.facebook.com/', 'Facebook'],
  [HERE, 'https://www.bing.com/search?q=x', 'Bing'],
  [HERE, 'https://t.co/abc', 'X'],
  [HERE, 'android-app://com.google.android.googlequicksearchbox/', 'Google'],
  [HERE, 'android-app://com.instagram.android/', 'Instagram'],
  [HERE, 'android-app://com.example.unknown/', ''],
  [HERE, 'https://www.tirana-guide.al/restorante/lista?id=7', 'tirana-guide.al'],
  [HERE, 'https://sd-design.test/', ''],
  [HERE, '', ''],
  [HERE, 'not a url', ''],
  [HERE, 'https://notgoogle.com.evil.example/', 'notgoogle.com.evil.example'],
]) {
  const got = arrivedFrom(address, referrer);
  ok(got === want, `reading: ${address.slice(HERE.length) || '(plain)'} from ${referrer || '(nowhere)'} gave "${got}", expected "${want}"`);
}

// ---------- 2 and 3. in a browser ----------
const sample = { contact: { whatsapp: '355600000000', phone: null, instagram: null, email: null, formEndpoint: null, formFields: {} }, person: { name: 'Test Person', photo: null }, legal: { name: null, nipt: null, address: null }, url: null, verify: { google: null, bing: null } };
const build = (dir, extra) => new Promise((resolve, reject) => {
  fs.rmSync(dir, { recursive: true, force: true });
  const env = { ...process.env, OWNER_SAMPLE: JSON.stringify(sample), FORCE_COLOR: '0', ...extra };
  delete env.SITE_URL;
  execFile(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build', '--outDir', dir], { cwd: root, env, maxBuffer: 1 << 26 }, (err, stdout, stderr) => (err ? (console.error(stdout, stderr), reject(new Error('the build failed'))) : resolve()));
});
const TYPES = { html: 'text/html; charset=utf-8', js: 'text/javascript', css: 'text/css', json: 'application/json', webp: 'image/webp', jpg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml', woff2: 'font/woff2', mp4: 'video/mp4', ico: 'image/x-icon' };
const serve = (dir) => new Promise((resolve) => {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (p.endsWith('/')) p += 'index.html';
    const file = path.join(dir, p);
    if (!file.startsWith(dir) || !fs.existsSync(file) || !fs.statSync(file).isFile()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[file.split('.').pop()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  }).listen(PORT, '127.0.0.1', () => resolve(server));
});
const scripts = (dir) => fs.readdirSync(path.join(dir, '_astro')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(dir, '_astro', f), 'utf8')).join('\n')
  + fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
// what a page's WhatsApp buttons would write, and what the form opens
async function visit(base, where, referer) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.evaluateOnNewDocument(() => { window.__opened = []; window.open = (u) => { window.__opened.push(u); return null; }; });
  // the messages as the HTML holds them, before the script adds anything
  const html = await (await fetch(base + where)).text();
  const before = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map((m) => new URL(m[1].replace(/&amp;/g, '&')).searchParams.get('text'));
  // (a browser driven by a script hands the referrer to the page only when told which policy to use)
  await page.goto(base + where, { waitUntil: 'load', ...(referer && { referer, referrerPolicy: 'unsafe-url' }) });
  await new Promise((r) => setTimeout(r, 2700)); // the form takes an answer only after a person could have typed one
  const texts = await page.evaluate(() => [...document.querySelectorAll('a[href^="https://wa.me/"]')].map((a) => new URL(a.href).searchParams.get('text')));
  await page.type('#f-text', 'Provë');
  await page.evaluate(() => document.querySelector('#form').requestSubmit());
  await new Promise((r) => setTimeout(r, 200));
  const opened = await page.evaluate(() => window.__opened.map((u) => new URL(u).searchParams.get('text')));
  const stored = await page.evaluate(() => ({ cookies: document.cookie, local: localStorage.length, session: sessionStorage.length, name: window.name }));
  await ctx.close();
  return { texts, before, opened, stored, errors };
}

const on = path.join(out, 'on'), off = path.join(out, 'off');
await build(on, {});
let server = await serve(on);
const base = `http://127.0.0.1:${PORT}`;
const line = (t, from) => `\n\n${t.ui.from.replace('{from}', from)}`;

let v = await visit(base, '/draft-falas/?utm_source=ig&utm_medium=social', null);
ok(v.texts.length >= 3 && v.texts.every((x) => x.endsWith(line(sq, 'Instagram'))), `from the Instagram bio: every button ends its message with the line (${v.texts.length} buttons; last: ${JSON.stringify(v.texts.at(-1)?.slice(-40))})`);
ok(v.before.length === v.texts.length && v.texts.every((x, i) => x === v.before[i] + line(sq, 'Instagram')), 'and each message is otherwise exactly what the page held');
ok(v.opened.length === 1 && v.opened[0].endsWith(line(sq, 'Instagram')) && v.opened[0].includes('Provë'), `the form's message says it too (${JSON.stringify(v.opened[0]?.slice(-50))})`);
ok(v.stored.cookies === '' && v.stored.local === 0 && v.stored.session === 0 && v.stored.name === '', `nothing is stored on the device (${JSON.stringify(v.stored)})`);
ok(v.errors.length === 0, `no script error (${v.errors[0]})`);

v = await visit(base, '/en/restaurants/', 'https://www.google.com/');
ok(v.texts.length >= 3 && v.texts.every((x) => x.endsWith(line(en, 'Google'))), `from a Google search, in English: ${JSON.stringify(v.texts[0]?.slice(-40))}`);

v = await visit(base, '/', null);
ok(v.texts.length >= 3 && v.texts.every((x) => !x.includes(sq.ui.from.split('{from}')[0])), 'a visit from nowhere adds nothing');
ok(v.opened.length === 1 && !v.opened[0].includes(sq.ui.from.split('{from}')[0]), 'nor does the form');

v = await visit(base, '/', `${base}/draft-falas/`);
ok(v.texts.every((x) => !x.includes(sq.ui.from.split('{from}')[0])), 'coming from another page of the site adds nothing');

ok(scripts(on).includes('utm_source'), 'the reading is in the page\'s script while the switch is on');
ok(fs.readFileSync(path.join(on, 'privatesia/index.html'), 'utf8').includes(sq.privacy.source.slice(0, 40)), 'and the privacy page says what the button writes');
server.close();

await build(off, { FEATURES_OFF: 'source' });
server = await serve(off);
v = await visit(base, '/draft-falas/?utm_source=ig', null);
ok(v.texts.length >= 3 && v.texts.every((x) => !x.includes(sq.ui.from.split('{from}')[0])), 'switched off: the same visit adds nothing');
ok(!scripts(off).includes('utm_source') && !scripts(off).includes('fbclid'), 'switched off: the reading is not in the page\'s script');
ok(!fs.readFileSync(path.join(off, 'privatesia/index.html'), 'utf8').includes(sq.privacy.source.slice(0, 40)), 'switched off: the privacy page does not mention it');
server.close();

await browser.close();
console.log(`source: ${checks} checks, ${fails.length} failures`);
for (const f of fails) console.log('FAIL', f);
process.exit(fails.length ? 1 : 0);
