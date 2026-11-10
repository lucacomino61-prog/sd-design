// llms.txt: the site in plain Markdown for AI assistants that look for this file. Google has said it does not use
// it; a few other tools do, and it costs nothing. Every sentence comes from the English copy, so it says exactly
// what the pages say.
import en from '../i18n/en.js';
import { SITE, LANGS, LANG_NAME, PAGES, SERVICES, abs } from '../data/site.js';
import { CONTACT } from '../data/contact.js';
import { SITES, ORDER } from '../data/sites.js';

export function GET() {
  const t = en;
  const contact = [
    CONTACT.whatsapp && `- WhatsApp: https://wa.me/${CONTACT.whatsapp}`,
    CONTACT.phone && `- Phone: ${CONTACT.phone}`,
    CONTACT.instagram && `- Instagram: https://instagram.com/${CONTACT.instagram}`,
    CONTACT.email && `- Email: ${CONTACT.email}`,
  ].filter(Boolean);
  const md = [
    `# ${SITE.name}`,
    '',
    `> ${t.meta.home.desc} Quotes are given on WhatsApp; no prices are published.`,
    '',
    '## Services',
    ...SERVICES.map((k) => `- [${t.services[k].h1.replace(/\.$/, '')}](${abs(PAGES[k].en)}): ${t.services[k].lead}`),
    '',
    '## Work',
    ...ORDER.map((id) => {
      const s = SITES[id], p = t.projects[id];
      return `- ${s.url ? `[${s.name}](${s.url})` : s.name} (${p.what}, ${p.place}; ${t.states[s.state].toLowerCase()}): ${p.lede} ${p.facts.join(' ')}`;
    }),
    '',
    '## How it works',
    ...t.home.steps.items.map(([title, text], i) => `${i + 1}. ${title}: ${text}`),
    '',
    '## Questions',
    ...t.home.faq.items.flatMap(([q, a]) => [`### ${q}`, a, '']),
    '## Languages',
    ...LANGS.map((l) => `- [${LANG_NAME[l]}](${abs(PAGES.home[l])})`),
    '',
    '## Contact',
    ...(contact.length ? contact : ['- The contact details are on the site.']),
    '',
  ].join('\n');
  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
}
