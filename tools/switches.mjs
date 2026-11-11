// Proves the switches in src/data/features.js, and the two places that stay empty until there is something real
// to put in them. Every case is a build of its own into a folder outside the project; the files of the site are
// never changed.
//   1. as it is: every feature on, the two slots empty (no owners' words, no proof line), no counter, and the page
//      check (tools/check-site.mjs seo) passes;
//   2. each feature off, one at a time: its pages are gone, nothing links to them, its block is on no page, its code
//      is not in the page's script, and the page check still passes;
//   3. everything off: the site as it was before the additions;
//   4. the slots with test entries: owners' words on the home page, on that kind's page and on that client's page,
//      in the page's language or marked with their own, never one without the client's agreement; the proof line
//      from five drafts up, never with numbers that make no sense; both gone with their switch off.
//   node tools/switches.mjs [outDir=../sd-switches]
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import sq from '../src/i18n/sq.js';
import en from '../src/i18n/en.js';
import it from '../src/i18n/it.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(process.argv[2] || path.join(root, '..', 'sd-switches'));
const NAMES = ['projects', 'guides', 'grants', 'calculator', 'quotes', 'proof', 'source', 'visits'];
let checks = 0;
const fails = [];
const ok = (cond, what) => { checks++; if (!cond) fails.push(what); };

const run = (args, env) => new Promise((resolve) => {
  execFile(process.execPath, args, { cwd: root, env: { ...process.env, FORCE_COLOR: '0', ...env }, maxBuffer: 1 << 26 }, (err, stdout, stderr) => resolve({ ok: !err, text: `${stdout}\n${stderr}` }));
});
async function build(name, env = {}) {
  const dir = path.join(out, name);
  fs.rmSync(dir, { recursive: true, force: true });
  const clean = { ...env };
  for (const key of ['SITE_URL', 'OWNER_SAMPLE', 'QUOTES_SAMPLE', 'PROOF_SAMPLE', 'FEATURES_OFF']) if (!(key in clean)) clean[key] = '';
  const r = await run([path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build', '--outDir', dir], clean);
  if (!r.ok) { console.error(r.text.slice(-1500)); throw new Error(`the build "${name}" failed`); }
  const pages = [];
  const walk = (d) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name); if (f.isDirectory()) walk(p); else if (f.name === 'index.html') pages.push(p); } };
  walk(dir);
  const html = Object.fromEntries(pages.map((p) => [`/${path.relative(dir, path.dirname(p)).replace(/\\/g, '/')}/`.replace('//', '/'), fs.readFileSync(p, 'utf8')]));
  const js = fs.existsSync(path.join(dir, '_astro')) ? fs.readdirSync(path.join(dir, '_astro')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(dir, '_astro', f), 'utf8')).join('\n') : '';
  return { dir, html, all: Object.values(html).join('\n'), js, has: (p) => fs.existsSync(path.join(dir, p)) };
}
// the page check on a built folder; it reads the page table, so it is told about the same switches
const pageCheck = async (b, env, name) => { const r = await run([path.join(root, 'tools/check-site.mjs'), path.join(out, 'shots'), `dir:${b.dir}`, 'seo'], { FEATURES_OFF: '', ...env }); ok(r.ok, `${name}: the page check fails: ${r.text.split('\n').filter((l) => l.startsWith('FAIL')).slice(0, 3).join(' | ') || r.text.slice(-300)}`); };

