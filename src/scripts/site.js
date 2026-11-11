// SD Design. One requestAnimationFrame loop (loop.js) serves everything that moves: the halftones here (about thirty
// frames a second, and only while something in them is changing) and the scroll scenes (scroll.js). Everything else
// is CSS and a few listeners. The page reads, links and opens its rows without this file; nothing is stored on the
// visitor's device.
import { $, $$, motion, fine, state, onStill, stillSwitch, makeTone, cover, mark, text } from './tone.js';
import { onFrame, firstFrame, wake } from './loop.js';
import { startScroll } from './scroll.js';
import { left } from '../data/offer.js';
import { arrivedFrom, tagLinks } from './source.js';

const html = document.documentElement;
const i18n = JSON.parse($('#i18n').textContent);
const saveData = navigator.connection?.saveData === true;

// A tap on WhatsApp, the phone, Instagram or the form is a "goal". If an analytics script is ever added to the
// page it hears about each one; with none, this does nothing.
const goal = (name) => { window.plausible?.(name); window.gtag?.('event', name); window.dispatchEvent(new CustomEvent('sd:goal', { detail: name })); };
document.addEventListener('click', (e) => { const a = e.target.closest('[data-goal]'); if (a) goal(a.dataset.goal); });

// ---------- where the visitor came from, said in the message they start ----------
// (src/scripts/source.js; left out of this script when the switch is off)
const fromLine = import.meta.env.SD_SOURCE && i18n.from ? ((from) => (from ? i18n.from.replace('{from}', from) : ''))(arrivedFrom()) : '';
if (fromLine) tagLinks(fromLine);

// ---------- Albania time, wherever the visitor is ----------
const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Tirane' });
const clocks = $$('[data-clock]');
const tick = () => { const now = fmt.format(new Date()); clocks.forEach((el) => { el.textContent = now; }); };
tick();
setInterval(tick, 15000);

// ---------- the note: for contact details that are not filled in yet, and for the surprises ----------
const note = $('#draft');
let noteTimer;
function say(message) {
  note.textContent = message;
  note.classList.add('on');
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => note.classList.remove('on'), 3600);
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-draft]');
  if (!a) return;
  e.preventDefault();
  say(i18n.toast[a.dataset.draft]);
});

// ---------- recordings: fetched when their phone comes on screen, paused when it leaves ----------
const onScreen = new Set();
function play(box) {
  let v = box.querySelector('video');
  if (!v && box.dataset.video) {
    v = Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, preload: 'metadata', src: box.dataset.video });
    v.setAttribute('aria-hidden', 'true');
    v.addEventListener('playing', () => v.classList.add('ready'), { once: true });
    v.addEventListener('playing', wake);
    box.append(v);
  }
  v?.play().catch(() => {});
}
onStill((still) => onScreen.forEach((box) => (still ? box.querySelector('video')?.pause() : play(box))));
const videos = new IntersectionObserver((entries) => entries.forEach((e) => {
  const box = e.target;
  e.isIntersecting ? onScreen.add(box) : onScreen.delete(box);
  if (e.isIntersecting && !state.still) play(box);
  else box.querySelector('video')?.pause();
}), { threshold: 0.3 });
$$('.phone[data-video]').forEach((el) => videos.observe(el));

