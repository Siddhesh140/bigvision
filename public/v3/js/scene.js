/* ============================================================
   BIG VISION v3 — "WE ENGINEER ATTENTION"
   One part on a blueprint stage. Wireframe → solid build sweep
   driven by window.__SCENE.build; energized by .glow (CTA).
   See v3/design.md §3. No post-processing — additive fakes.
   ============================================================ */

import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

window.__SCENE = window.__SCENE || {};
const S = window.__SCENE;
S.build = 1;      // part is ALWAYS fully solid (opaque logo)
S.scan = 0;       // QC inspection sweep — #spec scrubs 0→1 (ring + sparks)
S.dock = 0;       // 0 = hero pose · 1 = docked bottom-right watermark (mid-page)
S.glow = 0;       // CTA energize
S.lamp = 0;       // bat-signal work lamp: 0 dark → 1 on (main.js flickers it)
S.ready = false;
S.rotDeg = 0;     // telemetry readout

const isMobile = window.innerWidth < 1100;
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------- renderer / stage ---------- */

const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.localClippingEnabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0d12);
scene.fog = new THREE.Fog(0x0a0d12, 12, 34);

const LOGO_X = isMobile ? 0 : 1.55;

const camera = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0.4, 2.1, 7.2);

/* ---------- blueprint floor ---------- */

const gridCoarse = new THREE.GridHelper(80, 20, 0x568bff, 0x568bff);
gridCoarse.material.transparent = true;
gridCoarse.material.opacity = 0.14;
scene.add(gridCoarse);

let gridFine = null;
if (!isMobile) {
  gridFine = new THREE.GridHelper(80, 160, 0x568bff, 0x568bff);
  gridFine.material.transparent = true;
  gridFine.material.opacity = 0.06;
  scene.add(gridFine);
}

/* ---------- lights (base rig stays dark until the lamp turns on) ---------- */

const BASE = { ambient: 0.25, key: 0.9, rim: 6, under: 3 };

const ambient = new THREE.AmbientLight(0xaecbff, 0.03);
scene.add(ambient);

const key = new THREE.DirectionalLight(0xcfe0ff, 0.1);
key.position.set(-4, 6, 5);
scene.add(key);

const rim = new THREE.PointLight(0x31a2f3, 0.5, 18);
rim.position.set(3, 2.5, -3);
scene.add(rim);

const underGlow = new THREE.PointLight(0x2244cc, 0.3, 10);
underGlow.position.set(LOGO_X, 0.25, 1);
scene.add(underGlow);

/* ---------- the part ---------- */

const WING_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 29"><path d="M38.4877 0.500349L25.5117 9.79621L12.5339 0.500695C8.35591 0.462985 0 3.4647 0 15.7732C12.5339 8.5368 25.5108 21.8932 25.5108 28.5C25.5108 21.8932 38.4877 8.53646 51.0216 15.7729C51.0216 3.46435 42.6657 0.462639 38.4877 0.500349Z"/></svg>`;

const partGroup = new THREE.Group();
partGroup.position.set(LOGO_X, 1.45, 0);
scene.add(partGroup);

const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0); // keeps y <= constant

let partMinY = 0, partMaxY = 2.9; // world-space sweep bounds, refined after build
let solidMat = null;

{
  const data = new SVGLoader().parse(WING_SVG);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 6,
    bevelEnabled: true,
    bevelThickness: 0.9,
    bevelSize: 0.7,
    bevelSegments: 4,
    curveSegments: 26,
  });
  geo.center();

  const k = 0.075;

  // solid pass — opaque, brand-blue, clipped by the build plane
  solidMat = new THREE.MeshStandardMaterial({
    color: 0x2e7fe6,        // logo blue
    metalness: 0.5,
    roughness: 0.32,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.1, // reads blue even in shadow
    clippingPlanes: [clipPlane],
  });
  const solid = new THREE.Mesh(geo, solidMat);
  solid.scale.set(k, -k, k);
  partGroup.add(solid);

  // wireframe pass — faint construction-line accent only
  const edges = new THREE.EdgesGeometry(geo, 11);
  const wireMat = new THREE.LineBasicMaterial({
    color: 0x31a2f3, transparent: true, opacity: 0.16,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const wire = new THREE.LineSegments(edges, wireMat);
  wire.scale.set(k, -k, k);
  partGroup.add(wire);
  S.wireMat = wireMat;

  // world-space vertical bounds of the part (group y ± half height)
  const halfH = (29 * k) / 2 + 0.7 * k * 2;
  partMinY = partGroup.position.y - halfH - 0.05;
  partMaxY = partGroup.position.y + halfH + 0.05;
}

/* ---------- scan ring + glow disc ---------- */

const ringGroup = new THREE.Group();
ringGroup.position.x = LOGO_X;
scene.add(ringGroup);

const ringMat = new THREE.MeshBasicMaterial({
  color: 0x7dd3fc, transparent: true, opacity: 0.85,
  blending: THREE.AdditiveBlending, depthWrite: false,
});
const ring = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.012, 8, 96), ringMat);
ring.rotation.x = Math.PI / 2;
ringGroup.add(ring);

