// One screenshot of the first screen for each client site that takes a turn there, at two moments of its recording,
// to judge which makes the best opening picture.   node tools/hero-sites.mjs <outDir> [base] [path=/]
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const out = path.resolve(process.argv[2]);
const base = process.argv[3] || 'http://localhost:3760';
const where = process.argv[4] || '/';
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=d3d11', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
for (const phone of [false, true]) {
  const page = await (await browser.createBrowserContext()).newPage();
  await page.setViewport(phone ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900 });
  await page.goto(base + where, { waitUntil: 'load' });
  await sleep(3000);
  for (let i = 0; i < 4; i++) {
    const name = await page.$eval('#live-name', (el) => el.textContent.replace(/\W+/g, '-').toLowerCase());
    for (const t of ['a', 'b']) {
      await page.screenshot({ path: path.join(out, `${phone ? 'phone' : 'desk'}-${i}-${name}-${t}.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });
      await sleep(2600);
    }
    await page.$eval('#live-next', (el) => el.click());
    await sleep(2600);
  }
}
await browser.close();
