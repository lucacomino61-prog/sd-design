// llms.txt: the site in plain Markdown for AI assistants that look for this file. Google has said it does not use
// it; a few other tools do, and it costs nothing. Every sentence comes from the English copy, so it says exactly
// what the pages say.
import en from '../i18n/en.js';
import { SITE, LANGS, LANG_NAME, PAGES, SERVICES, GUIDES, abs } from '../data/site.js';
import { CONTACT } from '../data/contact.js';
import { SITES, ORDER } from '../data/sites.js';
import { OFFER } from '../data/offer.js';
import { GUIDE_TEXT } from '../i18n/guides.js';

export function GET() {
  const t = en, o = t.offer;
  const contact = [
    CONTACT.whatsapp && `- WhatsApp: https://wa.me/${CONTACT.whatsapp}`,
    CONTACT.phone && `- Phone: ${CONTACT.phone}`,
    CONTACT.instagram && `- Instagram: https://instagram.com/${CONTACT.instagram}`,
    CONTACT.email && `- Email: ${CONTACT.email}`,
  ].filter(Boolean);
  const md = [
    `# ${SITE.name}`,
    '',
    `> ${t.meta.home.desc} The price of the full site is given on WhatsApp, after the draft; no prices are published.`,
    '',
    `## The free draft`,
    `[${o.h1.replace(/\.$/, '')}](${abs(PAGES.offer.en)}): ${o.lead}`,
    '',
    ...o.steps.map(([title, text], i) => `${i + 1}. ${title}: ${text}`),
    '',
    '### What to send',
    ...o.send.map((x) => `- ${x}`),
    '',
    '### The terms',
    ...o.terms.map((x) => `- ${x.replace('{m}', OFFER.perWeek)}`),
    '',
    '## Kinds of site, by difficulty',
    ...t.levels.items.map(([title, text, items, eg]) => `- ${title}: ${text} ${items.join('; ')}. Example: ${SITES[eg].name}.`),
    '',
    '## Services',
    ...SERVICES.map((k) => `- [${t.services[k].h1.replace(/\.$/, '')}](${abs(PAGES[k].en)}): ${t.services[k].lead}`),
    '',
    '## Work',
    ...ORDER.map((id) => {
      const s = SITES[id], p = t.projects[id];
      const more = PAGES[`work-${id}`] ? ` [About this site](${abs(PAGES[`work-${id}`].en)}).` : '';
      return `- ${s.url ? `[${s.name}](${s.url})` : s.name} (${p.what}, ${p.place}; ${t.states[s.state].toLowerCase()}): ${p.lede} ${p.facts.join(' ')}${more}`;
    }),
    '',
    ...(GUIDES.length ? ['## Guides', ...GUIDES.map((id) => `- [${GUIDE_TEXT.en[id].h1}](${abs(PAGES[`guide-${id}`].en)}): ${GUIDE_TEXT.en[id].answer}`), ''] : []),
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