// what each feature leaves in a build
const marks = {
  projects: (b) => b.has('punet') || b.has('en/work') || b.has('it/lavori') || /href="\/(punet|en\/work|it\/lavori)\//.test(b.all) || b.all.includes('class="hero shero phero'),
  guides: (b) => b.has('udhezues') || b.has('en/guides') || b.has('it/guide') || /href="\/(udhezues|en\/guides|it\/guide)\//.test(b.all) || b.all.includes('class="reads"'),
  grants: (b) => b.has('udhezues/grante-per-faqe-interneti') || b.all.includes('grante-per-faqe-interneti') || b.all.includes('grants-for-a-website-in-albania') || b.all.includes('contributi-per-un-sito-web-in-albania') || b.all.includes('aida.gov.al'),
  calculator: (b) => b.all.includes('data-calc') || b.all.includes('#calc"') || b.js.includes('data-calc'),
  quotes: (b) => b.all.includes('class="quotes"'),
  proof: (b) => b.all.includes('data-proof'),
  source: (b) => b.js.includes('utm_source') || b.all.includes('utm_source') || b.all.includes(sq.privacy.source.slice(0, 30)) || b.all.includes(en.privacy.source.slice(0, 30)),
  visits: (b) => b.all.includes('cloudflareinsights') || b.all.includes('Cloudflare Web Analytics'),
};

const QUOTES = JSON.stringify([
  { site: 'martiri', name: 'Emër Shembull', role: { sq: 'pronar', en: 'owner', it: 'titolare' }, lang: 'sq', text: { sq: 'Fjali shembull vetëm për provë.', en: 'A sample sentence, for testing only.' }, ok: '2026-11-11' },
  { site: 'elixir', name: 'Emër Tjetër', role: 'themeluese', lang: 'sq', text: { sq: 'Fjali e dytë shembull.' }, ok: '2026-11-11' },
  { site: 'kater', name: 'Pa Leje', lang: 'sq', text: { sq: 'Kjo nuk duhet të shfaqet kurrë.' } },
  { site: 'askush', name: 'Klient i panjohur', lang: 'sq', text: { sq: 'As kjo.' }, ok: '2026-11-11' },
  { site: 'greta', name: '', lang: 'sq', text: { sq: 'Pa emër, as kjo.' }, ok: '2026-11-11' },
]);
const PROOF = JSON.stringify({ since: '2026-11-17', sent: 14, onTime: 13 });
const OWNER = JSON.stringify({ contact: { whatsapp: null, phone: null, instagram: null, email: null, formEndpoint: null, formFields: {} }, person: { name: 'Stefano Doko', photo: null }, legal: { name: null, nipt: null, address: null }, url: null, verify: { google: null, bing: null }, analytics: { cloudflare: '0123456789abcdef0123456789abcdef' } });
// with these, every feature has something to show
const FULL = { QUOTES_SAMPLE: QUOTES, PROOF_SAMPLE: PROOF, OWNER_SAMPLE: OWNER };

