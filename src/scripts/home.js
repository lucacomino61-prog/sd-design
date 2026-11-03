// SD Design home: the clients' real sites play on phones, the tabs switch the kind of business, WhatsApp is one tap away.
// GSAP is the one JS animation engine (the phone swap, the tilt, the magnetic buttons, the chip's timing). Scroll reveals
// are CSS transitions switched by an IntersectionObserver; the Konami rain and the wobbles use the Web Animations API,
// which runs on the compositor and adds no requestAnimationFrame loop. The page reads and links without any of this.
import gsap from 'gsap';
import { SITES, TABS } from '../data/sites.js';

const T = JSON.parse(document.getElementById('i18n').textContent);
const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private mode: the choice lasts this visit */ } },
};
const albanian = (text) => Object.assign(document.createElement('span'), { lang: 'sq', textContent: text });

// ---------- toast ----------
const toastEl = $('#toast');
let toastTimer;
function toast(text, sub) {
  toastEl.replaceChildren(text);
  if (sub) toastEl.append(Object.assign(document.createElement('small'), { textContent: sub }));
  toastEl.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('on'), 3400);
}

// ---------- contact details still to come: the link says so instead of guessing ----------
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-draft]');
  if (!a) return;
  e.preventDefault();
  toast(T.toast[a.dataset.draft]);
});

// ---------- the form (no inbox is connected yet) ----------
const form = $('#msg'), need = $('#m-text'), err = $('#m-err');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!need.value.trim()) {
    err.hidden = false;
    need.setAttribute('aria-invalid', 'true');
    need.setAttribute('aria-describedby', 'm-err');
    need.focus();
    return;
  }
  toast(T.toast.sent);
});
need.addEventListener('input', () => {
  if (err.hidden || !need.value.trim()) return;
  err.hidden = true;
  need.removeAttribute('aria-invalid');
  need.removeAttribute('aria-describedby');
});

// ---------- the phones ----------
const KEYS = Object.keys(TABS);
const ORDER = ['c', 'l', 'r'];
const slots = Object.fromEntries(ORDER.map((k) => [k, $(`[data-slot="${k}"]`)]));
const phones = $('#phones'), note = $('#tabnote'), capT = $('#cap-t'), capName = $('#cap-name'), capState = $('#cap-state');
const tabs = $$('[role="tab"]');
const vbtn = $('#vbtn');
let current = 'food', swap = null, inView = true;
let paused = store.get('sd-paused') ? store.get('sd-paused') === '1' : !motion;

