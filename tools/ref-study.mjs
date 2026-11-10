// Studies a reference site the way a designer would: the load sequence frame by frame, the scroll behaviour, and
// the numbers behind the look (type, colours, gutters, radii, easing curves, motion libraries).
// It reads public pages only, accepts no cookies, submits nothing, and stops if the site refuses automation.
// node tools/ref-study.mjs <name> <url> [outDir=research/study]     (run unsandboxed: it needs the network)
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const [name, url, outArg] = process.argv.slice(2);
const out = path.resolve(outArg || 'research/study', name);
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new',
  args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=d3d11', '--mute-audio'],
});

async function open(view) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport(view);
  for (let i = 1; i <= 4; i++) {
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); return { page, ctx }; }
    catch (e) { console.error(`try ${i}: ${String(e).slice(0, 90)}`); await sleep(4000); }
  }
  throw new Error('could not load ' + url);
}
const shot = (page, file) => page.screenshot({ path: path.join(out, file), type: 'jpeg', quality: 72, captureBeyondViewport: false });

// ---------- desktop: load frames ----------
const { page, ctx } = await open({ width: 1440, height: 900 });
for (let i = 0; i < 10; i++) { await shot(page, `load-${String(i).padStart(2, '0')}.jpg`); await sleep(450); }
await sleep(3500);
await page.evaluate(() => document.querySelectorAll('[id*="cookie" i], [class*="cookie" i], [id*="consent" i], [class*="consent" i], #CybotCookiebotDialog').forEach((n) => { if (n.getBoundingClientRect().height < innerHeight * 0.9) n.remove(); }));
await shot(page, 'rest.jpg');

// ---------- the numbers ----------
const data = await page.evaluate(() => {
  const cs = (el) => getComputedStyle(el);
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight * 1.2 && cs(el).visibility !== 'hidden' && +cs(el).opacity > 0.05; };
  const texts = [...document.querySelectorAll('h1,h2,h3,h4,p,a,span,div,li,button')].filter((el) => vis(el) && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1));
  const row = (el) => { const s = cs(el), r = el.getBoundingClientRect(); return { text: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 48), tag: el.tagName.toLowerCase(), font: s.fontFamily.split(',')[0].replace(/"/g, ''), size: Math.round(parseFloat(s.fontSize) * 10) / 10, weight: s.fontWeight, lh: s.lineHeight, ls: s.letterSpacing, upper: s.textTransform, color: s.color, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width) }; };
  const bySize = [...texts].sort((a, b) => parseFloat(cs(b).fontSize) - parseFloat(cs(a).fontSize));
  const seen = new Set(), scale = [];
  for (const el of bySize) { const k = `${cs(el).fontFamily.split(',')[0]}|${Math.round(parseFloat(cs(el).fontSize))}`; if (!seen.has(k)) { seen.add(k); scale.push(row(el)); } if (scale.length > 13) break; }
  // colours by painted area on the first screen
  const area = {};
  for (const el of document.querySelectorAll('body, body *')) { if (!vis(el)) continue; const bg = cs(el).backgroundColor; if (bg && bg !== 'rgba(0, 0, 0, 0)') { const r = el.getBoundingClientRect(); area[bg] = (area[bg] || 0) + Math.min(r.width, innerWidth) * Math.min(r.height, innerHeight); } }
  const inks = {};
  for (const el of texts) { const c = cs(el).color; inks[c] = (inks[c] || 0) + el.textContent.trim().length; }
  // easing and durations declared in the stylesheets
  const ease = {}, dur = {}, radii = {};
  const bump = (o, k) => { if (k) o[k] = (o[k] || 0) + 1; };
  for (const sheet of document.styleSheets) {
    let rules; try { rules = sheet.cssRules; } catch { continue; }
    const walk = (list) => { for (const r of list) {
      if (r.cssRules) walk(r.cssRules);
      const st = r.style; if (!st) continue;
      for (const p of ['transition-timing-function', 'animation-timing-function']) st.getPropertyValue(p).split(/,(?![^(]*\))/).forEach((v) => bump(ease, v.trim()));
      for (const p of ['transition-duration', 'animation-duration']) st.getPropertyValue(p).split(',').forEach((v) => bump(dur, v.trim()));
      bump(radii, st.getPropertyValue('border-radius').trim());
    } };
    walk(rules);
  }
  const top = (o, n) => Object.entries(o).filter(([k]) => k && k !== 'initial' && k !== 'inherit').sort((a, b) => b[1] - a[1]).slice(0, n);
  const vars = {}; const rs = cs(document.documentElement);
  for (const sheet of document.styleSheets) { let rules; try { rules = sheet.cssRules; } catch { continue; } for (const r of rules) if (r.selectorText && /^(:root|html|body)$/.test(r.selectorText)) for (const p of r.style) if (p.startsWith('--') && Object.keys(vars).length < 70) vars[p] = rs.getPropertyValue(p).trim().slice(0, 60); }
  const links = [...document.querySelectorAll('header a, nav a, [class*="nav" i] a')].filter(vis).slice(0, 8).map(row);
  const btns = [...document.querySelectorAll('a, button')].filter((el) => vis(el) && parseFloat(cs(el).borderRadius) > 6 && el.getBoundingClientRect().height < 90 && el.textContent.trim().length > 1).slice(0, 5).map((el) => ({ ...row(el), radius: cs(el).borderRadius, pad: cs(el).padding, bg: cs(el).backgroundColor, h: Math.round(el.getBoundingClientRect().height), border: cs(el).border }));
  return {
    title: document.title, lang: document.documentElement.lang, docH: document.documentElement.scrollHeight,
    body: { bg: cs(document.body).backgroundColor, color: cs(document.body).color, font: cs(document.body).fontFamily.slice(0, 80), size: cs(document.body).fontSize, lh: cs(document.body).lineHeight },
    scale, grounds: top(area, 6), inks: top(inks, 5), ease: top(ease, 10), dur: top(dur, 10), radii: top(radii, 8), vars, links, btns,
    libs: { gsap: window.gsap?.version || null, scrollTrigger: !!window.ScrollTrigger, lenis: document.documentElement.className.includes('lenis') || !!window.lenis, barba: !!window.barba, swup: !!window.swup, swiper: !!document.querySelector('.swiper'), canvases: document.querySelectorAll('canvas').length, videos: document.querySelectorAll('video').length, htmlClass: document.documentElement.className.slice(0, 120) },
    fonts: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => `${f.family} ${f.weight} ${f.style}`).slice(0, 20),
  };
});
fs.writeFileSync(path.join(out, 'numbers.json'), JSON.stringify(data, null, 1));

