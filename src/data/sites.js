// The clients' sites. Facts only, read from the public sites on 10 Nov 2026 (tools/client-facts.mjs writes what it
// finds to research/facts). A link appears only where a lasting public address is known; "proto" marks the two that
// are not public products yet. `tone` is a colour sampled from that client's own site.
export const SITES = {
  martiri: { name: 'Bar Martiri', kind: 'food', state: 'live', url: 'https://barmartiri.com', langs: ['sq', 'it', 'en'], tone: '#1f6fb0', video: '/phone/martiri.mp4', poster: '/phone/martiri.webp', shot: '/work/work-martiri.webp' },
  elixir: { name: 'elixir.al', kind: 'shop', state: 'live', url: 'https://elixir.al', langs: ['sq'], tone: '#5b2132', video: '/phone/elixir.mp4', poster: '/phone/elixir.webp', shot: '/work/work-elixir.webp' },
  kater: { name: 'Katër Burgers', kind: 'food', state: 'live', url: 'https://kater4burgers.vercel.app', langs: ['sq', 'en', 'it'], tone: '#2549c7', video: '/phone/kater.mp4', poster: '/phone/kater.webp', shot: '/work/work-kater.webp' },
  greta: { name: 'Dresses by Greta', kind: 'shop', state: 'live', langs: ['sq', 'en', 'fr'], tone: '#7a4a31', video: '/phone/greta.mp4', poster: '/phone/greta.webp', shot: '/work/work-greta.webp' },
  divjaka: { name: 'Divjaka · Hotel Pelikan', kind: 'hotel', state: 'proto', langs: ['sq', 'en'], tone: '#0d2b28', card: '/work/work-divjaka.webp' },
  beed: { name: 'BeeD Energy', kind: 'shop', state: 'proto', langs: ['sq', 'en'], tone: '#244754', video: '/phone/beed.mp4', poster: '/phone/beed.webp', shot: '/work/work-beed.webp' },
};

// The order of the work list, and the sites whose recordings take turns on the first screen (the three whose pages
// make the strongest halftone: pictures and large type; a pale page with thin type gives few dots).
export const ORDER = ['martiri', 'elixir', 'kater', 'greta', 'divjaka', 'beed'];
export const HERO = ['kater', 'martiri', 'greta'];
export const LIVE = ORDER.filter((id) => SITES[id].state === 'live');
export const BY_KIND = (kind) => ORDER.filter((id) => SITES[id].kind === kind);
