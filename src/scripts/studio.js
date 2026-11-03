// The studio: one room, toured by the scroll. Real models (Poly Haven, CC0), real light, one GSAP ticker for everything.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let motion = !reduce;
document.documentElement.dataset.motion = motion ? 'on' : 'off';
const $ = (s) => document.querySelector(s), $$ = (s) => [...document.querySelectorAll(s)];

// ---------- clock (Albania) ----------
const tz = 'Europe/Tirane';
const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit' });
const nowAL = () => { const p = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).formatToParts(new Date()); const g = (t) => +p.find((x) => x.type === t).value; return { h: g('hour') % 24, m: g('minute'), s: g('second') }; };
const tickClock = () => { $('#clock').textContent = fmt.format(new Date()); };
tickClock(); setInterval(tickClock, 10000);

// ---------- renderer ----------
const host = $('#gl');
const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' });
let dpr = Math.min(devicePixelRatio, 1.5);
renderer.setPixelRatio(dpr);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.shadowMap.autoUpdate = false; // the room is still: shadows are drawn once, and again only when a light changes
renderer.toneMapping = THREE.AgXToneMapping; renderer.toneMappingExposure = 1.25;
host.appendChild(renderer.domElement);
RectAreaLightUniformsLib.init();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0c0f);
scene.fog = new THREE.Fog(0x0b0c0f, 14, 26);
const camera = new THREE.PerspectiveCamera(34, innerWidth / innerHeight, 0.05, 60);
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 2 }));
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.38, 0.45, 1.0);
composer.addPass(bloom);
composer.addPass(new OutputPass());
const finish = new ShaderPass({ uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float uTime; uniform vec2 uRes; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){ vec2 d = vUv - 0.5; float v = smoothstep(0.85, 0.25, length(d * vec2(1.0, 0.9)));
      vec3 c = texture2D(tDiffuse, vUv).rgb; c *= mix(0.72, 1.0, v);
      c += (h(vUv * uRes + fract(uTime) * 91.0) - 0.5) * 0.035; gl_FragColor = vec4(c, 1.0); }` });
composer.addPass(finish);

// ---------- loading ----------
const manager = new THREE.LoadingManager();
let progress = 0; manager.onProgress = (_u, done, total) => { progress = done / total; };
// the loader counts while the room loads; it opens once the scene is built (or on Skip)
const loaderEl = $('#loader'), countEl = $('#count'), barEl = $('#barline');
let shown = 0, opened = false, sceneReady = false, skipAsked = false;
$('#skip').addEventListener('click', () => { skipAsked = true; if (sceneReady) openUp(); });
const loaderTick = () => { shown += (progress - shown) * 0.1; const n = Math.min(100, Math.round(shown * 100)); countEl.textContent = n; barEl.style.transform = `scaleX(${shown})`; if (sceneReady && (n >= 99 || skipAsked)) { gsap.ticker.remove(loaderTick); setTimeout(openUp, skipAsked ? 0 : 250); } };
gsap.ticker.add(loaderTick);
await document.fonts.load('500 128px Geist').catch(() => {});
const gltf = new GLTFLoader(manager); gltf.setMeshoptDecoder(MeshoptDecoder);
const texLoader = new THREE.TextureLoader(manager);
const loadModel = (id) => new Promise((res, rej) => gltf.load(`/models/${id}.glb`, (g) => res(g.scene), undefined, rej));
const tex = (url, srgb = false, rep = null) => { const t = texLoader.load(url); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = renderer.capabilities.getMaxAnisotropy(); if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); } return t; };

// ---------- the room ----------
const ROOM = { left: -3.4, back: -2.4, right: 4.4, front: 3.4, height: 3.1 };
function surface(id, rep, tint) {
  const m = new THREE.MeshStandardMaterial({ map: tex(`/textures/${id}/diff.jpg`, true, rep), normalMap: tex(`/textures/${id}/nor.jpg`, false, rep), roughnessMap: tex(`/textures/${id}/arm.jpg`, false, rep), metalnessMap: tex(`/textures/${id}/arm.jpg`, false, rep) });
  m.metalness = 0; if (tint) m.color.set(tint); m.normalScale.set(0.6, 0.6); return m;
}
const floorMat = surface('herringbone_parquet', [3.2, 3.2], 0x8c7c6e);
const wallMat = surface('grey_plaster_02', [2.4, 1.2], 0x47494e);
const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.right - ROOM.left, ROOM.front - ROOM.back), floorMat);
floor.rotation.x = -Math.PI / 2; floor.position.set((ROOM.left + ROOM.right) / 2, 0, (ROOM.back + ROOM.front) / 2); floor.receiveShadow = true; scene.add(floor);
const backWall = new THREE.Mesh(new THREE.PlaneGeometry(ROOM.right - ROOM.left, ROOM.height), wallMat);
backWall.position.set((ROOM.left + ROOM.right) / 2, ROOM.height / 2, ROOM.back); backWall.receiveShadow = true; scene.add(backWall);
// the left wall has a window: four panels around the opening
const WIN = { z0: -0.75, z1: 0.75, y0: 0.95, y1: 2.45 };
const leftWall = new THREE.Group(); scene.add(leftWall);
function wallPiece(z0, z1, y0, y1) { const m = new THREE.Mesh(new THREE.PlaneGeometry(z1 - z0, y1 - y0), wallMat); m.rotation.y = Math.PI / 2; m.position.set(ROOM.left, (y0 + y1) / 2, (z0 + z1) / 2); m.receiveShadow = true; leftWall.add(m); }
wallPiece(ROOM.back, WIN.z0, 0, ROOM.height); wallPiece(WIN.z1, ROOM.front, 0, ROOM.height); wallPiece(WIN.z0, WIN.z1, 0, WIN.y0); wallPiece(WIN.z0, WIN.z1, WIN.y1, ROOM.height);
const skirt = new THREE.MeshStandardMaterial({ color: 0x1c1c1f, roughness: 0.6 });
{ const a = new THREE.Mesh(new THREE.BoxGeometry(ROOM.right - ROOM.left, 0.09, 0.02), skirt); a.position.set((ROOM.left + ROOM.right) / 2, 0.045, ROOM.back + 0.01); a.receiveShadow = true; scene.add(a);
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, ROOM.front - ROOM.back), skirt); b.position.set(ROOM.left + 0.01, 0.045, (ROOM.back + ROOM.front) / 2); b.receiveShadow = true; scene.add(b); }
// window frame, glass and the night outside (Albania's sky, with a city below)
{ const metal = new THREE.MeshStandardMaterial({ color: 0x141518, roughness: 0.45, metalness: 0.7 });
  const W = WIN.z1 - WIN.z0, H = WIN.y1 - WIN.y0, cz = (WIN.z0 + WIN.z1) / 2, cy = (WIN.y0 + WIN.y1) / 2;
  for (const [w, h, y, z] of [[0.06, H + 0.06, cy, WIN.z0], [0.06, H + 0.06, cy, WIN.z1], [W, 0.06, WIN.y0, cz], [W, 0.06, WIN.y1, cz], [W, 0.035, cy + 0.15, cz], [0.035, H, cy, cz]]) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.08, h, w === 0.06 ? 0.06 : w), metal); f.position.set(ROOM.left, y, z); f.castShadow = true; scene.add(f); }
  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.04, W + 0.2), new THREE.MeshStandardMaterial({ color: 0x2a2a2d, roughness: 0.5 })); sill.position.set(ROOM.left + 0.1, WIN.y0 - 0.02, cz); sill.receiveShadow = sill.castShadow = true; scene.add(sill);
  const c = document.createElement('canvas'); c.width = 1024; c.height = 1024; const g = c.getContext('2d');
  const gr = g.createLinearGradient(0, 0, 0, 1024); gr.addColorStop(0, '#05070f'); gr.addColorStop(0.55, '#141a33'); gr.addColorStop(0.78, '#3a2a3e'); gr.addColorStop(1, '#0a0a10'); g.fillStyle = gr; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 220; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.8})`; const s = Math.random() * 1.8; g.fillRect(Math.random() * 1024, Math.random() * 560, s, s); }
  g.fillStyle = '#f4ecd8'; g.beginPath(); g.arc(700, 250, 26, 0, 7); g.fill();
  g.fillStyle = '#07080c'; for (let x = 0; x < 1024; x += 26 + Math.random() * 30) { const bh = 80 + Math.random() * 160; g.fillRect(x, 1024 - bh - 60, 24 + Math.random() * 30, bh + 60); }
  for (let i = 0; i < 260; i++) { g.fillStyle = Math.random() < 0.8 ? 'rgba(255,190,110,.9)' : 'rgba(180,210,255,.8)'; g.fillRect(Math.random() * 1024, 820 + Math.random() * 190, 3, 3); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  const out = new THREE.Mesh(new THREE.PlaneGeometry(W * 2.2, H * 2.0), new THREE.MeshBasicMaterial({ map: t, toneMapped: false, fog: false }));
  out.rotation.y = Math.PI / 2; out.position.set(ROOM.left - 1.6, cy, cz); scene.add(out);
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshPhysicalMaterial({ color: 0x9fb2c8, roughness: 0.05, metalness: 0, transmission: 0, transparent: true, opacity: 0.08, envMapIntensity: 1.5 }));
  glass.rotation.y = Math.PI / 2; glass.position.set(ROOM.left, cy, cz); scene.add(glass); }

