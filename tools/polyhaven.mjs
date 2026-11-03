// Download Poly Haven assets (CC0) and pack them for the site.
//   node tools/polyhaven.mjs            all models, textures and the HDRI below
//   node tools/polyhaven.mjs desk lamp  only ids containing these words
// Models: 1k glTF + JPG textures -> public/models/<id>.glb (meshopt-compressed geometry).
// Textures: 1k JPGs -> public/textures/<id>/. HDRI: 1k .hdr -> public/hdri/.
import dns from 'node:dns';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
dns.setDefaultResultOrder('ipv4first');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SRC = path.join(ROOT, 'assets-src', 'polyhaven');
const MODELS = [
  'metal_office_desk', 'mid_century_lounge_chair', 'modern_arm_chair_01', 'industrial_pipe_lamp', 'modern_ceiling_lamp_01',
  'steel_frame_shelves_01', 'decorative_book_set_01', 'book_encyclopedia_set_01', 'potted_plant_01', 'potted_plant_02',
  'potted_plant_04', 'hanging_picture_frame_01', 'television_02', 'gaming_console', 'modern_wooden_cabinet', 'boombox',
  'alarm_clock_01', 'Camera_01', 'ceramic_vase_01', 'office_notepads', 'stationery_supplies', 'cassette_player',
];
const TEXTURES = ['herringbone_parquet', 'grey_plaster_02', 'fabric_pattern_07'];
const HDRI = 'art_studio';

const only = process.argv.slice(2);
const want = (id) => !only.length || only.some((w) => id.toLowerCase().includes(w.toLowerCase()));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, json = false) {
  for (let i = 0; i < 6; i++) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(60000) });
      if (!r.ok) throw new Error(`${r.status} ${url}`);
      return json ? await r.json() : Buffer.from(await r.arrayBuffer());
    } catch (e) { if (i === 5) throw e; await sleep(1500 * (i + 1)); }
  }
}
async function save(url, file) { if (fs.existsSync(file)) return; fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, await get(url)); }

const gltfCli = path.join(ROOT, 'node_modules', '@gltf-transform', 'cli', 'bin', 'cli.js');
for (const id of MODELS.filter(want)) {
  const files = await get(`https://api.polyhaven.com/files/${id}`, true);
  const g = files.gltf?.['1k']?.gltf; if (!g) { console.log('no 1k gltf:', id); continue; }
  const dir = path.join(SRC, id);
  await save(g.url, path.join(dir, path.basename(g.url)));
  for (const [rel, f] of Object.entries(g.include || {})) await save(f.url, path.join(dir, rel));
  const out = path.join(ROOT, 'public', 'models', `${id}.glb`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync(process.execPath, [gltfCli, 'meshopt', path.join(dir, path.basename(g.url)), out], { stdio: 'pipe' });
  console.log('model', id, Math.round(fs.statSync(out).size / 1024) + ' KB');
}
for (const id of TEXTURES.filter(want)) {
  const files = await get(`https://api.polyhaven.com/files/${id}`, true);
  for (const [map, key] of [['diff', 'Diffuse'], ['nor', 'nor_gl'], ['arm', 'arm'], ['rough', 'Rough']]) {
    const f = files[key]?.['1k']?.jpg; if (!f) continue;
    await save(f.url, path.join(ROOT, 'public', 'textures', id, `${map}.jpg`));
  }
  console.log('texture', id);
}
if (want(HDRI)) {
  const files = await get(`https://api.polyhaven.com/files/${HDRI}`, true);
  await save(files.hdri['1k'].hdr.url, path.join(ROOT, 'public', 'hdri', `${HDRI}_1k.hdr`));
  console.log('hdri', HDRI);
}
