// Proves that what the owner fills in reaches the pages. It builds the site with every owner detail set to a test
// value (handed to the build through OWNER_SAMPLE, so src/data/owner.json itself is never touched) and reads the
// result: the WhatsApp number in every button, the phone, Instagram and email in the contact block, who answers and
// their photo, the legal details on the privacy page, the address in the canonical links, the sitemap and robots.txt,
// the search-engine codes in the head (these are the fields the admin tool writes), and the token of the visit
// counter, which is put into the file by hand.
//   node tools/owner-check.mjs [outDir=../sd-owner-check]
import fs from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { LANGS, PAGES } from '../src/data/site.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.resolve(process.argv[2] || path.join(root, '..', 'sd-owner-check'));

// Test values only: a number that cannot exist, the reserved .test domain.
const sample = {
  contact: { whatsapp: '355600000000', phone: '+355 60 000 0000', instagram: 'sd.design.test', email: 'test@sd-design.test', formEndpoint: null, formFields: {} },
  person: { name: 'Test Person', photo: '/person/test.webp' },
  legal: { name: 'SD Design Test SHPK', nipt: 'L00000000A', address: 'Rruga Test 1, Tiranë' },
  url: 'https://sd-design.test',
  verify: { google: 'google-test-code', bing: 'bing-test-code' },
  analytics: { cloudflare: '0123456789abcdef0123456789abcdef' },
};

fs.rmSync(out, { recursive: true, force: true });
const env = { ...process.env, OWNER_SAMPLE: JSON.stringify(sample), FORCE_COLOR: '0' };
delete env.SITE_URL;
await new Promise((resolve, reject) => {
  execFile(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build', '--outDir', out], { cwd: root, env, maxBuffer: 1 << 26 }, (err, stdout, stderr) => {
    if (err) { console.error(stdout, stderr); reject(new Error('the build failed')); } else resolve();
  });
});

const fails = [];
let checks = 0;
const must = (ok, msg) => { checks += 1; if (!ok) fails.push(msg); };
const read = (p) => fs.readFileSync(path.join(out, p), 'utf8');
const every = Object.entries(PAGES).flatMap(([page, byLang]) => LANGS.map((lang) => ({ page, lang, at: byLang[lang] })));

for (const { page, at } of every) {
  const html = read(path.join(at, 'index.html'));
  must(html.includes('https://wa.me/355600000000?text='), `${at}: the WhatsApp buttons open the number`);
  must(!/data-draft="(wa|tel|ig)"/.test(html), `${at}: no button is left as a draft`);
  must(!html.includes('name="robots" content="noindex"'), `${at}: no "noindex" once the address is set`);
  must(html.includes(`<link rel="canonical" href="https://sd-design.test${at}"`), `${at}: the canonical link uses the address`);
  must(html.includes('name="google-site-verification" content="google-test-code"') && html.includes('name="msvalidate.01" content="bing-test-code"'), `${at}: the search-engine codes are in the head`);
  must(html.includes('SD Design Test SHPK') && html.includes('L00000000A'), `${at}: the legal name and NIPT are in the structured data`);
  must(!html.includes('class="fine-draft"'), `${at}: the footer no longer says "Draft"`);
  must(html.includes('src="https://static.cloudflareinsights.com/beacon.min.js"') && html.includes('0123456789abcdef0123456789abcdef'), `${at}: the visit counter is loaded with its token`);
  const policy = (html.match(/http-equiv="content-security-policy" content="([^"]*)"/i) || [])[1] || '';
  must(/script-src[^;]*https:\/\/static\.cloudflareinsights\.com/.test(policy) && /connect-src[^;]*https:\/\/cloudflareinsights\.com/.test(policy), `${at}: the content security policy lets the counter in, and only it`);
  if (html.includes('class="who"')) must(html.includes('src="/person/test.webp"') && html.includes('<b>Test Person</b>'), `${at}: the photo and the name stand next to the button`);
  if (html.includes('data-goal="phone"') || page === 'home') {
    must(html.includes('href="tel:+355600000000"') && html.includes('+355 60 000 0000'), `${at}: the phone link`);
    must(html.includes('href="https://instagram.com/sd.design.test"') && html.includes('@sd.design.test'), `${at}: the Instagram link`);
    must(html.includes('href="mailto:test@sd-design.test"'), `${at}: the email link`);
  }
  if (page === 'privacy') must(html.includes('NIPT L00000000A') && html.includes('Rruga Test 1, Tiranë') && html.includes('test@sd-design.test'), `${at}: who runs the site, on the privacy page`);
  if (page === 'privacy') must(html.includes('Cloudflare Web Analytics') && !/nuk ka mjete matjeje|has no measurement|non ha strumenti di misurazione/.test(html), `${at}: the privacy page says that visits are counted, and no longer that nothing is measured`);
}

const sitemap = read('sitemap.xml');
must((sitemap.match(/<loc>https:\/\/sd-design\.test\//g) || []).length === every.length, `sitemap.xml lists all ${every.length} pages at the address`);
must(read('robots.txt').includes('Sitemap: https://sd-design.test/sitemap.xml'), 'robots.txt announces the sitemap');
const llms = read('llms.txt');
must(llms.includes('https://wa.me/355600000000') && llms.includes('+355 60 000 0000') && llms.includes('test@sd-design.test'), 'llms.txt carries the contact details');

// a token that does not look like one loads nothing (one page is enough to see it)
const bad = path.join(out, '..', path.basename(out) + '-bad-token');
fs.rmSync(bad, { recursive: true, force: true });
await new Promise((resolve, reject) => {
  execFile(process.execPath, [path.join(root, 'node_modules/astro/bin/astro.mjs'), 'build', '--outDir', bad], { cwd: root, env: { ...env, OWNER_SAMPLE: JSON.stringify({ ...sample, analytics: { cloudflare: 'not-a-token"><script>' } }) }, maxBuffer: 1 << 26 }, (err, stdout, stderr) => {
    if (err) { console.error(stdout, stderr); reject(new Error('the build failed')); } else resolve();
  });
});
const plain = fs.readFileSync(path.join(bad, 'index.html'), 'utf8');
must(!plain.includes('cloudflareinsights') && !plain.includes('not-a-token'), 'a token that does not look like one loads no counter and is written nowhere');
must(fs.readFileSync(path.join(bad, 'privatesia/index.html'), 'utf8').includes('nuk ka mjete matjeje'), 'and the privacy page then still says that nothing is measured');
fs.rmSync(bad, { recursive: true, force: true });

// and the real file was not touched
const real = JSON.parse(fs.readFileSync(path.join(root, 'src/data/owner.json'), 'utf8'));
must(real.contact.whatsapp !== sample.contact.whatsapp && real.url !== sample.url, 'src/data/owner.json was not changed by this check');

for (const f of fails) console.log(`FAIL  ${f}`);
console.log(`\n${checks} checks, ${fails.length} failures (built into ${out})`);
process.exit(fails.length ? 1 : 0);