// ---------- 1. as it is ----------
const now = await build('as-it-is');
for (const name of ['projects', 'guides', 'grants', 'calculator', 'source']) ok(marks[name](now), `as it is: "${name}" is on but leaves nothing in the build`);
ok(!marks.quotes(now), 'as it is: owners\' words show although the file is empty');
ok(!marks.proof(now), 'as it is: the proof line shows although the file holds no numbers');
ok(!marks.visits(now), 'as it is: a visit counter is loaded although there is no token');
ok(!/style="/.test(now.all.replace(/<script[\s\S]*?<\/script>/g, '')), 'as it is: a page has an inline style attribute');
await pageCheck(now, {}, 'as it is');
const count = Object.keys(now.html).length;

// ---------- 2. with everything there is to show, then each feature off ----------
const full = await build('full', FULL);
for (const name of NAMES) ok(marks[name](full), `full: "${name}" leaves nothing in the build`);
await pageCheck(full, {}, 'full');
for (const name of NAMES) {
  const b = await build(`off-${name}`, { ...FULL, FEATURES_OFF: name });
  ok(!marks[name](b), `"${name}" off: something of it is still in the build`);
  for (const other of NAMES) {
    // the guide about funds is one of the guides: without them it goes too
    if (other === name || (name === 'guides' && other === 'grants')) continue;
    ok(marks[other](b), `"${name}" off: "${other}" went with it`);
  }
  await pageCheck(b, { FEATURES_OFF: name }, `"${name}" off`);
}

// ---------- 3. everything off ----------
const none = await build('off-all', { ...FULL, FEATURES_OFF: NAMES.join(',') });
for (const name of NAMES) ok(!marks[name](none), `all off: something of "${name}" is still in the build`);
ok(Object.keys(none.html).length === 21 && none.has('404.html'), `all off: ${Object.keys(none.html).length} pages, expected the 21 the site had before (7 pages in 3 languages), and the 404`);
await pageCheck(none, { FEATURES_OFF: NAMES.join(',') }, 'all off');

// ---------- 4. the slots ----------
const T = { sq, en, it };
const q = (page) => (full.html[page].match(/<figure class="quote /g) || []).length;
ok(q('/') === 2 && q('/en/') === 2 && q('/it/') === 2, `owners' words: the home page shows ${q('/')} (two have a client, a name and the day of agreement)`);
// (the clinic page lists Bar Martiri and Katër Burgers as its examples, so it shows their owners' words too)
ok(q('/restorante/') === 1 && q('/dyqane-online/') === 1 && q('/hotele/') === 0 && q('/klinika/') === 1, `owners' words: a kind's page shows the ones of the clients it lists (${q('/restorante/')}, ${q('/dyqane-online/')}, ${q('/hotele/')}, ${q('/klinika/')})`);
ok(q('/punet/bar-martiri/') === 1 && q('/punet/elixir-al/') === 1 && q('/punet/kater-burgers/') === 0, 'owners\' words: a client\'s page shows its own');
ok(!full.all.includes('Pa Leje') && !full.all.includes('Klient i panjohur') && !full.all.includes('Pa emër, as kjo'), 'owners\' words: an entry without the day of agreement, for an unknown client or without a name is never shown');
ok(full.html['/en/'].includes('A sample sentence, for testing only.') && /<blockquote lang="sq"><p>Fjali e dytë shembull\./.test(full.html['/en/']), 'owners\' words: in the page\'s language where there is a translation, else the original marked with its language');
ok(full.html['/'].includes('<blockquote><p>Fjali shembull vetëm për provë.') && full.html['/it/'].includes('titolare') && full.html['/'].includes('href="/punet/bar-martiri/"'), 'owners\' words: who said it, their role in the page\'s language, and the way to that client\'s page');
ok(!/"@type":"(Review|AggregateRating)"/.test(full.all), 'owners\' words: no review or rating markup');
for (const lang of ['sq', 'en', 'it']) {
  const home = full.html[lang === 'sq' ? '/' : `/${lang}/`];
  const line = (home.match(/<p class="proof" data-proof>([^<]*)</) || [])[1] || '';
  ok(line.includes('14') && line.includes('13') && line.includes('24') && line.includes('17') && line.includes('2026') && line === T[lang].ui.proof.replace('{sent}', 14).replace('{onTime}', 13).replace('{h}', 24).replace('{date}', line.match(/17 \S+ 2026/)?.[0] ?? '?'), `proof (${lang}): "${line}"`);
}
ok((full.html['/'].match(/data-proof/g) || []).length === 2 && (full.html['/hotele/'].match(/data-proof/g) || []).length === 1, 'proof: twice on the home page (under the numbers, by the closing button), once elsewhere');
for (const [name, value] of [['four drafts', { since: '2026-11-17', sent: 4, onTime: 4 }], ['more on time than sent', { since: '2026-11-17', sent: 9, onTime: 12 }], ['no day', { sent: 9, onTime: 9 }], ['not numbers', { since: '2026-11-17', sent: '14', onTime: 13 }], ['half a draft', { since: '2026-11-17', sent: 9.5, onTime: 9 }]]) {
  const b = await build('proof-odd', { PROOF_SAMPLE: JSON.stringify(value) });
  ok(!marks.proof(b), `proof: shown with ${name}`);
}
fs.rmSync(path.join(out, 'proof-odd'), { recursive: true, force: true });

console.log(`switches: ${checks} checks, ${fails.length} failures (${count} pages as the site is; builds in ${out})`);
for (const f of fails) console.log('FAIL', f);
process.exit(fails.length ? 1 : 0);
