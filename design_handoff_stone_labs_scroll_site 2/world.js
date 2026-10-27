// Stone Labs — one persistent WebGL scene for the whole homepage journey.
// Hero sculpture → service turntable → project showcases → process cycle → closing halo.
const THREE = await (async () => { for (const u of ['https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js', 'https://unpkg.com/three@0.160.0/build/three.module.js']) { try { return await import(u); } catch (e) { console.warn('three load failed', u); } } throw new Error('three.js failed to load'); })();

// Logo outlines traced from assets/logo.png (1254px artboard). Two interlocking stones.
const TOP = [[150,620],[150,500,220,420,330,330],[480,210,650,125,830,125],[980,125,1090,230,1090,355],[1090,440,1040,478,930,478],[760,485,640,520,520,610],[420,690,360,755,260,755],[190,755,150,700,150,620]];
const BOT = [[170,865],[165,815,215,797,290,790],[450,775,560,720,660,625],[750,550,820,520,905,520],[1050,520,1095,620,1095,720],[1095,850,1030,975,950,1060],[870,1130,770,1142,660,1142],[510,1142,330,1060,230,985],[195,955,172,910,170,865]];
const CX = 622, CY = 633, S = 1 / 430;
const tx = (x) => (x - CX) * S, ty = (y) => -(y - CY) * S;
const DISPLAY = '"Clash Display", "Helvetica Neue", Arial, sans-serif', TEXT = 'Satoshi, "Helvetica Neue", Arial, sans-serif';
export const RIM_R = 2.17, ITEM_R = 1.5;

function shapeFrom(pts) {
  const s = new THREE.Shape();
  s.moveTo(tx(pts[0][0]), ty(pts[0][1]));
  for (let i = 1; i < pts.length; i++) { const p = pts[i]; s.bezierCurveTo(tx(p[0]), ty(p[1]), tx(p[2]), ty(p[3]), tx(p[4]), ty(p[5])); }
  return s;
}
function stoneGeo(pts) {
  const g = new THREE.ExtrudeGeometry(shapeFrom(pts), { depth: 0.2, curveSegments: 72, bevelEnabled: true, bevelThickness: 0.17, bevelSize: 0.065, bevelOffset: -0.065, bevelSegments: 12 });
  g.translate(0, 0, -0.1); g.computeVertexNormals(); return g;
}
function hash(x, y, z) { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1274126177); h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16; return (h >>> 0) / 4294967295; }
function vnoise(x, y, z) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf), l = (a, b, t) => a + (b - a) * t;
  return l(l(l(hash(xi,yi,zi),hash(xi+1,yi,zi),u),l(hash(xi,yi+1,zi),hash(xi+1,yi+1,zi),u),v),
           l(l(hash(xi,yi,zi+1),hash(xi+1,yi,zi+1),u),l(hash(xi,yi+1,zi+1),hash(xi+1,yi+1,zi+1),u),v),w);
}
function fbm(x, y, z) { let a = 0.5, f = 1, s = 0; for (let i = 0; i < 6; i++) { s += a * (1 - Math.abs(vnoise(x*f, y*f, z*f) * 2 - 1)); a *= 0.5; f *= 2.07; } return s; }
function rockGeo(seed, detail) {
  const g = new THREE.IcosahedronGeometry(1, detail);
  const p = g.attributes.position, c = new Float32Array(p.count * 3), v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i).normalize();
    const n = fbm(v.x * 1.7 + seed, v.y * 2.4 + seed * 2, v.z * 1.7 - seed);
    const r = 0.72 + n * 0.42 + Math.sin(v.y * 9 + n * 4) * 0.035;
    p.setXYZ(i, v.x * r, v.y * r, v.z * r);
    const t = Math.min(1, Math.max(0, (n - 0.45) * 1.6)), k = 0.07 + t * 0.12 + vnoise(v.x * 30, v.y * 30, v.z * 30) * 0.04;
    c[i*3] = k * 1.04; c[i*3+1] = k; c[i*3+2] = k * 0.95;
  }
  g.setAttribute('color', new THREE.BufferAttribute(c, 3)); g.computeVertexNormals(); return g;
}
function studioEnv(renderer) {
  const sc = new THREE.Scene();
  sc.add(new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x1a1a1a, side: THREE.BackSide })));
  const panel = (w, h, x, y, z, ry, rx, k) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(k, k, k * 0.97), side: THREE.DoubleSide }));
    m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0); sc.add(m);
  };
  panel(12, 2.2, 0, 8, 0, 0, Math.PI / 2, 3.2); panel(2, 10, -9, 1, 2, Math.PI / 2, 0, 2.2);
  panel(1.2, 10, 9, 0, -2, -Math.PI / 2, 0, 1.4); panel(14, 6, 0, -2, -9.5, 0, 0, 0.9); panel(8, 1.2, 0, -6, 6, 0, -Math.PI / 3, 0.6);
  const pm = new THREE.PMREMGenerator(renderer), tex = pm.fromScene(sc, 0.04).texture; pm.dispose();
  sc.traverse(o => { o.geometry && o.geometry.dispose(); o.material && o.material.dispose(); });
  return tex;
}
function shadowTex() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const x = c.getContext('2d'), g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(17,17,17,0.55)'); g.addColorStop(0.5, 'rgba(17,17,17,0.18)'); g.addColorStop(1, 'rgba(17,17,17,0)');
  x.fillStyle = g; x.fillRect(0, 0, 256, 256); return new THREE.CanvasTexture(c);
}
function rr(w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r); s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h); s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
}
function rbox(w, h, d, r, b) {
  const g = new THREE.ExtrudeGeometry(rr(w - 2 * b, h - 2 * b, Math.max(0.002, r - b)), { depth: d - 2 * b, bevelEnabled: true, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 10 });
  g.translate(0, 0, -(d - 2 * b) / 2); g.computeVertexNormals(); return g;
}
function screenGeo(w, h, r) {
  const g = new THREE.ShapeGeometry(rr(w, h, r), 12), p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) uv.setXY(i, (p.getX(i) + w / 2) / w, (p.getY(i) + h / 2) / h);
  return g;
}
function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function rrect(x, X, Y, W, H, R) { x.beginPath(); if (x.roundRect) x.roundRect(X, Y, W, H, R); else x.rect(X, Y, W, H); }

