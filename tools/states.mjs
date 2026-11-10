// Screenshots of the states a scroll does not show: the glass over the halftone, the next client site, an open row,
// the open menu, a question, the form's messages, and the stop switch. Also proves each of them works: it fails if a
// row does not open, the menu stays shut, the form accepts an empty message, or the switch leaves a video playing.
//   node tools/states.mjs <outDir> [base=http://localhost:3760]
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const out = path.resolve(process.argv[2] || '../sd-states');
const base = process.argv[3] || 'http://localhost:3760';
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new',
  args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=d3d11', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
});
const fails = [];
const must = (ok, msg) => { if (!ok) fails.push(msg); console.log(ok ? 'ok  ' : 'FAIL', msg); };

for (const phone of [false, true]) {
  const tag = phone ? 'phone' : 'desk';
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 160)); });
  page.on('pageerror', (e) => logs.push(String(e).slice(0, 160)));
  await page.setViewport(phone ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900 });
  const shot = (name) => page.screenshot({ path: path.join(out, `${tag}-${name}.jpg`), type: 'jpeg', quality: 82, captureBeyondViewport: false });
  await page.goto(base + '/', { waitUntil: 'load' });
  await sleep(3600);

  // the glass over the dots (a desktop pointer), then the next client site
  if (!phone) { await page.mouse.move(520, 250, { steps: 12 }); await sleep(700); await shot('glass'); }
  const before = await page.$eval('#live-name', (el) => el.textContent);
  await page.$eval('#live-next', (el) => el.click());
  await sleep(2600);
  const after = await page.$eval('#live-name', (el) => el.textContent);
  must(before !== after, `${tag}: "next" changes the site in the phone (${before} -> ${after})`);
  await shot('next');

  // the menu
  await page.$eval('#burger', (el) => el.click());
  await sleep(350);
  must(await page.$eval('#nav', (el) => el.classList.contains('open') && !el.hasAttribute('inert')), `${tag}: the menu opens`);
  await shot('menu');
  await page.keyboard.press('Escape');
  await sleep(250);
  must(await page.$eval('#nav', (el) => !el.classList.contains('open') && el.hasAttribute('inert')), `${tag}: Escape closes the menu`);

  // a row opens in its client's colour and its phone plays; opening another closes the first
  await page.$eval('#elixir', (el) => el.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await page.$eval('#elixir > summary', (el) => el.click());
  await sleep(2600);
  must(await page.$eval('#elixir', (el) => el.open), `${tag}: a row opens`);
  must(await page.$eval('#elixir', (el) => getComputedStyle(el).backgroundColor === 'rgb(91, 33, 50)'), `${tag}: the open row takes the client's colour`);
  must(await page.$eval('#elixir .phone video', (v) => !v.paused).catch(() => false), `${tag}: the phone in the open row plays`);
  await page.evaluate(() => scrollBy({ top: -70, behavior: 'instant' }));
  await sleep(300);
  await shot('row');
  await page.$eval('#martiri > summary', (el) => el.click());
  await sleep(1300);
  must(await page.$eval('#elixir', (el) => !el.open), `${tag}: opening another row closes the first`);
  await shot('row2');

  // a link straight to a project opens its row
  await page.goto(base + '/#greta', { waitUntil: 'load' });
  await sleep(1600);
  must(await page.$eval('#greta', (el) => el.open && el.getBoundingClientRect().top < innerHeight * 0.6), `${tag}: /#greta opens that row and shows it`);

  // a question
  await page.$eval('.qs .row > summary', (el) => { el.scrollIntoView({ block: 'center', behavior: 'instant' }); el.click(); });
  await sleep(900);
  await shot('question');

  // the form: an empty message is refused with words, a written one says the draft note (no number is set)
  await page.$eval('#form', (el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await sleep(2700); // longer than the robot trap
  await page.$eval('#form .send', (el) => el.click());
  await sleep(300);
  must(await page.$eval('#f-err', (el) => !el.hidden), `${tag}: an empty message is refused with a message`);
  await shot('form-empty');
  await page.type('#f-text', 'Dua një faqe me menu për barin tim.');
  await page.$eval('#form .send', (el) => el.click());
  await sleep(400);
  must(await page.$eval('#draft', (el) => el.classList.contains('on') && el.textContent.length > 10), `${tag}: with no WhatsApp number yet, the form says it is a draft`);
  await shot('form-draft');

  // the stop switch: nothing plays afterwards
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await sleep(1500);
  await page.$eval('[data-still]', (el) => el.click());
  await sleep(500);
  must(await page.evaluate(() => [...document.querySelectorAll('video')].every((v) => v.paused)), `${tag}: the stop switch pauses every recording`);
  must(await page.$eval('[data-still]', (el) => el.getAttribute('aria-pressed') === 'true'), `${tag}: the stop switch says it is pressed`);

  // typing "kafe" brings the coffee card, Escape closes it
  if (!phone) {
    await page.evaluate(() => document.activeElement?.blur()); // the surprises do not fire while typing in a field
    await page.keyboard.type('kafe');
    await sleep(300);
    must(await page.$eval('#kafe', (el) => !el.hidden), 'desk: typing "kafe" shows the coffee card');
    await shot('kafe');
    await page.keyboard.press('Escape');
    must(await page.$eval('#kafe', (el) => el.hidden), 'desk: Escape closes it');
    for (const k of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']) await page.keyboard.press(k);
    await sleep(900);
    must(await page.$eval('#draft', (el) => el.classList.contains('on')), 'desk: the Konami code is answered');
    await shot('konami');
  }
  must(logs.length === 0, `${tag}: no console errors${logs.length ? ' (' + logs.join(' | ') + ')' : ''}`);
  await ctx.close();
}
await browser.close();
console.log(`\n${fails.length} failures`);
process.exit(fails.length ? 1 : 0);