// A video is only fetched once it may play (not paused, not off screen); until then the poster stands in.
function playAll() {
  ORDER.forEach((k) => {
    const slot = slots[k], key = slot.dataset.site;
    const want = Boolean(!paused && inView && key && !slot.classList.contains('off'));
    if (want) addVideo(slot, key);
    const v = slot.querySelector('video');
    if (v) want ? v.play().catch(() => {}) : v.pause();
  });
}
function addVideo(slot, key) {
  const s = SITES[key];
  if (!s?.video || slot.querySelector('video')) return;
  const v = Object.assign(document.createElement('video'), { className: 'media', muted: true, loop: true, playsInline: true, preload: 'metadata', poster: s.poster, src: s.video });
  v.setAttribute('aria-hidden', 'true');
  v.addEventListener('playing', () => v.classList.add('ready'), { once: true });
  slot.querySelector('.scr').append(v);
}
function fill(slot, key) {
  const scr = slot.querySelector('.scr');
  if ((slot.dataset.site || null) !== (key || null)) {
    scr.querySelectorAll('.media').forEach((n) => n.remove());
    slot.dataset.site = key || '';
    if (key === 'clinic') scr.append($('#tpl-clinic').content.firstElementChild.cloneNode(true));
    else if (key) scr.append(Object.assign(new Image(), { className: 'media', decoding: 'async', src: SITES[key].poster, alt: T.onPhone.replace('{name}', SITES[key].name) }));
  }
  slot.classList.toggle('off', !key);
}
function setCap(key) {
  const s = key === 'clinic' ? { name: T.clinicName, state: 'sample' } : SITES[key];
  capName.textContent = s.name;
  capState.textContent = T.states[s.state];
  capState.className = `st ${s.state}`;
}
function show(tab) {
  if (tab === current) return;
  const dir = KEYS.indexOf(tab) > KEYS.indexOf(current) ? 1 : -1;
  current = tab;
  tabs.forEach((b) => {
    const on = b.dataset.tab === tab;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  phones.setAttribute('aria-labelledby', `tab-${tab}`);
  const apply = () => {
    ORDER.forEach((k) => fill(slots[k], TABS[tab][k]));
    setCap(TABS[tab].c);
    note.textContent = T.notes[tab];
    playAll();
  };
  chipHide();
  swap?.kill();
  if (!motion) { apply(); chipShow(); return; }
  // the phones slide out the way the tabs move, the next business slides in from the other side
  const all = ORDER.map((k) => slots[k].firstElementChild);
  swap = gsap.timeline({ onComplete: chipShow })
    .to(all, { x: -28 * dir, opacity: 0, duration: 0.16, ease: 'power2.out' })
    .to([note, capT], { opacity: 0, duration: 0.12, ease: 'power2.out' }, 0)
    .add(apply)
    .fromTo(all, { x: 32 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: 'power3.out', stagger: 0.05 })
    .to([note, capT], { opacity: 1, duration: 0.3, ease: 'power2.out' }, '<');
}
tabs.forEach((b) => b.addEventListener('click', () => show(b.dataset.tab)));
$('[role="tablist"]').addEventListener('keydown', (e) => {
  const i = tabs.indexOf(document.activeElement);
  const j = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
  if (i < 0 || j === undefined) return;
  e.preventDefault();
  const b = tabs[(j + tabs.length) % tabs.length];
  b.focus();
  show(b.dataset.tab);
});
// "See an example" on a business card switches the hero to that business and brings the phones into view.
$$('[data-see]').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault();
  show(a.dataset.see);
  phones.scrollIntoView({ behavior: motion ? 'smooth' : 'auto', block: 'center' });
  $(`#tab-${a.dataset.see}`).focus({ preventScroll: true });
}));
function setPaused(p) {
  paused = p;
  vbtn.setAttribute('aria-pressed', String(p));
  playAll();
}
vbtn.addEventListener('click', () => {
  setPaused(!paused);
  store.set('sd-paused', paused ? '1' : '0');
});
setPaused(paused);
new IntersectionObserver(([e]) => { inView = e.isIntersecting; playAll(); }, { threshold: 0.15 }).observe(phones);

// ---------- a customer writes on WhatsApp: typing dots, then the message ----------
const chip = $('#chip'), chipText = $('#chip-text');
let chipCall = null;
function chipHide() {
  chipCall?.kill();
  chip.classList.remove('on', 'typed');
}
function chipShow() {
  chipCall?.kill();
  chipText.textContent = T.chip[current];
  if (!motion) { chip.classList.add('on', 'typed'); return; }
  chip.classList.remove('typed');
  chipCall = gsap.delayedCall(0.3, () => {
    chip.classList.add('on');
    chipCall = gsap.delayedCall(1.1, () => chip.classList.add('typed'));
  });
}
chipCall = gsap.delayedCall(motion ? 1.2 : 0, chipShow);

