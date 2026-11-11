// Proves the commission calculator on the hotel and restaurant pages: the sum, the currency, the share that would
// come direct, what happens with an empty or impossible field, and that neither the fields nor the big number ever
// run past the edge of the screen. Takes a picture of each page on a desktop and on a phone.
//   node tools/calc-check.mjs <outDir> [base=http://localhost:3760]
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import sq from '../src/i18n/sq.js';
import en from '../src/i18n/en.js';
import it from '../src/i18n/it.js';
import { PAGES } from '../src/data/site.js';
import { FEATURES } from '../src/data/features.js';

const out = path.resolve(process.argv[2] || '../sd-calc');
const base = process.argv[3] || 'http://localhost:3760';
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
let checks = 0;
const fails = [];
const ok = (cond, what) => { checks++; if (!cond) fails.push(what); };

if (!FEATURES.calculator) {
  // switched off: the pages must not carry it
  for (const kind of ['hotel', 'food']) {
    const html = await (await fetch(base + PAGES[kind].sq)).text();
    ok(!html.includes('data-calc') && !html.includes('id="calc"'), `${kind}: the calculator is off but still on the page`);
  }
} else {
  const T = { sq, en, it };
  for (const lang of ['sq', 'en', 'it']) {
    for (const kind of ['hotel', 'food']) {
      for (const [w, h] of [[1440, 900], [390, 844], [320, 568]]) {
        const tag = `${kind}-${lang}-${w}`;
        const ctx = await browser.createBrowserContext();
        const page = await ctx.newPage();
        const errors = [];
        page.on('pageerror', (e) => errors.push(String(e)));
        page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
        await page.setViewport({ width: w, height: h, isMobile: w < 760, hasTouch: w < 760, deviceScaleFactor: w < 760 ? 2 : 1 });
        await page.goto(`${base}${PAGES[kind][lang]}#calc`, { waitUntil: 'load' });
        await sleep(900);
        const c = T[lang].calc, sep = c.sep;
        const group = (x) => String(Math.round(x)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
        const read = () => page.evaluate(() => {
          const q = (s) => document.querySelector(`[data-calc] ${s}`);
          const big = q('.calc-big'), r = big.getBoundingClientRect();
          return {
            total: q('[data-total]').textContent, kept: q('[data-kept]').textContent, share: q('[data-share]').textContent,
            unit: q('.calc-big [data-unit]').textContent, label: q('[data-label]').textContent, len: big.dataset.len,
            bigRight: Math.round(r.right), vw: document.documentElement.clientWidth,
            sideways: document.documentElement.scrollWidth > innerWidth + 1,
            cut: [...document.querySelectorAll('[data-calc] *')].filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && (b.right > document.documentElement.clientWidth + 0.5 || b.left < -0.5); }).length,
          };
        });
        const set = async (name, value) => {
          const field = `[data-calc] [name="${name}"]`;
          await page.focus(field);
          await page.evaluate((f) => document.querySelector(f).select(), field);
          await page.keyboard.press('Backspace');
          if (value !== '') await page.keyboard.type(String(value));
        };
        const eg = kind === 'hotel' ? { n: 60, price: 50, pct: 15, months: 5, unit: '€' } : { n: 300, price: 1500, pct: 25, months: 12, unit: c.lek };
        // as it opens: the example, the same numbers the HTML carries without the script
        let s = await read();
        const total0 = (eg.n * eg.price * eg.pct * eg.months) / 100;
        ok(s.total === group(total0), `${tag}: opens with ${s.total}, expected ${group(total0)}`);
        ok(s.kept === group(total0 * 0.2) && s.share === '20', `${tag}: the share line opens with ${s.kept} at ${s.share}%`);
        ok(s.unit === eg.unit, `${tag}: opens in ${s.unit}`);
        ok(s.label.includes(String(eg.months)), `${tag}: the label does not name the months: ${s.label}`);
        if (w === 1440 || w === 390) await page.screenshot({ path: path.join(out, `${tag}.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });
        // the owner's own numbers, with a comma for the decimal point
        await set('n', 120); await set('price', '80,5'); await set('pct', '17,5'); await set('months', 4);
        s = await read();
        ok(s.total === group(120 * 80.5 * 17.5 * 4 / 100), `${tag}: 120 x 80,5 x 17,5% x 4 gives ${s.total}`);
        ok(s.label.includes('4'), `${tag}: the label did not follow the months`);
        // the other currency
        await page.evaluate(() => { const r = document.querySelector('[data-calc] [name="cur"]:not(:checked)'); r.click(); });
        s = await read();
        ok(s.unit !== eg.unit && (s.unit === '€' || s.unit === c.lek), `${tag}: the currency did not change (${s.unit})`);
        // the share that would come direct: the slider, by keyboard
        await page.focus('[data-calc] [name="share"]');
        for (let i = 0; i < 4; i++) await page.keyboard.press('ArrowRight');
        s = await read();
        ok(s.share === '40' && s.kept === group(120 * 80.5 * 17.5 * 4 / 100 * 0.4), `${tag}: at 40% the line says ${s.kept} (${s.share}%)`);
        // one month reads in the singular
        await set('months', 1);
        s = await read();
        ok(s.label.includes(`1 ${c.months[0]}`), `${tag}: one month reads "${s.label}"`);
        // nonsense and nothing: zero, never NaN; months stay between 1 and 12; a percentage above 100 counts as 100
        await set('n', 'abc'); s = await read();
        ok(s.total === '0' && s.kept === '0', `${tag}: letters give ${s.total}`);
        await set('n', ''); s = await read();
        ok(s.total === '0', `${tag}: an empty field gives ${s.total}`);
        await set('n', 10); await set('price', 100); await set('pct', 250); await set('months', 99); s = await read();
        ok(s.total === group(10 * 100 * 12), `${tag}: 250% over 99 months gives ${s.total}, expected ${group(12000)}`);
        // the largest numbers the fields take: the result stops at ten digits, gets smaller and stays on the screen
        await set('n', 9999999); await set('price', 999999999); await set('pct', 100); await set('months', 12); s = await read();
        ok(s.total === group(9999999999) && s.len === 'e' && !s.sideways && s.cut === 0 && s.bigRight <= s.vw, `${tag}: the largest number runs off the screen (${JSON.stringify(s)})`);
        if (w === 390) await page.screenshot({ path: path.join(out, `${tag}-max.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });
        // a usual large one in lek
        await set('n', 300); await set('price', 1500); await set('pct', 25); await set('months', 12); s = await read();
        ok(s.total === group(1350000) && !s.sideways && s.cut === 0, `${tag}: 1 350 000 does not fit (${JSON.stringify(s)})`);
        ok(errors.length === 0, `${tag}: ${errors[0]}`);
        await ctx.close();
      }
    }
  }
  // without the script the example is in the HTML, with its result
  const html = await (await fetch(base + PAGES.hotel.sq)).text();
  ok(/data-total[^>]*>2.250</.test(html), 'hotel: the example result is not in the HTML');
  // and the other two service pages do not have it
  for (const kind of ['shop', 'clinic']) ok(!(await (await fetch(base + PAGES[kind].sq)).text()).includes('data-calc'), `${kind}: has a calculator`);
}

await browser.close();
console.log(`calc: ${checks} checks, ${fails.length} failures${FEATURES.calculator ? '' : ' (switched off)'}`);
for (const f of fails) console.log('FAIL', f);
process.exit(fails.length ? 1 : 0);
