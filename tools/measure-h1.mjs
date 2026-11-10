// How wide is the home headline in each language? Prints each line's width in em (at the display width and weight)
// and the longest single word, so the size in src/styles/site.css (--h1 per language) can be set to fit:
// on a desktop the lines must end before the glass phone, on a phone the longest word must fit the screen.
// node tools/measure-h1.mjs [base=http://localhost:3760]
import puppeteer from 'puppeteer-core';

const base = process.argv[2] || 'http://localhost:3760';
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' });
const page = await browser.newPage();
for (const p of ['/', '/en/', '/it/']) {
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(base + p, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 1800));
  const d = await page.evaluate(() => {
    const big = document.querySelector('.big'), size = parseFloat(getComputedStyle(big).fontSize);
    big.style.whiteSpace = 'nowrap'; // measure each line unbroken, whatever the current size does to it
    const em = (el) => +(el.getBoundingClientRect().width / size).toFixed(2);
    // a line's ink: from its first word's left edge to its last word's right edge
    const lines = [...big.querySelectorAll('.ln')].map((ln) => { const w = [...ln.querySelectorAll('.w > span')]; return +((w.at(-1).getBoundingClientRect().right - w[0].getBoundingClientRect().left) / size).toFixed(2); });
    const words = [...big.querySelectorAll('.w > span')].map((w) => [w.textContent, em(w)]).sort((a, b) => b[1] - a[1])[0];
    const phone = document.querySelector('#live-phone').getBoundingClientRect();
    return { size, lines, longestWord: words, phoneLeft: Math.round(phone.left), phoneBottom: Math.round(phone.bottom), h1Top: Math.round(big.getBoundingClientRect().top) };
  });
  // largest size (in vw) at 1440: the widest line within the 1360 px measure, and the first two lines clear of the phone
  const fitAll = 1360 / Math.max(...d.lines), fitPhone = (d.phoneLeft - 40 - 28) / Math.max(d.lines[0], d.lines[1]);
  console.log(p.padEnd(5), JSON.stringify(d), '-> desktop max', (Math.min(fitAll, fitPhone) / 14.4).toFixed(2) + 'vw', '| phone max', ((390 - 32) / d.longestWord[1] / 3.9).toFixed(2) + 'vw');
}
await browser.close();