// ---------- pointer: the phones lean toward it, the WhatsApp buttons pull toward it ----------
if (motion && fine) {
  // GSAP folds the element's CSS translate into its own transform the first time it touches it, so the tilt waits
  // for the CSS entrance (which moves translate) to finish; otherwise the phones would keep its start offset.
  Promise.all(phones.getAnimations().map((a) => a.finished)).then(() => {
    gsap.set(phones, { transformPerspective: 1400 });
    const rx = gsap.quickTo(phones, 'rotationX', { duration: 1.1, ease: 'power3' });
    const ry = gsap.quickTo(phones, 'rotationY', { duration: 1.1, ease: 'power3' });
    addEventListener('pointermove', (e) => {
      if (innerWidth < 961) return;
      ry((e.clientX / innerWidth - 0.5) * 8);
      rx((e.clientY / innerHeight - 0.5) * -6);
    }, { passive: true });
  });

  $$('.mag').forEach((el) => {
    const o = { x: 0, y: 0 };
    const draw = () => { el.style.translate = `${o.x}px ${o.y}px`; };
    const qx = gsap.quickTo(o, 'x', { duration: 0.45, ease: 'power3', onUpdate: draw });
    const qy = gsap.quickTo(o, 'y', { duration: 0.45, ease: 'power3', onUpdate: draw });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      qx(gsap.utils.clamp(-6, 6, (e.clientX - (r.left - o.x) - r.width / 2) * 0.12));
      qy(gsap.utils.clamp(-4, 4, (e.clientY - (r.top - o.y) - r.height / 2) * 0.25));
    });
    el.addEventListener('pointerleave', () => { qx(0); qy(0); });
  });
}

// ---------- sections rise once as they arrive; the work cards open ----------
// When something arrives, everything before it in the page shows too, so a jump (an anchor link, a fast fling) never
// leaves blocks hidden above the reader.
document.documentElement.classList.add('rv-ready');
const reveals = $$('.rv');
const rise = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  for (const el of reveals.slice(0, reveals.indexOf(e.target) + 1)) {
    if (el.classList.contains('in')) continue;
    el.classList.add('in');
    rise.unobserve(el);
  }
}), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
reveals.forEach((el) => rise.observe(el));

// ---------- hover a project to play it on a phone ----------
if (fine) $$('.wcard[data-video]').forEach((card) => {
  const screen = $('.mscr', card);
  let v = null;
  const on = () => {
    screen.style.backgroundImage ||= `url("${card.dataset.poster}")`;
    card.classList.add('play');
    if (paused) return;
    v ||= screen.appendChild(Object.assign(document.createElement('video'), { muted: true, loop: true, playsInline: true, preload: 'auto', src: card.dataset.video }));
    v.play().catch(() => {});
  };
  const off = () => { card.classList.remove('play'); v?.pause(); };
  card.addEventListener('pointerenter', on);
  card.addEventListener('pointerleave', off);
  card.addEventListener('focusin', on);
  card.addEventListener('focusout', off);
});

// ---------- the mobile bar steps aside at the contact block ----------
const dock = $('#dock');
new IntersectionObserver(([e]) => dock.classList.toggle('hide', e.isIntersecting), { threshold: 0.2 }).observe($('#contact'));

// ---------- easter egg: click the logo five times and the SD bubble talks ----------
const logo = $('#logo'), say = $('#say'), bub = $('#logo .bub');
let clicks = 0, lastClick = 0, phrase = -1, sayTimer;
logo.addEventListener('click', (e) => {
  e.preventDefault();
  scrollTo({ top: 0, behavior: motion ? 'smooth' : 'auto' });
  const now = performance.now();
  clicks = now - lastClick < 1200 ? clicks + 1 : 1;
  lastClick = now;
  if (clicks < 5 && phrase < 0) return;
  phrase = (phrase + 1) % T.eggs.say.length;
  const [line, tr] = T.eggs.say[phrase];
  say.replaceChildren(albanian(line));
  if (tr) say.append(Object.assign(document.createElement('small'), { textContent: tr }));
  say.classList.add('on');
  if (motion) bub.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-14deg)' }, { transform: 'rotate(10deg)' }, { transform: 'rotate(-5deg)' }, { transform: 'rotate(0)' }], { duration: 520, easing: 'ease-in-out' });
  clearTimeout(sayTimer);
  sayTimer = setTimeout(() => { say.classList.remove('on'); phrase = -1; clicks = 0; }, 3800);
});

