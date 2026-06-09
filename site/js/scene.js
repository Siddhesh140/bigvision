/* ============================================================
   BIG VISION — WebGL scene
   Night sky · storm-cloud deck · 3D wing logo · signal beam
   Camera is driven by window.__SCENE.dive / .rise (set by main.js)
   ============================================================ */

import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

// Shared state — main.js writes scroll progress here
window.__SCENE = window.__SCENE || {};
const S = window.__SCENE;
S.dive = 0;      // 0..1 hero → below the clouds
S.rise = 0;      // 0..1 below → back above the clouds (CTA)
S.ready = false;

const isMobile = window.innerWidth < 768;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

/* ---------- renderer ---------- */

const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x06080f);
scene.fog = new THREE.Fog(0x06080f, 14, 46);

const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 220);
camera.position.set(0, 0.8, 14);

/* ---------- lights ---------- */

scene.add(new THREE.AmbientLight(0x8aa2cc, 0.22));

const keyLight = new THREE.DirectionalLight(0x9db8e8, 0.45);
keyLight.position.set(-6, 9, 7);
scene.add(keyLight);

// subtle electric glow buried in the cloud deck (the beam's source)
const cloudGlow = new THREE.PointLight(0x1d6ff2, 9, 18, 1.8);
cloudGlow.position.set(0, -5.6, 0.4);
scene.add(cloudGlow);

// narrow signal light aimed up at the logo
const signal = new THREE.SpotLight(0x38bdf8, 38, 26, 0.32, 0.9);
signal.position.set(0, -5.6, 0.4);
scene.add(signal);
signal.target.position.set(0, 2.2, 0);
scene.add(signal.target);

// soft fill near the logo
const fill = new THREE.PointLight(0x4f7df0, 5, 14);
fill.position.set(0, 4.5, 5);
scene.add(fill);

/* ---------- stars ---------- */

function makeStars(count, radius) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = radius * (0.55 + 0.45 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = Math.abs(r * Math.cos(phi)) * 0.8 - 6; // bias upward hemisphere
    pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xbcd2ff, size: 0.16, sizeAttenuation: true,
    transparent: true, opacity: 0.85, depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}
const stars = makeStars(isMobile ? 900 : 2200, 90);
scene.add(stars);

/* ---------- floating particles near the logo ---------- */

function makeSparkles(count) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 22;
    pos[i * 3 + 1] = Math.random() * 9 - 2;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: 0x7dd3fc, size: 0.07, sizeAttenuation: true,
    transparent: true, opacity: 0.6, depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geo, mat);
}
const sparkles = makeSparkles(isMobile ? 60 : 140);
scene.add(sparkles);

/* ---------- procedural cloud sprites ---------- */

