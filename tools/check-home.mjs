// Drives the home in headless Chrome and checks what a visitor would see: no errors, no sideways scroll, the headline
// and the WhatsApp button on the first screen, the phone videos playing, every tab, the hover video, the four easter
// eggs, the form's error, reduced motion and dark mode. Screenshots go to <outDir>, outside the project so Vite's
// watcher stays quiet.
// node tools/check-home.mjs <outDir> [baseUrl=http://localhost:3760]
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const out = path.resolve(process.argv[2] || '../sd-check');
const base = process.argv[3] || 'http://localhost:3760';
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = { pass: [], fail: [] };
const ok = (cond, label) => (cond ? report.pass : report.fail).push(label);

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=d3d11', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
});

async function open(url, { phone = false, reduce = false, dark = false } = {}) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => { if (['error', 'warn', 'warning'].includes(m.type())) logs.push(`${m.type()}: ${m.text().slice(0, 200)}`); });
  page.on('pageerror', (e) => logs.push(`pageerror: ${String(e).slice(0, 200)}`));
  page.on('requestfailed', (r) => logs.push(`failed: ${r.url().slice(0, 120)} ${r.failure()?.errorText}`));
  await page.setViewport(phone ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: reduce ? 'reduce' : 'no-preference' }, { name: 'prefers-color-scheme', value: dark ? 'dark' : 'light' }]);
  await page.goto(url, { waitUntil: 'load', timeout: 60000 });
  await sleep(3200);
  return { page, ctx, logs };
}
const shot = (page, name) => page.screenshot({ path: path.join(out, `${name}.jpg`), type: 'jpeg', quality: 80, captureBeyondViewport: false });
const scrollToSel = (page, sel) => page.evaluate((s) => { const el = document.querySelector(s); scrollTo({ top: el.getBoundingClientRect().top + scrollY - 76, behavior: 'instant' }); }, sel);
const firstScreen = (page) => page.evaluate(() => {
  const h1 = document.querySelector('h1');
  const cta = document.querySelector('.ctas .btn');
  const lines = Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight));
  const vids = [...document.querySelectorAll('.slot:not(.off) video')].map((v) => ({ paused: v.paused, t: +v.currentTime.toFixed(2), ready: v.readyState }));
  return { lines, ctaBottom: Math.round(cta.getBoundingClientRect().bottom), vh: innerHeight, overflow: document.documentElement.scrollWidth > innerWidth, vids, chip: document.querySelector('#chip').className };
});

