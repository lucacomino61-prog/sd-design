// Option C, "The Glass". One requestAnimationFrame loop, owned here, redraws the halftones about twelve times a
// second and only while they are on screen. Everything else is CSS. The page reads without this.
import { $, $$, motion, clocks, drafts, lazyVideos, state, stillSwitch, onStill } from './shared.js';

clocks();
drafts();
lazyVideos('.c-live, .c-phone', { threshold: 0.3 });

// ---------- halftone: a client's site, drawn as dots on the dark ground ----------
// Light pages would flood the screen, so the dots follow darkness: an empty page stays dark and its words and
// pictures light up. Each dot keeps a hint of its source colour, lifted toward the warm white.
const tint = new Map();
function colour(key) {
  let c = tint.get(key);
  if (!c) {
    const lift = (v, to) => Math.round(v * 17 + (to - v * 17) * 0.6);
    c = `rgb(${lift(key >> 8, 249)},${lift((key >> 4) & 15, 244)},${lift(key & 15, 235)})`;
    tint.set(key, c);
  }
  return c;
}
function makeTone(canvas) {
  const ctx = canvas.getContext('2d');
  const small = document.createElement('canvas');
  const sctx = small.getContext('2d', { willReadFrequently: true });
  const cell = innerWidth < 760 ? 7 : 9;
  let cols = 0, rows = 0, w = 0, h = 0, dpr = 1;
  const size = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    cols = Math.ceil(w / cell); rows = Math.ceil(h / cell);
    small.width = cols; small.height = rows;
  };
  const draw = (src) => {
    const sw = src.videoWidth || src.naturalWidth, sh = src.videoHeight || src.naturalHeight;
    if (!sw || !cols) return;
    const s = Math.max(cols / sw, rows / sh), dw = sw * s, dh = sh * s;
    sctx.drawImage(src, (cols - dw) / 2, (rows - dh) * 0.3, dw, dh);
    const px = sctx.getImageData(0, 0, cols, rows).data;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    let last = '';
    for (let y = 0, i = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++, i += 4) {
        const r = px[i], g = px[i + 1], b = px[i + 2];
        const dark = 1 - (r * 0.2126 + g * 0.7152 + b * 0.0722) / 255;
        if (dark < 0.1) continue;
        const d = Math.min(1, (dark - 0.1) * 1.5) * cell * 0.86;
        const c = colour(((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4));
        if (c !== last) { ctx.fillStyle = c; last = c; }
        ctx.fillRect(x * cell + (cell - d) / 2, y * cell + (cell - d) / 2, d, d);
      }
    }
  };
  return { size, draw };
}

const tones = $$('canvas[data-tone]').map((canvas) => {
  const tone = makeTone(canvas);
  const from = canvas.dataset.from ? $(canvas.dataset.from) : null;
  const poster = from ? from.querySelector('img') : Object.assign(new Image(), { src: canvas.dataset.poster });
  const item = { canvas, tone, from, poster, video: null, seen: false, still: false };
  new ResizeObserver(() => { tone.size(); item.still = false; }).observe(canvas);
  new IntersectionObserver(([e]) => {
    item.seen = e.isIntersecting;
    // a halftone with its own source gets a hidden video only once it is on screen
    if (item.seen && motion && !from && !item.video) {
      item.video = Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, preload: 'auto', src: canvas.dataset.video });
      item.video.setAttribute('aria-hidden', 'true');
      Object.assign(item.video.style, { position: 'absolute', width: '2px', height: '2px', opacity: '0', pointerEvents: 'none' });
      canvas.after(item.video);
    }
    if (item.video) item.seen && !state.still ? item.video.play().catch(() => {}) : item.video.pause();
  }).observe(canvas);
  return item;
});
function paint(item) {
  const v = item.video || item.from?.querySelector('video');
  if (v && v.readyState >= 2) {
    if (state.still && item.still) return; // stopped: the last frame stays
    item.tone.draw(v);
    item.still = true;
    return;
  }
  // no moving source (yet, or reduced motion): the poster, drawn once
  if (!item.still && item.poster.complete && item.poster.naturalWidth) { item.tone.draw(item.poster); item.still = true; }
}
let then = 0;
function loop(now) {
  if (now - then > 82) { then = now; tones.forEach((t) => { if (t.seen) paint(t); }); }
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

onStill((still) => tones.forEach((t) => { if (t.video) still || !t.seen ? t.video.pause() : t.video.play().catch(() => {}); }));
stillSwitch();

// ---------- the bar: a line that changes, and the menu ----------
const msg = $('.c-msg span');
const lines = msg.dataset.msgs.split('|');
let at = 0;
setInterval(() => {
  if (document.hidden || state.still) return;
  at = (at + 1) % lines.length;
  if (!motion) { msg.textContent = lines[at]; return; }
  msg.classList.add('out');
  setTimeout(() => {
    msg.textContent = lines[at];
    msg.classList.replace('out', 'pre');
    void msg.offsetWidth;
    msg.classList.remove('pre');
  }, 160);
}, 3400);

const nav = $('#c-nav'), burger = $('#c-burger');
function setMenu(open) {
  nav.classList.toggle('open', open);
  nav.toggleAttribute('inert', !open);
  burger.setAttribute('aria-expanded', String(open));
}
burger.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); burger.focus(); } });
document.addEventListener('pointerdown', (e) => { if (nav.classList.contains('open') && !e.target.closest('.c-bar')) setMenu(false); });

// ---------- the rail's page counter follows the section in the middle of the screen ----------
const count = $('#c-count');
const middle = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) count.textContent = e.target.dataset.section.padStart(2, '0'); }), { rootMargin: '-48% 0px -48% 0px' });
$$('[data-section]').forEach((el) => middle.observe(el));

// ---------- blocks rise once as they arrive ----------
const rise = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rise.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.c-work-top, .c-row, .c-what h2, .c-kinds, .c-what .c-lead, .c-cols > li, .c-end h2, .c-end-b').forEach((el) => { el.classList.add('c-rise'); rise.observe(el); });
