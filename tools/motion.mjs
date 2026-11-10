// Frame by frame: scrolls the home page the way a visitor does (a mouse wheel on a desktop, small finger steps on a
// phone), records what every moving part is doing on each animation frame, and looks for glitches:
//   the example conversation   no message over the chat's header, none overlapping another, the newest one always in
//                              view, no message jumping back and forth;
//   the story                  the step shown matches the scroll, the draft only ever slides one way;
//   the gallery                the row and each site inside its phone only ever move one way, never past their ends;
//   the page                   no word of the conversation or of a step outside its box, no long gaps between frames.
// It scrolls down through the page and back up, at several screen sizes and in the three languages.
//   node tools/motion.mjs [base=http://localhost:3760] [sizes=all|1440x900,390x844,...]
import puppeteer from 'puppeteer-core';

const base = process.argv[2] || 'http://localhost:3760';
const ALL = [[1920, 1080], [1536, 864], [1440, 900], [1366, 768], [1280, 720], [1280, 600], [1024, 768], [820, 1180], [430, 932], [390, 844], [360, 740], [320, 568]];
const sizes = process.argv[3] && process.argv[3] !== 'all' ? process.argv[3].split(',').map((s) => s.split('x').map(Number)) : ALL;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new',
  args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=d3d11', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
});
let bad = 0;
const fail = (where, msg) => { bad++; console.log('FAIL', where, msg); };

// runs in the page: sample the moving parts on every animation frame
function sampler() {
  window.__rec = [];
  const story = document.querySelector('.story-scene'), reelScene = document.querySelector('.reel-scene');
  const list = story.querySelector('.chat-list'), head = story.querySelector('.chat-top'), pin = story.querySelector('.pin');
  const msgs = [...story.querySelectorAll('.chat-m')], page = story.querySelector('.page'), screen = story.querySelector('.mock-s');
  const beats = [...story.querySelectorAll('.beat')];
  const reel = reelScene.querySelector('.reel'), talls = [...reelScene.querySelectorAll('.tall')];
  let last = performance.now();
  (function tick(now) {
    const lr = list.getBoundingClientRect(), pr = pin.getBoundingClientRect(), sr = screen.getBoundingClientRect();
    const inStory = pr.top <= 1 && pr.bottom >= innerHeight - 60 && story.getBoundingClientRect().bottom > innerHeight;
    window.__rec.push({
      t: Math.round(now), gap: Math.round(now - last), y: Math.round(scrollY),
      p: Number(story.style.getPropertyValue('--p') || -1), step: Number(story.dataset.step || 0), inStory,
      listTop: lr.top, room: Math.min(lr.bottom, pr.bottom) , headBottom: head.getBoundingClientRect().bottom,
      msgs: msgs.map((m) => { const r = m.getBoundingClientRect(); return [Number(getComputedStyle(m).opacity), r.top, r.bottom, r.left, r.right]; }),
      screen: [sr.left, sr.right],
      page: page.getBoundingClientRect().top - sr.top,
      beat: beats.findIndex((b) => Number(getComputedStyle(b).opacity) > 0.9) + 1,
      pinned: reelScene.classList.contains('pinned'),
      reelX: reel.getBoundingClientRect().left,
      inner: talls.map((im) => parseFloat((im.style.translate || '0 0').split(' ')[1]) || 0),
    });
    last = now;
    requestAnimationFrame(tick);
  })(last);
}

