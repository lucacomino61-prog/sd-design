// Option B, "The Split". GSAP is the one animation engine here: the intro, the red dot and the phone that follows
// the pointer over the list. Everything else is CSS on the reference's one curve. The page reads without this.
import gsap from 'gsap';
import { $, $$, motion, fine, clocks, drafts, state, stillSwitch, onStill } from './shared.js';

clocks();
drafts();
const body = document.body;
const first = $('.b-first'), top = $('.b-top'), w1 = $('.b-w1'), w2 = $('.b-w2'), mid = $('.b-mid');
const cards = $$('.b-cards li:not(.b-yours)'), yours = $('.b-yours'), title = $('#b-title');
const phone = matchMedia('(max-width: 760px)').matches;

// ---------- the cards: one is lit at a time, its recording plays and its name shows at the top ----------
let lit = -1, held = false, cycle;
function video(a) {
  let v = a.querySelector('video');
  if (!v && a.dataset.video && motion) {
    v = Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, preload: 'metadata', src: a.dataset.video });
    v.setAttribute('aria-hidden', 'true');
    v.addEventListener('playing', () => v.classList.add('ready'), { once: true });
    a.append(v);
  }
  return v;
}
// A card that lights up by itself only turns to colour; its recording is fetched and played when the visitor
// asks for it (pointer, focus, or the card swiped to the middle on a phone).
function light(i) {
  const a = cards[i].firstElementChild;
  if (i !== lit) {
    if (lit >= 0) { cards[lit].classList.remove('on'); cards[lit].querySelector('video')?.pause(); }
    lit = i;
    cards[i].classList.add('on');
    title.textContent = a.dataset.title;
  }
  if ((held || phone) && !state.still) video(a)?.play().catch(() => {});
}
function startCycle() {
  light(0);
  if (!motion || phone) return;
  cycle = setInterval(() => { if (!held && !document.hidden && !state.still) light((lit + 1) % cards.length); }, 2800);
}
cards.forEach((li, i) => {
  const a = li.firstElementChild;
  a.addEventListener('pointerenter', () => { held = true; light(i); });
  a.addEventListener('pointerleave', () => { held = false; });
  a.addEventListener('focus', () => { held = true; light(i); });
  a.addEventListener('blur', () => { held = false; });
});
onStill((still) => { if (still) $$('.b-cards video, .b-peek video').forEach((v) => v.pause()); });
stillSwitch();
// on a phone the cards are a row to swipe: the one in the middle is the lit one
if (phone) {
  const mid = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) light(cards.indexOf(e.target)); }), { root: $('.b-cards'), threshold: 0.7 });
  cards.forEach((li) => mid.observe(li));
}

// ---------- intro, as on the reference: dark, the wordmark rises joined, splits to the corners as the ground turns
// to paper and the cards scatter out. A tap or a key skips it. ----------
function intro() {
  const r1 = w1.getBoundingClientRect(), r2 = w2.getBoundingClientRect();
  const gap = r1.width * 0.14, start = (innerWidth - (r1.width + gap + r2.width)) / 2;
  const cx = innerWidth / 2, cy = innerHeight * 0.4;
  const all = [...cards, yours];
  gsap.set(first, { backgroundColor: '#1e1e1e' });
  gsap.set(w1, { x: start - r1.left, yPercent: 118, color: '#fefff8' });
  gsap.set(w2, { x: start + r1.width + gap - r2.left, yPercent: 118, color: '#fefff8' });
  all.forEach((li) => { const r = li.getBoundingClientRect(); gsap.set(li, { x: cx - (r.left + r.width / 2), y: cy - (r.top + r.height / 2), scale: 0.3, opacity: 0 }); });
  gsap.set([mid, top], { opacity: 0 });
  body.classList.add('b-ready');
  const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.1 }, onComplete: () => {
    // only what the intro set: 'all' would also wipe the cards' --x and --y, which live in their style attribute
    gsap.set([first, w1, w2, mid, top, ...all], { clearProps: 'transform,opacity,color,backgroundColor' });
    startCycle();
  } });
  tl.to([w1, w2], { yPercent: 0 }, 0.15)
    .to(first, { backgroundColor: '#fefff8', duration: 0.7, ease: 'power2.inOut' }, 1.05)
    .to([w1, w2], { color: '#1e1e1e', duration: 0.7, ease: 'power2.inOut' }, 1.05)
    .to([w1, w2], { x: 0, duration: 1.2 }, 1.15)
    .to(all, { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.2, stagger: 0.05 }, 1.25)
    .to([mid, top], { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.75);
  const skip = () => tl.progress(1);
  addEventListener('pointerdown', skip, { once: true });
  addEventListener('keydown', skip, { once: true });
}
if (motion && !phone) document.fonts.ready.then(intro);
else { body.classList.add('b-ready'); startCycle(); }

// the title at the top belongs to the cards: it leaves with them
new IntersectionObserver(([e]) => body.classList.toggle('b-away', !e.isIntersecting), { threshold: 0.35 }).observe(first);

// ---------- rows rise once as they arrive ----------
const rise = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rise.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
$$('.b-row, .b-who > ul > li').forEach((el) => rise.observe(el));

// ---------- the menu ----------
const nav = $('#b-nav'), menu = $('#b-menu');
function setMenu(open) {
  nav.classList.toggle('open', open);
  body.classList.toggle('b-open', open);
  nav.toggleAttribute('inert', !open);
  menu.setAttribute('aria-expanded', String(open));
  menu.querySelector('span').textContent = open ? 'Mbyll' : 'Menu';
  if (open) nav.querySelector('a').focus({ preventScroll: true });
}
menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menu.focus(); } });

// ---------- pointer: the red dot, and the phone that follows it over the list ----------
if (fine && motion) {
  const dot = Object.assign(document.createElement('div'), { className: 'b-dot' });
  dot.setAttribute('aria-hidden', 'true');
  const label = dot.appendChild(document.createElement('span'));
  body.append(dot);
  const dx = gsap.quickTo(dot, 'x', { duration: 0.5, ease: 'expo.out' }), dy = gsap.quickTo(dot, 'y', { duration: 0.5, ease: 'expo.out' });
  const peek = $('.b-peek'), box = $('.b-peek-in');
  const px = gsap.quickTo(peek, 'x', { duration: 0.9, ease: 'expo.out' }), py = gsap.quickTo(peek, 'y', { duration: 0.9, ease: 'expo.out' });
  addEventListener('pointermove', (e) => {
    dx(e.clientX); dy(e.clientY);
    px(Math.min(e.clientX + 36, innerWidth - peek.offsetWidth - 16)); py(e.clientY - peek.offsetHeight * 0.55);
  }, { passive: true });
  const say = (text) => { label.textContent = text; dot.classList.toggle('big', Boolean(text)); };
  cards.forEach((li) => { li.addEventListener('pointerenter', () => say('Shiko')); li.addEventListener('pointerleave', () => say('')); });
  $$('.b-row').forEach((row) => {
    row.addEventListener('pointerenter', () => {
      const img = Object.assign(new Image(), { src: row.dataset.poster, alt: '' });
      box.replaceChildren(img);
      if (row.dataset.video) {
        const v = Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, src: row.dataset.video });
        v.addEventListener('playing', () => v.classList.add('ready'), { once: true });
        box.append(v);
        v.play().catch(() => {});
      }
      peek.classList.add('on');
      say(row.tagName === 'A' ? 'Hap' : '');
    });
    row.addEventListener('pointerleave', () => { peek.classList.remove('on'); box.querySelector('video')?.pause(); say(''); });
  });
}