// ---------- light ----------
const hemi = new THREE.HemisphereLight(0x8090b0, 0x1a1410, 0.35); scene.add(hemi);
const moon = new THREE.DirectionalLight(0xa9bcff, 2.1); moon.position.set(ROOM.left - 4, 4.6, 0.4); moon.target.position.set(0.5, 0, -0.2);
moon.castShadow = true; moon.shadow.mapSize.set(2048, 2048); Object.assign(moon.shadow.camera, { left: -5, right: 5, top: 5, bottom: -5, near: 0.5, far: 16 }); moon.shadow.bias = -0.0004; moon.shadow.normalBias = 0.02;
scene.add(moon, moon.target);
const lamp = new THREE.SpotLight(0xffb36a, 7, 6, 0.9, 0.9, 1.8); lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024); lamp.shadow.bias = -0.0003; lamp.shadow.normalBias = 0.02; scene.add(lamp, lamp.target);
const lampFill = new THREE.PointLight(0xffa155, 0.7, 3, 2); scene.add(lampFill);
const globe = new THREE.PointLight(0xffd6a8, 2.2, 6, 1.8); scene.add(globe);
const neonLight = new THREE.PointLight(0xff3424, 3.4, 4.2, 1.8); scene.add(neonLight);
const screenLight = new THREE.RectAreaLight(0xcfe0ff, 2.2, 0.62, 0.35); scene.add(screenLight);
const tvLight = new THREE.PointLight(0x7fb6ff, 1.2, 2.6, 2); scene.add(tvLight);