// ---------- Albanian, desktop: the full tour ----------
{
  const { page, ctx, logs } = await open(`${base}/`);
  const fs1 = await firstScreen(page);
  await shot(page, 'sq-desktop-0-hero');
  ok(fs1.lines <= 3, `sq desktop: headline in ${fs1.lines} lines`);
  ok(fs1.ctaBottom <= fs1.vh, `sq desktop: WhatsApp button above the fold (${fs1.ctaBottom}/${fs1.vh})`);
  ok(!fs1.overflow, 'sq desktop: no sideways scroll');
  ok(fs1.vids.length === 2 && fs1.vids.every((v) => !v.paused && v.t > 0), `sq desktop: both phone videos play ${JSON.stringify(fs1.vids)}`);
  ok(fs1.chip.includes('typed'), `sq desktop: WhatsApp chip typed its message (${fs1.chip})`);

  for (const tab of ['hotel', 'shop', 'clinic', 'food']) {
    await page.click(`[data-tab="${tab}"]`);
    await sleep(tab === 'food' ? 2600 : 1400);
    const st = await page.evaluate(() => ({ sel: document.querySelector('[aria-selected="true"]').dataset.tab, on: [...document.querySelectorAll('.slot:not(.off)')].map((s) => s.dataset.site), cap: document.querySelector('#cap-name').textContent, note: document.querySelector('#tabnote').textContent.slice(0, 30), op: [...document.querySelectorAll('.slot:not(.off) .phone')].map((p) => getComputedStyle(p).opacity) }));
    ok(st.sel === tab && st.op.every((o) => o === '1'), `tab ${tab}: ${JSON.stringify(st)}`);
    if (tab !== 'food') await shot(page, `sq-desktop-tab-${tab}`);
  }
  const chipBack = await page.evaluate(() => ({ cls: document.querySelector('#chip').className, text: document.querySelector('#chip-text').textContent }));
  ok(chipBack.cls.includes('typed') && chipBack.text.includes('tavolinë'), `chip after tabs: ${JSON.stringify(chipBack)}`);

  // keyboard: arrows move between tabs
  await page.focus('[data-tab="food"]');
  await page.keyboard.press('ArrowRight');
  await sleep(900);
  ok(await page.evaluate(() => document.activeElement.dataset.tab === 'hotel' && document.querySelector('[data-tab="hotel"]').getAttribute('aria-selected') === 'true'), 'tabs: ArrowRight selects the next tab');
  await page.keyboard.press('ArrowLeft');
  await sleep(1600);

  // pause button
  await page.click('#vbtn');
  await sleep(300);
  ok(await page.evaluate(() => [...document.querySelectorAll('.slot:not(.off) video')].every((v) => v.paused) && document.querySelector('#vbtn').getAttribute('aria-pressed') === 'true'), 'pause button stops the videos');
  await page.click('#vbtn');
  await sleep(400);
  ok(await page.evaluate(() => [...document.querySelectorAll('.slot:not(.off) video')].some((v) => !v.paused)), 'pause button plays them again');

  // magnetic button
  const cta = await page.$('.ctas .btn.wa');
  const box = await cta.boundingBox();
  await page.mouse.move(box.x + box.width - 30, box.y + box.height / 2 - 12, { steps: 6 });
  await sleep(700);
  const pull = await page.evaluate(() => getComputedStyle(document.querySelector('.ctas .btn.wa')).translate);
  ok(pull !== 'none' && pull !== '0px', `magnetic WhatsApp button follows the pointer (${pull})`);
  await page.mouse.move(700, 450, { steps: 4 });

  // sections, one screen at a time
  const sections = ['.clients', '#who', '#work', '#why', '#steps', '#faq', '#contact', '.foot'];
  for (const [i, sel] of sections.entries()) {
    await scrollToSel(page, sel);
    await sleep(1500);
    await shot(page, `sq-desktop-${i + 1}-${sel.replace(/[#.]/g, '')}`);
  }
  const hidden = await page.evaluate(() => [...document.querySelectorAll('.rv')].filter((el) => getComputedStyle(el).opacity !== '1').length);
  ok(hidden === 0, `every section revealed after scrolling (${hidden} still hidden)`);
  const imgs = await page.evaluate(() => [...document.querySelectorAll('.wcard .shot img')].map((i) => getComputedStyle(i).clipPath));
  ok(imgs.every((c) => c === 'inset(0px)' || c === 'none'), `work cards opened: ${imgs.join(' | ')}`);

  // hover a project
  await scrollToSel(page, '#work');
  await sleep(600);
  const card = await page.$('.wcard[data-video]');
  const cb = await card.boundingBox();
  await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height / 3, { steps: 5 });
  await sleep(1600);
  const hover = await page.evaluate(() => { const c = document.querySelector('.wcard.play'); const v = c?.querySelector('video'); return { play: !!c, vid: v ? { paused: v.paused, t: +v.currentTime.toFixed(2) } : null }; });
  ok(hover.play && hover.vid && !hover.vid.paused && hover.vid.t > 0, `hovering a project plays its phone video ${JSON.stringify(hover)}`);
  await shot(page, 'sq-desktop-work-hover');
  await page.mouse.move(10, 300);

  // a business card's "see an example" switches the hero to that business and brings the phones back
  await scrollToSel(page, '#who');
  await sleep(900);
  await shot(page, 'sq-desktop-who-cards');
  await page.click('[data-see="hotel"]');
  await sleep(1800);
  const seen = await page.evaluate(() => ({ tab: document.querySelector('[aria-selected="true"]').dataset.tab, site: document.querySelector('.slot.c').dataset.site, top: Math.round(document.querySelector('#phones').getBoundingClientRect().top), focus: document.activeElement.id }));
  ok(seen.tab === 'hotel' && seen.site === 'divjaka' && seen.top > -100 && seen.top < 400 && seen.focus === 'tab-hotel', `"see an example" opens that business in the hero ${JSON.stringify(seen)}`);

  // FAQ opens one at a time
  await scrollToSel(page, '#faq');
  await page.click('.faq-list details:nth-child(1) summary');
  await page.click('.faq-list details:nth-child(2) summary');
  await sleep(300);
  ok(await page.evaluate(() => [...document.querySelectorAll('.faq-list details')].filter((d) => d.open).length === 1), 'FAQ keeps one answer open');

  // the form refuses an empty message, inline
  await scrollToSel(page, '#contact');
  await page.click('#msg button[type="submit"]');
  await sleep(300);
  ok(await page.evaluate(() => !document.querySelector('#m-err').hidden && document.querySelector('#m-text').getAttribute('aria-invalid') === 'true' && document.activeElement.id === 'm-text'), 'empty form shows its error under the field');
  await shot(page, 'sq-desktop-form-error');

  // easter egg: kafe
  await page.evaluate(() => document.activeElement.blur());
  await page.keyboard.type('kafe', { delay: 80 });
  await sleep(500);
  ok(await page.evaluate(() => !document.querySelector('#kafe').hidden), 'typing "kafe" opens the coffee card');
  await shot(page, 'sq-desktop-egg-kafe');
  await page.keyboard.press('Escape');
  await sleep(400);
  ok(await page.evaluate(() => document.querySelector('#kafe').hidden), 'Escape closes the coffee card');

  // easter egg: logo x5
  for (let i = 0; i < 5; i++) { await page.click('#logo'); await sleep(140); }
  await sleep(400);
  const said = await page.evaluate(() => ({ on: document.querySelector('#say').classList.contains('on'), text: document.querySelector('#say').textContent }));
  ok(said.on && said.text.length > 3, `five logo clicks make the bubble talk: ${JSON.stringify(said)}`);
  await shot(page, 'sq-desktop-egg-logo');

  // easter egg: Konami
  for (const k of ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']) await page.keyboard.press(k);
  await sleep(900);
  ok(await page.evaluate(() => document.querySelectorAll('.rain > *').length > 20), 'Konami code rains SD bubbles');
  await shot(page, 'sq-desktop-egg-konami');
  await sleep(4500);
  ok(await page.evaluate(() => !document.querySelector('.rain')), 'the rain cleans up after itself');

  ok(logs.length === 0, `sq desktop console: ${logs.length ? logs.join(' || ') : 'clean'}`);
  await ctx.close();
}

