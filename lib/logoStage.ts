// Scroll-controlled logo animation for the landing page: one logo that changes form from the hero to the footer.
//   hero logo -> melts into a stream -> fills the About band from the bottom -> drips out and gathers into the logo (watermark behind Work)
//   -> outline -> borders of the project previews -> one border unspools into a line that traces a symbol beside each service
//   -> gathers into the logo beside the Services heading -> unfolds into the path through the four process steps
//   -> reforms as the logo -> softens into a pool in Contact (a ripple spreads the section colour) -> contracts to a droplet
//   -> travels to the footer and becomes the exact logo beside the Stone Labs name.
// Everything is an SVG layer in page coordinates (the browser scrolls it natively); only progress values change per frame.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type Pt = [number, number];
type Poly = Pt[];

const D1 = 'M150 620C150 500 220 420 330 330C480 210 650 125 830 125C980 125 1090 230 1090 355C1090 440 1040 478 930 478C760 485 640 520 520 610C420 690 360 755 260 755C190 755 150 700 150 620Z';
const D2 = 'M170 865C165 815 215 797 290 790C450 775 560 720 660 625C750 550 820 520 905 520C1050 520 1095 620 1095 720C1095 850 1030 975 950 1060C870 1130 770 1142 660 1142C510 1142 330 1060 230 985C195 955 172 910 170 865Z';
const CX0 = 622.5, CY0 = 632.5, LOGO_H = 1055;
const LIQ = '#D9DDE1', HILITE = '#F3F5F7', SHADE = '#62676E', INK = '#111111';
const WM_OP = 0.07, BORDER_A = 0.2, LINE_A = 0.4;
const N = 120;
const NS = 'http://www.w3.org/2000/svg';

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const sm = (t: number) => { t = clamp(t); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rgb = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const A = rgb(a), B = rgb(b); return 'rgb(' + A.map((v, i) => Math.round(lerp(v, B[i], t))).join(',') + ')'; };
const f1 = (v: number) => Math.round(v * 10) / 10;

