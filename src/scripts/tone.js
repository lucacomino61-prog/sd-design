// The halftone: a picture, a video frame or the SD mark drawn as a field of square dots, the way a screen is made
// of pixels. Dots ease toward each new picture, so one site melts into the next, and a round glass follows the
// pointer and magnifies the dots under it. Plain canvas 2D; the caller owns the one animation loop.
import { S_PATH, BUBBLE } from '../data/mark.js';

export const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

// "Stop the motion": one switch stops everything that moves by itself. It starts pressed when the visitor's system
// asks for reduced motion.
export const state = { still: !motion };
const watchers = new Set();
export const onStill = (fn) => watchers.add(fn);
export function stillSwitch() {
  const btn = $('[data-still]');
  const apply = () => {
    // (the page itself is marked by scroll.js with "move"; a class named like the button's would style <html> as a button)
    btn?.setAttribute('aria-pressed', String(state.still));
    watchers.forEach((fn) => fn(state.still));
  };
  btn?.addEventListener('click', () => { state.still = !state.still; apply(); });
  apply();
}

// ---------- what a halftone can be drawn from ----------
// a picture or a video frame, filling the field like object-fit: cover (a tall phone recording shows its upper part)
export const cover = (src) => (c, cols, rows) => {
  const sw = src.videoWidth || src.naturalWidth, sh = src.videoHeight || src.naturalHeight;
  if (!sw) return false;
  const s = Math.max(cols / sw, rows / sh), dw = sw * s, dh = sh * s;
  c.drawImage(src, (cols - dw) / 2, (rows - dh) * 0.3, dw, dh);
  return true;
};
// the SD mark, centred
const S = new Path2D(S_PATH), B = new Path2D(BUBBLE);
export const mark = (size = 0.56, ax = 0.5, ay = 0.46) => (c, cols, rows) => {
  const s = Math.min((cols * 0.8) / 707, (rows * size) / 494);
  c.save();
  c.translate(cols * ax - (707 * s) / 2, rows * ay - (494 * s) / 2 + 6 * s);
  c.scale(s, s);
  c.fillStyle = '#000';
  c.fill(S); c.fill(B);
  c.restore();
  return true;
};
// a few big characters, for the page that was not found
export const text = (str) => (c, cols, rows) => {
  c.fillStyle = '#000';
  c.font = `900 ${Math.round(Math.min(rows * 0.74, cols * 0.34))}px Archivo, Arial, sans-serif`;
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(str, cols / 2, rows * 0.46);
  return true;
};