function makeCloudTexture(seed) {
  const sz = 256;
  const c = document.createElement('canvas');
  c.width = c.height = sz;
  const ctx = c.getContext('2d');
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  // horizontal band of overlapping puffs → stratus-like wisp, not a round blob
  for (let i = 0; i < 64; i++) {
    const x = sz * (0.1 + rnd() * 0.8);
    const y = sz * (0.38 + rnd() * 0.26 + Math.sin(x / sz * Math.PI) * -0.06);
    const r = sz * (0.05 + rnd() * 0.13);
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const a = 0.04 + rnd() * 0.09;
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(0.55, `rgba(255,255,255,${a * 0.45})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, sz, sz);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const cloudTextures = [makeCloudTexture(7), makeCloudTexture(101), makeCloudTexture(977)];
const cloudGroup = new THREE.Group();
const cloudSprites = [];

function addCloud(x, y, z, scale, tint, opacity) {
  const mat = new THREE.SpriteMaterial({
    map: cloudTextures[Math.floor(Math.random() * cloudTextures.length)],
    color: tint,
    transparent: true,
    opacity,
    depthWrite: false,
    rotation: Math.random() * Math.PI * 2,
  });
  const sp = new THREE.Sprite(mat);
  sp.position.set(x, y, z);
  sp.scale.set(scale * 1.9, scale * 0.8, 1); // wide, flat cloud bodies
  sp.userData = {
    baseX: x,
    drift: 0.12 + Math.random() * 0.3,
    phase: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.015,
  };
  cloudGroup.add(sp);
  cloudSprites.push(sp);
}

// main storm deck below the logo
const deckCount = isMobile ? 22 : 46;
for (let i = 0; i < deckCount; i++) {
  const x = (Math.random() - 0.5) * 56;
  const y = -7 + (Math.random() - 0.5) * 3.4;
  const z = (Math.random() - 0.5) * 16;
  const scale = 9 + Math.random() * 14;
  const shade = Math.random();
  const tint = new THREE.Color().lerpColors(new THREE.Color(0x0a101e), new THREE.Color(0x223354), shade);
  addCloud(x, y, z, scale, tint, 0.5 + Math.random() * 0.3);
}
// high framing wisps
for (let i = 0; i < (isMobile ? 4 : 10); i++) {
  const x = (Math.random() - 0.5) * 70;
  const y = 9 + Math.random() * 8;
  const z = -14 - Math.random() * 12;
  addCloud(x, y, z, 12 + Math.random() * 12, new THREE.Color(0x0a0f1c), 0.28);
}
scene.add(cloudGroup);

/* ---------- 3D wing logo (extruded from brand SVG) ---------- */

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 29"><path d="M38.4877 0.500349L25.5117 9.79621L12.5339 0.500695C8.35591 0.462985 0 3.4647 0 15.7732C12.5339 8.5368 25.5108 21.8932 25.5108 28.5C25.5108 21.8932 38.4877 8.53646 51.0216 15.7729C51.0216 3.46435 42.6657 0.462639 38.4877 0.500349Z"/></svg>`;

const logoGroup = new THREE.Group();
logoGroup.position.set(0, 2.2, 0);
scene.add(logoGroup);
let logoMat = null;

{
  const data = new SVGLoader().parse(LOGO_SVG);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 5,
    bevelEnabled: true,
    bevelThickness: 1.1,
    bevelSize: 0.85,
    bevelSegments: 5,
    curveSegments: 28,
  });
  geo.center();
  const mat = new THREE.MeshStandardMaterial({
    color: 0x16233a,
    metalness: 0.9,
    roughness: 0.24,
    emissive: 0x1d4ed8,
    emissiveIntensity: 0.08,
  });
  logoMat = mat;
  const mesh = new THREE.Mesh(geo, mat);
  const k = 0.155;
  mesh.scale.set(k, -k, k); // flip Y (SVG space is y-down)
  logoGroup.add(mesh);
}

/* ---------- signal beam ---------- */

// The signal rises from a single bright point in the clouds up to the logo.
const BEAM_SRC = new THREE.Vector3(0, -5.6, 0.4); // source point (in cloud deck)
const BEAM_DST = new THREE.Vector3(0, 2.2, 0);    // logo
const beamLen = BEAM_SRC.distanceTo(BEAM_DST);

const beamGroup = new THREE.Group();
beamGroup.position.copy(BEAM_SRC).add(BEAM_DST).multiplyScalar(0.5);
beamGroup.lookAt(BEAM_DST);
beamGroup.rotateX(Math.PI / 2); // cylinder Y-axis onto src→dst line
scene.add(beamGroup);

// outer haze — barely-there, widens toward the logo
const beamOuterMat = new THREE.MeshBasicMaterial({
  color: 0x38bdf8, transparent: true, opacity: 0.03,
  blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
});
const beamOuter = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 0.07, beamLen, 40, 1, true), beamOuterMat);
beamGroup.add(beamOuter);

// tight bright core
const beamInnerMat = new THREE.MeshBasicMaterial({
  color: 0x7dd3fc, transparent: true, opacity: 0.1,
  blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
});
const beamInner = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.035, beamLen, 28, 1, true), beamInnerMat);
beamGroup.add(beamInner);

// glowing point where the light is born
const sourceOrbMat = new THREE.MeshBasicMaterial({ color: 0xbfe6ff });
const sourceOrb = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), sourceOrbMat);
sourceOrb.position.copy(BEAM_SRC);
scene.add(sourceOrb);

// pulse of light that travels up the beam and ignites the logo
const pulseOrbMat = new THREE.MeshBasicMaterial({
  color: 0xd6efff, transparent: true, opacity: 0.95,
  blending: THREE.AdditiveBlending, depthWrite: false,
});
const pulseOrb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), pulseOrbMat);
scene.add(pulseOrb);
const PULSE_PERIOD = 3.2;   // seconds per pulse cycle
const PULSE_TRAVEL = 0.62;  // fraction of cycle spent travelling

