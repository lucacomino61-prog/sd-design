// What the three design options (src/pages/options) need beyond sites.js. Nothing here is invented:
// each tone is sampled from that client's own site, and the features are the ones the home's copy already names.
import { CONTACT } from './contact.js';

export const TONE = { elixir: '#5b2132', kater: '#2549c7', greta: '#7a4a31', martiri: '#1f6fb0', divjaka: '#0d2b28', beed: '#244754' };
export const ORDER = ['elixir', 'kater', 'greta', 'martiri', 'divjaka', 'beed'];
export const KIND = { elixir: 'shop', kater: 'food', greta: 'shop', martiri: 'food', divjaka: 'hotel', beed: 'shop' };
export const FEATURES = {
  elixir: ['Katalog', 'Shportë', 'Panel për stafin'],
  kater: ['Menu', 'Porosi'],
  greta: ['Katalog', 'Shportë', 'Pagesë në dorëzim'],
  martiri: ['Menu', 'Orar', 'Tri gjuhë'],
  divjaka: ['Rezervime', 'Dyqan', 'Itinerar'],
  beed: ['Katalog', 'Shportë', 'Panel për stafin'],
};

// The SD mark: the S and the speech bubble that stands for the D.
export const S_PATH = 'M160.2 405.8Q112.2 405.8 76.6 391.1Q41 376.3 21.1 347.4Q1.3 318.4 0 275.9H79.7Q81.3 296.1 91.8 309.7Q102.3 323.2 119.8 329.9Q137.2 336.7 159.3 336.7Q181.2 336.7 197.5 330.3Q213.8 323.9 222.9 312.4Q232 300.8 232 285.7Q232 271.9 223.8 262.6Q215.7 253.4 200.3 246.8Q185 240.1 163.1 234.9L119.1 224Q68.3 211.6 39.5 185.2Q10.7 158.7 10.7 115.1Q10.7 78.9 30.3 51.8Q49.8 24.7 83.8 9.7Q117.8 -5.4 161.2 -5.4Q205.6 -5.4 238.6 9.8Q271.6 25 290.1 51.9Q308.5 78.9 309.2 114H229.9Q227.6 89.9 209.4 76.7Q191.1 63.5 160.5 63.5Q139.6 63.5 124.9 69.5Q110.1 75.5 102.4 86Q94.7 96.5 94.7 109.9Q94.7 124.6 103.7 134.3Q112.6 144 127.3 150.1Q142 156.2 158.8 160.3L194.9 169.1Q220.1 174.8 241.9 184.5Q263.7 194.2 280 208.3Q296.4 222.4 305.4 241.6Q314.5 260.9 314.5 286.1Q314.5 322.5 296.2 349.4Q277.8 376.4 243.3 391.1Q208.8 405.8 160.2 405.8Z';
export const BUBBLE = 'M362.5 0H506.5A200 200 0 0 1 506.5 400H482.5L322.5 488L362.5 360Z';

// Contact links: real once src/data/contact.js is filled in; until then they point at the contact block and the
// script shows a "draft" note, so no number is ever guessed.
export const wa = (text) => (CONTACT.whatsapp
  ? { href: `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`, target: '_blank', rel: 'noopener' }
  : { href: '#contact', 'data-draft': 'wa' });
export const tel = CONTACT.phone ? { href: `tel:${CONTACT.phone.replace(/\s+/g, '')}` } : { href: '#contact', 'data-draft': 'tel' };
export const ig = CONTACT.instagram ? { href: `https://instagram.com/${CONTACT.instagram}`, target: '_blank', rel: 'noopener' } : { href: '#contact', 'data-draft': 'ig' };