// Procedural screen content — shown until real work is set in stone-data.js (projects[].screen / .video)
function drawWeb(x, W, H, p) {
  x.fillStyle = '#F5F5F2'; x.fillRect(0, 0, W, H); x.fillStyle = '#111';
  x.font = '600 24px ' + TEXT; x.fillText('Atelier North', 56, 72);
  ['Work', 'Studio', 'Journal', 'Contact'].forEach((s, i) => { x.font = '500 20px ' + TEXT; x.fillText(s, 560 + i * 110, 72); });
  x.fillRect(56, 104, W - 112, 1.5);
  x.font = '500 124px ' + DISPLAY; x.fillText('Spaces that', 50, 290); x.fillText('hold attention.', 50, 416);
  x.fillStyle = '#6b6760'; x.font = '400 24px ' + TEXT;
  x.fillText('An editorial website for a design-led practice —', 56, 492); x.fillText('built for slow reading and fast loading.', 56, 528);
  let g = x.createLinearGradient(0, 590, 0, 1170); g.addColorStop(0, '#d6d0c6'); g.addColorStop(1, '#77726b'); x.fillStyle = g; x.fillRect(56, 590, W - 112, 580);
  x.fillStyle = '#ebe7e0'; x.fillRect(170, 780, 690, 22); x.fillStyle = '#2b2927'; x.fillRect(210, 802, 610, 368);
  x.fillStyle = 'rgba(245,245,242,.28)'; for (let i = 0; i < 6; i++) x.fillRect(240 + i * 98, 836, 58, 300);
  x.fillStyle = '#111'; x.font = '500 18px ' + TEXT; x.fillText('01 — House on the Ridge', 56, 1210); x.fillText('2026', W - 104, 1210);
  ['#d6d0c6', '#292929', '#a7a198'].forEach((c, i) => {
    const cx = 56 + i * 312; x.fillStyle = c; x.fillRect(cx, 1260, 288, 360);
    x.fillStyle = '#111'; x.font = '500 28px ' + DISPLAY; x.fillText(['Courtyard', 'Pavilion', 'Gallery'][i], cx, 1664);
    x.fillStyle = '#8a857d'; x.font = '400 18px ' + TEXT; x.fillText('Residential · 2025', cx, 1694);
  });
  x.fillStyle = '#111'; x.fillRect(0, 1760, W, H - 1760); x.fillStyle = '#F5F5F2'; x.font = '500 72px ' + DISPLAY; x.fillText('Start a conversation', 56, 1880);
  x.font = '400 20px ' + TEXT; x.fillStyle = '#BFC3C7'; x.fillText('studio@atelier-north.com', 56, 1930);
}
function drawApp(x, W, H) {
  x.fillStyle = '#F5F5F2'; x.fillRect(0, 0, W, H); x.fillStyle = '#111';
  x.font = '600 22px ' + TEXT; x.fillText('9:41', 40, 50); x.fillRect(W - 92, 34, 52, 18);
  x.font = '500 58px ' + DISPLAY; x.fillText('Today', 32, 150);
  x.font = '400 20px ' + TEXT; x.fillStyle = '#6b6760'; x.fillText('Wednesday, 14 October', 32, 186);
  ['All', 'Focus', 'Studio', 'Saved'].forEach((s, i) => {
    const X = 32 + i * 112; rrect(x, X, 214, 100, 44, 22);
    if (i === 0) { x.fillStyle = '#111'; x.fill(); x.fillStyle = '#F5F5F2'; } else { x.strokeStyle = '#111'; x.lineWidth = 1.5; x.stroke(); x.fillStyle = '#111'; }
    x.font = '500 18px ' + TEXT; x.fillText(s, X + 22, 242);
  });
  let g = x.createLinearGradient(0, 290, 0, 600); g.addColorStop(0, '#3a3936'); g.addColorStop(1, '#111'); x.fillStyle = g; rrect(x, 32, 290, 448, 310, 26); x.fill();
  x.fillStyle = '#F5F5F2'; x.font = '500 34px ' + DISPLAY; x.fillText('Morning session', 60, 520);
  x.fillStyle = '#BFC3C7'; x.font = '400 18px ' + TEXT; x.fillText('45 min · Guided', 60, 552);
  x.fillStyle = 'rgba(245,245,242,.25)'; x.fillRect(60, 574, 392, 3); x.fillStyle = '#F5F5F2'; x.fillRect(60, 574, 160, 3);
  for (let i = 0; i < 5; i++) {
    const Y = 640 + i * 112; x.fillStyle = ['#d6d0c6', '#a7a198', '#292929', '#c9c3b9', '#77726b'][i];
    rrect(x, 32, Y, 76, 76, 18); x.fill(); x.fillStyle = '#111'; x.font = '500 24px ' + TEXT;
    x.fillText(['Deep work', 'Walk & think', 'Studio review', 'Reading', 'Wind down'][i], 128, Y + 34);
    x.fillStyle = '#8a857d'; x.font = '400 18px ' + TEXT; x.fillText(['25 min', '40 min', '1 h', '30 min', '15 min'][i], 128, Y + 62);
    x.fillStyle = '#e1ddd5'; x.fillRect(32, Y + 94, 448, 1);
  }
  x.fillStyle = '#e4e0d8'; rrect(x, 32, 1220, 448, 300, 26); x.fill();
  x.fillStyle = '#111'; x.font = '500 28px ' + DISPLAY; x.fillText('This week', 60, 1268);
  [0.4, 0.7, 0.55, 0.9, 0.62, 0.3, 0.8].forEach((v, i) => x.fillRect(64 + i * 58, 1490 - v * 180, 30, v * 180));
}
function drawMotion(x, W, H, t) {
  x.fillStyle = '#0d0d0d'; x.fillRect(0, 0, W, H);
  x.fillStyle = 'rgba(191,195,199,.08)'; for (let i = 1; i < 8; i++) x.fillRect(i * 128, 0, 1, H);
  const cx = W * 0.7, cy = H * 0.48;
  for (let i = 0; i < 7; i++) {
    const r = 46 + i * 30, a0 = t * (0.35 + i * 0.12) * (i % 2 ? 1 : -1) + i;
    x.strokeStyle = i === 3 ? '#F5F5F2' : 'rgba(245,245,242,' + (0.22 + i * 0.07) + ')'; x.lineWidth = i === 3 ? 3 : 1.5;
    x.beginPath(); x.arc(cx, cy, r, a0, a0 + Math.PI * (0.35 + 0.12 * i)); x.stroke();
  }
  const oa = t * 0.9; x.fillStyle = '#F5F5F2'; x.beginPath(); x.arc(cx + Math.cos(oa) * 166, cy + Math.sin(oa) * 166, 6, 0, 7); x.fill();
  x.font = '500 104px ' + DISPLAY; let px = 56; const hi = Math.floor(t * 2) % 6;
  'MOTION'.split('').forEach((ch, i) => { x.fillStyle = i === hi ? '#F5F5F2' : '#8d9196'; x.fillText(ch, px, 300 + Math.sin(t * 2.2 + i * 0.7) * 14); px += x.measureText(ch).width + 4; });
  x.font = '500 18px ' + TEXT; x.fillStyle = '#BFC3C7'; x.fillText('BRAND SYSTEM — TITLE SEQUENCE', 58, 352);
  const f = Math.floor(t * 25), tc = [Math.floor(f / 1500) % 60, Math.floor(f / 25) % 60, f % 25].map(n => String(n).padStart(2, '0')).join(':');
  x.font = '500 16px ui-monospace, Menlo, monospace'; x.fillText('TC 00:' + tc, 56, H - 44);
  x.fillStyle = 'rgba(191,195,199,.25)'; x.fillRect(56, H - 28, W - 112, 2); x.fillStyle = '#F5F5F2'; x.fillRect(56, H - 28, (W - 112) * ((t % 12) / 12), 2);
}

