// The facts about the site itself, and its page list. Nothing here is guessed: what is not known yet is null.
import { CONTACT } from './contact.js';

const env = typeof process !== 'undefined' ? process.env : {};

export const SITE = {
  name: 'SD Design',
  // The address the site will live at, without a slash at the end, e.g. 'https://sddesign.al'.
  // While this is null the site is a DRAFT: every page says "noindex", the sitemap is empty and the footer says so.
  url: env.SITE_URL || null,
  // Codes from Google Search Console and Bing Webmaster Tools ("HTML tag" method), once the site is added there.
  verify: { google: null, bing: null },
  // Who runs the site, shown on the privacy page: the registered name, the NIPT and the address.
  legal: { name: null, nipt: null, address: null },
  // Set by the contact data: the origin the form may post to (for the content security policy).
  formOrigin: CONTACT.formEndpoint ? new URL(CONTACT.formEndpoint).origin : null,
};
export const DRAFT = !SITE.url;

export const LANGS = ['sq', 'en', 'it'];
export const LANG_NAME = { sq: 'Shqip', en: 'English', it: 'Italiano' };
export const LOCALE = { sq: 'sq_AL', en: 'en_GB', it: 'it_IT' };

// One page per search intent and language. The same table feeds the menus, hreflang, the sitemap and the checks.
export const PAGES = {
  home: { sq: '/', en: '/en/', it: '/it/' },
  food: { sq: '/restorante/', en: '/en/restaurants/', it: '/it/ristoranti/' },
  hotel: { sq: '/hotele/', en: '/en/hotels/', it: '/it/hotel/' },
  shop: { sq: '/dyqane-online/', en: '/en/online-shops/', it: '/it/negozi-online/' },
  clinic: { sq: '/klinika/', en: '/en/clinics/', it: '/it/cliniche/' },
  privacy: { sq: '/privatesia/', en: '/en/privacy/', it: '/it/privacy/' },
};
export const SERVICES = ['food', 'hotel', 'shop', 'clinic'];
export const href = (page, lang) => PAGES[page][lang];
export const abs = (p) => (SITE.url ? SITE.url + p : p);

// Contact links: real once src/data/contact.js is filled in. Until then they point at the contact block and the
// script shows a "draft" note, so no number is ever guessed.
export const wa = (text) => (CONTACT.whatsapp
  ? { href: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, target: '_blank', rel: 'noopener', 'data-goal': 'whatsapp' }
  : { href: '#contact', 'data-draft': 'wa' });
export const tel = CONTACT.phone ? { href: `tel:${CONTACT.phone.replace(/\s+/g, '')}`, 'data-goal': 'phone' } : { href: '#contact', 'data-draft': 'tel' };
export const ig = CONTACT.instagram ? { href: `https://instagram.com/${CONTACT.instagram}`, target: '_blank', rel: 'me noopener', 'data-goal': 'instagram' } : { href: '#contact', 'data-draft': 'ig' };

// The SD mark lives in mark.js so the page script can draw it without loading this file.
export { S_PATH, BUBBLE } from './mark.js';