// ---------- helpers ----------
function put(obj, { x = 0, y = 0, z = 0, ry = 0, s = 1 } = {}) {
  obj.scale.setScalar(s); obj.rotation.y = ry; obj.position.set(x, 0, z); obj.updateMatrixWorld(true);
  const b = new THREE.Box3().setFromObject(obj); obj.position.y = y - b.min.y; obj.updateMatrixWorld(true);
  if (!obj.parent) scene.add(obj); return obj;
}
function shade(obj, { cast = true, receive = true, env = 0.9 } = {}) {
  obj.traverse((o) => { if (!o.isMesh) return; o.castShadow = cast; o.receiveShadow = receive; const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach((m) => { if ('envMapIntensity' in m) m.envMapIntensity = env; }); });
  return obj;
}
const byName = (root, name) => { let f = null; root.traverse((o) => { if (!f && o.name === name) f = o; }); return f; };
const matByName = (root, name) => { let f = null; root.traverse((o) => { if (f || !o.isMesh) return; const ms = Array.isArray(o.material) ? o.material : [o.material]; f = ms.find((m) => m.name === name) || null; }); return f; };
const topOf = (obj) => new THREE.Box3().setFromObject(obj).max.y;
const hot = []; // things the pointer can wake: { root, stop?, label, act? }

// ---------- canvas textures: posters, screens ----------
function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; }
const S_D = new Path2D('M160.2 405.8Q112.2 405.8 76.6 391.1Q41 376.3 21.1 347.4Q1.3 318.4 0 275.9H79.7Q81.3 296.1 91.8 309.7Q102.3 323.2 119.8 329.9Q137.2 336.7 159.3 336.7Q181.2 336.7 197.5 330.3Q213.8 323.9 222.9 312.4Q232 300.8 232 285.7Q232 271.9 223.8 262.6Q215.7 253.4 200.3 246.8Q185 240.1 163.1 234.9L119.1 224Q68.3 211.6 39.5 185.2Q10.7 158.7 10.7 115.1Q10.7 78.9 30.3 51.8Q49.8 24.7 83.8 9.7Q117.8 -5.4 161.2 -5.4Q205.6 -5.4 238.6 9.8Q271.6 25 290.1 51.9Q308.5 78.9 309.2 114H229.9Q227.6 89.9 209.4 76.7Q191.1 63.5 160.5 63.5Q139.6 63.5 124.9 69.5Q110.1 75.5 102.4 86Q94.7 96.5 94.7 109.9Q94.7 124.6 103.7 134.3Q112.6 144 127.3 150.1Q142 156.2 158.8 160.3L194.9 169.1Q220.1 174.8 241.9 184.5Q263.7 194.2 280 208.3Q296.4 222.4 305.4 241.6Q314.5 260.9 314.5 286.1Q314.5 322.5 296.2 349.4Q277.8 376.4 243.3 391.1Q208.8 405.8 160.2 405.8Z');
const D_D = new Path2D('M362.5 0H506.5A200 200 0 0 1 506.5 400H482.5L322.5 488L362.5 360Z');
function poster(word, line, bg, fg, n) {
  return canvasTex(700, 1000, (g, w, h) => {
    g.fillStyle = bg; g.fillRect(0, 0, w, h);
    g.fillStyle = fg; g.font = '500 30px Geist, sans-serif'; g.fillText(`0${n}`, 56, 92); g.textAlign = 'right'; g.fillText('SD DESIGN', w - 56, 92); g.textAlign = 'left';
    g.font = '500 128px Geist, sans-serif'; let fs = 128; while (g.measureText(word).width > w - 112) { fs -= 4; g.font = `500 ${fs}px Geist, sans-serif`; } g.fillText(word, 52, 560);
    g.font = '400 34px Geist, sans-serif'; g.globalAlpha = 0.75; g.fillText(line, 56, 625); g.globalAlpha = 1;
    g.save(); g.translate(56, h - 210); g.scale(0.28, 0.28); g.fillStyle = fg; g.fill(S_D); g.fillStyle = bg === '#e83a2c' ? '#f1ece4' : '#e83a2c'; g.fill(D_D); g.restore();
  });
}
const WORK = ['elixir', 'martiri', 'greta', 'beed', 'divjaka', 'barber', 'kater'];
const LAB = ['shah', 'hold', 'lindja'];
const shots = {};
for (const k of [...WORK, ...LAB]) { const t = tex(`/work/work-${k}.${k === 'divjaka' ? 'png' : 'jpg'}`, true); t.anisotropy = 8; shots[k] = t; }

// ---------- furniture and props ----------
const ids = ['metal_office_desk', 'mid_century_lounge_chair', 'modern_arm_chair_01', 'industrial_pipe_lamp', 'modern_ceiling_lamp_01', 'steel_frame_shelves_01', 'book_encyclopedia_set_01', 'potted_plant_01', 'potted_plant_02', 'potted_plant_04', 'hanging_picture_frame_01', 'television_02', 'gaming_console', 'modern_wooden_cabinet', 'boombox', 'alarm_clock_01', 'Camera_01', 'ceramic_vase_01', 'office_notepads', 'stationery_supplies', 'cassette_player'];
const M = {};
const hdrReady = new Promise((res) => new HDRLoader(manager).load('/hdri/art_studio_1k.hdr', (t) => { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromEquirectangular(t).texture; scene.environmentIntensity = 0.3; t.dispose(); pm.dispose(); res(); }));
await Promise.all([hdrReady, ...ids.map(async (id) => { M[id] = await loadModel(id); })]);