// soft glow disc under the ring (fakes bloom)
function makeGlowTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(125,211,252,0.55)');
  g.addColorStop(0.35, 'rgba(49,162,243,0.18)');
  g.addColorStop(1, 'rgba(49,162,243,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const glowTex = makeGlowTexture();
const ringGlow = new THREE.Sprite(new THREE.SpriteMaterial({
  map: glowTex, transparent: true, opacity: 0.5,
  blending: THREE.AdditiveBlending, depthWrite: false,
}));
ringGlow.scale.set(5.4, 5.4, 1);
ringGroup.add(ringGlow);

/* ---------- the work lamp (bat-signal reveal) ---------- */

// floor projector in the bottom-right, beaming UP at the part
const LAMP_POS = new THREE.Vector3(LOGO_X + (isMobile ? 1.9 : 3.1), 0.42, 2.1);
const PART_POS = new THREE.Vector3(LOGO_X, 1.45, 0);

const lampGroup = new THREE.Group();
lampGroup.position.copy(LAMP_POS);
scene.add(lampGroup);

// housing: searchlight drum aimed at the part + floor base
{
  const housingMat = new THREE.MeshStandardMaterial({ color: 0x1b2230, metalness: 0.8, roughness: 0.45 });
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.5, 24, 1, true), housingMat);
  shade.rotation.x = Math.PI / 2; // axis onto -Z so lookAt aims the opening
  lampGroup.add(shade);
  lampGroup.lookAt(PART_POS);

  // base sitting on the grid (independent of aim)
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 0.22, 16), housingMat);
  base.position.set(LAMP_POS.x, 0.11, LAMP_POS.z);
  scene.add(base);
  const yoke = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.24, 8), housingMat);
  yoke.position.set(LAMP_POS.x, 0.3, LAMP_POS.z);
  scene.add(yoke);
}

// the bulb face — glows when on
const bulbMat = new THREE.MeshBasicMaterial({ color: 0xdcecff, transparent: true, opacity: 0 });
const bulb = new THREE.Mesh(new THREE.CircleGeometry(0.22, 24), bulbMat);
bulb.position.copy(LAMP_POS).add(new THREE.Vector3().subVectors(PART_POS, LAMP_POS).normalize().multiplyScalar(0.28));
bulb.lookAt(PART_POS);
scene.add(bulb);

// spotlight from the lamp onto the part
const lampSpot = new THREE.SpotLight(0xd6e6ff, 0, 30, 0.42, 0.55, 1.2);
lampSpot.position.copy(LAMP_POS);
scene.add(lampSpot);
lampSpot.target.position.copy(PART_POS);
scene.add(lampSpot.target);

// volumetric beam cone: narrow at the lamp, wide at the part
const beamDir = new THREE.Vector3().subVectors(PART_POS, LAMP_POS);
const beamLen = beamDir.length();
const beamMat = new THREE.MeshBasicMaterial({
  color: 0x9ec8ff, transparent: true, opacity: 0,
  blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
});
const beam = new THREE.Mesh(
  new THREE.CylinderGeometry(1.7, 0.1, beamLen, 36, 1, true), // top (+Y → part) wide
  beamMat
);
beam.position.copy(LAMP_POS).add(beamDir.clone().multiplyScalar(0.5));
beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beamDir.clone().normalize());
scene.add(beam);