// ---------- the halftones ----------
const hidden = (src) => {
  const v = Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, preload: 'auto', src });
  v.setAttribute('aria-hidden', 'true');
  v.addEventListener('playing', wake);
  Object.assign(v.style, { position: 'absolute', width: '2px', height: '2px', opacity: '0', pointerEvents: 'none' });
  return v;
};
function setup(canvas) {
  const kind = canvas.dataset.tone;
  // a small picture (data-dot) has finer dots and no glass; data-ink names another colour for the dots than the red
  const dot = Number(canvas.dataset.dot) || 0;
  const tone = makeTone(canvas, { lens: fine && !dot, dot, ...(canvas.dataset.ink && { color: canvas.dataset.ink }) });
  const it = { canvas, tone, kind, seen: false, last: 0, fresh: true, intro: false, t0: 0, video: () => null };
  if (kind === 'hero') {
    // the dots show whatever plays in the glass phone; on load they draw the SD mark first
    const box = $('#live-phone');
    it.video = () => box.querySelector('video');
    it.picture = () => tone.sample(cover(box.querySelector('img')), { reset: true });
    it.intro = motion;
  } else if (kind === 'site') {
    const poster = Object.assign(new Image(), { src: canvas.dataset.poster });
    let v = null;
    it.video = () => v;
    it.picture = () => tone.sample(cover(poster), { reset: true });
    it.wake = () => {
      if (!v && canvas.dataset.video && !state.still) { v = hidden(canvas.dataset.video); canvas.after(v); }
      if (v) state.still ? v.pause() : v.play().catch(() => {});
    };
    it.sleep = () => v?.pause();
    onStill(() => { if (it.seen) it.wake(); });
  } else if (kind === 'text') {
    it.picture = () => tone.sample(text(canvas.dataset.text), { reset: true });
    document.fonts?.ready.then(() => { it.fresh = true; wake(); });
  } else {
    const draw = canvas.classList.contains('foot-tone') ? mark(0.66, 0.5, 0.5) : dot ? mark(0.84, 0.5, 0.5) : mark();
    it.picture = () => tone.sample(draw, { reset: true });
  }
  new ResizeObserver(() => { if (tone.size()) { it.fresh = true; wake(); } }).observe(canvas);
  new IntersectionObserver(([e]) => { it.seen = e.isIntersecting; it.seen ? it.wake?.() : it.sleep?.(); wake(); }).observe(canvas);
  if (fine && !dot) {
    // the glass follows the pointer anywhere over the section the canvas fills
    const host = canvas.parentElement;
    let x = 0, y = 0;
    host.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); x = e.clientX - r.left; y = e.clientY - r.top; tone.pointer(x, y, !state.still && x >= 0 && y >= 0 && x <= r.width && y <= r.height); wake(); });
    host.addEventListener('pointerleave', () => { tone.pointer(x, y, false); wake(); });
    onStill((still) => { if (still) tone.pointer(x, y, false); });
  }
  return it;
}
const tones = $$('canvas[data-tone]').map(setup);
const heroTone = tones.find((t) => t.kind === 'hero');

function step(it, now, dt) {
  const { tone } = it;
  if (it.intro) {
    // the mark, held for a moment, then the site
    if (!it.t0) { if (tone.sample(mark(), { reset: true })) it.t0 = now; }
    else if (now - it.t0 > 1050) { it.intro = false; it.fresh = true; }
  } else {
    // a recording feeds the dots frame by frame; where the browser hands over empty frames (Safari, for a recording
    // that plays but is not shown), the still picture is used instead
    const v = state.still || it.stillOnly ? null : it.video();
    if (v && v.readyState >= 2 && !v.paused) {
      if (now - it.last > 64) {
        const got = tone.sample(cover(v), { reset: it.fresh, skipEmpty: true });
        it.last = now;
        if (got === 'empty') { it.empty = (it.empty || 0) + 1; if (it.empty >= 3) { it.stillOnly = true; it.fresh = true; } } else { it.empty = 0; it.fresh = false; }
      }
    } else if (it.fresh && it.picture() !== false) {
      it.fresh = false;
      if (!motion) tone.snap();
    }
  }
  tone.frame(dt);
}
// The halftones take a turn about thirty times a second, and only those on screen. When none of them has anything left
// to draw (no recording playing, no dot still moving), they stop asking for frames.
let drawn = 0;
if (tones.length) {
  onFrame((now) => {
    const due = now - drawn >= 30, d = Math.min(now - drawn, 80);
    let live = false;
    for (const it of tones) {
      if (!it.seen) continue;
      if (due) step(it, now, d);
      const v = state.still || it.stillOnly ? null : it.video();
      if (it.intro || it.fresh || it.tone.busy || (v && !v.paused && !v.ended)) live = true;
    }
    if (due) drawn = now;
    return live;
  });
  onStill(wake);
}

// ---------- first screen: the client sites take turns in the phone and in the dots ----------
const live = $('#live');
if (live) {
  const sites = JSON.parse(live.dataset.sites);
  const box = $('#live-phone'), img = $('#live-img'), name = $('#live-name');
  let at = 0, timer;
  const show = (i) => {
    at = (i + sites.length) % sites.length;
    const s = sites[at];
    box.querySelector('video')?.remove();
    box.dataset.video = s.video;
    img.src = s.poster;
    img.alt = s.alt;
    name.textContent = s.name;
    if (onScreen.has(box) && !state.still) play(box);
    if (heroTone) { heroTone.intro = false; heroTone.fresh = true; heroTone.stillOnly = false; heroTone.empty = 0; wake(); }
  };
  // by itself only on a desktop that has not asked to save data; the button works everywhere
  const arm = () => {
    clearInterval(timer);
    if (motion && fine && !saveData) timer = setInterval(() => { if (!document.hidden && !state.still && heroTone?.seen) show(at + 1); }, 9000);
  };
  $('#live-next').addEventListener('click', () => { show(at + 1); arm(); });
  arm();
}