// desk against the back wall, monitor, lamp and the little things on it
const desk = shade(put(M.metal_office_desk, { x: -0.1, z: ROOM.back + 0.52 }));
{ const dm = matByName(desk, 'metal_office_desk'); if (dm) { dm.color.multiplyScalar(0.5); dm.roughness = Math.min(1, (dm.roughness ?? 0.5) + 0.1); } }
const deskTop = topOf(desk);
const monitor = new THREE.Group(); scene.add(monitor);
{ const alu = new THREE.MeshPhysicalMaterial({ color: 0xc4c6cb, metalness: 1, roughness: 0.3, clearcoat: 0.3 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(0.68, 0.41, 0.028, 4, 0.012), alu); body.position.y = 0.43; body.castShadow = true; monitor.add(body);
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(0.664, 0.394), new THREE.MeshStandardMaterial({ color: 0x050506, roughness: 0.15 })); bezel.position.set(0, 0.43, 0.0142); monitor.add(bezel);
  const neck = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.3, 0.012, 2, 0.005), alu); neck.position.set(0, 0.17, -0.05); neck.rotation.x = -0.18; neck.castShadow = true; monitor.add(neck);
  const foot = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.008, 0.17, 2, 0.003), alu); foot.position.set(0, 0.004, -0.02); foot.castShadow = foot.receiveShadow = true; monitor.add(foot); }
const screenMat = new THREE.ShaderMaterial({ toneMapped: false, uniforms: { a: { value: shots.elixir }, b: { value: shots.martiri }, mixV: { value: 0 }, gain: { value: 0.92 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D a, b; uniform float mixV, gain; varying vec2 vUv;
    void main(){ vec2 uv = vec2(vUv.x, 1.0 - (1.0 - vUv.y) * 0.98); float e = smoothstep(0.0, 1.0, mixV);
      vec2 ua = uv + vec2(0.0, e * 0.06), ub = uv - vec2(0.0, (1.0 - e) * 0.06);
      vec3 c = mix(texture2D(a, ua).rgb, texture2D(b, ub).rgb, e); gl_FragColor = vec4(pow(c, vec3(2.2)) * gain, 1.0); }` });
const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.63, 0.355), screenMat); screen.position.set(0, 0.435, 0.0146); monitor.add(screen);
monitor.position.set(-0.35, deskTop, ROOM.back + 0.3); monitor.rotation.y = 0.12;
const keyboard = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.012, 0.13, 2, 0.004), new THREE.MeshPhysicalMaterial({ color: 0xd9dade, metalness: 0.6, roughness: 0.35 })); keyboard.position.set(-0.3, deskTop + 0.006, ROOM.back + 0.66); keyboard.rotation.y = 0.06; keyboard.castShadow = keyboard.receiveShadow = true; scene.add(keyboard);
const pipeLamp = shade(put(M.industrial_pipe_lamp, { x: 0.62, y: deskTop, z: ROOM.back + 0.28, ry: -0.75 }));
const notes = put(M.office_notepads, { x: 0.25, y: deskTop, z: ROOM.back + 0.72, s: 0.55, ry: 0.08 }); shade(notes, { cast: false });
const pens = shade(put(M.stationery_supplies, { x: -0.92, y: deskTop, z: ROOM.back + 0.3, ry: 0.5 }));
const clock = shade(put(M.alarm_clock_01, { x: 0.58, y: deskTop, z: ROOM.back + 0.66, ry: -0.5, s: 1.15 }));
const plantSmall = shade(put(M.potted_plant_04, { x: -0.98, y: deskTop, z: ROOM.back + 0.66 }));
const chair = shade(put(M.mid_century_lounge_chair, { x: -0.05, z: ROOM.back + 1.55, ry: Math.PI + 0.35, s: 0.92 }));
// the lamp's bulb glows and lights the desk
const bulb = byName(pipeLamp, 'industrial_pipe_lamp_bulb'); const bulbGlass = matByName(pipeLamp, 'industrial_pipe_lamp_glass');
if (bulbGlass) { bulbGlass.emissive = new THREE.Color(0xffa04a); bulbGlass.emissiveIntensity = 2.4; bulbGlass.toneMapped = false; }
{ const p = new THREE.Vector3(); (bulb || pipeLamp).getWorldPosition(p); lamp.position.copy(p).add(new THREE.Vector3(0, 0.02, 0)); lamp.target.position.set(p.x - 0.55, deskTop, p.z + 0.35); lampFill.position.copy(p).add(new THREE.Vector3(0, -0.05, 0.05)); }
// the screen lights the chair
{ const p = new THREE.Vector3(); screen.getWorldPosition(p); screenLight.position.copy(p).add(new THREE.Vector3(0, 0, 0.02)); screenLight.lookAt(p.x + 0.05, p.y - 0.2, p.z + 2); }

// neon SD over the desk
const neon = new THREE.Group(); scene.add(neon);
const neonRed = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff2e22).multiplyScalar(5), toneMapped: false });
const neonWhite = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfff0dc).multiplyScalar(3.2), toneMapped: false });
{ const svg = new SVGLoader();
  const tube = (d, mat) => { const data = svg.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${d}"/></svg>`); const shape = SVGLoader.createShapes(data.paths[0])[0]; const pts = shape.getSpacedPoints(220).map((p) => new THREE.Vector3((p.x - 353) * 0.0016, -(p.y - 244) * 0.0016, 0)); const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true), 440, 0.012, 10, true), mat); neon.add(m); };
  tube('M160.2 405.8Q112.2 405.8 76.6 391.1Q41 376.3 21.1 347.4Q1.3 318.4 0 275.9H79.7Q81.3 296.1 91.8 309.7Q102.3 323.2 119.8 329.9Q137.2 336.7 159.3 336.7Q181.2 336.7 197.5 330.3Q213.8 323.9 222.9 312.4Q232 300.8 232 285.7Q232 271.9 223.8 262.6Q215.7 253.4 200.3 246.8Q185 240.1 163.1 234.9L119.1 224Q68.3 211.6 39.5 185.2Q10.7 158.7 10.7 115.1Q10.7 78.9 30.3 51.8Q49.8 24.7 83.8 9.7Q117.8 -5.4 161.2 -5.4Q205.6 -5.4 238.6 9.8Q271.6 25 290.1 51.9Q308.5 78.9 309.2 114H229.9Q227.6 89.9 209.4 76.7Q191.1 63.5 160.5 63.5Q139.6 63.5 124.9 69.5Q110.1 75.5 102.4 86Q94.7 96.5 94.7 109.9Q94.7 124.6 103.7 134.3Q112.6 144 127.3 150.1Q142 156.2 158.8 160.3L194.9 169.1Q220.1 174.8 241.9 184.5Q263.7 194.2 280 208.3Q296.4 222.4 305.4 241.6Q314.5 260.9 314.5 286.1Q314.5 322.5 296.2 349.4Q277.8 376.4 243.3 391.1Q208.8 405.8 160.2 405.8Z', neonWhite);
  tube('M362.5 40Q362.5 0 402.5 0H506.5A200 200 0 0 1 506.5 400H494.5Q482.5 400 472 405.8L333 482.2Q322.5 488 326.1 476.5L358.9 371.5Q362.5 360 362.5 348Z', neonRed);
  const plate = new THREE.Mesh(new RoundedBoxGeometry(1.32, 0.95, 0.012, 3, 0.02), new THREE.MeshPhysicalMaterial({ color: 0x223, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.18 })); plate.position.z = -0.03; neon.add(plate); }
