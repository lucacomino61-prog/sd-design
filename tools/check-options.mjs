// Looks at the design options (src/pages/options) the way a visitor would, desktop and phone: console errors,
// sideways scroll, the load sequence, then one screenshot per scroll step. Screenshots go outside the project.
// node tools/check-options.mjs <outDir> [a,b,c] [baseUrl=http://localhost:3760]
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const out = path.resolve(process.argv[2] || '../sd-options');
const which = (process.argv[3] || 'a,b,c').split(',');
const base = process.argv[4] || 'http://localhost:3760';
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new',
  args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=d3d11', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
});
const report = {};

for (const id of which) {
  for (const phone of [false, true]) {
    const tag = `${id}-${phone ? 'phone' : 'desk'}`;
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    const logs = [];
    page.on('console', (m) => { if (['error', 'warn', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text().slice(0, 160)}`); });
    page.on('pageerror', (e) => logs.push(`pageerror: ${String(e).slice(0, 160)}`));
    page.on('requestfailed', (r) => { if (!/ERR_ABORTED/.test(r.failure()?.errorText || '')) logs.push(`failed: ${r.url().slice(0, 100)}`); });
    await page.setViewport(phone ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900 });
    const shot = (name) => page.screenshot({ path: path.join(out, `${tag}-${name}.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });
    await page.goto(`${base}/options/${id}/`, { waitUntil: 'load', timeout: 60000 });
    for (const [i, ms] of [[0, 250], [1, 450], [2, 500], [3, 700]]) { await sleep(ms); if (!phone) await shot(`load${i}`); }
    await sleep(2600);
    await shot('0');
    const info = await page.evaluate(() => ({ docH: document.documentElement.scrollHeight, overflow: document.documentElement.scrollWidth > innerWidth + 1, h1: document.querySelector('h1')?.textContent.trim().slice(0, 70), videos: [...document.querySelectorAll('video')].map((v) => !v.paused).filter(Boolean).length }));
    const steps = Math.min(11, Math.ceil(info.docH / (phone ? 844 : 900)) - 1);
    for (let i = 1; i <= steps; i++) {
      await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), Math.round(i * (phone ? 844 : 900) * 0.96));
      await sleep(1100);
      await shot(String(i));
    }
    report[tag] = { ...info, steps, logs };
    await ctx.close();
  }
}
await browser.close();
console.log(JSON.stringify(report, null, 1));
