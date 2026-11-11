// What the scroll moves. No library: the browser scrolls the page, and this file only reads how far.
//
//   the ground   the page takes the colour of the section in the middle of the screen (dark, light, red), and in the
//                gallery the colour of the client whose site is in the middle;
//   scenes       a scene is a block with a stage inside it. While the page scrolls through a pinned scene the stage
//                gets a number from 0 to 1 (--p) and a step (data-step), and the stylesheet does the rest. The story
//                of the free draft is one; the gallery of client sites is the other, moved sideways by that number;
//   type         headings rise word by word as they arrive, one line of big type slides with the scroll, and the
//                three numbers of the offer count.
//
// Everything here is an addition. Without this file, or with the animations stopped (the switch in the rail, or the
// system setting), the story is a list beside a picture and the gallery a strip that scrolls sideways.
import { $, $$, fine, state, onStill } from './tone.js';
import { onFrame, firstFrame, wake } from './loop.js';

const html = document.documentElement, body = document.body;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const wide = matchMedia('(min-width: 900px)');
const moving = () => html.classList.contains('move');
// where in the story (0..1) each line of the example conversation arrives
const CHAT_AT = [0.03, 0.12, 0.28, 0.37, 0.53, 0.59];
const CHAT_GAP = 8, CHAT_PAD = 12;

// ---------- the ground ----------
// Each section names its ground; the page wears the one in the middle of the screen and the stylesheet fades between
// them. Sections that name none are dark.
// A section can also name a client's colour (data-wear): the page wears it while that section is in the middle. A
// page that opens in a client's colour has it from the stylesheet (body.worn) until the first section reports here.
html.classList.add('fade');
let wear = '';
const middle = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  body.dataset.ground = e.target.dataset.ground || 'dark';
  wear = e.target.dataset.wear || '';
  retone();
  body.classList.remove('worn');
}), { rootMargin: '-48% 0px -48% 0px' });
$$('main > *').forEach((el) => middle.observe(el));
let toneNow = '';
function setTone(color) {
  if (color === toneNow) return;
  toneNow = color;
  // on a client's colour the softer text is as strong as the main text: some of those colours are bright
  if (color) { body.style.setProperty('--ground', color); body.style.setProperty('--soft', '#f9f4eb'); } else { body.style.removeProperty('--ground'); body.style.removeProperty('--soft'); }
}

// ---------- scenes ----------
const scenes = $$('[data-scene]').map((el) => {
  const sc = { el, kind: el.dataset.scene, pin: $('.pin', el), near: false, s: -1, shown: '', pinned: false, pinH: 0 };
  if (sc.kind === 'story') {
    sc.steps = Number(el.dataset.steps) || 1;
    sc.step = 0;
    sc.list = $('.chat-list', el);
    sc.screen = $('.mock-s', el);
    sc.msgs = $$('.chat-m', el).map((m, i) => ({ el: m, at: CHAT_AT[i] ?? 1, h: 0, shown: '' }));
    sc.room = 0;
  } else {
    sc.wrap = $('.reel-wrap', el);
    sc.reel = $('.reel', el);
    sc.bar = $('.reel-bar i', el);
    sc.centre = false;
    sc.active = null;
    sc.slides = $$('.slide', el).map((li) => ({ el: li, img: $('.tall', li), tone: li.dataset.tone || '', left: 0, width: 0, enter: 0, leave: 1, q: -1 }));
  }
  return sc;
});
const reels = scenes.filter((sc) => sc.kind === 'reel');