neon.position.set(-0.15, 2.05, ROOM.back + 0.06);
neonLight.position.set(-0.05, 2.0, ROOM.back + 0.45);

// shelves in the back-left corner with books and things
const shelves = shade(put(M.steel_frame_shelves_01, { x: ROOM.left + 0.62, z: ROOM.back + 0.3, s: 0.1 }));
const SH = new THREE.Box3().setFromObject(shelves); const sh = (k) => SH.min.y + 0.035 + k * (SH.max.y - SH.min.y - 0.05) / 4;
shade(put(M.book_encyclopedia_set_01, { x: ROOM.left + 0.5, y: sh(2), z: ROOM.back + 0.3 }));
shade(put(M.Camera_01, { x: ROOM.left + 0.85, y: sh(3), z: ROOM.back + 0.32, ry: 0.7 }));
shade(put(M.ceramic_vase_01, { x: ROOM.left + 0.35, y: sh(3), z: ROOM.back + 0.3, s: 0.75 }));
shade(put(M.cassette_player, { x: ROOM.left + 0.8, y: sh(1), z: ROOM.back + 0.3, ry: 0.3 }));
const boombox = shade(put(M.boombox, { x: ROOM.left + 0.55, y: sh(0), z: ROOM.back + 0.3, s: 0.95 }));
shade(put(M.potted_plant_02, { x: ROOM.left + 0.62, y: sh(4), z: ROOM.back + 0.3, s: 0.55 }));

