// Where a visitor came from, said in the WhatsApp message they start, so the studio can tell which profile, advert or
// search brings people without counting or following anybody. It is read once, on the page the visitor arrives at:
// from the address (utm_source, and the marks that Google, Facebook, Instagram and TikTok add to the links they
// send) or from the page that linked here. Nothing is stored, so it is known only on that first page; a visitor who
// goes on to another page first simply sends the message without the line. They see the line before sending it and
// can delete it. (The switch is `source` in src/data/features.js; with it off this file is not in the page's script.)
const NAMES = { ig: 'Instagram', instagram: 'Instagram', fb: 'Facebook', facebook: 'Facebook', meta: 'Facebook / Instagram', google: 'Google', gmb: 'Google Maps', maps: 'Google Maps', tiktok: 'TikTok', youtube: 'YouTube', whatsapp: 'WhatsApp', linkedin: 'LinkedIn', newsletter: 'newsletter', email: 'email' };
const HOSTS = [
  [/(^|\.)instagram\.com$/, 'Instagram'], [/(^|\.)(facebook|fb)\.com$|(^|\.)fb\.me$/, 'Facebook'], [/(^|\.)google\.[a-z.]{2,6}$/, 'Google'],
  [/(^|\.)bing\.com$/, 'Bing'], [/(^|\.)tiktok\.com$/, 'TikTok'], [/(^|\.)duckduckgo\.com$/, 'DuckDuckGo'], [/(^|\.)yahoo\.com$/, 'Yahoo'],
  [/(^|\.)youtube\.com$|^youtu\.be$/, 'YouTube'], [/(^|\.)linkedin\.com$|^lnkd\.in$/, 'LinkedIn'], [/^t\.co$|(^|\.)(twitter|x)\.com$/, 'X'],
];
const APPS = { 'com.google.android.googlequicksearchbox': 'Google', 'com.google.android.gm': 'Gmail', 'com.instagram.android': 'Instagram', 'com.facebook.katana': 'Facebook', 'com.zhiliaoapp.musically': 'TikTok', 'com.whatsapp': 'WhatsApp' };

// the name of where the visit came from, or '' when it is not known (or it came from this site itself)
export function arrivedFrom(address = location.href, referrer = document.referrer) {
  const here = new URL(address), q = here.searchParams;
  const utm = (q.get('utm_source') || '').trim().toLowerCase();
  if (/^[a-z0-9][a-z0-9._-]{0,29}$/.test(utm)) return NAMES[utm] || utm;
  if (q.has('gclid') || q.has('gbraid') || q.has('wbraid')) return 'Google Ads';
  if (q.has('fbclid')) return 'Facebook / Instagram';
  if (q.has('ttclid')) return 'TikTok';
  let from;
  try { from = new URL(referrer); } catch { return ''; }
  if (from.protocol === 'android-app:') return APPS[from.host] || '';
  if (!/^https?:$/.test(from.protocol) || from.hostname === here.hostname) return '';
  for (const [host, name] of HOSTS) if (host.test(from.hostname)) return name;
  // another site: its name only, never the page
  return from.hostname.replace(/^www\./, '').slice(0, 40);
}

// the line, added at the end of the message every WhatsApp button on the page starts
export function tagLinks(line) {
  const more = encodeURIComponent(`\n\n${line}`);
  for (const a of document.querySelectorAll('a[href^="https://wa.me/"][href*="?text="]')) a.href += more;
}
