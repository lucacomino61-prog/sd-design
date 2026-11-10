// Option A, "The Block". The page reads without this: it adds the clock, the header's colour over red or dark
// ground, the phone videos while their panel is on screen, and the draft note.
import { $, $$, clocks, drafts, lazyVideos, stillSwitch } from './shared.js';

clocks();
drafts();
stillSwitch();
lazyVideos('.a-card, .a-mini', { threshold: 0.5 });

// The header is ink on the red blocks and white on everything else; after the first screen it keeps only the name
// and the pill, as the reference does.
const reds = new Set();
const overRed = new IntersectionObserver((entries) => {
  entries.forEach((e) => (e.isIntersecting ? reds.add(e.target) : reds.delete(e.target)));
  document.body.classList.toggle('on-red', reds.size > 0);
}, { rootMargin: '0px 0px -94% 0px' });
$$('.a-block, .a-end').forEach((el) => overRed.observe(el));
new IntersectionObserver(([e]) => document.body.classList.toggle('past', !e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe($('.a-block'));
