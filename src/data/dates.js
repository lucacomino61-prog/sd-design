// A day (YYYY-MM-DD) written out in the site's three languages. The month names are listed here because browsers
// have no Albanian ones, and a build should not depend on what the machine it runs on happens to know.
const MONTHS = {
  sq: ['janar', 'shkurt', 'mars', 'prill', 'maj', 'qershor', 'korrik', 'gusht', 'shtator', 'tetor', 'nëntor', 'dhjetor'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  it: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
};
export const longDate = (day, lang) => {
  const [y, m, d] = day.split('-').map(Number);
  return `${d} ${MONTHS[lang][m - 1]} ${y}`;
};
