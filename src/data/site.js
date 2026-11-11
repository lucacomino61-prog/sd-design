// The facts about the site itself, and its page list. Nothing here is guessed: what is not known yet is null.
// What only the owner knows (the address, the legal details, who answers) is in owner.json: see owner.js.
import { owner } from './owner.js';
import { CONTACT } from './contact.js';
import { FEATURES } from './features.js';
import { LIVE } from './sites.js';

const env = typeof process !== 'undefined' ? process.env : {};

export const SITE = {
  name: 'SD Design',
  // "url": the address the site will live at, without a slash at the end, e.g. 'https://sddesign.al'.
  // While it is null the site is a DRAFT: every page says "noindex", the sitemap is empty and the footer says so.
  // (SITE_URL=... in front of a build overrides it, to check the launch version without changing the file.)
  url: env.SITE_URL || owner.url || null,
  // "verify": codes from Google Search Console and Bing Webmaster Tools ("HTML tag" method), once the site is added there.
  verify: { google: null, bing: null, ...owner.verify },
  // "legal": who runs the site, shown on the privacy page: the registered name, the NIPT and the address.
  legal: { name: null, nipt: null, address: null, ...owner.legal },
  // "person": who answers on WhatsApp, named next to the button. The photo is shown only once there is a real one: a
  // square picture in public/, e.g. '/person/stefano.webp'. Until then the SD mark stands in its place, never a made-up face.
  person: { name: 'Stefano Doko', photo: null, ...owner.person },
  // Set by the contact data: the origin the form may post to (for the content security policy).
  formOrigin: CONTACT.formEndpoint ? new URL(CONTACT.formEndpoint).origin : null,
  // Which commit this build was made from, when the host says so (Cloudflare Pages, Netlify, Vercel). It goes into
  // every page's head as a short note, so it can be told whether the latest change is the one that is live.
  build: (/^[a-f0-9]{7,40}$/.exec(env.CF_PAGES_COMMIT_SHA || env.COMMIT_REF || env.VERCEL_GIT_COMMIT_SHA || '')?.[0] || '').slice(0, 12) || null,
};
export const DRAFT = !SITE.url;

export const LANGS = ['sq', 'en', 'it'];
export const LANG_NAME = { sq: 'Shqip', en: 'English', it: 'Italiano' };
export const LOCALE = { sq: 'sq_AL', en: 'en_GB', it: 'it_IT' };

// The client sites that have a page of their own: the ones that are online. The name in the address stays the same
// in every language.
const PROJECT_SLUG = { martiri: 'bar-martiri', elixir: 'elixir-al', kater: 'kater-burgers', greta: 'dresses-by-greta' };
export const PROJECTS = FEATURES.projects ? LIVE.filter((id) => PROJECT_SLUG[id]) : [];
// The guides, and the words in their addresses. Their text is in src/i18n/guides.js.
const GUIDE_SLUG = {
  cost: { sq: 'sa-kushton-nje-faqe-interneti', en: 'how-much-does-a-website-cost-in-albania', it: 'quanto-costa-un-sito-web-in-albania' },
  instagram: { sq: 'instagram-apo-faqe-interneti', en: 'instagram-or-a-website', it: 'instagram-o-sito-web' },
  direct: { sq: 'rezervime-dhe-porosi-pa-komision', en: 'bookings-and-orders-without-commission', it: 'prenotazioni-e-ordini-senza-commissioni' },
  grants: { sq: 'grante-per-faqe-interneti', en: 'grants-for-a-website-in-albania', it: 'contributi-per-un-sito-web-in-albania' },
};
export const GUIDES = FEATURES.guides ? Object.keys(GUIDE_SLUG).filter((g) => g !== 'grants' || FEATURES.grants) : [];

// One page per search intent and language. The same table feeds the menus, hreflang, the sitemap and the checks.
// A page that is switched off in features.js is simply not in the table.
export const PAGES = {
  home: { sq: '/', en: '/en/', it: '/it/' },
  offer: { sq: '/draft-falas/', en: '/en/free-draft/', it: '/it/bozza-gratis/' },
  food: { sq: '/restorante/', en: '/en/restaurants/', it: '/it/ristoranti/' },
  hotel: { sq: '/hotele/', en: '/en/hotels/', it: '/it/hotel/' },
  shop: { sq: '/dyqane-online/', en: '/en/online-shops/', it: '/it/negozi-online/' },
  clinic: { sq: '/klinika/', en: '/en/clinics/', it: '/it/cliniche/' },
  ...Object.fromEntries(PROJECTS.map((id) => [`work-${id}`, { sq: `/punet/${PROJECT_SLUG[id]}/`, en: `/en/work/${PROJECT_SLUG[id]}/`, it: `/it/lavori/${PROJECT_SLUG[id]}/` }])),
  ...(GUIDES.length ? { guides: { sq: '/udhezues/', en: '/en/guides/', it: '/it/guide/' } } : {}),
  ...Object.fromEntries(GUIDES.map((g) => [`guide-${g}`, { sq: `/udhezues/${GUIDE_SLUG[g].sq}/`, en: `/en/guides/${GUIDE_SLUG[g].en}/`, it: `/it/guide/${GUIDE_SLUG[g].it}/` }])),
  privacy: { sq: '/privatesia/', en: '/en/privacy/', it: '/it/privacy/' },
};
export const SERVICES = ['food', 'hotel', 'shop', 'clinic'];
export const href = (page, lang) => PAGES[page][lang];
export const abs = (p) => (SITE.url ? SITE.url + p : p);
// where a client's site is read about: its own page when it has one, else its row in the list on the home page
export const workHref = (id, lang) => PAGES[`work-${id}`]?.[lang] ?? `${PAGES.home[lang]}#${id}`;

// Contact links: real once the contact details are filled in (owner.json). Until then they point at the contact block and the
// script shows a "draft" note, so no number is ever guessed.
export const wa = (text) => (CONTACT.whatsapp
  ? { href: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, target: '_blank', rel: 'noopener', 'data-goal': 'whatsapp' }
  : { href: '#contact', 'data-draft': 'wa' });
export const tel = CONTACT.phone ? { href: `tel:${CONTACT.phone.replace(/\s+/g, '')}`, 'data-goal': 'phone' } : { href: '#contact', 'data-draft': 'tel' };
export const ig = CONTACT.instagram ? { href: `https://instagram.com/${CONTACT.instagram}`, target: '_blank', rel: 'me noopener', 'data-goal': 'instagram' } : { href: '#contact', 'data-draft': 'ig' };

// The message every WhatsApp button starts: a request for the free draft, with the lines the studio needs filled in.
// A service page already knows the kind of business.
export const offerMsg = (t, type = '') => t.offer.msg.replace('{type}', type);

// The SD mark lives in mark.js so the page script can draw it without loading this file.
export { S_PATH, BUBBLE } from './mark.js';
