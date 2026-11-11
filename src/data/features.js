// Switches. Each addition to the site can be turned off here without touching anything else: `false` takes its pages
// out of the menus, the sitemap and the build, or leaves its block out of the pages. Build again after changing one.
// (FEATURES_OFF=projects,... in front of a build turns some off for that build only: tools/switches.mjs uses it to
// prove that the site is whole with each one off.)
const env = typeof process !== 'undefined' ? process.env : {};
const off = new Set(String(env.FEATURES_OFF || '').split(',').map((s) => s.trim()).filter(Boolean));
const on = (flags) => Object.fromEntries(Object.entries(flags).map(([name, value]) => [name, value && !off.has(name)]));

export const FEATURES = on({
  projects: true, // a page of its own for each client site that is online
  guides: true, // the guides (what a site costs, Instagram or a site, bookings without commission) and their index
  grants: true, // the guide about public funds (needs `guides`): its facts carry the day they were checked
  calculator: true, // the commission calculator on the hotel and restaurant pages
});