/* ---------- post-processing ---------- */

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  isMobile ? 0.4 : 0.55, // strength
  0.7,                   // radius
  0.3                    // threshold
);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ---------- pointer ---------- */

const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
window.addEventListener('mousemove', (e) => {
  pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1);
}, { passive: true });

/* ---------- resize ---------- */

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

/* ---------- animate ---------- */

const clock = new THREE.Clock();
const look = new THREE.Vector3();

function tick() {
  requestAnimationFrame(tick);
  if (document.hidden) return;

  const t = clock.getElapsedTime();
  const dt = Math.min(clock.getDelta() + 0.016, 0.05);

  // pointer easing
  pointer.x = lerp(pointer.x, pointer.tx, 0.06);
  pointer.y = lerp(pointer.y, pointer.ty, 0.06);

  // ----- camera: hero → dive below clouds → rise back at CTA -----
  const dive = smooth(S.dive);
  const rise = smooth(S.rise);

  let cy = lerp(0.8, -36, dive);
  let cz = lerp(14, 10, dive);
  let ly = lerp(1.5, -38, dive);

  cy = lerp(cy, 1.6, rise);
  cz = lerp(cz, 15.5, rise);
  ly = lerp(ly, 2.0, rise);

  camera.position.x = lerp(camera.position.x, pointer.x * 1.3, 0.08);
  camera.position.y = lerp(camera.position.y, cy + pointer.y * 0.5, 0.1);
  camera.position.z = lerp(camera.position.z, cz, 0.1);
  look.set(0, ly, 0);
  camera.lookAt(look);

  // ----- logo: float + face the cursor -----
  logoGroup.position.y = 2.2 + Math.sin(t * 0.9) * 0.28;
  logoGroup.rotation.y = lerp(logoGroup.rotation.y, pointer.x * 0.4 + Math.sin(t * 0.4) * 0.06, 0.06);
  logoGroup.rotation.x = lerp(logoGroup.rotation.x, -pointer.y * 0.16, 0.06);

  // ----- signal: pulse travels from the source up to the logo -----
  const cycle = (t % PULSE_PERIOD) / PULSE_PERIOD; // 0..1
  let flare = 0;
  if (cycle < PULSE_TRAVEL) {
    // travelling: orb moves up the beam, beam brightens behind it
    const u = cycle / PULSE_TRAVEL;
    pulseOrb.visible = true;
    pulseOrb.position.lerpVectors(BEAM_SRC, BEAM_DST, u);
    pulseOrbMat.opacity = 0.9 * (1 - u * 0.35);
    beamInnerMat.opacity = 0.06 + u * 0.07;
    beamOuterMat.opacity = 0.02 + u * 0.025;
  } else {
    // arrived: logo flares, then decays until the next pulse
    const v = (cycle - PULSE_TRAVEL) / (1 - PULSE_TRAVEL); // 0..1
    pulseOrb.visible = false;
    flare = Math.pow(1 - v, 2.2);
    beamInnerMat.opacity = 0.05 + flare * 0.05;
    beamOuterMat.opacity = 0.018 + flare * 0.02;
  }
  if (logoMat) logoMat.emissiveIntensity = 0.08 + flare * 0.85;
  fill.intensity = 4 + flare * 14;

  // source point breathes gently
  const breathe = 0.85 + Math.sin(t * 2.1) * 0.15;
  sourceOrb.scale.setScalar(breathe);
  cloudGlow.intensity = 7 + breathe * 3 + flare * 8;

  // ----- clouds drift -----
  for (const sp of cloudSprites) {
    const u = sp.userData;
    sp.position.x = u.baseX + Math.sin(t * 0.05 * u.drift * 10 + u.phase) * 1.6;
    sp.material.rotation += u.spin * dt;
  }

  // ----- stars / sparkles -----
  stars.rotation.y = t * 0.004;
  sparkles.rotation.y = t * 0.02;
  sparkles.position.y = Math.sin(t * 0.5) * 0.4;

  composer.render();

  if (!S.ready) S.ready = true;
}
tick();