// glare sprite at the lamp mouth
function makeLampGlow() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(236,244,255,0.9)');
  g.addColorStop(0.3, 'rgba(158,200,255,0.35)');
  g.addColorStop(1, 'rgba(158,200,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
const lampGlare = new THREE.Sprite(new THREE.SpriteMaterial({
  map: makeLampGlow(), transparent: true, opacity: 0,
  blending: THREE.AdditiveBlending, depthWrite: false,
}));
lampGlare.position.copy(bulb.position);
lampGlare.scale.set(1.6, 1.6, 1);
scene.add(lampGlare);

/* ---------- sparks at the cut line ---------- */

const SPARKS = isMobile ? 40 : 90;
const sparkPos = new Float32Array(SPARKS * 3);
const sparkSeed = new Float32Array(SPARKS);
for (let i = 0; i < SPARKS; i++) {
  const a = Math.random() * Math.PI * 2;
  const r = 1.0 + Math.random() * 1.5;
  sparkPos[i * 3] = Math.cos(a) * r;
  sparkPos[i * 3 + 1] = 0;
  sparkPos[i * 3 + 2] = Math.sin(a) * r;
  sparkSeed[i] = Math.random() * Math.PI * 2;
}
const sparkGeo = new THREE.BufferGeometry();
sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
const sparkMat = new THREE.PointsMaterial({
  color: 0x9bdcff, size: 0.035, sizeAttenuation: true,
  transparent: true, opacity: 0.9, depthWrite: false,
  blending: THREE.AdditiveBlending,
});
const sparks = new THREE.Points(sparkGeo, sparkMat);
sparks.position.x = LOGO_X;
scene.add(sparks);

/* ---------- pointer / resize ---------- */

const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('mousemove', (e) => {
  pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
}, { passive: true });

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------- tick ---------- */

const clock = new THREE.Clock();
const lookTarget = new THREE.Vector3(LOGO_X * 0.7, 1.35, 0);

function tick() {
  requestAnimationFrame(tick);
  if (document.hidden) return;

  const t = clock.getElapsedTime();

  // pointer easing
  pointer.x = lerp(pointer.x, pointer.tx, 0.07);
  pointer.y = lerp(pointer.y, pointer.ty, 0.07);

  // camera parallax
  camera.position.x = 0.4 + pointer.x * 0.5;
  camera.position.y = 2.1 + pointer.y * 0.25;
  camera.lookAt(lookTarget);

  // front-facing; gentle cursor lean + barely-there idle sway (no spin)
  partGroup.rotation.y = lerp(partGroup.rotation.y, pointer.x * 0.26 + Math.sin(t * 0.35) * 0.03, 0.06);
  partGroup.rotation.x = lerp(partGroup.rotation.x, -pointer.y * 0.08, 0.06);
  S.rotDeg = Math.abs(partGroup.rotation.y * 180 / Math.PI);

  // part stays fully solid
  clipPlane.constant = lerp(partMinY, partMaxY, Math.min(1, Math.max(0, S.build)));

  // ----- the part travels: hero pose ↔ docked corner watermark -----
  const dock = Math.min(1, Math.max(0, S.dock));
  partGroup.position.x = LOGO_X + dock * 2.3;
  partGroup.position.y = 1.45 - dock * 0.8;
  const ps = 1 - dock * 0.62;
  partGroup.scale.setScalar(ps);
  underGlow.position.x = partGroup.position.x;

  // ----- QC inspection sweep (#spec act) -----
  const scan = Math.min(1, Math.max(0, S.scan));
  const scanY = lerp(partMinY, partMaxY, scan) + (partGroup.position.y - 1.45);
  ringGroup.position.set(partGroup.position.x, scanY, 0);
  ringGroup.scale.setScalar(ps);
  sparks.position.set(partGroup.position.x, scanY, 0);
  sparks.scale.setScalar(ps);

  const ringAlive = (scan > 0.004 && scan < 0.996) ? 1 : 0;
  const pulse = 0.5 + Math.sin(t * 6) * 0.5;
  ringMat.opacity = (0.5 + pulse * 0.5) * ringAlive;
  ringGlow.material.opacity = (0.3 + pulse * 0.25) * ringAlive;
  sparkMat.opacity = 0.9 * ringAlive;

  // spark jitter around the cut line
  const pos = sparkGeo.attributes.position;
  for (let i = 0; i < SPARKS; i++) {
    pos.array[i * 3 + 1] = Math.sin(t * 7 + sparkSeed[i]) * 0.07 + (Math.random() - 0.5) * 0.01;
  }
  pos.needsUpdate = true;

  // ----- work lamp: flickered on by main.js, subtle hum forever after.
  //       Dims while the part is docked mid-page, re-lights at the CTA -----
  const hum = 0.96 + Math.sin(t * 23) * 0.025 + Math.sin(t * 7.3) * 0.015;
  const lamp = Math.min(1, Math.max(0, S.lamp)) * hum * (1 - dock * 0.82);

  lampSpot.intensity = lamp * 70;
  beamMat.opacity = lamp * 0.085;
  bulbMat.opacity = lamp;
  lampGlare.material.opacity = lamp * 0.75;

  // base rig follows the lamp: near-black before, workshop-lit after
  ambient.intensity = BASE.ambient * (0.1 + 0.9 * lamp);
  key.intensity = BASE.key * (0.08 + 0.92 * lamp);
  rim.intensity = BASE.rim * (0.06 + 0.94 * lamp);
  gridCoarse.material.opacity = 0.14 * (0.25 + 0.75 * lamp);
  if (gridFine) gridFine.material.opacity = 0.06 * (0.25 + 0.75 * lamp);

  // energize (CTA) — docked part self-illuminates so the watermark stays logo-blue
  const g = Math.min(1, Math.max(0, S.glow));
  if (solidMat) solidMat.emissiveIntensity = (0.04 + 0.1 * lamp) + dock * 0.24 + g * 0.45;
  if (S.wireMat) S.wireMat.opacity = (0.03 + 0.13 * lamp) + g * 0.25;
  underGlow.intensity = (BASE.under * (0.08 + 0.92 * lamp)) + g * 11;

  renderer.render(scene, camera);
  if (!S.ready) S.ready = true;
}
tick();