// ---------- scroll frames (real wheel, so smooth-scroll libraries respond) ----------
await page.mouse.move(720, 450);
for (let i = 0; i < 16; i++) {
  for (let k = 0; k < 4; k++) { await page.mouse.wheel({ deltaY: 110 }); await sleep(60); }
  await sleep(650);
  await shot(page, `scroll-${String(i).padStart(2, '0')}.jpg`);
}
const after = await page.evaluate(() => ({ y: Math.round(scrollY), h: document.documentElement.scrollHeight }));
// ---------- hover: the first pill or button, then the first large link ----------
await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
await sleep(1200);
const target = await page.evaluate(() => { const el = [...document.querySelectorAll('a, button')].find((e) => { const r = e.getBoundingClientRect(); return r.top >= 0 && r.top < 200 && r.width > 60 && parseFloat(getComputedStyle(e).borderRadius) > 6; }); if (!el) return null; const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
if (target) { await page.mouse.move(target.x, target.y, { steps: 8 }); await sleep(500); await shot(page, 'hover-pill.jpg'); }
await ctx.close();

// ---------- phone ----------
const m = await open({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await sleep(6500);
await m.page.evaluate(() => document.querySelectorAll('[id*="cookie" i], [class*="cookie" i], [id*="consent" i], #CybotCookiebotDialog').forEach((n) => { if (n.getBoundingClientRect().height < innerHeight * 0.9) n.remove(); }));
await shot(m.page, 'phone-0.jpg');
await m.page.evaluate(() => scrollTo({ top: innerHeight * 0.9, behavior: 'instant' }));
await sleep(1500);
await shot(m.page, 'phone-1.jpg');
await m.ctx.close();
await browser.close();
console.log(JSON.stringify({ name, out, scrolledTo: after, libs: data.libs, body: data.body }, null, 0));