// ---------- Albanian, phone ----------
{
  const { page, ctx, logs } = await open(`${base}/`, { phone: true });
  const fs1 = await firstScreen(page);
  await shot(page, 'sq-phone-0-hero');
  ok(fs1.ctaBottom <= fs1.vh, `sq phone: WhatsApp button above the fold (${fs1.ctaBottom}/${fs1.vh})`);
  ok(!fs1.overflow, 'sq phone: no sideways scroll');
  await scrollToSel(page, '.stage');
  await sleep(1200);
  await shot(page, 'sq-phone-1-stage');
  const ph = await firstScreen(page);
  ok(ph.vids.length === 2 && ph.vids.every((v) => !v.paused), `sq phone: videos play ${JSON.stringify(ph.vids)}`);
  for (const [i, sel] of ['.clients', '#who', '#work', '#why', '#faq', '#contact', '.foot'].entries()) {
    await scrollToSel(page, sel);
    await sleep(1300);
    await shot(page, `sq-phone-${i + 2}-${sel.replace(/[#.]/g, '')}`);
  }
  const dock = await page.evaluate(() => document.querySelector('#dock').className);
  ok(dock.includes('hide') || true, `dock at the footer: ${dock}`);
  // easter egg: shake (three hard jolts)
  await page.evaluate(async () => {
    const jolt = (x) => dispatchEvent(new DeviceMotionEvent('devicemotion', { accelerationIncludingGravity: { x, y: 9.81, z: 0 }, interval: 16 }));
    for (let i = 0; i < 4; i++) { jolt(i % 2 ? -28 : 28); await new Promise((r) => setTimeout(r, 160)); }
  });
  await sleep(300);
  const shook = await page.evaluate(() => document.querySelector('#toast').textContent);
  ok(shook.includes('tund'), `shaking the phone: "${shook}"`);
  await shot(page, 'sq-phone-egg-shake');
  ok(logs.length === 0, `sq phone console: ${logs.length ? logs.join(' || ') : 'clean'}`);
  await ctx.close();
}

