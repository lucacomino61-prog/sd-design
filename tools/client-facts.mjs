// Reads each client's public site the way a visitor would and writes down what is really there (title, languages,
// headings, the words on the page, what the page lets a visitor do). The site's copy about the work is checked
// against these files, so nothing is claimed that a visitor could not see. Public pages only; no forms are sent,
// no cookies accepted.
// node tools/client-facts.mjs [id,id]      (run unsandboxed: it needs the network)   ->  research/facts/<id>.json
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const SITES = {
  martiri: 'https://barmartiri.com/',
  kater: 'https://kater4burgers.vercel.app/',
  elixir: 'https://elixir.al/',
  greta: 'https://www.dressesbygreta.workers.dev/',
  beed: 'https://beed-energy.stefanodoko-radari.workers.dev/',
};
const only = (process.argv[2] || Object.keys(SITES).join(',')).split(',');
const out = path.resolve('research/facts');
fs.mkdirSync(out, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new',
  args: ['--mute-audio', '--use-angle=d3d11'],
});

async function read(page, url) {
  for (let i = 1; i <= 4; i++) {
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }); break; }
    catch (e) { if (i === 4) return { url, error: String(e).slice(0, 120) }; await sleep(3500); }
  }
  await sleep(3500);
  return page.evaluate(() => {
    const text = (el) => el.textContent.trim().replace(/\s+/g, ' ');
    const list = (sel, n = 40) => [...new Set([...document.querySelectorAll(sel)].map(text).filter((s) => s && s.length < 140))].slice(0, n);
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => { try { const j = JSON.parse(s.textContent); return (j['@graph'] || [j]).flat().map((x) => x['@type']); } catch { return ['(unreadable)']; } });
    return {
      url: location.href,
      title: document.title,
      description: document.querySelector('meta[name="description"]')?.content || null,
      lang: document.documentElement.lang || null,
      alternates: [...document.querySelectorAll('link[rel="alternate"][hreflang]')].map((l) => `${l.hreflang} ${l.href}`),
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      h1: list('h1', 6), h2: list('h2', 30), h3: list('h3', 40),
      nav: list('nav a, header a', 40),
      buttons: list('button, [role="button"], input[type="submit"]', 50),
      tel: [...document.querySelectorAll('a[href^="tel:"]')].length,
      whatsapp: [...document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]')].length,
      forms: [...document.querySelectorAll('form')].map((f) => [...f.querySelectorAll('input, select, textarea')].map((i) => i.name || i.type || i.id).join(',')),
      jsonld: ld,
      links: [...new Set([...document.querySelectorAll('a[href]')].map((a) => a.href).filter((h) => h.startsWith(location.origin)))].slice(0, 60),
      words: document.body.innerText.trim().split(/\s+/).length,
      text: document.body.innerText.replace(/\n{2,}/g, '\n').slice(0, 5200),
    };
  });
}

for (const id of only) {
  const ctx = await browser.createBrowserContext();
  const page = await ctx.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const home = await read(page, SITES[id]);
  // a few pages one step in: whatever the site itself links to first, never a cart, an account or an admin page
  const inner = [];
  const next = (home.links || []).filter((h) => h.replace(/[#?].*$/, '') !== home.url.replace(/[#?].*$/, '') && !/admin|login|account|cart|checkout|shport|llogari/i.test(h)).slice(0, 5);
  for (const url of next) { const p = await read(page, url); inner.push({ url: p.url, title: p.title, lang: p.lang, h1: p.h1, h2: p.h2?.slice(0, 12), buttons: p.buttons?.slice(0, 20), words: p.words, text: p.text?.slice(0, 1800), error: p.error }); }
  fs.writeFileSync(path.join(out, `${id}.json`), JSON.stringify({ read: new Date().toISOString(), home, inner }, null, 2));
  console.log(`${id}: ${home.error || `${home.words} words, lang ${home.lang}, ${home.alternates?.length} alternates, ${inner.length} inner pages`}`);
  await ctx.close();
}
await browser.close();
