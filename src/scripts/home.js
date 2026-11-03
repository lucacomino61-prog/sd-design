// Home: the clients' real sites play on phones; tabs switch the business type; WhatsApp is one tap everywhere.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CONTACT } from '../data/contact.js';

gsap.registerPlugin(ScrollTrigger);
const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!motion) document.documentElement.classList.add('no-motion');
const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];
const toastEl = $('#toast');
function toast(t) { toastEl.textContent = t; gsap.killTweensOf(toastEl); gsap.fromTo(toastEl, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' }); gsap.to(toastEl, { opacity: 0, delay: 3, duration: 0.4 }); }

// ---------- contact links: built from CONTACT, never invented ----------
$$('[data-wa]').forEach((a) => {
  const text = decodeURIComponent((a.getAttribute('href') || '').replace(/^#wa:/, ''));
  if (CONTACT.whatsapp) { a.href = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`; a.target = '_blank'; a.rel = 'noopener'; }
  else a.addEventListener('click', (e) => { e.preventDefault(); toast('Draft: numri i WhatsApp shtohet para publikimit.'); });
});
$$('[data-tel]').forEach((a) => { if (CONTACT.phone) { a.href = `tel:${CONTACT.phone}`; } else a.addEventListener('click', (e) => { e.preventDefault(); toast('Draft: numri i telefonit shtohet para publikimit.'); }); });
if (CONTACT.phone) $('#tel-t').textContent = CONTACT.phone;
$$('[data-ig]').forEach((a) => { if (CONTACT.instagram) { a.href = `https://instagram.com/${CONTACT.instagram}`; $('#ig-t').textContent = '@' + CONTACT.instagram; } else a.addEventListener('click', (e) => { e.preventDefault(); toast('Draft: profili i Instagram shtohet para publikimit.'); }); });
$$('[data-soon]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); toast('English dhe italisht vijnë së shpejti.'); }));
$('#msg').addEventListener('submit', (e) => { e.preventDefault(); const t = $('#m-text'); if (!t.value.trim()) { t.focus(); toast('Shkruani shkurt çfarë ju duhet.'); return; } toast('Draft: mesazhi do të shkojë në inbox pasi ta lidhim.'); });

// ---------- the phones ----------
const SITES = {
  martiri: { name: 'Bar Martiri', state: 'Online', live: true, video: '/phone/martiri.mp4', poster: '/phone/martiri.jpg' },
  kater: { name: 'Katër Burgers', state: 'Online', live: true, video: '/phone/kater.mp4', poster: '/phone/kater.jpg' },
  elixir: { name: 'elixir.al', state: 'Online', live: true, video: '/phone/elixir.mp4', poster: '/phone/elixir.jpg' },
  greta: { name: 'Dresses by Greta', state: 'Online', live: true, video: '/phone/greta.mp4', poster: '/phone/greta.jpg' },
  beed: { name: 'BeeD Energy', state: 'Prototip', video: '/phone/beed.mp4', poster: '/phone/beed.jpg' },
  divjaka: { name: 'Divjaka · Hotel Pelikan', state: 'Prototip', poster: '/phone/divjaka-og.png' },
  clinic: { name: 'Faqja juaj në italisht', state: 'Shembull', card: true },
};
const TABS = {
  food: { c: 'martiri', l: 'kater', r: null, note: 'Bar Martiri në Spille dhe Katër Burgers në Tiranë: menu, orar dhe porosi, gjithçka nga telefoni.' },
  hotel: { c: 'divjaka', l: null, r: null, note: 'Divjaka, për Hotel Pelikan: rezervime, dyqan dhe itinerar në një platformë. Prototip, ende jo publik.' },
  shop: { c: 'elixir', l: 'greta', r: 'beed', note: 'elixir.al, Dresses by Greta dhe BeeD Energy: katalog, shportë dhe pagesë në dorëzim, me panel për stafin.' },
  clinic: { c: 'clinic', l: null, r: null, note: 'Për klinika dhe agjenci me klientë italianë: faqe në italisht. Ende pa projekt publik; na kërkoni një shembull.' },
};
const slots = { c: $('[data-slot="c"]'), l: $('[data-slot="l"]'), r: $('[data-slot="r"]') };
function fill(slot, key) {
  const scr = slot.querySelector('.scr'); scr.querySelectorAll('video, img, .demo').forEach((n) => n.remove());
  if (!key) { slot.classList.add('off'); return; }
  slot.classList.remove('off');
  const s = SITES[key];
  if (s.card) { const d = document.createElement('div'); d.className = 'demo'; d.innerHTML = '<div style="position:absolute;inset:0;display:grid;align-content:center;gap:10px;padding:28px;background:linear-gradient(160deg,#fff,#eef4f2);color:#111;font-family:Geist,sans-serif"><small style="font:600 10px/1 \'Geist Mono\',monospace;letter-spacing:.1em;color:#e2382a">ESEMPIO · CLINICA</small><b style="font-size:26px;line-height:1.05;letter-spacing:-.03em">Il tuo sorriso, a Tirana.</b><span style="font-size:13px;color:#55585f">Visite, preventivi e viaggio: tutto in italiano.</span><span style="margin-top:8px;display:inline-block;background:#25d366;color:#06210f;font-weight:600;font-size:13px;padding:10px 12px;border-radius:999px;justify-self:start">Scrivici su WhatsApp</span></div>'; scr.appendChild(d); return; }
  if (s.video) { const v = document.createElement('video'); Object.assign(v, { muted: true, loop: true, playsInline: true, autoplay: motion, preload: 'metadata', poster: s.poster }); v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.src = s.video; v.setAttribute('aria-label', `${s.name}, faqja në telefon`); scr.appendChild(v); if (motion) v.play().catch(() => {}); }
  else { const i = document.createElement('img'); i.src = s.poster; i.alt = `${s.name}, faqja`; i.style.objectPosition = 'center'; scr.appendChild(i); }
}
function show(tab) {
  const t = TABS[tab];
  $$('[data-tab]').forEach((b) => b.setAttribute('aria-selected', b.dataset.tab === tab));
  const go = () => { fill(slots.c, t.c); fill(slots.l, t.l); fill(slots.r, t.r); const s = SITES[t.c]; $('#cap').innerHTML = `<b>${s.name}</b><small class="${s.live ? 'live' : ''}">${s.state}</small>`; $('#tabnote').textContent = t.note; };
  if (motion) gsap.timeline().to('#stage .phone:not(.off), #cap', { opacity: 0, y: 14, duration: 0.22, ease: 'power2.in' }).add(go).fromTo('#stage .phone:not(.off), #cap', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06, clearProps: 'transform' });
  else go();
}
$$('[data-tab]').forEach((b) => b.addEventListener('click', () => show(b.dataset.tab)));
show('food');
// play only what is on screen
const io = new IntersectionObserver((es) => es.forEach((e) => e.target.querySelectorAll('video').forEach((v) => (e.isIntersecting && motion ? v.play().catch(() => {}) : v.pause()))), { threshold: 0.1 });
io.observe($('#stage'));

// ---------- motion: the phones lean toward the pointer, sections rise in ----------
if (motion) {
  const stage = $('#stage');
  addEventListener('pointermove', (e) => { if (innerWidth < 980) return; const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5; gsap.to(stage, { rotateY: x * 6, rotateX: -y * 5, x: x * 14, duration: 1.2, ease: 'power3.out', transformPerspective: 1200 }); }, { passive: true });
  gsap.to('.hero .rv', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08, delay: 0.1 });
  gsap.from('#stage .phone', { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', stagger: 0.1, delay: 0.25, clearProps: 'transform,opacity' });
  $$('main section:not(.hero) .rv').forEach((el) => gsap.to(el, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
} else $$('.rv').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