// ---------- the free drafts left this week, worked out for the visitor's own day ----------
const free = left();
$$('[data-meter]').forEach((m) => {
  $('[data-left]', m).textContent = String(free);
  $$('.meter-ticks i', m).forEach((tick, k) => tick.classList.toggle('on', k < free));
  m.classList.toggle('none', free === 0);
});

// the scroll scenes listen to the same switch, so they start before it is read
startScroll();
stillSwitch();

// ---------- the bar: a line that changes, and the menu ----------
const msg = $('#msg');
let lineAt = 0, hold = 0;
function line(textValue) {
  if (!motion) { msg.textContent = textValue; return; }
  msg.classList.add('out');
  setTimeout(() => {
    msg.textContent = textValue;
    msg.classList.replace('out', 'pre');
    void msg.offsetWidth;
    msg.classList.remove('pre');
  }, 160);
}
setInterval(() => {
  if (document.hidden || state.still || performance.now() < hold) return;
  lineAt = (lineAt + 1) % i18n.bar.length;
  line(i18n.bar[lineAt]);
}, 3400);
// the bubble speaks: the line in the bar, and the same words (with their translation) as a note
function speak([words, meaning]) {
  hold = performance.now() + 4200;
  line(words);
  say(meaning ? `${words} · ${meaning}` : words);
  const logo = $('#logo');
  logo.classList.remove('pop');
  void logo.offsetWidth;
  logo.classList.add('pop');
}

const nav = $('#nav'), burger = $('#burger');
function setMenu(open) {
  nav.classList.toggle('open', open);
  nav.toggleAttribute('inert', !open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); } });
document.addEventListener('pointerdown', (e) => { if (nav.classList.contains('open') && !e.target.closest('.bar')) setMenu(false); });

// ---------- the rail's page counter follows the section in the middle of the screen ----------
const count = $('#count');
const middle = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) count.textContent = e.target.dataset.section.padStart(2, '0'); }), { rootMargin: '-48% 0px -48% 0px' });
$$('[data-section]').forEach((el) => middle.observe(el));

// ---------- blocks rise once as they arrive ----------
// Only blocks that start below the screen are hidden first, so nothing a visitor already sees ever blinks, and a
// jump far down the page shows everything it passed. Nothing is hidden before the first animation frame has arrived
// (and the scroll scenes have taken their places): a browser that runs no frames shows the whole page as it is.
if (motion) firstFrame(() => {
  const all = $$('.say, .work-top > .lead, .rows > .row, .sec-head > .lead, .stair, .kinds-t, .levels-other, .why-list > li, .step-list > li, .terms-col, .work-all, .faq-more, .get-list > li, .more-t, .more-list > li, .story-ask, .close > h2, .close-b, .foot-nav > div, .doc section, [data-rise]');
  const below = all.filter((el) => el.getBoundingClientRect().top > innerHeight * 0.92);
  const rise = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const upto = below.indexOf(e.target);
    for (let i = 0; i <= upto; i++) {
      const el = below[i];
      if (el.dataset.risen) continue;
      el.dataset.risen = '1';
      el.classList.add('in');
      rise.unobserve(el);
      // once it has arrived the block goes back to its own styles (a row keeps its colour transition)
      setTimeout(() => el.classList.remove('rise', 'in'), 950);
    }
  }), { rootMargin: '0px 0px -7% 0px' });
  below.forEach((el) => { el.classList.add('rise'); rise.observe(el); });
});

// ---------- links within the page glide when clicked ----------
// Only a pointer click glides. The keyboard gets the browser's own jump, which also moves the focus to the place, and
// focus moving by Tab never animates (there is no smooth scrolling in the stylesheet).
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href*="#"]');
  if (!a || !motion || e.detail === 0 || e.defaultPrevented || a.dataset.draft || a.target || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
  const url = new URL(a.href);
  const el = url.pathname === location.pathname && url.hash.length > 1 && document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if (!el) return;
  e.preventDefault();
  history.pushState(null, '', url.hash);
  if (el.matches('details')) el.open = true;
  el.scrollIntoView({ block: 'start', behavior: 'smooth' });
});

