// Owners' words. quotes.json holds one entry for each sentence a client said or wrote and agreed to see on the site:
//
//   { "site": "martiri", "name": "Emri Mbiemri", "role": { "sq": "pronar", "en": "owner", "it": "titolare" },
//     "lang": "sq", "text": { "sq": "Fjalia e tij.", "en": "His sentence.", "it": "La sua frase." }, "ok": "2026-11-20" }
//
//   site   the client, by the name it has in sites.js
//   name   who said it; `role` is optional (one string, or one per language)
//   lang   the language it was said in; `text` must have the sentence in that language, the others are translations
//          (a page in a language without a translation shows the original, marked with its language)
//   ok     the day the client agreed to it being shown: an entry without that day is never shown
//
// The file is empty until there are real sentences. Nothing is ever written here that a client did not say.
// (QUOTES_SAMPLE='[...]' in front of a build stands in for the file, to test how the pages look with some.)
import file from './quotes.json' with { type: 'json' };
import { FEATURES } from './features.js';
import { SITES } from './sites.js';

const env = typeof process !== 'undefined' ? process.env : {};
const list = env.QUOTES_SAMPLE ? JSON.parse(env.QUOTES_SAMPLE) : file;
const words = (s) => typeof s === 'string' && s.trim().length > 0;
const valid = (q) => q && SITES[q.site] && words(q.name) && q.text && words(q.text[q.lang]) && /^\d{4}-\d{2}-\d{2}$/.test(q.ok ?? '');

export const QUOTES = FEATURES.quotes && Array.isArray(list) ? list.filter(valid) : [];
// the sentences of these clients, in the order of the file
export const quotesFor = (ids) => QUOTES.filter((q) => ids.includes(q.site));