// The client whose phone is in the middle of the gallery lends the page its colour, for as long as the gallery itself
// is on the middle of the screen.
function retone() {
  const sc = reels.find((r) => r.centre && r.active);
  setTone(sc ? sc.active.tone : wear);
}
for (const sc of reels) {
  const centred = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const sl = sc.slides.find((s) => s.el === e.target);
    for (const s of sc.slides) s.el.classList.toggle('on', s === sl);
    sl.el.classList.add('seen');
    sc.active = sl;
    retone();
  }), { root: sc.wrap, rootMargin: '0px -68% 0px -30%' }); // a line a third of the way across: where a slide's phone is
  sc.slides.forEach((sl) => centred.observe(sl.el));
  new IntersectionObserver(([e]) => { sc.centre = e.isIntersecting; retone(); }, { rootMargin: '-34% 0px -64% 0px' }).observe(sc.el);
  // The keyboard: when a link in a slide that is off to the side takes the focus, the page jumps to where the pinned
  // row shows that slide. (As a strip the browser does this by itself.)
  sc.reel.addEventListener('focusin', (e) => {
    const sl = sc.pinned && sc.slides.find((s) => s.el.contains(e.target));
    if (!sl) return;
    const box = e.target.getBoundingClientRect(), r = sc.el.getBoundingClientRect();
    if (box.left >= 0 && box.right <= sc.vw && r.top <= 0 && r.bottom >= innerHeight) return;
    scrollTo({ top: scrollY + r.top + clamp((sl.left - sc.vw * 0.12) / Math.max(1, sc.travel)) * (r.height - sc.pinH), behavior: 'instant' });
    sc.s = -1;
  });
}

// A scene asks for frames only while it is near the screen. The gallery's pictures are fetched as it comes near, so a
// phone that slides in from the side is never empty.
const nearby = new IntersectionObserver((es) => es.forEach((e) => {
  const sc = scenes.find((s) => s.el === e.target);
  sc.near = e.isIntersecting;
  if (sc.near && sc.kind === 'reel' && !sc.warm) { sc.warm = true; for (const sl of sc.slides) if (sl.img) sl.img.loading = 'eager'; }
  if (sc.near) wake();
}), { rootMargin: '70% 0px 70% 0px' });
scenes.forEach((sc) => nearby.observe(sc.el));

// Measure. The gallery is pinned on a wide screen with a mouse or trackpad; on a touch screen it stays a strip to
// swipe. A pinned gallery's height comes from the distance its row has to travel.
function layout() {
  for (const sc of scenes) {
    if (sc.kind === 'story') {
      sc.pinned = moving();
      for (const m of sc.msgs) { m.el.style.translate = ''; m.el.style.opacity = ''; m.shown = ''; }
      sc.screen.style.removeProperty('--seen');
      if (sc.pinned) {
        if (!sc.step) { sc.step = 1; sc.el.dataset.step = '1'; }
        // the room the conversation has: the part of the chat that can be seen (on a phone the mock runs off the foot
        // of the stage), and the height of each message at this width
        const list = sc.list.getBoundingClientRect(), pin = sc.pin.getBoundingClientRect();
        sc.room = Math.max(80, Math.min(list.bottom, pin.bottom - 10) - list.top);
        // how much of the phone's screen can be seen, for whatever sits at its foot
        const screen = sc.screen.getBoundingClientRect();
        sc.screen.style.setProperty('--seen', `${Math.round(Math.min(screen.bottom, pin.bottom) - screen.top)}px`);
        for (const m of sc.msgs) m.h = m.el.offsetHeight;
      }
    } else {
      const pinned = moving() && fine && wide.matches && sc.el.hasAttribute('data-pin');
      sc.el.classList.toggle('pinned', pinned);
      if (pinned) sc.wrap.removeAttribute('tabindex'); else sc.wrap.setAttribute('tabindex', '0');
      if (pinned) {
        sc.vw = sc.pin.clientWidth;
        sc.travel = Math.max(0, sc.reel.offsetWidth - sc.vw);
        // three quarters of the row's travel: the row moves a little faster than the page scrolls
        sc.el.style.height = `${Math.round(sc.pin.offsetHeight + sc.travel * 0.75)}px`;
        for (const sl of sc.slides) {
          sl.left = sl.el.offsetLeft; sl.width = sl.el.offsetWidth;
          // a site scrolls inside its phone from the moment the phone comes on screen until it has left
          sl.enter = Math.max(0, sl.left - sc.vw); sl.leave = Math.max(sl.enter + 1, Math.min(sc.travel, sl.left + sl.width));
          sl.q = -1;
        }
      } else if (sc.pinned) {
        sc.el.style.height = '';
        sc.reel.style.translate = '';
        sc.bar.style.scale = '';
        for (const sl of sc.slides) if (sl.img) sl.img.style.translate = '';
      }
      sc.pinned = pinned;
    }
    sc.pinH = sc.pin.offsetHeight;
    sc.s = -1;
  }
  for (const b of bands) { b.width = b.span.offsetWidth; if (!moving()) b.span.style.translate = ''; }
  wake();
}

