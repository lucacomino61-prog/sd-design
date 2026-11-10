// The free draft, in numbers. The owner changes two things here: how many free drafts have been given away this week
// (`taken`) and the day that was written (`updated`). The site shows what is left, and goes back to the full number
// by itself when a new week begins (Monday, Albanian time), so last week's count is never shown as this week's.
export const OFFER = {
  perWeek: 10, // free drafts a week
  hours: 24, // until the draft, counted on working days (Monday to Friday)
  taken: 0, // free drafts given away in the week of `updated`
  updated: '2026-11-10', // the day `taken` was last changed, as YYYY-MM-DD
};

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
