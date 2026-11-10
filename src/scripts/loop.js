// One requestAnimationFrame loop for the whole page. Whatever moves (the halftones, the scroll scenes, the numbers that
// count) subscribes here, so there is never a second scheduler competing for the same frame. A subscriber returns
// false when it has nothing left to do; once every subscriber says so the loop stops asking for frames, until wake().
const subs = new Set();
let raf = 0, then = 0;

function frame(now) {
  raf = 0;
  const dt = Math.min(Math.max(now - then, 0), 80);
  then = now;
  let more = false;
  for (const fn of subs) if (fn(now, dt) !== false) more = true;
  // a subscriber may have called wake() itself during this frame: never ask twice
  if (more && !raf) raf = requestAnimationFrame(frame);
}

// ask for frames again: after a scroll scene comes near, a picture changes, the pointer moves over a halftone
export function wake() {
  if (raf) return;
  then = performance.now() - 16;
  raf = requestAnimationFrame(frame);
}

export function onFrame(fn) {
  subs.add(fn);
  wake();
  return () => { subs.delete(fn); };
}

// Run something once, when the first frame has really arrived. Whatever hides content in order to reveal it later
// waits for this: a browser that never runs a frame (some embedded views) then simply shows the page as it is.
export function firstFrame(fn) {
  const stop = onFrame(() => { stop(); fn(); return false; });
}