// ---------- easter egg: type "kafe" for a coffee ----------
const kafe = $('#kafe');
function openKafe() {
  if (!kafe.hidden) return;
  kafe.classList.remove('out');
  kafe.hidden = false;
}
function closeKafe() {
  if (kafe.hidden) return;
  kafe.classList.add('out');
  setTimeout(() => { kafe.hidden = true; kafe.classList.remove('out'); }, motion ? 150 : 0);
}
$('#kafe-x').addEventListener('click', closeKafe);

// ---------- easter egg: the Konami code rains SD bubbles ----------
const BUBBLE = '<svg viewBox="322 0 385 488" aria-hidden="true"><path fill="#e2382a" d="M362.5 0H506.5A200 200 0 0 1 506.5 400H482.5L322.5 488L362.5 360Z"/></svg>';
function konami() {
  toast(T.eggs.konami);
  if (!motion || $('.rain')) return;
  const rain = Object.assign(document.createElement('div'), { className: 'rain' });
  rain.setAttribute('aria-hidden', 'true');
  const runs = [];
  for (let i = 0; i < 44; i++) {
    const el = document.createElement('span');
    if (i < 14) {
      el.className = 'b';
      el.innerHTML = BUBBLE;
      el.style.width = `${18 + Math.random() * 26}px`;
    } else el.className = `c c${i % 3}`;
    el.style.left = `${Math.random() * 100}vw`;
    rain.append(el);
    const drift = (Math.random() - 0.5) * 180, spin = (Math.random() - 0.5) * 720;
    runs.push(el.animate([
      { transform: 'translate(0, -15vh) rotate(0deg)' },
      { transform: `translate(${drift * 0.5}px, 45vh) rotate(${spin * 0.5}deg)`, offset: 0.5 },
      { transform: `translate(${drift}px, 115vh) rotate(${spin}deg)` },
    ], { duration: 2400 + Math.random() * 1400, delay: Math.random() * 600, easing: 'cubic-bezier(0.35, 0, 0.65, 1)', fill: 'both' }));
  }
  document.body.append(rain);
  Promise.all(runs.map((r) => r.finished)).then(() => rain.remove());
}

const KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
let typed = '', step = 0;
addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeKafe(); return; }
  if (e.metaKey || e.ctrlKey || e.altKey || e.target.closest?.('input, textarea, select, [contenteditable]')) return;
  const k = e.key.toLowerCase();
  step = k === KONAMI[step] ? step + 1 : k === KONAMI[0] ? 1 : 0;
  if (step === KONAMI.length) { step = 0; konami(); }
  if (e.key.length !== 1) return;
  typed = (typed + k).slice(-12);
  if (T.eggs.kafe.words.some((w) => typed.endsWith(w))) { typed = ''; openKafe(); }
});

// ---------- easter egg: shake the phone ----------
// The listener never asks for permission: where motion needs a prompt (iOS) no events arrive and nothing happens,
// because an easter egg should not raise a system dialog.
function shake() {
  const [line, tr] = T.eggs.shake;
  toast(albanian(line), tr);
  if (motion) phones.animate([{ rotate: '0deg' }, { rotate: '-3deg' }, { rotate: '3deg' }, { rotate: '-2deg' }, { rotate: '1deg' }, { rotate: '0deg' }], { duration: 650, easing: 'ease-in-out' });
}
let hits = 0, lastHit = 0, rest = 0;
addEventListener('devicemotion', (e) => {
  const a = e.accelerationIncludingGravity;
  if (!a || a.x == null) return;
  if (Math.abs(Math.hypot(a.x, a.y, a.z) - 9.81) < 13) return;
  const now = performance.now();
  if (now - lastHit < 120) return;
  hits = now - lastHit < 700 ? hits + 1 : 1;
  lastHit = now;
  if (hits >= 3 && now > rest) { rest = now + 3000; hits = 0; shake(); }
});