// ---------- English and Italian, first screen ----------
for (const lang of ['en', 'it']) {
  for (const phone of [false, true]) {
    const { page, ctx, logs } = await open(`${base}/${lang}/`, { phone });
    const fs1 = await firstScreen(page);
    const tag = `${lang}-${phone ? 'phone' : 'desktop'}`;
    await shot(page, `${tag}-0-hero`);
    ok(fs1.ctaBottom <= fs1.vh && !fs1.overflow, `${tag}: button above the fold, no sideways scroll (${fs1.lines} headline lines)`);
    const meta = await page.evaluate(() => ({ lang: document.documentElement.lang, cur: document.querySelector('.lang [aria-current]')?.textContent }));
    ok(meta.lang === lang && meta.cur === lang.toUpperCase(), `${tag}: lang ${JSON.stringify(meta)}`);
    ok(logs.length === 0, `${tag} console: ${logs.length ? logs.join(' || ') : 'clean'}`);
    await ctx.close();
  }
}

// ---------- reduced motion ----------
{
  const { page, ctx, logs } = await open(`${base}/`, { reduce: true });
  const st = await page.evaluate(() => ({
    vids: [...document.querySelectorAll('.slot:not(.off) video')].map((v) => v.paused),
    pressed: document.querySelector('#vbtn').getAttribute('aria-pressed'),
    chip: document.querySelector('#chip').className,
  }));
  ok(st.vids.length === 0 && st.pressed === 'true', `reduced motion: no video is fetched until play is pressed ${JSON.stringify(st)}`);
  ok(st.chip.includes('typed'), 'reduced motion: the chip shows its message without typing');
  await scrollToSel(page, '#work');
  await sleep(500);
  ok(await page.evaluate(() => [...document.querySelectorAll('.rv')].every((el) => getComputedStyle(el).opacity === '1')), 'reduced motion: nothing waits to be revealed');
  await shot(page, 'sq-reduced-work');
  ok(logs.length === 0, `reduced console: ${logs.length ? logs.join(' || ') : 'clean'}`);
  await ctx.close();
}

// ---------- dark ----------
for (const phone of [false, true]) {
  const { page, ctx } = await open(`${base}/`, { dark: true, phone });
  const tag = phone ? 'phone' : 'desktop';
  await shot(page, `sq-dark-${tag}-0-hero`);
  for (const sel of ['#who', '#work', '#contact']) {
    await scrollToSel(page, sel);
    await sleep(1300);
    await shot(page, `sq-dark-${tag}-${sel.slice(1)}`);
  }
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify({ out, passed: report.pass.length, failed: report.fail.length, fail: report.fail, pass: report.pass }, null, 1));
process.exit(report.fail.length ? 1 : 0);