// ---------- rows: a link to one opens it, and an opened row is never left above the screen ----------
function openFromHash() {
  const el = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (el && el.matches('details')) { el.open = true; el.scrollIntoView({ block: 'start', behavior: 'instant' }); }
}
addEventListener('hashchange', openFromHash);
openFromHash();
document.addEventListener('toggle', (e) => {
  const d = e.target;
  if (!d.matches?.('details.row') || !d.open) return;
  // the row above may be closing, which moves this one up: look again once that has finished
  setTimeout(() => {
    const top = d.getBoundingClientRect().top;
    if (top < 70 || top > innerHeight * 0.8) scrollTo({ top: scrollY + top - 84, behavior: motion ? 'smooth' : 'instant' });
  }, 540);
}, true);

// ---------- the form: to WhatsApp with the message written, or to the inbox when one is set ----------
const form = $('#form');
if (form) {
  const f = i18n.form, started = Date.now();
  const err = $('#f-err'), status = $('#f-note'), field = form.elements.message;
  field.addEventListener('input', () => { if (field.value.trim()) { err.hidden = true; field.removeAttribute('aria-invalid'); } });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const message = String(data.message).trim();
    if (!message) { err.hidden = false; field.setAttribute('aria-invalid', 'true'); field.focus(); return; }
    // a filled trap field or an answer faster than a person can type is a robot: thank it and send nothing
    if (data.website || Date.now() - started < 2500) { status.textContent = f.ok; form.reset(); return; }
    if (f.endpoint) {
      form.setAttribute('aria-busy', 'true');
      try {
        const res = await fetch(f.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ ...f.fields, name: data.name, phone: data.phone, message, page: location.pathname, lang: html.lang }) });
        if (!res.ok) throw new Error(String(res.status));
        status.textContent = f.ok;
        form.reset();
        goal('form');
      } catch { status.textContent = f.fail; }
      form.removeAttribute('aria-busy');
      return;
    }
    if (f.whatsapp) {
      const words = [f.hello, data.name && `${f.labelName}: ${data.name}`, data.phone && `${f.labelPhone}: ${data.phone}`, message].filter(Boolean).join('\n') + (fromLine ? `\n\n${fromLine}` : '');
      goal('form');
      window.open(`https://wa.me/${f.whatsapp}?text=${encodeURIComponent(words)}`, '_blank', 'noopener');
      return;
    }
    say(i18n.toast.form);
  });
}

// ---------- four surprises ----------
// 1. Five quick clicks on the mark: the bubble speaks Albanian. On the home page the mark also takes you to the top.
const logo = $('#logo');
let clicks = 0, clickTimer, phrase = 0;
logo.addEventListener('click', (e) => {
  if (new URL(logo.href).pathname === location.pathname) { e.preventDefault(); scrollTo({ top: 0, behavior: motion ? 'smooth' : 'instant' }); }
  clicks++;
  clearTimeout(clickTimer);
  clickTimer = setTimeout(() => { clicks = 0; }, 1600);
  if (clicks >= 5) { clicks = 0; speak(i18n.eggs.say[phrase++ % i18n.eggs.say.length]); }
});
// 2. Type "kafe" anywhere (not in a field): an invitation to a coffee.
const kafe = $('#kafe');
let typed = '';
const closeKafe = () => { kafe.hidden = true; };
$('#kafe-x').addEventListener('click', closeKafe);
// 3. The Konami code: for a few seconds every halftone draws the SD mark.
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konami = 0;
function showMark() {
  for (const it of tones) { if (it.seen) { it.intro = false; it.tone.sample(mark(), { reset: true }); it.last = performance.now() + 3200; } }
  wake();
  setTimeout(() => { for (const it of tones) { it.fresh = true; } wake(); }, 3200);
}
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !kafe.hidden) { closeKafe(); return; }
  if (e.ctrlKey || e.metaKey || e.altKey || e.target.closest?.('input, textarea, [contenteditable]')) return;
  konami = e.key === KONAMI[konami] || e.key.toLowerCase() === KONAMI[konami] ? konami + 1 : e.key === KONAMI[0] ? 1 : 0;
  if (konami === KONAMI.length) { konami = 0; speak(i18n.eggs.konami); showMark(); }
  if (e.key.length !== 1) return;
  typed = (typed + e.key.toLowerCase()).slice(-12);
  if (i18n.eggs.kafe.words.some((w) => typed.endsWith(w))) { typed = ''; kafe.hidden = false; }
});
// 4. Shake the phone. The listener is simply added: where the system would ask for permission first, nothing happens.
let shaken = 0;
addEventListener('devicemotion', (e) => {
  const a = e.acceleration;
  if (!a || state.still) return;
  const now = performance.now();
  if (Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0) > 34 && now - shaken > 5000) { shaken = now; speak(i18n.eggs.shake); showMark(); }
});