export function webglAvailable() {
  try { const c = document.createElement('canvas'); return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) { return false; }
}

export function defaultState(mobile) {
  return {
    tx: 0, ty: 0, tz: 0, theta: 0, phi: 0, dist: 9, frameX: 0, frameY: 0, intro: 1,
    rotX: 0.12, rotY: 0, rotZ: 0, scale: mobile ? 0.62 : 0.78, x: 0, y: mobile ? 0.05 : -0.12, z: 0, gap: 0,
    spread: 0, rockLift: 0, shadow: 1,
    stageY: -5.5, turn: -1, disc: 1, spot: 0, rise0: 0, rise1: 0, rise2: 0, rise3: 0,
    rimDY: 0, rimZ: 0, rimTilt: 0, rimScale: 1, prog: 0, bead: 0,
    webScroll: 0, appScroll: 0, play: 0
  };
}

export function createWorld(container, opts = {}) {
  const mobile = !!opts.mobile, P = (window.STONE && window.STONE.projects) || [];
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.localClippingEnabled = true;
  renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.appendChild(renderer.domElement);
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene(), env = studioEnv(renderer); scene.environment = env;
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
  scene.add(new THREE.HemisphereLight(0xf5f5f2, 0x1a1a1a, 0.55));
  const key = new THREE.DirectionalLight(0xfff8ef, 2.4); key.position.set(-3, 4, 6); scene.add(key);
  const rimL = new THREE.PointLight(0xfff1df, 60, 14, 1.6); rimL.position.set(0, 0.6, -3.5); scene.add(rimL);
  const fill = new THREE.DirectionalLight(0xdfe4ea, 0.8); fill.position.set(4, -1, 3); scene.add(fill);
  const spot = new THREE.SpotLight(0xfff6ea, 0, 0, 0.6, 0.9, 2); spot.position.set(0.6, 6, 2.6); spot.target.position.set(0, -0.8, 0); scene.add(spot, spot.target);

  // Logo sculpture (carried through every chapter)
  const steel = new THREE.MeshPhysicalMaterial({ color: 0xc4c8cc, metalness: 1, roughness: 0.27, clearcoat: 0.35, clearcoatRoughness: 0.25, envMapIntensity: 1.25 });
  const logo = new THREE.Group(), top = new THREE.Mesh(stoneGeo(TOP), steel), bot = new THREE.Mesh(stoneGeo(BOT), steel);
  logo.add(top, bot); const holder = new THREE.Group(); holder.add(logo); scene.add(holder);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.4), new THREE.MeshBasicMaterial({ map: shadowTex(), transparent: true, depthWrite: false, opacity: 0.55 }));
  shadow.position.set(0.25, -0.35, -1.6); scene.add(shadow);

  // Hero rocks
  const rockMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.93, metalness: 0.05, flatShading: true, envMapIntensity: 0.35 });
  const rockScale = mobile ? 0.55 : 1, rockPush = mobile ? 0.55 : 0, rocks = [];
  [[-1, 1.3, [1.9, 3.4, 1.5], 0.55, 0.2, 0.6, 0.3], [-1, 4.1, [1.3, 2.4, 1.2], 1.25, -1.9, 1.6, -0.6], [-1, 7.7, [1.6, 2.6, 1.4], 1.0, 2.2, -1.4, 1.1],
   [1, 2.6, [2.0, 3.6, 1.5], 0.5, -0.3, 0.4, 2.2], [1, 5.9, [1.2, 2.2, 1.1], 1.25, 2.0, 1.4, 0.4], [1, 9.2, [1.5, 2.4, 1.3], 0.95, -2.3, -1.2, 1.7]
  ].forEach(([side, seed, sc, off, y, z, r]) => {
    const m = new THREE.Mesh(rockGeo(seed, mobile ? 22 : 34), rockMat);
    m.scale.set(sc[0] * rockScale, sc[1] * Math.max(rockScale, 0.8), sc[2] * rockScale); m.rotation.set(r * 0.3, r, r * 0.2);
    m.userData = { side, off, y, z, by: r, seed }; scene.add(m); rocks.push(m);
  });

  // Turntable stage
  const clip = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.8), C = [clip];
  const stage = new THREE.Group(), spin = new THREE.Group(); stage.add(spin); scene.add(stage);
  const discMat = new THREE.MeshPhysicalMaterial({ color: 0x242424, metalness: 0.85, roughness: 0.4, clearcoat: 0.5, clearcoatRoughness: 0.28 });
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.1, 0.16, 160, 1), discMat); disc.position.y = -0.08; spin.add(disc);
  const M = {
    steel: new THREE.MeshPhysicalMaterial({ color: 0xc9ccd0, metalness: 1, roughness: 0.33, clearcoat: 0.2, clippingPlanes: C }),
    dark: new THREE.MeshPhysicalMaterial({ color: 0x0c0c0c, metalness: 0.3, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08, clippingPlanes: C }),
    conc: new THREE.MeshStandardMaterial({ color: 0xdcd8d1, roughness: 0.88, metalness: 0, clippingPlanes: C }),
    concDark: new THREE.MeshStandardMaterial({ color: 0x8e8a84, roughness: 0.92, clippingPlanes: C }),
    glass: new THREE.MeshPhysicalMaterial({ color: 0x9aa5ab, metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.42, envMapIntensity: 1.6, clippingPlanes: C }),
    water: new THREE.MeshPhysicalMaterial({ color: 0x1b2124, metalness: 0.5, roughness: 0.06, clearcoat: 1, clippingPlanes: C })
  };
  const scrMat = (tex) => new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, color: 0xe6e6e6, clippingPlanes: C });
  const mkTex = (cv) => { const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; return t; };

  // Screens: canvas by default; real image/video from stone-data.js when provided
  const [mC, mX] = canvas(1024, 576); drawMotion(mX, 1024, 576, 0); const motionTex = mkTex(mC);
  const [wC, wX] = canvas(1024, 2048); drawWeb(wX, 1024, 2048, P[1] || {}); const webTex = mkTex(wC);
  const [aC, aX] = canvas(512, 1600); drawApp(aX, 512, 1600); const appTex = mkTex(aC);
  const WEB_A = 0.69 / 1.13, APP_A = 0.865 / 0.395;
  const scroller = { web: { tex: webTex, frac: (WEB_A * 1024) / 2048 }, app: { tex: appTex, frac: Math.min(1, (APP_A * 512) / 1600) } };
  const motionMat = scrMat(motionTex), webMat = scrMat(webTex), appMat = scrMat(appTex);
  let video = null, motionLive = true;
  const loader = new THREE.TextureLoader();
  const useImage = (url, mat, key, aspect) => loader.load(url, (t) => {
    t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; mat.map = t; mat.needsUpdate = true;
    if (key) scroller[key] = { tex: t, frac: Math.min(1, (aspect * t.image.width) / t.image.height) };
  });
  if (P[0] && P[0].video) {
    video = document.createElement('video'); Object.assign(video, { src: P[0].video, muted: true, loop: true, playsInline: true, crossOrigin: 'anonymous' });
    const vt = new THREE.VideoTexture(video); vt.colorSpace = THREE.SRGBColorSpace; motionMat.map = vt; motionLive = false;
  } else if (P[0] && P[0].screen) { useImage(P[0].screen, motionMat); motionLive = false; }
  if (P[1] && P[1].screen) useImage(P[1].screen, webMat, 'web', WEB_A);
  if (P[2] && P[2].screen) useImage(P[2].screen, appMat, 'app', APP_A);
  document.fonts && document.fonts.ready.then(() => { drawWeb(wX, 1024, 2048, P[1] || {}); webTex.needsUpdate = true; drawApp(aX, 512, 1600); appTex.needsUpdate = true; });

  const items = [];
  { // 01 Motion — freestanding display
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.02, 64), M.steel); base.position.y = 0.01;
    const stem = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.36, 0.02), M.steel); stem.position.set(0, 0.19, -0.03);
    const frame = new THREE.Mesh(rbox(1.5, 0.88, 0.03, 0.018, 0.006), M.dark); frame.position.set(0, 0.77, 0);
    const scr = new THREE.Mesh(screenGeo(1.46, 0.84, 0.01), motionMat); scr.position.set(0, 0.77, 0.0158);
    g.add(base, stem, frame, scr); items.push(g);
  }
  { // 02 Web — laptop
    const g = new THREE.Group();
    const base = new THREE.Mesh(rbox(1.24, 0.84, 0.034, 0.03, 0.008), M.steel); base.rotation.x = -Math.PI / 2; base.position.y = 0.017;
    const deck = new THREE.Mesh(new THREE.PlaneGeometry(1.08, 0.38), M.dark); deck.rotation.x = -Math.PI / 2; deck.position.set(0, 0.0345, -0.13);
    const hinge = new THREE.Group(); hinge.position.set(0, 0.034, -0.41); hinge.rotation.x = -0.3;
    const lid = new THREE.Mesh(rbox(1.24, 0.8, 0.022, 0.03, 0.006), M.steel); lid.position.set(0, 0.4, 0);
    const bezel = new THREE.Mesh(screenGeo(1.2, 0.76, 0.024), M.dark); bezel.position.set(0, 0.4, 0.0116);
    const scr = new THREE.Mesh(screenGeo(1.13, 0.69, 0.006), webMat); scr.position.set(0, 0.41, 0.0124);
    hinge.add(lid, bezel, scr); g.add(base, deck, hinge); items.push(g);
  }
  { // 03 App — phone on a dock
    const g = new THREE.Group();
    const dock = new THREE.Mesh(rbox(0.56, 0.18, 0.04, 0.03, 0.008), M.steel); dock.rotation.x = -Math.PI / 2; dock.position.set(0, 0.02, -0.02);
    const ph = new THREE.Group(); ph.position.set(0, 0.5, -0.02); ph.rotation.x = -0.1;
    const body = new THREE.Mesh(rbox(0.44, 0.92, 0.045, 0.075, 0.01), M.steel);
    const glass = new THREE.Mesh(screenGeo(0.425, 0.905, 0.07), M.dark); glass.position.z = 0.0231;
    const scr = new THREE.Mesh(screenGeo(0.395, 0.865, 0.055), appMat); scr.position.z = 0.0236;
    ph.add(body, glass, scr); g.add(dock, ph); items.push(g);
  }
  { // 04 3D Visualization — architectural model
    const g = new THREE.Group(), B = (w, h, d, x, y, z, m) => { const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); me.position.set(x, y + h / 2, z); g.add(me); return me; };
    B(1.5, 0.05, 1.05, 0, 0, 0, M.concDark);
    B(1.0, 0.2, 0.52, 0.12, 0.05, -0.12, M.conc);
    B(0.4, 0.012, 0.2, -0.42, 0.05, 0.3, M.water);
    B(1.3, 0.035, 0.66, -0.06, 0.25, -0.06, M.conc);
    B(0.9, 0.17, 0.5, -0.1, 0.285, -0.08, M.glass);
    B(1.06, 0.035, 0.62, -0.18, 0.455, -0.05, M.conc);
    B(0.3, 0.26, 0.05, 0.47, 0.05, 0.19, M.conc);
    [[-0.66, -0.3], [-0.66, 0.22]].forEach(([x, z]) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 12), M.steel); c.position.set(x, 0.15, z); g.add(c); });
    items.push(g);
  }
  items.forEach((it, k) => {
    const a = (k * Math.PI) / 2, h = new THREE.Group();
    h.position.set(Math.sin(a) * ITEM_R, 0, Math.cos(a) * ITEM_R); h.rotation.y = a; h.add(it); spin.add(h);
  });

  // Steel rim → process cycle → closing halo
  const rimMat = new THREE.MeshPhysicalMaterial({ color: 0xd9dcdf, metalness: 1, roughness: 0.18, clearcoat: 0.4 });
  const rimPivot = new THREE.Group(), rimSpin = new THREE.Group(); rimPivot.add(rimSpin); scene.add(rimPivot);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(RIM_R, 0.016, 12, 256), rimMat); rim.rotation.x = Math.PI / 2; rimSpin.add(rim);
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2, m = new THREE.Mesh(new THREE.BoxGeometry(0.028, 0.028, 0.2), rimMat);
    m.position.set(Math.sin(a) * RIM_R, 0.012, Math.cos(a) * RIM_R); m.rotation.y = a; rimSpin.add(m);
  }
  class Arc extends THREE.Curve { getPoint(t, o = new THREE.Vector3()) { const a = t * Math.PI * 2; return o.set(Math.sin(a) * RIM_R, 0.01, Math.cos(a) * RIM_R); } }
  const TS = 512, RS = 8;
  const trail = new THREE.Mesh(new THREE.TubeGeometry(new Arc(), TS, 0.026, RS, false), new THREE.MeshBasicMaterial({ color: 0xf5f5f2 }));
  trail.geometry.setDrawRange(0, 0); rimSpin.add(trail);
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.075, 32, 16), rimMat); rimSpin.add(bead);

  const state = opts.state || defaultState(mobile);
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 }, look = new THREE.Vector3();
  let w = 1, h = 1, halfW = 1, discTransparent = false;
  function resize() {
    w = container.clientWidth || 1; h = container.clientHeight || 1;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 9 * camera.aspect;
  }
  resize();
  const ro = new ResizeObserver(resize); ro.observe(container);
  const onMove = (e) => { pointer.tx = (e.clientX / window.innerWidth) * 2 - 1; pointer.ty = (e.clientY / window.innerHeight) * 2 - 1; };
  if (opts.interactive !== false && !mobile) window.addEventListener('pointermove', onMove, { passive: true });

  let active = true, raf = 0, lastM = 0;
  const t0 = performance.now(), GAPDIR = new THREE.Vector2(-0.28, 1).normalize(), idle = opts.idle === false ? 0 : 1;
  function draw(now) {
    const t = (now - t0) / 1000, s = state, inv = 1 - s.intro;
    pointer.x += (pointer.tx - pointer.x) * 0.05; pointer.y += (pointer.ty - pointer.y) * 0.05;
    const d = s.dist - inv * 3.2, cp = Math.cos(s.phi), par = d / 9;
    camera.position.set(s.tx + Math.sin(s.theta) * cp * d + pointer.x * 0.35 * par, s.ty + Math.sin(s.phi) * d - pointer.y * 0.22 * par + 0.05, s.tz + Math.cos(s.theta) * cp * d);
    camera.lookAt(look.set(s.tx, s.ty, s.tz));
    camera.setViewOffset(w, h, -s.frameX * w, s.frameY * h, w, h);

    holder.position.set(s.x, s.y + Math.sin(t * 0.9) * 0.05 * idle * s.scale, s.z);
    holder.rotation.set(s.rotX + Math.sin(t * 0.6) * 0.04 * idle, s.rotY - inv * 0.9 + Math.sin(t * 0.45) * 0.08 * idle, s.rotZ);
    holder.scale.setScalar(s.scale * (0.86 + 0.14 * s.intro));
    top.position.set(GAPDIR.x * s.gap, GAPDIR.y * s.gap, s.gap * 0.25); top.rotation.z = s.gap * 0.18;
    bot.position.set(-GAPDIR.x * s.gap, -GAPDIR.y * s.gap, -s.gap * 0.25); bot.rotation.z = -s.gap * 0.18;
    shadow.visible = s.shadow > 0.01;
    shadow.position.set(0.25 + s.x * 0.6, -0.35 + s.y * 0.8, -1.6);
    shadow.material.opacity = 0.55 * s.shadow * (1 - Math.min(1, s.gap * 1.5) * 0.4);

    const spread = s.spread - inv * 0.55;
    rocks.forEach((m) => {
      const u = m.userData; m.visible = s.spread < 2.9;
      if (!m.visible) return;
      m.position.set(u.side * (halfW - u.off * rockScale + 0.15 + rockPush) + u.side * spread * 3.6, u.y + s.rockLift * (u.y > 0 ? 1 : -1) * 0.8 + Math.sin(t * 0.3 + u.seed) * 0.03 * idle, u.z + spread * 1.6);
      m.rotation.y = u.by + spread * 0.5 * u.side + t * 0.008 * idle;
    });

    stage.visible = s.stageY > -5.4;
    stage.position.y = s.stageY; spin.rotation.y = rimSpin.rotation.y = (-s.turn * Math.PI) / 2;
    clip.constant = -s.stageY;
    items.forEach((it, k) => { const r = s['rise' + k]; it.position.y = (r - 1) * 1.35; it.visible = r > 0.001; });
    const wantT = s.disc < 0.999;
    if (wantT !== discTransparent) { discTransparent = wantT; discMat.transparent = wantT; discMat.needsUpdate = true; }
    discMat.opacity = s.disc; disc.visible = s.disc > 0.005; disc.scale.set(0.7 + 0.3 * s.disc, 1, 0.7 + 0.3 * s.disc);

    rimPivot.visible = stage.visible;
    rimPivot.position.set(0, s.stageY + s.rimDY, s.rimZ); rimPivot.rotation.x = s.rimTilt; rimPivot.scale.setScalar(s.rimScale);
    trail.geometry.setDrawRange(0, Math.floor(Math.min(1, s.prog / 4) * TS) * RS * 6);
    const ba = (s.prog * Math.PI) / 2; bead.position.set(Math.sin(ba) * RIM_R, 0.03, Math.cos(ba) * RIM_R);
    bead.scale.setScalar(Math.max(0.0001, s.bead)); bead.visible = s.bead > 0.001;
    spot.intensity = s.spot * 95;

    ['web', 'app'].forEach((k) => { const o = scroller[k], sc = k === 'web' ? s.webScroll : s.appScroll; o.tex.repeat.set(1, o.frac); o.tex.offset.y = (1 - o.frac) * (1 - sc); });
    if (s.play > 0.01) {
      if (motionLive && now - lastM > 33) { drawMotion(mX, 1024, 576, t); motionTex.needsUpdate = true; lastM = now; }
      if (video && video.paused) video.play().catch(() => {});
    } else if (video && !video.paused) video.pause();
    renderer.render(scene, camera);
  }
  function frame(now) { raf = requestAnimationFrame(frame); if (active && !document.hidden) draw(now); }
  raf = requestAnimationFrame(frame);

  return {
    state, resize,
    setActive(v) { active = !!v; },
    renderOnce() { draw(performance.now()); },
    dispose() {
      cancelAnimationFrame(raf); ro.disconnect(); window.removeEventListener('pointermove', onMove);
      if (video) { video.pause(); video.removeAttribute('src'); video.load(); }
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
        ms.forEach((m) => { m.map && m.map.dispose(); m.dispose(); });
      });
      env.dispose(); renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); renderer.domElement.remove();
    }
  };
}
