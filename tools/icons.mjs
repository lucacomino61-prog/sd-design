// Copies the Phosphor icons the site uses (MIT, @phosphor-icons/core) into src/icons, so the build reads plain files.
// Small UI glyphs use the regular weight; the large feature icons use light, so both draw about a 1.5-2 px line.
// Run after changing the list: node tools/icons.mjs
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'node_modules/@phosphor-icons/core/assets';
const OUT = 'src/icons';
const ICONS = {
  regular: ['whatsapp-logo', 'arrow-up-right', 'arrow-right', 'arrow-down', 'x'],
  light: ['coffee'],
};

fs.mkdirSync(OUT, { recursive: true });
for (const [weight, names] of Object.entries(ICONS)) {
  for (const name of names) {
    const file = weight === 'regular' ? `${name}.svg` : `${name}-${weight}.svg`;
    fs.copyFileSync(path.join(SRC, weight, file), path.join(OUT, `${name}.svg`));
  }
}
fs.writeFileSync(path.join(OUT, 'LICENSE.md'), 'Icons from Phosphor (https://phosphoricons.com), MIT licence, copied by tools/icons.mjs.\n');
console.log('copied', Object.values(ICONS).flat().length, 'icons to', OUT);