// `dot` fixes the size of a dot (for a small picture); otherwise it follows the width of the canvas
export function makeTone(canvas, { color = '#ff4d36', glass = '#f9f4eb', lens = true, dot = 0 } = {}) {
  const ctx = canvas.getContext('2d');
  const small = document.createElement('canvas');
  const sctx = small.getContext('2d', { willReadFrequently: true });
  let cell = 9, cols = 0, rows = 0, w = 0, h = 0, dpr = 1;
  let cur = new Float32Array(0), tgt = new Float32Array(0);
  let inv = false, fresh = true, busy = true;
  // the glass: where the pointer is (tx, ty), where the glass has got to (px, py), and how open it is (r)
  let tx = 0, ty = 0, px = 0, py = 0, r = 0, want = 0;

  function size() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = canvas.clientWidth; h = canvas.clientHeight;
    if (!w || !h) return false;
    cell = dot || (w < 760 ? 7 : w < 1280 ? 8 : 9);
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    const c = Math.ceil(w / cell), rr = Math.ceil(h / cell);
    if (c !== cols || rr !== rows) { cols = c; rows = rr; small.width = cols; small.height = rows; cur = new Float32Array(cols * rows); tgt = new Float32Array(cols * rows); }
    busy = true;
    return true;
  }

  // Read a source into dot sizes. Dots follow the darker tone of a light page and the lighter tone of a dark one, so
  // an empty page stays empty and its words and pictures light up.
  function sample(draw, { reset = false } = {}) {
    if (!cols) return false;
    sctx.fillStyle = '#fff';
    sctx.fillRect(0, 0, cols, rows);
    if (draw(sctx, cols, rows) === false) return false;
    const d = sctx.getImageData(0, 0, cols, rows).data;
    let sum = 0;
    for (let i = 0, j = 0; i < tgt.length; i++, j += 4) { const v = 1 - (d[j] * 0.2126 + d[j + 1] * 0.7152 + d[j + 2] * 0.0722) / 255; tgt[i] = v; sum += v; }
    const mean = sum / tgt.length;
    if (reset || fresh) { inv = mean > 0.5; fresh = false; } else if (!inv && mean > 0.62) inv = true; else if (inv && mean < 0.38) inv = false;
    for (let i = 0; i < tgt.length; i++) { const v = inv ? 1 - tgt[i] : tgt[i]; tgt[i] = v < 0.12 ? 0 : Math.min(1, (v - 0.12) * 1.45); }
    busy = true;
    return true;
  }
  const snap = () => { cur.set(tgt); busy = true; };

  function pointer(x, y, on) {
    tx = x; ty = y;
    if (on && want === 0 && r < 1) { px = x; py = y; }
    want = on && lens ? Math.min(150, Math.max(84, w * 0.085)) : 0;
    busy = true;
  }

  // One frame: move the dots toward their target, move the glass toward the pointer, draw. Returns false once
  // nothing is changing, so the caller can stop asking.
  function frame(dt) {
    if (!busy || !cols) return false;
    const k = Math.min(1, dt / 150);
    let moving = false;
    for (let i = 0; i < cur.length; i++) {
      const d = tgt[i] - cur[i];
      if (d > 0.006 || d < -0.006) { cur[i] += d * k; moving = true; } else cur[i] = tgt[i];
    }
    const g = Math.min(1, dt / 90);
    if (Math.abs(want - r) > 0.5) { r += (want - r) * g; moving = true; } else r = want;
    if (Math.abs(tx - px) + Math.abs(ty - py) > 0.5) { px += (tx - px) * g; py += (ty - py) * g; moving = true; }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    const max = cell * 0.88, r2 = r * r, half = cell / 2;
    for (let y = 0, i = 0; y < rows; y++) {
      const cy = y * cell + half, dy = cy - py;
      for (let x = 0; x < cols; x++, i++) {
        const v = cur[i];
        if (v < 0.03) continue;
        const cx = x * cell + half;
        if (r > 1) { const dx = cx - px; if (dx * dx + dy * dy < r2) continue; }
        const s = v * max;
        ctx.fillRect(cx - s / 2, cy - s / 2, s, s);
      }
    }
    if (r > 1) {
      // inside the glass the same dots are drawn larger and further apart, in the light colour
      const z = 1.8, inner = r / z;
      ctx.save();
      ctx.beginPath(); ctx.arc(px, py, r, 0, 6.2832); ctx.clip();
      ctx.fillStyle = glass;
      const x0 = Math.max(0, Math.floor((px - inner) / cell) - 1), x1 = Math.min(cols - 1, Math.ceil((px + inner) / cell) + 1);
      const y0 = Math.max(0, Math.floor((py - inner) / cell) - 1), y1 = Math.min(rows - 1, Math.ceil((py + inner) / cell) + 1);
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const v = cur[y * cols + x];
          if (v < 0.03) continue;
          const s = v * max * z;
          ctx.fillRect(px + (x * cell + half - px) * z - s / 2, py + (y * cell + half - py) * z - s / 2, s, s);
        }
      }
      ctx.restore();
      ctx.globalAlpha = 0.55; ctx.strokeStyle = glass; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px, py, r - 0.5, 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = 1;
    }
    busy = moving;
    return true;
  }

  return { size, sample, snap, pointer, frame, get busy() { return busy; }, wake() { busy = true; fresh = true; } };
}