// One frame of the scenes: read where each one is, then write.
function scenesFrame(now, dt) {
  if (!moving()) return false;
  let live = false;
  for (const sc of scenes) {
    sc.rect = sc.near && sc.pinned ? sc.el.getBoundingClientRect() : null;
    if (sc.rect) live = true;
  }
  for (const sc of scenes) {
    if (!sc.rect) continue;
    const p = clamp(-sc.rect.top / Math.max(1, sc.rect.height - sc.pinH));
    // a wheel moves the page in steps, so the number follows it with a short glide; a finger is already smooth
    const s = sc.s < 0 || !fine || Math.abs(p - sc.s) < 0.0004 ? p : sc.s + (p - sc.s) * (1 - Math.exp(-dt / 95));
    if (s === sc.s) continue;
    sc.s = s;
    if (sc.kind === 'story') {
      const text = s.toFixed(4);
      if (text !== sc.shown) { sc.shown = text; sc.el.style.setProperty('--p', text); }
      const step = Math.min(sc.steps, Math.floor(s * sc.steps) + 1);
      if (step !== sc.step) { sc.step = step; sc.el.dataset.step = String(step); }
      // the conversation: each message takes its place under the ones that have arrived, and when they no longer
      // fit, all of them move up so the newest stays in view
      let y = CHAT_PAD;
      for (const m of sc.msgs) { const k = clamp((s - m.at) * 30); m.on = 1 - (1 - k) ** 3; m.y = y; y += m.on * (m.h + CHAT_GAP); }
      const over = Math.max(0, y + CHAT_PAD - CHAT_GAP - sc.room);
      for (const m of sc.msgs) {
        const now = `${(m.y - over + (1 - m.on) * 12).toFixed(1)}|${m.on.toFixed(3)}`;
        if (now === m.shown) continue;
        m.shown = now;
        m.el.style.translate = `0 ${(m.y - over + (1 - m.on) * 12).toFixed(1)}px`;
        m.el.style.opacity = m.on.toFixed(3);
      }
    } else {
      const x = sc.travel * s;
      sc.reel.style.translate = `${(-x).toFixed(1)}px 0`;
      sc.bar.style.scale = `${s.toFixed(4)} 1`;
      for (const sl of sc.slides) {
        const at = sl.left - x;
        if (at > sc.vw + 200 || at + sl.width < -200) continue;
        if (sl.img) {
          const q = clamp((x - sl.enter) / (sl.leave - sl.enter));
          if (q !== sl.q) { sl.q = q; sl.img.style.translate = `0 ${(-75 * q).toFixed(2)}%`; }
        }
      }
    }
  }
  return live;
}

// ---------- one line of big type that slides as the page scrolls past it ----------
const bands = $$('[data-band]').map((el) => ({ el, span: el.firstElementChild, near: false, width: 0, x: -1 }));
const bandNear = new IntersectionObserver((es) => es.forEach((e) => { bands.find((b) => b.el === e.target).near = e.isIntersecting; if (e.isIntersecting) wake(); }), { rootMargin: '10% 0px 10% 0px' });
bands.forEach((b) => bandNear.observe(b.el));
function bandsFrame() {
  if (!moving()) return false;
  let live = false;
  const vh = innerHeight, vw = html.clientWidth;
  for (const b of bands) {
    if (!b.near) continue;
    live = true;
    const r = b.el.getBoundingClientRect();
    const x = Math.round(clamp((vh - r.top) / (vh + r.height)) * Math.max(0, Math.min(b.width - vw, vw * 1.5)));
    if (x !== b.x) { b.x = x; b.span.style.translate = `${-x}px 0`; }
  }
  return live;
}