// the lab corner: a low cabinet along the left wall with the TV and the console
const cabinet = shade(put(M.modern_wooden_cabinet, { x: ROOM.left + 0.27, z: 2.05, ry: Math.PI / 2 }));
const cabTop = topOf(cabinet);
const tv = shade(put(M.television_02, { x: ROOM.left + 0.32, y: cabTop, z: 1.55, ry: Math.PI / 2, s: 1.35 }));
const consoleBox = shade(put(M.gaming_console, { x: ROOM.left + 0.3, y: cabTop, z: 2.35, ry: Math.PI / 2 + 0.2 }));
const crtMat = new THREE.ShaderMaterial({ toneMapped: false, uniforms: { map: { value: shots.hold }, uTime: { value: 0 }, gain: { value: 1.1 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D map; uniform float uTime, gain; varying vec2 vUv;
    void main(){ vec2 c = vUv - 0.5; c *= 1.0 + dot(c, c) * 0.22; vec2 uv = c + 0.5;
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) { gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0); return; }
      vec3 col = vec3(texture2D(map, uv + vec2(0.002, 0.0)).r, texture2D(map, uv).g, texture2D(map, uv - vec2(0.002, 0.0)).b);
      col *= 0.82 + 0.18 * sin(uv.y * 900.0 + uTime * 4.0); col *= smoothstep(0.75, 0.2, length(c)); col *= 0.96 + 0.04 * sin(uTime * 37.0);
      gl_FragColor = vec4(pow(col, vec3(2.2)) * gain, 1.0); }` });
const crt = new THREE.Mesh(new THREE.PlaneGeometry(0.33, 0.25), crtMat);
{ const b = new THREE.Box3().setFromObject(tv); crt.position.set(b.max.x + 0.002, b.min.y + (b.max.y - b.min.y) * 0.6, (b.min.z + b.max.z) / 2 - 0.035); crt.rotation.y = Math.PI / 2; scene.add(crt); tvLight.position.set(b.max.x + 0.35, crt.position.y, crt.position.z); }

// lounge: armchair, rug, a tall plant and the globe lamp
const rug = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.7), new THREE.MeshStandardMaterial({ map: tex('/textures/fabric_pattern_07/diff.jpg', true, [2, 1.4]), normalMap: tex('/textures/fabric_pattern_07/nor.jpg', false, [2, 1.4]), roughness: 0.95, color: 0x8a6f62 }));
rug.rotation.x = -Math.PI / 2; rug.position.set(2.35, 0.004, -0.55); rug.receiveShadow = true; scene.add(rug);
const armchair = shade(put(M.modern_arm_chair_01, { x: 2.0, z: -0.65, ry: 0.55 }));
const plantBig = shade(put(M.potted_plant_01, { x: 3.55, z: ROOM.back + 0.45, s: 1.0 }), { cast: true });
const ceiling = shade(M.modern_ceiling_lamp_01, { cast: false }); scene.add(ceiling);
{ const b = new THREE.Box3().setFromObject(ceiling); ceiling.position.set(2.15, ROOM.height - b.max.y + 0.02, -0.45); ceiling.updateMatrixWorld(true); const g = matByName(ceiling, 'modern_ceiling_globe'); if (g) { g.emissive = new THREE.Color(0xffd2a0); g.emissiveIntensity = 2.4; } const cb = new THREE.Box3().setFromObject(ceiling); globe.position.set(2.15, cb.min.y + 0.12, -0.45); }

// four posters on the back wall: what we do
const posterDefs = [['Websites', 'Design · front end · back end', '#f1ece4', '#141416'], ['Shops', 'Basket · checkout · admin', '#e83a2c', '#f1ece4'], ['Platforms', 'Bookings · marketplaces', '#141416', '#f1ece4'], ['Brands', 'Mark · colour · type', '#f1ece4', '#e83a2c']];
const posters = new THREE.Group(); scene.add(posters);
posterDefs.forEach(([w, l, bg, fg], i) => {
  const f = M.hanging_picture_frame_01.clone(true); f.traverse((o) => { if (o.isMesh) { o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone(); o.castShadow = true; o.receiveShadow = true; } });
  const art = matByName(f, 'hanging_picture_frame_01_artwork'); if (art) { const pt = poster(w, l, bg, fg, i + 1); pt.flipY = false; art.map = pt; art.roughness = 0.75; art.needsUpdate = true; }
  const glassM = matByName(f, 'hanging_picture_frame_01_glass'); if (glassM) { glassM.transparent = true; glassM.opacity = 0.12; glassM.roughness = 0.04; }
  f.position.set(1.52 + (i % 2) * 0.74, 2.02 - Math.floor(i / 2) * 0.96, ROOM.back + 0.02); f.scale.setScalar(1.0); posters.add(f);
});

// ---------- hotspots ----------
hot.push({ root: posters, stop: 1, label: 'What we do' }, { root: monitor, stop: 2, label: 'Open the work' }, { root: tv, stop: 3, label: 'The lab' }, { root: crt, stop: 3, label: 'The lab' }, { root: notes, stop: 4, label: 'Leave a note' },
  { root: pipeLamp, label: 'Lamp', act: () => toggleLamp() }, { root: neon, label: 'Neon', act: () => flicker() }, { root: boombox, label: 'Radio', act: () => radio() }, { root: clock, label: 'Albania time', act: () => toast(`It's ${fmt.format(new Date())} in Albania.`) });

// ---------- camera stops ----------
const anchor = (o, dy = 0) => { const b = new THREE.Box3().setFromObject(o); const c = b.getCenter(new THREE.Vector3()); c.y = b.max.y + dy; return c; };
const STOPS = [
  { p: [4.7, 3.05, 4.7], t: [0.05, 1.0, -0.95] },
  { p: [2.05, 1.55, 1.25], t: [1.9, 1.5, ROOM.back] },
  { p: [0.12, 1.32, -0.55], t: [-0.35, 1.08, ROOM.back + 0.3] },
  { p: [-1.15, 1.25, 1.95], t: [ROOM.left + 0.35, 1.0, 1.62] },
  { p: [1.05, 1.95, -0.3], t: [0.12, deskTop, ROOM.back + 0.6] },
];
const narrowTweak = () => innerWidth < 860;
const cam = { p: new THREE.Vector3(...STOPS[0].p), t: new THREE.Vector3(...STOPS[0].t) };
const camTarget = { p: cam.p.clone(), t: cam.t.clone() };

// ---------- scroll ----------
const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.lagSmoothing(0);
const chapters = $$('.chapter');
const panels = $$('[data-panel]'), tags = $$('.tag');
let stop = 0;
function stopProgress() {
  // scroll position -> fractional stop with a hold around every stop
  const max = document.documentElement.scrollHeight - innerHeight; if (max <= 0) return 0;
  const endY = chapters[chapters.length - 1].offsetTop; const y = Math.min(scrollY, endY);
  const f = (y / endY) * (STOPS.length - 1); const i = Math.floor(f), r = f - i;
  return Math.min(STOPS.length - 1, i + THREE.MathUtils.smootherstep(r, 0.3, 0.9));
}
function scrollToStop(i) { const endY = chapters[chapters.length - 1].offsetTop; lenis.scrollTo((i / (STOPS.length - 1)) * endY + (i ? 2 : 0), { duration: motion ? 2.2 : 0, easing: (x) => 1 - Math.pow(1 - x, 4) }); }
$$('[data-go]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); scrollToStop(+a.dataset.go); }));

// ---------- pointer: parallax, hover, cursor ----------
const cursor = $('#cursor'), cursorT = $('#cursor-t');
const ptr = { x: 0, y: 0, sx: 0, sy: 0, px: innerWidth / 2, py: innerHeight / 2, cx: innerWidth / 2, cy: innerHeight / 2 };
addEventListener('pointermove', (e) => { ptr.px = e.clientX; ptr.py = e.clientY; ptr.x = e.clientX / innerWidth * 2 - 1; ptr.y = -(e.clientY / innerHeight) * 2 + 1; }, { passive: true });
const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let hovered = null;
const glowMats = new Map();
function setGlow(root, on) { root.traverse((o) => { if (!o.isMesh || !o.material || !o.material.emissive) return; const ms = Array.isArray(o.material) ? o.material : [o.material]; ms.forEach((m) => { if (!glowMats.has(m)) glowMats.set(m, { c: m.emissive.clone(), i: m.emissiveIntensity }); const base = glowMats.get(m); if (m === bulbGlass) return; gsap.to(m, { emissiveIntensity: on ? base.i + 0.25 : base.i, duration: 0.4 }); if (on && base.c.getHex() === 0) m.emissive.set(0x3a2a20); else if (!on) m.emissive.copy(base.c); }); }); }
function pick() { ndc.set(ptr.px / innerWidth * 2 - 1, -(ptr.py / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); let best = null, bd = 1e9; for (const h of hot) { const hit = ray.intersectObject(h.root, true)[0]; if (hit && hit.distance < bd) { bd = hit.distance; best = h; } } return best; }
host.addEventListener('click', () => { const h = pick(); if (!h) return; if (h.act) h.act(); else scrollToStop(h.stop); });

// ---------- easter eggs ----------
const toastEl = $('#toast');
function toast(t) { toastEl.textContent = t; gsap.killTweensOf(toastEl); gsap.fromTo(toastEl, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }); gsap.to(toastEl, { opacity: 0, delay: 2.6, duration: 0.4 }); }
let lampOn = true;
function toggleLamp() { lampOn = !lampOn; gsap.to(lamp, { intensity: lampOn ? 7 : 0, duration: 0.25 }); gsap.to(lampFill, { intensity: lampOn ? 0.7 : 0, duration: 0.25 }); if (bulbGlass) gsap.to(bulbGlass, { emissiveIntensity: lampOn ? 2.4 : 0.05, duration: 0.2 }); renderer.shadowMap.needsUpdate = true; click(lampOn ? 900 : 600); }
function flicker() { const tl = gsap.timeline(); [0.05, 1, 0.2, 1, 0.02, 0.6, 1].forEach((v, i) => tl.add(() => { neonRed.color.setRGB(5 * v, 0.9 * v, 0.68 * v); neonLight.intensity = 3.4 * v; }, i * 0.07)); buzz(); }
let ac = null, sound = false, radioOn = false, radioNodes = null;
function audio() { ac ??= new AudioContext(); return ac; }
function click(f = 700) { if (!sound) return; const a = audio(), t = a.currentTime, o = a.createOscillator(), g = a.createGain(); o.frequency.value = f; o.type = 'sine'; g.gain.setValueAtTime(0.04, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08); o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.1); }
function buzz() { if (!sound) return; const a = audio(), t = a.currentTime, o = a.createOscillator(), g = a.createGain(); o.type = 'sawtooth'; o.frequency.value = 110; g.gain.setValueAtTime(0.025, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5); o.connect(g).connect(a.destination); o.start(t); o.stop(t + 0.52); }
function radio() {
  if (!sound) { sound = true; $('#snd').setAttribute('aria-pressed', 'true'); $('#snd').textContent = 'Sound on'; }
  radioOn = !radioOn; toast(radioOn ? 'Radio SD, late-night set.' : 'Radio off.');
  if (!radioOn) { radioNodes?.stop(); radioNodes = null; return; }
  const a = audio(), out = a.createGain(); out.gain.value = 0.05; const lp = a.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; out.connect(lp).connect(a.destination);
  const chords = [[261.6, 329.6, 392, 493.9], [220, 261.6, 329.6, 392], [174.6, 220, 261.6, 329.6], [196, 246.9, 293.7, 349.2]]; let k = 0;
  const play = () => { const t = a.currentTime; chords[k++ % 4].forEach((f, j) => { const o = a.createOscillator(), g = a.createGain(); o.type = j ? 'triangle' : 'sine'; o.frequency.value = f; g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.6, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + 2.3); o.connect(g).connect(out); o.start(t); o.stop(t + 2.4); }); };
  play(); const id = setInterval(play, 2400); radioNodes = { stop: () => { clearInterval(id); out.disconnect(); } };
}
$('#snd').addEventListener('click', (e) => { sound = !sound; e.currentTarget.setAttribute('aria-pressed', sound); e.currentTarget.textContent = sound ? 'Sound on' : 'Sound off'; if (!sound && radioOn) radio(); click(); });
$('#mot').addEventListener('click', (e) => { motion = !motion; document.documentElement.dataset.motion = motion ? 'on' : 'off'; e.currentTarget.setAttribute('aria-pressed', motion); e.currentTarget.textContent = motion ? 'Motion on' : 'Motion off'; });
$('#say-form').addEventListener('submit', (e) => { e.preventDefault(); const m = $('#say-msg'); if (!m.value.trim()) { m.focus(); toast('Write a line first, then send.'); return; } m.value = ''; toast('Note received. (Draft: the inbox is not connected yet.)'); });

// the work list drives the monitor; the lab list drives the TV
let shotA = 'elixir', cycle = 0, pinned = null;
function showWork(k) { if (!shots[k] || k === shotA) return; screenMat.uniforms.a.value = shots[shotA]; screenMat.uniforms.b.value = shots[k]; screenMat.uniforms.mixV.value = 0; gsap.to(screenMat.uniforms.mixV, { value: 1, duration: motion ? 0.9 : 0, ease: 'power3.inOut' }); shotA = k; click(1200); }
function showLab(k) { if (shots[k]) { crtMat.uniforms.map.value = shots[k]; click(300); } }
$$('[data-panel="2"] [data-shot]').forEach((li) => { li.addEventListener('pointerenter', () => { pinned = li.dataset.shot; showWork(pinned); }); li.addEventListener('pointerleave', () => { pinned = null; }); });
$$('[data-panel="3"] [data-shot]').forEach((li) => li.addEventListener('pointerenter', () => showLab(li.dataset.shot)));
setInterval(() => { if (pinned || !motion) return; cycle = (cycle + 1) % WORK.length; showWork(WORK[cycle]); }, 3200);
let labI = 0; setInterval(() => { if (!motion) return; labI = (labI + 1) % LAB.length; showLab(LAB[labI]); }, 4200);

// ---------- size + adaptive resolution ----------
function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); composer.setSize(w, h); bloom.setSize(w / 2, h / 2); camera.aspect = w / h; camera.fov = w < 860 ? 52 : 34; camera.updateProjectionMatrix(); finish.uniforms.uRes.value.set(w, h); }
resize(); addEventListener('resize', () => { resize(); ScrollTrigger.refresh(); });
let ftAcc = 0, ftN = 0;
function adapt(dt) { ftAcc += dt; ftN++; if (ftN < 60) return; const avg = ftAcc / ftN; ftAcc = 0; ftN = 0; const next = avg > 0.034 ? Math.max(0.6, dpr - 0.15) : avg < 0.016 ? Math.min(Math.min(devicePixelRatio, 1.75), dpr + 0.1) : dpr; if (Math.abs(next - dpr) > 0.01) { dpr = next; renderer.setPixelRatio(dpr); composer.setPixelRatio(dpr); resize(); } }

