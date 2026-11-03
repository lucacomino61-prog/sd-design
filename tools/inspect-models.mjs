// List every model's size (metres), triangle count, meshes and materials: node tools/inspect-models.mjs [names...]
import fs from 'node:fs';
import path from 'node:path';
import { NodeIO, getBounds } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';

await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const dir = path.resolve('public/models');
const only = process.argv.slice(2);
for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.glb')).filter((n) => !only.length || only.some((o) => n.includes(o)))) {
  const doc = await io.read(path.join(dir, f));
  const root = doc.getRoot(), scene = root.getDefaultScene() || root.listScenes()[0];
  const b = getBounds(scene); const size = b.max.map((v, i) => (v - b.min[i]).toFixed(2));
  let tris = 0; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const idx = p.getIndices(); tris += (idx ? idx.getCount() : p.getAttribute('POSITION').getCount()) / 3; }
  console.log(`${f}  size ${size.join(' x ')}  min.y ${b.min[1].toFixed(2)}  tris ${Math.round(tris)}`);
  console.log('   nodes:', root.listNodes().filter((n) => n.getMesh()).map((n) => n.getName()).join(' | '));
  console.log('   materials:', root.listMaterials().map((m) => m.getName()).join(' | '));
}