// ---------- numbers that count once, when they arrive ----------
const counts = $$('[data-count]').map((el) => ({ el, to: Number(el.dataset.count), from: 0, t0: 0, done: false })).filter((c) => c.to > 0);
const running = new Set();
const arrive = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  arrive.unobserve(e.target);
  const c = counts.find((x) => x.el === e.target);
  if (c.done || !moving()) return;
  c.t0 = 0;
  running.add(c);
  wake();
}), { threshold: 0.15 });
function countsFrame(now) {
  for (const c of running) {
    if (!c.t0) c.t0 = now;
    const k = clamp((now - c.t0) / 1000), eased = 1 - (1 - k) ** 4;
    c.el.textContent = String(Math.round(c.from + (c.to - c.from) * eased));
    if (k >= 1) { c.done = true; running.delete(c); }
  }
  return running.size > 0;
}

// ---------- headings rise word by word ----------
// Only a heading that starts below the screen is hidden first, so nothing a visitor already sees ever blinks.
const splits = $$('.split');
const reveal = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  reveal.unobserve(e.target);
  e.target.classList.remove('hide');
}), { rootMargin: '0px 0px -8% 0px' });

// ---------- moving, or still ----------
// The page keeps its place when the layout changes under it (the pinned scenes are much taller than the plain ones).
function keepPlace(change) {
  const at = scrollY > 4 && document.elementFromPoint(innerWidth / 2, innerHeight / 2)?.closest('main > *, footer');
  const before = at && at.getBoundingClientRect();
  const part = before && before.height ? (innerHeight / 2 - before.top) / before.height : 0;
  change();
  if (!at) return;
  const after = at.getBoundingClientRect();
  const off = after.top + part * after.height - innerHeight / 2;
  if (Math.abs(off) > 2) scrollBy({ top: off, behavior: 'instant' });
}
// The scenes take their places as soon as the script starts: the page then has its full height while it loads, so
// after a reload or a step back the browser can put it where it was. A browser that never runs an animation frame
// (some embedded views) could not move them, so if no frame has arrived after half a second the page goes back to
// its plain layout, where nothing depends on a frame to be read; it returns to the scenes if frames start later.
let frames = false, noFrames = false, armed = false, started = false;
function setMode() {
  const move = !state.still && !noFrames;
  const change = () => { html.classList.toggle('move', move); layout(); };
  // the first time the browser itself is still putting the page where it was; later changes keep the visitor's place
  if (started) keepPlace(change); else change();
  started = true;
  arm();
  if (state.still) {
    for (const el of splits) el.classList.remove('hide');
    running.clear();
    for (const c of counts) { c.done = true; c.el.textContent = String(c.to); }
  }
}
// Hide what will rise or count, but only what is still below the screen, and only once frames are known to arrive
// (whatever is hidden needs a frame to be shown again).
function arm() {
  if (armed || !frames || !moving()) return;
  armed = true;
  for (const el of splits) if (el.getBoundingClientRect().top > innerHeight * 0.94) { el.classList.add('hide'); reveal.observe(el); }
  for (const c of counts) if (c.el.getBoundingClientRect().top > innerHeight * 0.9) { c.el.textContent = String(c.from); arrive.observe(c.el); } else c.done = true;
}

export function startScroll() {
  onStill(setMode);
  firstFrame(() => { frames = true; if (noFrames) { noFrames = false; setMode(); } else arm(); });
  const watch = () => setTimeout(() => { if (!frames && document.visibilityState === 'visible') { noFrames = true; setMode(); } }, 500);
  if (document.visibilityState === 'visible') watch(); else document.addEventListener('visibilitychange', watch, { once: true });
  onFrame(scenesFrame);
  onFrame(bandsFrame);
  onFrame(countsFrame);
  // Measure again when the window changes. On a phone the address bar sliding away changes only the height, and
  // nothing here depends on that, so a scroll never triggers a new measure.
  let queued = 0, width = innerWidth;
  const again = () => { clearTimeout(queued); queued = setTimeout(() => keepPlace(layout), 140); };
  addEventListener('resize', () => { if (fine || innerWidth !== width) { width = innerWidth; again(); } });
  wide.addEventListener('change', again);
  document.fonts?.ready.then(again);
}
