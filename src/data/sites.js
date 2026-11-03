// The clients' sites, shared by the page and its script. Facts only: a link appears only where a public address is
// known, and "proto" marks the two that are not public yet.
export const SITES = {
  elixir: { name: 'elixir.al', state: 'live', url: 'https://elixir.al', video: '/phone/elixir.mp4', poster: '/phone/elixir.webp', shot: '/work/work-elixir.webp' },
  martiri: { name: 'Bar Martiri', state: 'live', url: 'https://barmartiri.com', video: '/phone/martiri.mp4', poster: '/phone/martiri.webp', shot: '/work/work-martiri.webp' },
  kater: { name: 'Katër Burgers', state: 'live', url: 'https://kater4burgers.vercel.app', video: '/phone/kater.mp4', poster: '/phone/kater.webp', shot: '/work/work-kater.webp' },
  greta: { name: 'Dresses by Greta', state: 'live', video: '/phone/greta.mp4', poster: '/phone/greta.webp', shot: '/work/work-greta.webp' },
  beed: { name: 'BeeD Energy', state: 'proto', video: '/phone/beed.mp4', poster: '/phone/beed.webp', shot: '/work/work-beed.webp' },
  divjaka: { name: 'Divjaka · Hotel Pelikan', state: 'proto', poster: '/phone/divjaka-og.webp', shot: '/work/work-divjaka.webp' },
};

// Which site sits in which phone (centre, left, right) for each kind of business. "clinic" is a labelled example card.
export const TABS = {
  food: { c: 'martiri', l: 'kater' },
  hotel: { c: 'divjaka' },
  shop: { c: 'elixir', l: 'greta', r: 'beed' },
  clinic: { c: 'clinic' },
};

export const WORK = ['elixir', 'martiri', 'kater', 'greta', 'beed', 'divjaka'];
export const LIVE = WORK.filter((id) => SITES[id].state === 'live');