// ---------- polygons ----------
function resample(dense: Poly, n: number): Poly {
  const m = dense.length, cum = [0];
  for (let i = 1; i <= m; i++) { const a = dense[i - 1], b = dense[i % m]; cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
  const total = cum[m], out: Poly = [];
  let j = 1;
  for (let k = 0; k < n; k++) {
    const d = (total * k) / n;
    while (cum[j] < d) j++;
    const a = dense[j - 1], b = dense[j % m], t = (d - cum[j - 1]) / (cum[j] - cum[j - 1] || 1);
    out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t)]);
  }
  return out;
}
function ellipse(cx: number, cy: number, rx: number, ry: number): Poly {
  const dense: Poly = [];
  for (let i = 0; i < 360; i++) { const a = Math.PI + (i / 360) * Math.PI * 2; dense.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  return resample(dense, N);
}
function rrectKey(x: number, y: number, w: number, h: number, r: number): Poly {
  r = Math.min(r, w / 2, h / 2);
  const pts: Poly = [[x, y + h / 2]];
  const arc = (cx: number, cy: number, a0: number, a1: number) => { for (let i = 0; i <= 8; i++) { const a = a0 + ((a1 - a0) * i) / 8; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); } };
  arc(x + r, y + r, Math.PI, 1.5 * Math.PI); arc(x + w - r, y + r, 1.5 * Math.PI, 2 * Math.PI);
  arc(x + w - r, y + h - r, 0, 0.5 * Math.PI); arc(x + r, y + h - r, 0.5 * Math.PI, Math.PI);
  return pts;
}
const rrectPoly = (x: number, y: number, w: number, h: number, r: number) => resample(rrectKey(x, y, w, h, r), N);
function rrectD(x: number, y: number, w: number, h: number, r: number) {
  return `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
}
function smoothPath(p: Poly, closed = true): string {
  const n = p.length;
  let d = 'M' + f1(p[0][0]) + ' ' + f1(p[0][1]);
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = p[closed ? (i - 1 + n) % n : Math.max(i - 1, 0)], p1 = p[i], p2 = p[(i + 1) % n], p3 = p[closed ? (i + 2) % n : Math.min(i + 2, n - 1)];
    d += 'C' + f1(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f1(p1[1] + (p2[1] - p0[1]) / 6) + ' ' + f1(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f1(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f1(p2[0]) + ' ' + f1(p2[1]);
  }
  return d + (closed ? 'Z' : '');
}
const morph = (a: Poly, b: Poly, t: number): Poly => a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]);
const spin = (a: Poly, k: number): Poly => a.map((_, i) => a[(i + k) % a.length]);
const align = (a: Poly, b: Poly): Poly => {
  let best = 0, min = Infinity;
  for (let k = 0; k < b.length; k++) { let d = 0; for (let i = 0; i < a.length; i += 4) { const q = b[(i + k) % b.length]; d += (a[i][0] - q[0]) ** 2 + (a[i][1] - q[1]) ** 2; } if (d < min) { min = d; best = k; } }
  return spin(b, best);
};
const shift = (a: Poly, dx: number, dy: number): Poly => a.map((p) => [p[0] + dx, p[1] + dy]);

// ---------- polylines (long paths drawn by distance) ----------
interface Line { p: Poly; c: number[]; L: number }
function mkLine(p: Poly): Line {
  const c = [0];
  for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]));
  return { p, c, L: c[c.length - 1] };
}
function locate(ln: Line, d: number): [number, number] {
  d = clamp(d, 0, ln.L);
  let lo = 0, hi = ln.c.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (ln.c[m] <= d) lo = m; else hi = m; }
  return [lo, (d - ln.c[lo]) / (ln.c[hi] - ln.c[lo] || 1)];
}
const lp = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const pointAt = (ln: Line, d: number): Pt => { const [i, t] = locate(ln, d); return lp(ln.p[i], ln.p[Math.min(i + 1, ln.p.length - 1)], t); };
function slice(ln: Line, a: number, b: number): Poly {
  a = clamp(a, 0, ln.L); b = clamp(b, 0, ln.L);
  if (b - a < 0.5) return [];
  const [i0, t0] = locate(ln, a), [i1, t1] = locate(ln, b);
  const out: Poly = [lp(ln.p[i0], ln.p[i0 + 1], t0)];
  for (let i = i0 + 1; i <= i1; i++) out.push(ln.p[i]);
  out.push(lp(ln.p[i1], ln.p[Math.min(i1 + 1, ln.p.length - 1)], t1));
  return out;
}
const lineD = (p: Poly) => (p.length < 2 ? '' : 'M' + p.map((q) => f1(q[0]) + ' ' + f1(q[1])).join('L'));
function bez(a: Pt, c1: Pt, c2: Pt, b: Pt, step: number): Poly {
  const n = Math.max(8, Math.ceil((Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.25) / step)), out: Poly = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, u = 1 - t;
    out.push([u * u * u * a[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * b[0], u * u * u * a[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * b[1]]);
  }
  return out;
}
function densify(p: Poly, step: number): Poly {
  const out: Poly = [p[0]];
  for (let i = 1; i < p.length; i++) {
    const a = p[i - 1], b = p[i], n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let k = 1; k <= n; k++) out.push(lp(a, b, k / n));
  }
  return out;
}
// simple symbols (24-unit box), each a single stroke
const ICONS: Record<string, Poly> = {
  web: [[3, 10], [21, 10], [21, 6], [3, 6], [3, 18], [21, 18], [21, 10]],
  app: [[8, 6], [8, 3], [16, 3], [16, 21], [8, 21], [8, 6], [16, 6]],
  motion: [...Array.from({ length: 25 }, (_, i): Pt => [12 + 9 * Math.sin((i / 24) * Math.PI * 2), 12 - 9 * Math.cos((i / 24) * Math.PI * 2)]), [10, 8], [10, 16], [17, 12], [10, 8]],
  viz: [[12, 2], [20, 7], [20, 17], [12, 22], [4, 17], [4, 7], [12, 2], [12, 12], [20, 7], [12, 12], [4, 7], [12, 12], [12, 22]]
};

export function initLogoStage(svg: SVGSVGElement, root: HTMLElement): () => void {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mk = (name: string, attrs: Record<string, string | number>, parent: Element) => {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, String(attrs[k]));
    parent.appendChild(e);
    return e as SVGElement;
  };
  svg.replaceChildren();
  const sample = (d: string): Poly => {
    const p = mk('path', { d }, svg) as unknown as SVGPathElement;
    const len = p.getTotalLength(), dense: Poly = [];
    for (let i = 0; i < 480; i++) { const q = p.getPointAtLength((len * i) / 480); dense.push([q.x, q.y]); }
    svg.removeChild(p);
    return resample(dense, N);
  };
  const P1 = sample(D1), P2 = sample(D2);
  const UNIT = ellipse(0, 0, 1, 1);

  // ---------- layers (back to front) ----------
  const defs = mk('defs', {}, svg);
  const filt = (id: string) => {
    const fl = mk('filter', { id, filterUnits: 'userSpaceOnUse', 'color-interpolation-filters': 'sRGB' }, defs);
    const blur = mk('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: 0 }, fl);
    mk('feColorMatrix', { type: 'matrix', values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9' }, fl);
    return { fl, blur };
  };
  const fa = filt('hm-goo-a'), fb = filt('hm-goo-b'), fc = filt('hm-goo-c');
  const clipA = mk('clipPath', { id: 'hm-clip-a' }, defs), clipARect = mk('rect', {}, clipA);
  const clipF = mk('clipPath', { id: 'hm-clip-f' }, defs), clipFRect = mk('rect', {}, clipF);
  const shade = mk('linearGradient', { id: 'hm-shade', gradientUnits: 'userSpaceOnUse', x1: 0, x2: 0 }, defs);
  mk('stop', { offset: 0, 'stop-color': SHADE, 'stop-opacity': 0 }, shade); mk('stop', { offset: 1, 'stop-color': SHADE, 'stop-opacity': 0.16 }, shade);

  const ripG = mk('g', { 'clip-path': 'url(#hm-clip-f)' }, svg);
  const ripFill = mk('ellipse', { fill: HILITE }, ripG), ripRing1 = mk('ellipse', { fill: 'none', stroke: LIQ, 'stroke-width': 1.5 }, ripG), ripRing2 = mk('ellipse', { fill: 'none', stroke: LIQ, 'stroke-width': 1 }, ripG);
  const poolG = mk('g', { 'clip-path': 'url(#hm-clip-a)' }, svg);
  const poolBack = mk('path', { fill: HILITE }, poolG), pool = mk('path', { fill: LIQ }, poolG), poolShade = mk('path', { fill: 'url(#hm-shade)' }, poolG);
  const sheen = mk('path', { fill: 'none', stroke: '#fff', 'stroke-opacity': 0.7, 'stroke-width': 1.5 }, poolG), edge = mk('path', { fill: 'none', stroke: SHADE, 'stroke-opacity': 0.22, 'stroke-width': 1 }, poolG);
  const bodyG = mk('g', {}, svg);
  const head1 = mk('path', {}, bodyG), head2 = mk('path', {}, bodyG), stream = mk('path', { stroke: SHADE, 'stroke-width': 1 }, bodyG);
  const dripG = mk('g', {}, svg);
  const base = mk('path', { fill: LIQ }, dripG), neck = mk('path', { fill: LIQ }, dripG);
  const ve = { 'vector-effect': 'non-scaling-stroke', 'stroke-linejoin': 'round' };
  const wm1 = mk('path', ve, dripG), wm2 = mk('path', ve, dripG);
  const borderG = mk('g', {}, svg);
  let borders: SVGElement[] = [];
  const iconG = mk('g', { fill: 'none', stroke: SHADE, 'stroke-opacity': 0.7, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
  let icons: SVGElement[] = [];
  const procPath = mk('path', { fill: 'none', stroke: SHADE, 'stroke-opacity': 0.45, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
  const snake = mk('path', { fill: 'none', stroke: INK, 'stroke-opacity': BORDER_A, 'stroke-width': 1, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
  const lgG = mk('g', {}, svg);
  const lg1 = mk('path', ve, lgG), lg2 = mk('path', ve, lgG), poolHi = mk('path', { fill: HILITE }, lgG);

  const show = (e: Element, on: boolean) => { if (on) e.removeAttribute('display'); else e.setAttribute('display', 'none'); };
  const setPoly = (e: Element, poly: Poly) => { e.setAttribute('d', smoothPath(poly)); e.removeAttribute('transform'); };
  const setExact = (e: Element, d: string, cx: number, cy: number, k: number, dx = 0, dy = 0) => {
    e.setAttribute('d', d);
    e.setAttribute('transform', `translate(${f1(cx + dx)} ${f1(cy + dy)}) scale(${k}) translate(${-CX0} ${-CY0})`);
  };
  const setBlur = (g: Element, fl: { fl: Element; blur: Element }, id: string, b: number, x: number, y: number, w: number, h: number) => {
    if (b < 0.45) { g.removeAttribute('filter'); return; }
    fl.blur.setAttribute('stdDeviation', String(f1(b)));
    fl.fl.setAttribute('x', String(f1(x))); fl.fl.setAttribute('y', String(f1(y))); fl.fl.setAttribute('width', String(f1(w))); fl.fl.setAttribute('height', String(f1(h)));
    g.setAttribute('filter', `url(#${id})`);
  };

  // ---------- layout ----------
  interface R { x: number; y: number; w: number; h: number; b: number; cx: number; cy: number }
  const rect = (e: Element): R => { const r = e.getBoundingClientRect(); return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height, b: r.bottom + window.scrollY, cx: r.left + window.scrollX + r.width / 2, cy: r.top + window.scrollY + r.height / 2 }; };
  const q = (s: string) => root.querySelector(s)!;
  const qa = (s: string) => Array.from(root.querySelectorAll(s));
  let M: ReturnType<typeof measure> | null = null;

  function measure() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const mobile = vw < 820 || window.matchMedia('(pointer: coarse)').matches;
    const step = mobile ? 8 : 5;
    const hero = rect(q('#top')), A = rect(q('#about')), B = rect(q('#work')), C = rect(q('#more-work')), Dd = rect(q('#services')), E = rect(q('#process')), F = rect(q('#contact'));
    const thumbs = qa('#more-work .hm-thumb').map(rect);
    const docH = root.getBoundingClientRect().height;
    const smax = Math.max(0, docH - vh);
    const H = hero.b, cx = vw / 2, Lh = 0.364 * hero.h, cy = hero.y + 0.52 * hero.h, k = Lh / LOGO_H;
    const pad = parseFloat(getComputedStyle(q('#about')).paddingLeft) || 20;
    const sx = Math.max(10, (A.x + pad) / 2);
    const W0 = Math.min(clamp(0.05 * Lh, 6, 16) * (mobile ? 0.85 : 1), sx * 1.5);
    const map = (P: Poly, x: number, y: number, kk: number): Poly => P.map(([px, py]) => [x + (px - CX0) * kk, y + (py - CY0) * kk]);
    const ellipseHead = (ox: number, oy: number, rx: number, ry: number) => ellipse(cx + ox * Lh, cy + oy * Lh, rx, ry);
    // watermark behind Work
    const Wh = Math.min(B.h * 0.98, vh * 1.0, vw * 1.1), kw = Wh / LOGO_H, wmCy = B.y + B.h / 2;
    const WP1 = map(P1, cx, wmCy, kw), WP2 = map(P2, cx, wmCy, kw);
    const RPraw = thumbs.map((t) => rrectPoly(t.x + 0.5, t.y + 0.5, t.w - 1, t.h - 1, 9.5));
    const RP = RPraw.map((r, i) => (i === 0 ? align(WP1, r) : i === RPraw.length - 1 ? align(WP2, r) : r));

    // ---- services: icon boxes, heading logo, and the line that connects them ----
    const icoBoxes = qa('[data-ico]').map(rect), G = rect(q('[data-hlogo]'));
    const kG = G.h / LOGO_H;
    let Q: Line | null = null, Lb = 0, qIcon: [number, number][] = [], iconLines: Line[] = [];
    if (thumbs.length) {
      const T = thumbs[thumbs.length - 1];
      let loop = densify([...rrectKey(T.x + 0.5, T.y + 0.5, T.w - 1, T.h - 1, 9.5), rrectKey(T.x + 0.5, T.y + 0.5, T.w - 1, T.h - 1, 9.5)[0]], step);
      let bi = 0, bd = Infinity;
      loop.forEach((p, i) => { const d = Math.hypot(p[0] - (T.x + T.w / 2), p[1] - (T.y + T.h)); if (d < bd) { bd = d; bi = i; } });
      loop = [...loop.slice(bi, -1), ...loop.slice(0, bi + 1)];
      const pts: Poly = [...loop];
      Lb = mkLine(loop).L;
      const connect = (a: Pt, b: Pt) => {
        const vert = Math.abs(b[1] - a[1]) > 140, hop = Math.max(60, Math.min(160, Math.abs(b[0] - a[0]) * 0.4)) * 0.5;
        const c1: Pt = vert ? [a[0], a[1] + Math.min(160, Math.abs(b[1] - a[1]) * 0.5)] : [a[0] + (b[0] - a[0]) * 0.2, a[1] - hop];
        const c2: Pt = vert ? [b[0], b[1] - Math.min(160, Math.abs(b[1] - a[1]) * 0.5)] : [a[0] + (b[0] - a[0]) * 0.8, b[1] - hop];
        pts.push(...bez(a, c1, c2, b, step).slice(1));
      };
      const ids = ['web', 'app', 'motion', 'viz'];
      const marks: [number, number][] = [];
      icoBoxes.forEach((bx, i) => {
        const raw = ICONS[ids[i]].map(([u, v]): Pt => [bx.x + (u / 24) * bx.w, bx.y + (v / 24) * bx.h]);
        const dense = densify(raw, step);
        iconLines.push(mkLine(dense));
        connect(pts[pts.length - 1], dense[0]);
        marks.push([pts.length - 1, 0]);
        pts.push(...dense.slice(1));
        marks[i][1] = pts.length - 1;
      });
      connect(pts[pts.length - 1], [G.cx, G.cy]);
      Q = mkLine(pts);
      qIcon = marks.map(([a, b]) => [Q!.c[a], Q!.c[b]]);
    }

    // ---- process: circles, path, logo reappearing beside the last step ----
    const circles = qa('.hm-process .hm-no').map(rect), PL = rect(q('[data-plogo]'));
    const kP = PL.h / LOGO_H;
    let PP: Line | null = null, pc: number[] = [];
    if (circles.length) {
      const pts: Poly = [[circles[0].cx, circles[0].cy]];
      pc = [0];
      for (let i = 0; i < circles.length - 1; i++) {
        const a: Pt = [circles[i].cx, circles[i].cy], b: Pt = [circles[i + 1].cx, circles[i + 1].cy], sgn = i % 2 ? -1 : 1, dy = (b[1] - a[1]) * 0.4;
        pts.push(...bez(a, [a[0] + 22 * sgn, a[1] + dy], [b[0] - 22 * sgn, b[1] - dy], b, step).slice(1));
        pc.push(mkLine(pts).L);
      }
      const last: Pt = [circles[circles.length - 1].cx, circles[circles.length - 1].cy], end: Pt = [PL.x + PL.w * 0.78, PL.cy];
      pts.push(...bez(last, [last[0] - 70, last[1] + 36], [end[0] + 90, end[1] + (end[1] < last[1] ? 40 : -10)], end, step).slice(1));
      PP = mkLine(pts);
    }

    // ---- contact pool and footer logo ----
    const FL = rect(q('[data-footer-logo]'));
    const kF = FL.h / LOGO_H;
    const px = mobile ? vw - 90 : vw * 0.76, py = mobile ? F.y + 40 : F.y + F.h * 0.5;
    const prx = mobile ? 62 : 100, pry = mobile ? 17 : 24;
    let Rx = 0;
    for (const [qx, qy] of [[0, F.y], [vw, F.y], [0, F.b], [vw, F.b]]) Rx = Math.max(Rx, Math.sqrt((qx - px) ** 2 + ((qy - py) / 0.5) ** 2));

    // ---- timeline (scroll positions) ----
    const s0 = Math.max(A.b - vh * 0.95, H * 0.5);
    const fillDur = Math.max(0.5 * vh, Math.min(A.h * 0.8, 1.2 * vh));
    const s1 = s0 + fillDur;
    const gS = s1 - 0.15 * vh, gD = 0.38 * vh;
    const oS = Math.max(s1 + 0.38 * vh, C.y - 0.72 * vh), oD = 0.5 * vh;
    const s5a = oS + oD;
    const s5b = Math.max(s5a + 0.5 * vh, G.cy - 0.3 * vh);
    const s6a = s5b + 0.05 * vh;
    const lead = 0.8 * vh;               // the process path is drawn up to this height of the viewport
    const c1Y = circles.length ? circles[0].cy : E.y, c4Y = circles.length ? circles[circles.length - 1].cy : E.b;
    const s6b = Math.max(s6a + 0.25 * vh, c1Y - lead);
    const se0 = Math.max(s6b + 0.3 * vh, c4Y + 0.2 * vh - lead);
    const se1 = se0 + 0.2 * vh;
    const tail = Math.max(smax, se1 + 0.6 * vh) - se1;    // what is left for contact + footer
    const s7a = se1 + 0.04 * vh, s7b = s7a + tail * 0.22, s7c = s7b + tail * 0.28, s8a = Math.max(s7b + 0.05 * vh, s7c - tail * 0.05), s8b = Math.max(s8a + 0.2 * vh, smax - 2);
    return {
      vw, vh, mobile, step, H, cx, cy, Lh, k, sx, W0, A, B, C, Dd, E, F, thumbs, Wh, kw, wmCy, docH, smax,
      HP1: map(P1, cx, cy, k), HP2: map(P2, cx, cy, k),
      E1: ellipseHead(0, -0.17, W0 * 1.3, Lh * 0.3), E2: ellipseHead(0, 0.22, W0 * 1.15, Lh * 0.26),
      WP1, WP2, RP, G, kG, Q, Lb, qIcon, iconLines, icoBoxes, circles, PL, kP, PP, pc, FL, kF, px, py, prx, pry, Rx,
      s0, s1, fillDur, gS, gD, oS, oD, s5a, s5b, s6a, s6b, se0, se1, s7a, s7b, s7c, s8a, s8b, lead
    };
  }

  function layout() {
    M = measure();
    svg.setAttribute('width', String(M.vw)); svg.setAttribute('height', String(Math.ceil(M.docH)));
    svg.setAttribute('viewBox', `0 0 ${M.vw} ${Math.ceil(M.docH)}`);
    svg.style.height = Math.ceil(M.docH) + 'px';
    clipARect.setAttribute('x', '0'); clipARect.setAttribute('y', String(M.A.y)); clipARect.setAttribute('width', String(M.vw)); clipARect.setAttribute('height', String(M.A.h));
    clipFRect.setAttribute('x', '0'); clipFRect.setAttribute('y', String(M.F.y)); clipFRect.setAttribute('width', String(M.vw)); clipFRect.setAttribute('height', String(M.F.h));
    shade.setAttribute('y1', String(M.A.y)); shade.setAttribute('y2', String(M.A.b));
    borderG.replaceChildren(); iconG.replaceChildren();
    borders = M.thumbs.map((t) => mk('path', { d: rrectD(t.x + 0.5, t.y + 0.5, t.w - 1, t.h - 1, 9.5), fill: 'none', stroke: INK, 'stroke-opacity': BORDER_A, 'stroke-width': 1, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1, display: 'none' }, borderG));
    icons = M.iconLines.map(() => mk('path', { display: 'none' }, iconG));
  }

  // ---------- render ----------
  const sectionC = q('#more-work');
  const stepItems = qa('.hm-process li');
  const footerImg = q('[data-footer-logo]') as HTMLElement;
  let animated = true;

  function renderStatic() {
    const m = M!;
    show(ripG, true); show(poolG, true); show(bodyG, true); show(dripG, true); show(borderG, false); show(snake, false); show(lgG, false);
    ripFill.setAttribute('cx', '0'); ripFill.setAttribute('cy', String(m.F.cy)); ripFill.setAttribute('rx', String(m.vw * 2)); ripFill.setAttribute('ry', String(m.F.h * 2)); show(ripRing1, false); show(ripRing2, false);
    poolBack.setAttribute('d', ''); poolShade.setAttribute('d', ''); sheen.setAttribute('d', ''); edge.setAttribute('d', '');
    pool.setAttribute('d', `M0 ${m.A.y}H${m.vw}V${m.A.b}H0Z`);
    stream.setAttribute('d', ''); head1.setAttribute('fill', INK); head2.setAttribute('fill', INK); head1.setAttribute('stroke', 'none'); head2.setAttribute('stroke', 'none');
    setExact(head1, D1, m.cx, m.cy, m.k); setExact(head2, D2, m.cx, m.cy, m.k);
    show(base, false); show(neck, false);
    for (const [e, d] of [[wm1, D1], [wm2, D2]] as [SVGElement, string][]) { setExact(e, d, m.cx, m.wmCy, m.kw); e.setAttribute('fill', INK); e.setAttribute('fill-opacity', String(WM_OP)); e.setAttribute('stroke', 'none'); }
    m.iconLines.forEach((ln, i) => { icons[i].setAttribute('d', lineD(ln.p)); show(icons[i], true); });
    if (m.PP) { procPath.setAttribute('d', lineD(m.PP.p)); show(procPath, true); stepItems.forEach((li) => li.classList.add('is-reached')); } else show(procPath, false);
    bodyG.removeAttribute('filter'); dripG.removeAttribute('filter');
  }

  function render(s: number) {
    const m = M!;
    const { vw, vh, cx, cy, Lh, sx, W0, A, B, C, F } = m;
    const win0 = s - 140, win1 = s + vh + 140, vis = (a: number, b: number) => b > win0 && a < win1;
    const mob = m.mobile;

    // ===== 1. hero logo melts into a stream; 2. it fills the About band =====
    const melt = sm(s / (0.55 * m.H));
    const L = clamp((s - m.s0) / m.fillDur);
    const lb = cy + Lh * 0.28;
    const tipY = lb + (A.b - lb) * sm(s / m.s0);
    const amp0 = mob ? 4 : 7, amp = amp0 * sm(L * 6);
    const ph = s * 0.012;
    const Y = A.b + 1.5 * amp0 - L * (A.h + 3 * amp0);
    const endY = L > 0 ? Y + 6 : tipY;
    const thin = 1 - sm((s - (m.s1 - 0.1 * vh)) / (0.4 * vh));
    const sw = sm((melt - 0.3) / 0.7) * thin;
    const liq = mix(INK, LIQ, sm(melt * 1.05));

    const headOn = vis(cy - Lh, cy + Lh);
    show(head1, headOn); show(head2, headOn);
    if (headOn) {
      const t = sm((melt - 0.12) / 0.88);
      if (t < 0.001) { setExact(head1, D1, cx, cy, m.k); setExact(head2, D2, cx, cy, m.k); }
      else { setPoly(head1, morph(m.HP1, m.E1, t)); setPoly(head2, morph(m.HP2, m.E2, t)); }
      head1.setAttribute('fill', liq); head2.setAttribute('fill', liq);
      for (const e of [head1, head2]) { e.setAttribute('stroke', SHADE); e.setAttribute('stroke-opacity', String(0.22 * sm(melt))); e.setAttribute('stroke-width', '1'); }
    }
    const streamOn = sw > 0.02 && endY - lb > 6 && vis(lb, endY);
    show(stream, streamOn);
    if (streamOn) {
      const y0 = Math.max(lb, win0), y1 = Math.min(endY, win1);
      const n = Math.max(10, Math.min(mob ? 40 : 70, Math.round((y1 - y0) / 24)));
      const dTurn = Math.min(0.9 * vh, (endY - lb) * 0.85) || 1;
      const spine = (y: number): Pt => {
        const u = clamp((y - lb) / dTurn), x = sx + (cx - sx) * (1 - sm(u));
        const meander = (mob ? 2 : 5) * Math.sin(y * 0.012 + s * 0.01) * sm(u) * (1 - clamp((y - (endY - 60)) / 60) * 0.7);
        return [x + meander, y];
      };
      const width = (y: number) => W0 * sw * (1 + 0.9 * (1 - sm((y - lb) / (0.3 * vh))) + (L > 0 ? 2.2 : 1.2) * Math.exp(-(endY - y) / 16));
      const left: Poly = [], right: Poly = [];
      for (let i = 0; i <= n; i++) {
        const y = lerp(y0, y1, i / n), a = spine(y - 1), b = spine(y + 1), c = spine(y);
        let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
        const w = width(y) / 2;
        left.push([c[0] - ty * w, c[1] + tx * w]); right.push([c[0] + ty * w, c[1] - tx * w]);
      }
      stream.setAttribute('d', smoothPath([...left, ...right.reverse()]));
      stream.setAttribute('fill', liq); stream.setAttribute('stroke-opacity', String(0.2 * sm(melt)));
    }
    const b1 = (mob ? 0 : 7) * sm(melt / 0.7);
    if (headOn || streamOn) {
      const gy0 = Math.max(cy - Lh, win0) - 40, gy1 = Math.min(Math.max(endY, cy + Lh) + 40, win1 + 40);
      setBlur(bodyG, fa, 'hm-goo-a', b1, Math.min(cx - Lh, sx - 40) - 40, gy0, Math.abs(cx - sx) + 2 * Lh + 120, gy1 - gy0);
    } else bodyG.removeAttribute('filter');
    show(bodyG, headOn || streamOn);

    const poolOn = L > 0.002 && vis(A.y, A.b);
    show(poolG, poolOn);
    if (poolOn) {
      const stepX = mob ? 16 : 8, pts: Poly = [], back: Poly = [];
      const lift = 9 * sm(L * 8), bump = (mob ? 0 : 5) * thin * sm(L * 6);
      for (let x = 0; x <= vw + stepX; x += stepX) {
        const w = amp * (0.6 * Math.sin(x * 0.011 + ph) + 0.4 * Math.sin(x * 0.026 - ph * 1.4)) + bump * Math.exp(-(((x - sx) / 120) ** 2)) * Math.sin((x - sx) * 0.09 - s * 0.06);
        const w2 = amp * (0.6 * Math.sin(x * 0.009 - ph * 0.8 + 1.7) + 0.4 * Math.sin(x * 0.02 + ph * 1.1));
        pts.push([x, Y + w]); back.push([x, Y - lift + w2]);
      }
      const close = (p: Poly) => 'M0 ' + (A.b + 2) + 'L' + p.map((qq) => f1(qq[0]) + ' ' + f1(qq[1])).join('L') + 'L' + (vw + stepX) + ' ' + (A.b + 2) + 'Z';
      const cd = close(pts);
      pool.setAttribute('d', cd); poolShade.setAttribute('d', cd); poolBack.setAttribute('d', close(back));
      const line = 'M' + pts.map((qq) => f1(qq[0]) + ' ' + f1(qq[1])).join('L');
      sheen.setAttribute('d', line); edge.setAttribute('d', line);
    }

    // ===== 3. drip -> solid logo -> watermark behind Work; 4. outline -> borders of the project previews =====
    const g = clamp((s - m.gS) / m.gD);
    const o = clamp((s - m.oS) / m.oD);
    const wmOn = g > 0.001 && o < 1 && vis(A.b - 40, B.b + 40);
    show(dripG, wmOn);
    if (wmOn) {
      const gA = sm(g / 0.35), gB = clamp((g - 0.25) / 0.75), fall = sm(gB);
      const r = (mob ? 15 : 20) + 6 * gA;
      const hang = A.b + 14 + (mob ? 46 : 70) * gA;
      const ycur = lerp(hang, m.wmCy, fall);
      const neckK = 1 - sm((g - 0.28) / 0.3);
      show(base, neckK > 0.01); show(neck, neckK > 0.01);
      if (neckK > 0.01) {
        base.setAttribute('d', smoothPath(UNIT.map(([ux, uy]) => [cx + ux * 60 * neckK, A.b - 6 + uy * 14 * neckK])));
        const nw = 8 * neckK;
        neck.setAttribute('d', `M${f1(cx - nw)} ${A.b - 6}L${f1(cx + nw)} ${A.b - 6}L${f1(cx + nw * 0.5)} ${f1(ycur)}L${f1(cx - nw * 0.5)} ${f1(ycur)}Z`);
      }
      const bulb1: Poly = UNIT.map(([ux, uy]) => [cx + ux * r, ycur - r * 0.55 + uy * r]);
      const bulb2: Poly = UNIT.map(([ux, uy]) => [cx + ux * r * 0.85, ycur + r * 0.6 + uy * r * 0.8]);
      const dy = ycur - m.wmCy;
      const t = fall;
      const col = mix(LIQ, INK, sm((gB - 0.4) / 0.4));
      dripG.setAttribute('opacity', String(o > 0 ? 1 : lerp(1, WM_OP, sm((gB - 0.4) / 0.6))));
      const o1 = sm(o / 0.3), o2 = sm((o - 0.2) / 0.3), o3 = sm((o - 0.5) / 0.5);
      const sepA = 0.12 * m.Wh * o2 * (1 - o3);
      const useDrop = t < 0.999;
      const baseA = useDrop ? morph(bulb1, shift(m.WP1, 0, dy), t) : null, baseB = useDrop ? morph(bulb2, shift(m.WP2, 0, dy), t) : null;
      const nT = m.thumbs.length;
      const sA: Pt = [0.27 * sepA, -0.96 * sepA], sB: Pt = [-0.27 * sepA, 0.96 * sepA];
      let polyA: Poly | null = null, polyB: Poly | null = null;
      if (o3 > 0.001 && nT > 0) { polyA = morph(shift(m.WP1, sA[0], sA[1]), m.RP[0], o3); polyB = morph(shift(m.WP2, sB[0], sB[1]), m.RP[nT - 1], o3); }
      const place = (e: SVGElement, exactD: string, bs: Poly | null, poly: Poly | null, sep: Pt) => {
        if (poly) setPoly(e, poly); else if (bs) setPoly(e, bs); else setExact(e, exactD, cx, m.wmCy, m.kw, sep[0], sep[1]);
      };
      place(wm1, D1, baseA, polyA, sA); place(wm2, D2, baseB, polyB, sB);
      for (const e of [wm1, wm2]) {
        e.setAttribute('fill', col);
        e.setAttribute('fill-opacity', String(o > 0 ? WM_OP * (1 - o1) : 1));
        e.setAttribute('stroke', INK); e.setAttribute('stroke-width', '1');
        e.setAttribute('stroke-opacity', String(BORDER_A * o1));
      }
      const b2 = (mob ? 0 : 5) * (1 - sm((gB - 0.2) / 0.35)) * (o > 0 ? 0 : 1);
      setBlur(dripG, fb, 'hm-goo-b', b2, cx - m.Wh, Math.min(A.b - 40, ycur - m.Wh), 2 * m.Wh, ycur - A.b + 2 * m.Wh);
    }

    // borders: drawn by the outline, then they stay (the CSS borders of these previews are hidden while this layer is active)
    const nT = m.thumbs.length;
    const bOn = o > 0.001 && nT > 0;
    show(borderG, bOn);
    if (bOn) {
      const dp = sm((o - 0.55) / 0.45);
      borders.forEach((b, i) => {
        const done = o >= 1, last = i === nT - 1 && done;
        const mid = i > 0 && i < nT - 1;
        show(b, (mid || done) && !last);
        b.setAttribute('stroke-dashoffset', String(done ? 0 : mid ? 1 - dp : 1));
      });
    }

    // ===== 5. one border unspools into a line that traces a symbol beside each service, then gathers into the logo =====
    const p5 = clamp((s - m.s5a) / (m.s5b - m.s5a));
    const gp = sm((p5 - 0.82) / 0.18);
    const Q = m.Q;
    if (Q && o >= 1) {
      const f = m.Lb + (Q.L - m.Lb) * p5;
      const len = (m.Lb + (260 - m.Lb) * sm(p5 / 0.35)) * (1 - sm((p5 - 0.85) / 0.15));
      const b = Math.max(0, f - len);
      const w = slice(Q, b, f);
      snake.setAttribute('d', lineD(w));
      show(snake, w.length > 1);
      const warm = 1 + 0.8 * sm(p5 * 4);
      snake.setAttribute('stroke-opacity', String(Math.min(LINE_A, BORDER_A * warm)));
      m.iconLines.forEach((ln, i) => {
        const [qa0, qb0] = m.qIcon[i], fr = clamp((f - qa0) / (qb0 - qa0));
        const sl = slice(ln, 0, ln.L * fr);
        icons[i].setAttribute('d', lineD(sl)); show(icons[i], sl.length > 1);
      });
    } else { show(snake, false); icons.forEach((e) => show(e, false)); }

    // ===== 6. the process path =====
    const c1 = m.circles[0], PP = m.PP;
    let reached = 0;
    if (PP && c1) {
      const span = (m.circles[m.circles.length - 1].cy + 0.2 * vh) - c1.cy;
      const dist = clamp((s + m.lead - c1.cy) / (span || 1)) * PP.L;
      const dd = s >= m.s6b ? Math.max(dist, 30) : 0;
      const sl = slice(PP, 0, dd);
      procPath.setAttribute('d', lineD(sl)); show(procPath, sl.length > 1);
      m.pc.forEach((d) => { if (dist >= d - 1) reached++; });
    }
    stepItems.forEach((li, i) => li.classList.toggle('is-reached', i < reached));

    // ===== the logo itself: heading -> process -> contact pool -> footer =====
    const u6 = sm((s - m.s6a) / (m.s6b - m.s6a));
    const em = sm((s - m.se0) / (m.se1 - m.se0));
    const u7 = sm((s - m.s7a) / (m.s7b - m.s7a));
    const rip = clamp((s - m.s7b) / (m.s7c - m.s7b));
    const u8 = clamp((s - m.s8a) / (m.s8b - m.s8a));
    const { G, PL, FL, px, py } = m;
    const logoAt = (x: number, y: number, kk: number): [Poly, Poly] => [P1.map(([a, bb]): Pt => [x + (a - CX0) * kk, y + (bb - CY0) * kk]), P2.map(([a, bb]): Pt => [x + (a - CX0) * kk, y + (bb - CY0) * kk])];
    const poolPolys = (x: number, y: number, rx: number, ry: number): [Poly, Poly] => [UNIT.map(([ux, uy]): Pt => [x + ux * rx, y - 2 + uy * ry]), UNIT.map(([ux, uy]): Pt => [x + 10 + ux * rx * 0.9, y + 3 + uy * ry * 0.8])];
    let lgOn = false;
    let polys: [Poly, Poly] | null = null, exact: [number, number, number] | null = null;
    let fill = 1, color = INK, strokeA = 0, strokeC = INK, blur = 0, hi = 0, hix = 0, hiy = 0;
    if (s >= m.s8a) {                                      // 8. pool -> droplet -> footer logo
      lgOn = true;
      const c = sm(u8 / 0.28), tr = sm((u8 - 0.22) / 0.55), rf = sm((u8 - 0.7) / 0.3);
      const x = lerp(px, FL.cx, tr) + (mob ? 8 : 22) * Math.sin(tr * Math.PI), y = lerp(py, FL.cy, tr);
      const drop = poolPolys(x, y, lerp(m.prx, 14, c), lerp(m.pry, 16, c)), logo = logoAt(FL.cx, FL.cy, m.kF);
      if (rf >= 0.999) exact = [FL.cx, FL.cy, m.kF]; else polys = [morph(drop[0], logo[0], rf), morph(drop[1], logo[1], rf)];
      color = mix(LIQ, INK, rf); strokeA = 0.22 * (1 - rf); strokeC = SHADE; blur = (mob ? 0 : 5) * sm(c * 2) * (1 - rf);
    } else if (s >= m.s7a) {                               // 7. logo -> small pool of liquid
      lgOn = true;
      const logo = logoAt(PL.cx, PL.cy, m.kP), pl = poolPolys(px, py, m.prx * (1 + 0.025 * Math.sin(s * 0.03)), m.pry);
      if (u7 <= 0) exact = [PL.cx, PL.cy, m.kP]; else polys = [morph(logo[0], pl[0], u7), morph(logo[1], pl[1], u7)];
      color = mix(INK, LIQ, u7); strokeA = 0.22 * u7; strokeC = SHADE; blur = (mob ? 0 : 6) * Math.sin(u7 * Math.PI);
      hi = sm((u7 - 0.6) / 0.4); hix = px - m.prx * 0.25; hiy = py - m.pry * 0.35;
    } else if (s >= m.se0) {                               // 6. path reconnects into the logo
      lgOn = true;
      const kk = m.kP * Math.max(0.02, em);
      exact = em >= 0.999 ? [PL.cx, PL.cy, m.kP] : null;
      if (!exact) polys = logoAt(PL.cx, PL.cy, kk);
      fill = sm((em - 0.5) / 0.5); strokeA = LINE_A * (1 - fill);
    } else if (s >= m.s6a && u6 < 0.999) {                 // 6. logo unfolds into the start of the path
      lgOn = true;
      const logo = logoAt(G.cx, G.cy, m.kG), c1x = c1 ? c1.cx : G.cx, c1y = c1 ? c1.cy : G.cy;
      const l1 = ellipse(c1x, c1y, 18, 5), l2 = ellipse(c1x, c1y, 15, 4);
      polys = [morph(logo[0], l1, u6), morph(logo[1], l2, u6)];
      fill = 1 - sm(u6 * 2); strokeA = LINE_A * sm(u6 * 3);
    } else if (s < m.s6a && gp > 0.001 && o >= 1) {        // 5. the line gathers into the logo beside the heading
      lgOn = true;
      const kk = m.kG * Math.max(0.02, gp);
      exact = gp >= 0.999 ? [G.cx, G.cy, m.kG] : null;
      if (!exact) polys = logoAt(G.cx, G.cy, kk);
      fill = sm((gp - 0.5) / 0.5); strokeA = LINE_A * (1 - fill);
    }
    show(lgG, lgOn);
    if (lgOn) {
      const d1 = D1, d2 = D2;
      if (exact) { setExact(lg1, d1, exact[0], exact[1], exact[2]); setExact(lg2, d2, exact[0], exact[1], exact[2]); }
      else if (polys) { setPoly(lg1, polys[0]); setPoly(lg2, polys[1]); }
      for (const e of [lg1, lg2]) { e.setAttribute('fill', color); e.setAttribute('fill-opacity', String(fill)); e.setAttribute('stroke', strokeC); e.setAttribute('stroke-opacity', String(strokeA)); e.setAttribute('stroke-width', '1'); }
      show(poolHi, hi > 0.01);
      if (hi > 0.01) { poolHi.setAttribute('d', smoothPath(UNIT.map(([ux, uy]): Pt => [hix + ux * m.prx * 0.38, hiy + uy * m.pry * 0.2]))); poolHi.setAttribute('fill-opacity', String(0.8 * hi)); }
      const cxm = polys ? polys[0][0][0] : px;
      setBlur(lgG, fc, 'hm-goo-c', blur, Math.min(px, FL.cx, PL.cx) - 220, Math.min(PL.cy, py) - 200, Math.abs(px - PL.cx) + 440, Math.abs(FL.cy - PL.cy) + 400 + 0 * cxm);
    } else lgG.removeAttribute('filter');

    // ===== 7. a broad ripple introduces the Contact background =====
    show(ripG, rip > 0.001 && vis(F.y, F.b));
    if (rip > 0.001) {
      const e = sm(rip), rx = m.Rx * e, ry = rx * 0.5;
      ripFill.setAttribute('cx', String(px)); ripFill.setAttribute('cy', String(py)); ripFill.setAttribute('rx', String(f1(rx))); ripFill.setAttribute('ry', String(f1(ry)));
      const rings = !mob && rip < 1;
      show(ripRing1, rings); show(ripRing2, rings);
      if (rings) {
        for (const [el, k2, a] of [[ripRing1, 1, 0.7], [ripRing2, 0.82, 0.4]] as [SVGElement, number, number][]) {
          el.setAttribute('cx', String(px)); el.setAttribute('cy', String(py)); el.setAttribute('rx', String(f1(rx * k2))); el.setAttribute('ry', String(f1(ry * k2))); el.setAttribute('stroke-opacity', String(a * (1 - rip)));
        }
      }
    }
  }

  // ---------- driver ----------
  let cleanup = () => {};
  layout();
  if (reduced) {
    animated = false;
    renderStatic();
    const ro = new ResizeObserver(() => { layout(); renderStatic(); });
    ro.observe(root);
    cleanup = () => ro.disconnect();
  } else {
    gsap.registerPlugin(ScrollTrigger);
    sectionC.classList.add('hm-bd-anim');
    footerImg.style.visibility = 'hidden';
    let target = window.scrollY, cur = target, last = NaN;
    svg.style.opacity = '0';
    gsap.to(svg, { opacity: 1, duration: 1.2, delay: 0.6, ease: 'power2.out' });
    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => { target = self.scroll(); },
      onRefresh: () => { layout(); last = NaN; target = window.scrollY; }
    });
    const tick = () => {
      const d = target - cur;
      cur = Math.abs(d) > 2 * window.innerHeight || Math.abs(d) < 0.05 ? target : cur + d * 0.2;
      if (cur !== last && M) { last = cur; render(cur); }
    };
    gsap.ticker.add(tick);
    const ro = new ResizeObserver(() => { layout(); last = NaN; });
    ro.observe(root);
    const again = () => { layout(); last = NaN; };
    window.addEventListener('load', again);
    document.fonts?.ready.then(again);
    cleanup = () => { gsap.ticker.remove(tick); st.kill(); ro.disconnect(); window.removeEventListener('load', again); sectionC.classList.remove('hm-bd-anim'); footerImg.style.visibility = ''; };
  }
  return cleanup;
}