// ---------- loader, then the first move ----------
const words = $$('.hero h1 .w > span');
gsap.set(words, { yPercent: motion ? 110 : 0 });
function openUp() {
  if (opened) return; opened = true;
  gsap.to(loaderEl, { clipPath: 'inset(0 0 100% 0)', duration: motion ? 1.1 : 0, ease: 'power4.inOut', onComplete: () => loaderEl.remove() });
  if (motion) { cam.p.set(7.2, 4.6, 7.4); gsap.to(words, { yPercent: 0, duration: 1.2, ease: 'power4.out', stagger: 0.07, delay: 0.45 }); }
  else gsap.set(words, { yPercent: 0 });
}
loaderEl.style.clipPath = 'inset(0 0 0 0)';

// ---------- the one loop ----------
const v3 = new THREE.Vector3(), tagAnchors = [anchor(posters, 0.12), anchor(monitor, 0.06), anchor(tv, 0.08), anchor(notes, 0.05)];
gsap.ticker.add((time, dms) => {
  lenis.raf(time * 1000);
  const dt = Math.min(dms / 1000, 1 / 20);
  // camera: scroll picks the stop, the pointer leans it
  const f = stopProgress(); const i = Math.min(STOPS.length - 2, Math.floor(f)), r = f - i;
  const A = STOPS[i], B = STOPS[Math.min(STOPS.length - 1, i + 1)];
  camTarget.p.set(...A.p).lerp(v3.set(...B.p), r); camTarget.t.set(...A.t).lerp(v3.set(...B.t), r);
  if (narrowTweak() && i === 0 && r < 0.01) camTarget.p.add(v3.set(1.2, 0.8, 1.6));
  const k = 1 - Math.pow(0.0025, dt);
  ptr.sx += (ptr.x - ptr.sx) * (1 - Math.pow(0.02, dt)); ptr.sy += (ptr.y - ptr.sy) * (1 - Math.pow(0.02, dt));
  cam.p.lerp(camTarget.p, motion ? k : 1); cam.t.lerp(camTarget.t, motion ? k : 1);
  const lean = motion ? 1 : 0, dist = cam.p.distanceTo(cam.t);
  camera.position.copy(cam.p).add(v3.set(ptr.sx * 0.06 * dist * lean, ptr.sy * 0.035 * dist * lean, 0));
  camera.lookAt(cam.t);
  // which stop is showing
  const s = Math.round(f); if (s !== stop) { stop = s; panels.forEach((p) => p.classList.toggle('on', +p.dataset.panel === stop && Math.abs(f - stop) < 0.25)); gsap.to('.hero, .scrollhint', { autoAlpha: stop === 0 ? 1 : 0, duration: 0.5 }); }
  panels.forEach((p) => p.classList.toggle('on', +p.dataset.panel === stop && Math.abs(f - stop) < 0.25));
  // labels follow their objects in the overview
  const showTags = f < 0.2;
  tags.forEach((el, j) => { v3.copy(tagAnchors[j]).project(camera); el.style.opacity = showTags && v3.z < 1 ? 1 : 0; el.style.pointerEvents = showTags ? 'auto' : 'none'; el.style.transform = `translate(${(v3.x * 0.5 + 0.5) * innerWidth}px, ${(-v3.y * 0.5 + 0.5) * innerHeight}px)`; });
  // hover
  const h = pick(); if (h !== hovered) { if (hovered) setGlow(hovered.root, false); hovered = h; if (h) setGlow(h.root, true); cursor.classList.toggle('big', !!h); cursorT.textContent = h ? h.label : ''; host.style.cursor = h ? 'pointer' : ''; }
  ptr.cx += (ptr.px - ptr.cx) * 0.25; ptr.cy += (ptr.py - ptr.cy) * 0.25; cursor.style.transform = `translate(${ptr.cx}px, ${ptr.cy}px)`;
  // living details: the clock keeps Albania time, the neon hums, the CRT rolls
  const t = nowAL(); const hh = byName(clock, 'houd_hand'), mm = byName(clock, 'minute_hand'), ss = byName(clock, 'second_hand');
  if (mm) { mm.rotation.z = -(t.m / 60) * Math.PI * 2; hh.rotation.z = -((t.h % 12) / 12 + t.m / 720) * Math.PI * 2; ss.rotation.z = -(t.s / 60) * Math.PI * 2; }
  if (motion) neonLight.intensity = 3.4 + Math.sin(time * 9.0) * 0.08;
  crtMat.uniforms.uTime.value = time; finish.uniforms.uTime.value = time;
  adapt(dt);
  composer.render();
});
renderer.shadowMap.needsUpdate = true;
sceneReady = true;
