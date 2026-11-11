// The free draft, in numbers. The numbers themselves are in offer.json, which the admin tool writes (it is a separate
// program, not part of this site) and which can also be changed by hand:
//   perWeek  free drafts a week
//   hours    until the draft, counted on working days (Monday to Friday)
//   taken    free drafts given away in the week of `updated`
//   updated  the day `taken` was last changed, as YYYY-MM-DD
// `perWeek` and `hours` are promises: the sentences in src/i18n say them too, so change them together.
// The site shows what is left, and goes back to the full number by itself when a new week begins (Monday, Albanian
// time), so last week's count is never shown as this week's.
import numbers from './offer.json' with { type: 'json' };

export const OFFER = numbers;

// the Monday of the week a day (YYYY-MM-DD) falls in
export const monday = (day) => {
  const d = new Date(`${day}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
};
// today's date in Albania, wherever the visitor (or the build) is
export const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Tirane', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
// how many free drafts are left in the week of `day`
export const left = (o = OFFER, day = today()) => (monday(day) === monday(o.updated) ? Math.max(0, Math.min(o.perWeek, o.perWeek - o.taken)) : o.perWeek);