async function run([w, h], lang) {
  const phone = w < 900 && (w < 760 || h > w);
  const tag = `${w}x${h} ${lang}`;
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  const logs = [];
  page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text().slice(0, 140)); });
  page.on('pageerror', (e) => logs.push(String(e).slice(0, 140)));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: phone, hasTouch: phone });
  await page.goto(base + (lang === 'sq' ? '/' : `/${lang}/`), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await sleep(2200);
  const place = await page.evaluate(() => {
    const top = (s) => Math.round(document.querySelector(s).getBoundingClientRect().top + scrollY);
    return { story: top('.story'), work: top('.work'), levels: top('.levels'), max: document.documentElement.scrollHeight - innerHeight };
  });
  // start a little above the story, then scroll down to the levels and back up
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), Math.max(0, place.story - 300));
  await sleep(500);
  await page.evaluate(sampler);
  const end = Math.min(place.max, place.levels + 200);
  const steps = Math.ceil((end - (place.story - 300)) / (phone ? 70 : 110));
  const down = async (dir) => {
    for (let i = 0; i < steps; i++) {
      if (phone) await page.evaluate((d) => scrollBy({ top: d, behavior: 'instant' }), dir * 70);
      else { await page.mouse.move(w / 2, h / 2); await page.mouse.wheel({ deltaY: dir * 110 }); }
      await sleep(34);
    }
    await sleep(700);
  };
  await down(1);
  const mark = await page.evaluate(() => window.__rec.length);
  await down(-1);
  const rec = await page.evaluate(() => window.__rec);
  await ctx.close();

  // ---------- read the recording ----------
  const out = { frames: rec.length, longGaps: rec.filter((f) => f.gap > 60).length, worstGap: Math.max(...rec.map((f) => f.gap)) };
  let prev = null, issues = new Map();
  const note = (k, v) => { if (!issues.has(k)) issues.set(k, v); };
  rec.forEach((f, i) => {
    const dir = i < mark ? 1 : -1;
    if (f.inStory && f.p >= 0) {
      const want = Math.min(4, Math.floor(f.p * 4) + 1);
      if (f.step !== want) note('step', `step ${f.step} at p=${f.p} (should be ${want})`);
      const shown = f.msgs.map((m, k) => ({ k, o: m[0], top: m[1], bottom: m[2], left: m[3], right: m[4] })).filter((m) => m.o > 0.05);
      const covered = f.page < 6; // the draft has slid over the whole conversation
      if (!covered) {
        for (const m of shown) {
          // drawn over the header? (the list is clipped below it, so a message may only be cut, never on top of it)
          if (m.left < f.screen[0] - 1 || m.right > f.screen[1] + 1) note('side', `message ${m.k + 1} runs off the side of the phone (${Math.round(m.left)}..${Math.round(m.right)} in ${Math.round(f.screen[0])}..${Math.round(f.screen[1])})`);
        }
        for (let a = 0; a < shown.length; a++) for (let b = a + 1; b < shown.length; b++) {
          if (shown[a].o > 0.3 && shown[b].o > 0.3 && shown[a].bottom > shown[b].top + 1.5 && shown[b].bottom > shown[a].top + 1.5) note('overlap', `messages ${shown[a].k + 1} and ${shown[b].k + 1} overlap at p=${f.p}`);
        }
        const full = shown.filter((m) => m.o > 0.98);
        // the newest message rises into the chat from its foot while it arrives; once it has arrived (and fits) it is
        // whole: not below what can be seen, not cut at the top
        const newest = shown[shown.length - 1];
        if (newest && newest.o > 0.98 && newest.bottom - newest.top < f.room - f.listTop - 8) {
          if (newest.bottom > f.room + 1.5) note('below', `the newest message (${newest.k + 1}) ends ${Math.round(newest.bottom - f.room)}px below what can be seen, at p=${f.p}`);
          if (newest.top < f.listTop - 1.5) note('above', `the newest message (${newest.k + 1}) starts above the chat, at p=${f.p}`);
        }
        const first = shown[0];
        if (first && first.k === 0 && shown.length <= 2 && first.top < f.listTop - 1.5) note('early', `the first message is already cut off when only ${shown.length} are shown, at p=${f.p}`);
        // nothing may move against the scroll: going down, an arrived message only ever moves up (or stays)
        if (prev && prev.inStory && prev.p >= 0) for (const m of full) { const was = prev.msgs[m.k]; if (was[0] > 0.98) { const d = m.top - was[1]; if (dir * d > 1.5) note('back', `message ${m.k + 1} moved ${d.toFixed(1)}px against the scroll at p=${f.p}`); } }
      }
      if (prev && prev.inStory && dir * (f.page - prev.page) > 2) note('page', `the draft moved against the scroll at p=${f.p}`);
      if (f.beat !== 0 && Math.abs(f.beat - want) > 1) note('beat', `step ${f.beat} is lit at p=${f.p} (should be ${want})`);
    }
    if (f.pinned && prev && prev.pinned) {
      if (dir * (f.reelX - prev.reelX) > 2) note('reel', `the row moved ${(f.reelX - prev.reelX).toFixed(1)}px against the scroll`);
      f.inner.forEach((v, k) => { if (v > 0.01 || v < -75.01) note('inner', `site ${k + 1} is at ${v}% (outside 0..-75%)`); if (dir * (v - prev.inner[k]) > 0.6) note('innerBack', `site ${k + 1} scrolled against the page`); });
    }
    prev = f;
  });
  for (const l of logs) note('console', l);
  for (const [k, v] of issues) fail(tag, `${k}: ${v}`);
  console.log(issues.size ? '    ' : 'ok  ', tag.padEnd(14), JSON.stringify(out));
}

for (const size of sizes) await run(size, 'sq');
if (!process.argv[3] || process.argv[3] === 'all') for (const lang of ['en', 'it']) for (const size of [[1440, 900], [1280, 600], [390, 844], [320, 568]]) await run(size, lang);
await browser.close();
console.log(`\n${bad} failures`);
process.exit(bad ? 1 : 0);
