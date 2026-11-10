// Small things all three design options share: the Albania clock, the "draft" note for contact details that are not
// filled in yet, and videos that load and play only while they are on screen.
export const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// "Ndalo lëvizjen": one switch stops everything that moves by itself (videos, cycles, the halftone). It starts
// pressed when the visitor's system asks for reduced motion.
export const state = { still: !motion };
const watchers = new Set();
export const onStill = (fn) => watchers.add(fn);
export function stillSwitch() {
  const btn = $('[data-still]');
  const apply = () => {
    btn?.setAttribute('aria-pressed', String(state.still));
    document.documentElement.classList.toggle('still', state.still);
    watchers.forEach((fn) => fn(state.still));
  };
  btn?.addEventListener('click', () => { state.still = !state.still; apply(); });
  apply();
}

// Albania time, wherever the visitor is
const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Tirane' });
export function clocks() {
  const els = $$('[data-clock]');
  if (!els.length) return;
  const tick = () => { const now = fmt.format(new Date()); els.forEach((el) => { el.textContent = now; }); };
  tick();
  setInterval(tick, 15000);
}

const DRAFT = { wa: 'Draft: numri i WhatsApp shtohet para publikimit.', tel: 'Draft: numri i telefonit shtohet para publikimit.', ig: 'Draft: profili i Instagram shtohet para publikimit.' };
export function drafts() {
  const note = Object.assign(document.createElement('div'), { className: 'draft' });
  note.setAttribute('role', 'status');
  document.body.append(note);
  let timer;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[data-draft]');
    if (!a) return;
    e.preventDefault();
    note.textContent = DRAFT[a.dataset.draft];
    note.classList.add('on');
    clearTimeout(timer);
    timer = setTimeout(() => note.classList.remove('on'), 3200);
  });
}

// <figure data-video="/phone/x.mp4"> gets its video only when it comes on screen, and the video pauses when it leaves
export function lazyVideos(selector, { threshold = 0.35 } = {}) {
  const seen = new Set();
  const play = (box) => {
    let v = box.querySelector('video');
    if (!v && box.dataset.video) {
      v = Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, preload: 'metadata', src: box.dataset.video });
      v.setAttribute('aria-hidden', 'true');
      v.addEventListener('playing', () => v.classList.add('ready'), { once: true });
      box.append(v);
    }
    v?.play().catch(() => {});
  };
  // the switch pauses what is on screen, and starts it again (fetching it first if it never played)
  onStill((still) => seen.forEach((box) => (still ? box.querySelector('video')?.pause() : play(box))));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    const box = e.target;
    e.isIntersecting ? seen.add(box) : seen.delete(box);
    if (e.isIntersecting && !state.still) play(box);
    else box.querySelector('video')?.pause();
  }), { threshold });
  $$(selector).forEach((el) => io.observe(el));
}
