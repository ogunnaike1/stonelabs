/* eslint-disable @typescript-eslint/no-explicit-any */
// Scroll choreography for the DOM stage — values ported verbatim from the design prototype (Home.dc.html).
import type gsapType from 'gsap';

export const TOTAL = 35.5;
export const LABELS: Record<string, number> = { top: 0, services: 3.9, work: 12.0, studio: 25.6, contact: 33.6 };
const SV = [3.9, 5.5, 7.1, 8.7];
const SW = 9.7, W = [12.0, 15.0, 18.0, 21.0], WP = 23.2, PC = 31.4;

type G = typeof gsapType;

export interface CinemaHandle {
  st: any;
  morph: (t: number, ks?: any[]) => void;
  trEnd: { x: number; y: number; s: number; r: number } | null;
}

export function buildCinema(g: G, root: HTMLElement, opts: { mobile: boolean; pace?: number; intro?: boolean; onChapter: (dark: boolean, chap: number) => void }): CinemaHandle {
  const q = (s: string) => root.querySelector(s) as HTMLElement, qa = (s: string) => Array.from(root.querySelectorAll(s)) as HTMLElement[];
  const Mb = opts.mobile;
  const unit = (opts.pace ?? 0.26) * (Mb ? 0.85 : 1);
  const handle: CinemaHandle = { st: null, morph: () => {}, trEnd: null };

  const svcP = q('[data-p="svc"]'), workP = q('[data-p="work"]'), procP = q('[data-p="proc"]'), conP = q('[data-p="contact"]');
  const svcT = qa('[data-svc-t]'), svcD = qa('[data-svc-d]'), svcSeg = qa('[data-svc-seg]'), svcN = qa('[data-svc-n]');
  const pw = (p: HTMLElement) => Array.from(p.querySelectorAll(':scope > [data-wipe]')) as HTMLElement[];
  const projs = qa('[data-proj]'), pl = projs.map((a) => Array.from(a.querySelectorAll('[data-pl]')) as HTMLElement[]), wseg = qa('[data-wseg]');
  const stages = qa('[data-stage]'), sl = stages.map((a) => Array.from(a.querySelectorAll('[data-sl]')) as HTMLElement[]), stn = qa('[data-stn]');
  const cl = qa('[data-cl]'), letters = qa('[data-ch]');

  const SHOW = 'inset(-10% 0% -10% 0%)', HR = 'inset(-10% 100% -10% 0%)', HL = 'inset(-10% 0% -10% 100%)';
  const VT = 'inset(100% 0% -10% 0%)', VB = 'inset(-10% 0% 100% 0%)';
  g.set([...qa('[data-wipe]'), ...svcT, ...svcD, ...pl.flat(), ...cl], { clipPath: HR });
  g.set(sl.flat(), { clipPath: VT });

  // Page-load intro. Starts once the white curtain begins to lift (see StoneSite). Only touches properties the scroll timeline leaves alone
  // (word container, [data-hero-in] children, [data-hf-in], rail, travelling-logo wrapper), and is skipped when the layout is rebuilt on resize.
  const intro = opts.intro !== false;
  if (intro) {
    g.from(q('[data-l="word"]'), { opacity: 0, y: 70, letterSpacing: '0.06em', duration: 1.6, delay: 0.6, ease: 'expo.out' });
    g.from(qa('[data-hero-in]'), { opacity: 0, y: 24, duration: 0.9, stagger: 0.07, delay: 1.1, ease: 'power3.out' });
    g.from(q('[data-rail]'), { opacity: 0, duration: 1, delay: 1.4 });
  }
  g.fromTo(q('[data-cue]'), { yPercent: -100 }, { yPercent: 300, duration: 1.6, ease: 'power2.inOut', repeat: -1 });

  const tl = g.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: root, start: 'top top', end: () => '+=' + Math.round(window.innerHeight * unit * TOTAL), pin: true, scrub: Mb ? 0.6 : 0.9, anticipatePin: 1, invalidateOnRefresh: true }
  });
  handle.st = tl.scrollTrigger;
  tl.eventCallback('onUpdate', () => {
    const t = tl.time(), d = false;
    const c = t < 2.6 ? -1 : t < SW + 0.6 ? 0 : t < WP + 0.8 ? 1 : t < PC + 0.8 ? 2 : 3;
    handle.morph(t);
    opts.onChapter(d, c);
  });
  const wIn = (els: any, at: number, st = 0.07) => tl.fromTo(els, { clipPath: HR, x: 56 }, { clipPath: SHOW, x: 0, duration: 0.6, stagger: st, ease: 'power3.out', immediateRender: false }, at);
  const wOut = (els: any, at: number, st = 0.04) => tl.fromTo(els, { clipPath: SHOW, x: 0 }, { clipPath: HL, x: -56, duration: 0.45, stagger: st, ease: 'power2.in', immediateRender: false }, at);
  const vIn = (els: any, at: number) => tl.fromTo(els, { clipPath: VT, y: -30 }, { clipPath: SHOW, y: 0, duration: 0.55, stagger: 0.06, ease: 'power3.out', immediateRender: false }, at);
  const vOut = (els: any, at: number) => tl.fromTo(els, { clipPath: SHOW, y: 0 }, { clipPath: VB, y: 30, duration: 0.4, stagger: 0.03, ease: 'power2.in', immediateRender: false }, at);

  // HERO — type flies through the camera
  tl.to(letters, { z: (i: number) => 380 + Math.abs(i - 4.5) * 140, xPercent: (i: number) => (i - 4.5) * 34, opacity: 0, duration: 1.7, ease: 'power2.in', stagger: { each: 0.035, from: 'center' } }, 0.05)
    .to(qa('[data-hero-l]'), { x: -80, opacity: 0, duration: 0.7, ease: 'power1.in' }, 0)
    .to(qa('[data-hero-r]'), { x: 80, opacity: 0, duration: 0.7, ease: 'power1.in' }, 0)
    .to(q('[data-hero-c]'), { y: 40, opacity: 0, duration: 0.5, ease: 'power1.in' }, 0)
    .set(q('[data-l="heroUI"]'), { autoAlpha: 0 }, 0.75);

  // HERO → SERVICES
  tl.set(svcP, { autoAlpha: 1 }, 3.0);
  wIn(pw(svcP), 3.1, 0.12); wIn(svcT[0], 3.3); wIn(svcD[0], 3.5);
  tl.to(svcSeg[0], { scaleX: 1, duration: 0.6 }, 3.4).to(svcN[0], { color: '#111', duration: 0.3 }, 3.4);

  // SERVICES
  for (let k = 1; k < 4; k++) {
    const at = SV[k] - 0.7;
    wOut(svcT[k - 1], at); wOut(svcD[k - 1], at + 0.02);
    wIn(svcT[k], at + 0.35); wIn(svcD[k], at + 0.45);
    tl.to(svcSeg[k], { scaleX: 1, duration: 0.8 }, at)
      .to(svcN[k], { color: '#111', duration: 0.3 }, at + 0.3)
      .to(svcN[k - 1], { color: '#8a857d', duration: 0.3 }, at + 0.3);
  }

  // SERVICES → WORK
  wOut([pw(svcP)[0], svcT[3], svcD[3], pw(svcP)[1]], SW, 0.05);
  tl.set(svcP, { autoAlpha: 0 }, SW + 0.7)
    .set(workP, { autoAlpha: 1 }, SW + 1.5)
    .set(projs[0], { autoAlpha: 1 }, SW + 1.5);
  wIn(pw(workP)[0], SW + 1.5); wIn(pl[0], SW + 1.7); wIn(pw(workP)[1], SW + 1.9);
  tl.to(wseg[0], { scaleX: 1, duration: 0.6 }, SW + 1.8);

  // WORK
  for (let k = 0; k < 3; k++) {
    const T = W[k] + 2.2;
    wOut(pl[k], T);
    tl.set(projs[k], { autoAlpha: 0 }, T + 0.5).set(projs[k + 1], { autoAlpha: 1 }, T + 0.5);
    wIn(pl[k + 1], T + 0.45);
    tl.to(q('[data-counter]'), { yPercent: -25 * (k + 1), duration: 0.5, ease: 'power3.inOut' }, T + 0.3)
      .to(wseg[k + 1], { scaleX: 1, duration: 0.8 }, T);
  }

  // WORK → PROCESS
  wOut([pw(workP)[0], ...pl[3], pw(workP)[1]], WP, 0.04);
  tl.set(workP, { autoAlpha: 0 }, WP + 0.7).set(procP, { autoAlpha: 1 }, WP + 1.6);
  wIn(pw(procP).slice(0, 2), WP + 1.7, 0.12); vIn(sl[0], WP + 2.0); wIn(pw(procP)[2], WP + 2.1);
  tl.to(stn[0], { color: '#111', duration: 0.3 }, WP + 2.1);

  // PROCESS
  const PS = [25.6, 27.2, 28.8, 30.4];
  for (let k = 1; k < 4; k++) {
    const at = PS[k] - 0.6;
    vOut(sl[k - 1], at); vIn(sl[k], at + 0.3);
    tl.to(stn[k], { color: '#111', duration: 0.3 }, at + 0.3).to(stn[k - 1], { color: '#8a857d', duration: 0.3 }, at + 0.3);
  }

  // PROCESS → CONTACT
  vOut(sl[3], PC); wOut(pw(procP), PC, 0.05);
  tl.set(procP, { autoAlpha: 0 }, PC + 0.6)
    .to(q('[data-l="bgBlack"]'), { opacity: 1, duration: 1.2 }, PC + 0.6)
    .set(conP, { autoAlpha: 1 }, PC + 1.6);
  wIn(pw(conP)[0], PC + 1.7); wIn(cl, PC + 1.8, 0.12); wIn(pw(conP).slice(1), PC + 2.2, 0.12);

  // dark chapter backdrop + linking layers
  tl.to(q('[data-l="bgGraph"]'), { opacity: 1, duration: 1.2 }, SW + 0.6).to(q('[data-l="bgGraph"]'), { opacity: 0, duration: 1.2 }, WP + 0.2);
  const gw = qa('[data-gw]'), GR = [[2.6, SW + 0.8], [SW + 1.2, WP], [WP + 1.4, PC + 0.4]];
  g.set(gw, { x: '100vw', opacity: 0 });
  gw.forEach((el, i) => {
    const [a, b] = GR[i];
    tl.set(el, { opacity: 0.14 }, a).fromTo(el, { x: '100vw' }, { x: '-150vw', duration: b - a, ease: 'none', immediateRender: false }, a).set(el, { opacity: 0 }, b);
  });
  tl.fromTo(q('[data-rail-fill]'), { scaleY: 0 }, { scaleY: 1, duration: TOTAL, ease: 'none' }, 0);

  const hf = qa('[data-hf]'), hfIn = qa('[data-hf-in]');
  if (Mb) { g.set([...hf, q('[data-rail]')], { display: 'none' }); }
  else {
    if (intro) g.from(hfIn, { opacity: 0, y: 60, rotation: 3, duration: 1.2, stagger: 0.12, delay: 0.9, ease: 'power3.out' });
    [['-22vw', '-12vh', -14, 1.5, 0.05], ['24vw', '10vh', 10, 1.35, 0.15], ['6vw', '-34vh', 7, 1.7, 0.1]].forEach(([x, y, r, sc, at], i) =>
      tl.to(hf[i], { x, y, rotation: r, scale: sc, opacity: 0, duration: 1.5, ease: 'power2.in' }, at as number));
  }

  // DOM stage: four stone-toned shapes
  const cards = qa('[data-card]'), dring = q('[data-dring]');
  if (cards.length) {
    const Wd = window.innerWidth, Hd = window.innerHeight, rs = Mb ? 0.72 : 1;
    const P = Mb ? { sx: 0.5, sy: 0.3, wx: 0.5, wy: 0.3, rx: 0.5, ry: 0.34, ex: 0.5, ey: 0.3 } : { sx: 0.73, sy: 0.47, wx: 0.31, wy: 0.5, rx: 0.3, ry: 0.52, ex: 0.7, ey: 0.48 };
    cards.forEach((c, i) => { c.style.zIndex = String(10 - i); });
    const u = Mb ? Math.min(0.27 * Hd, (0.5 * Wd) / 1.5) : 0.5 * Hd, dims = [[1, 1], [1.5, 0.95], [0.5, 1], [0.8, 1]];
    cards.forEach((c, i) => g.set(c, { width: dims[i][0] * u, height: dims[i][1] * u, xPercent: -50, yPercent: -50, x: Wd * 1.2, y: P.sy * Hd, autoAlpha: 0, transformPerspective: 1400 }));
    g.set(dring, { x: P.rx * Wd, y: P.ry * Hd, scale: rs, autoAlpha: 0 });
    const svcPose = (i: number, a: number): any => { const d = i - a; return d < 0 ? { x: P.sx * Wd - 0.12 * Wd, y: P.sy * Hd, scale: 0.75, rotationY: 38, rotation: 0, autoAlpha: 0 } : { x: P.sx * Wd + d * (Mb ? 0.05 : 0.09) * Wd, y: P.sy * Hd + d * 0.035 * Hd, scale: 1 - d * 0.13, rotationY: d ? -16 : -6, rotation: 0, autoAlpha: d ? 0.6 : 1 }; };
    const workPose = (i: number, a: number): any => { const d = i - a, k = Mb ? 1 : 1.32; return d < 0 ? { x: -0.45 * Wd, y: P.wy * Hd, scale: k * 1.1, rotationY: 0, rotation: -9, autoAlpha: 0 } : { x: P.wx * Wd + d * 0.03 * Wd, y: P.wy * Hd - d * 0.04 * Hd, scale: k * (1 - d * 0.07), rotationY: 0, rotation: 0, autoAlpha: d ? 0.5 : 1 }; };
    const ringPose = (i: number, a: number): any => { const an = ((i * 90 - 90 + a) * Math.PI) / 180, Rr = 0.25 * Hd * rs; return { x: P.rx * Wd + Math.cos(an) * Rr, y: P.ry * Hd + Math.sin(an) * Rr, scale: Mb ? 0.26 : 0.3, rotationY: 0, rotation: 0, autoAlpha: 1 }; };
    const endPose = { x: P.ex * Wd, y: P.ey * Hd, scale: 0.04, rotationY: 0, rotation: 0, autoAlpha: 0 };
    const go = (fn: any, k: number, at: number, dur: number, ease: string, st = 0.06) => cards.forEach((c, i) => tl.to(c, { ...fn(i, k), duration: dur, ease }, at + i * st));
    cards.forEach((c, i) => tl.fromTo(c, { x: P.sx * Wd + 0.4 * Wd, y: P.sy * Hd + 0.12 * Hd, rotationY: -50, scale: 0.7, autoAlpha: 0 }, { ...svcPose(i, 0), duration: 1.3, ease: 'power3.out', immediateRender: false }, 2.5 + i * 0.14));
    for (let k = 1; k < 4; k++) go(svcPose, k, SV[k] - 0.7, 0.9, 'power2.inOut', 0.03);
    go(workPose, 0, SW + 0.1, 1.9, 'power3.inOut', 0.07);
    for (let k = 0; k < 3; k++) go(workPose, k + 1, W[k] + 2.2, 1.0, 'power3.inOut', 0.03);
    go(ringPose, 0, WP + 0.2, 1.8, 'power3.inOut', 0.08);
    const ring = { a: 0 };
    tl.fromTo(dring, { autoAlpha: 0, scale: rs * 0.6 }, { autoAlpha: 0.6, scale: rs, duration: 0.9, ease: 'power3.out', immediateRender: false }, WP + 0.9)
      .fromTo(ring, { a: 0 }, { a: 360, duration: PC - (WP + 2.2), ease: 'none', immediateRender: false, onUpdate: () => { cards.forEach((c, i) => g.set(c, ringPose(i, ring.a))); g.set(dring, { rotation: ring.a }); } }, WP + 2.2);
    cards.forEach((c, i) => tl.to(c, { ...endPose, duration: 1.4, ease: 'power3.in' }, PC + i * 0.08));
    tl.to(dring, { x: P.ex * Wd, y: P.ey * Hd, scale: rs * 0.74, duration: 1.6, ease: 'power3.inOut' }, PC + 0.2);
  }

  // Travelling two-stone logo
  const wrap = document.querySelector('[data-trav-wrap]') as HTMLElement | null;
  if (wrap) {
    const trav = wrap.querySelector('[data-trav]') as SVGElement, svg = wrap.querySelector('svg') as SVGSVGElement, full = svg.querySelector('[data-p-full]') as SVGPathElement, trail = svg.querySelector('[data-p-trail]') as SVGPathElement;
    const Wd = window.innerWidth, Hd = window.innerHeight; svg.setAttribute('viewBox', '0 0 ' + Wd + ' ' + Hd);
    const wp = Mb ? [[0.5, 0.5], [0.4, 0.46], [0.85, 0.16], [0.78, 0.13], [0.88, 0.2], [0.5, 0.34], [0.5, 0.3]] : [[0.5, 0.52], [0.4, 0.46], [0.86, 0.2], [0.82, 0.15], [0.6, 0.2], [0.3, 0.52], [0.7, 0.48]];
    const pts = wp.map(([x, y]) => [x * Wd, y * Hd]);
    const seg = (i: number) => { const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)]; return [p1, [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6], p2]; };
    let d = 'M' + pts[0][0] + ' ' + pts[0][1], acc = 0; const cum = [0], NS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < pts.length - 1; i++) {
      const [p, c1, c2, e] = seg(i), part = 'C' + c1[0] + ' ' + c1[1] + ' ' + c2[0] + ' ' + c2[1] + ' ' + e[0] + ' ' + e[1];
      d += ' ' + part; const t = document.createElementNS(NS, 'path'); t.setAttribute('d', 'M' + p[0] + ' ' + p[1] + ' ' + part);
      svg.appendChild(t); acc += t.getTotalLength(); svg.removeChild(t); cum.push(acc);
    }
    full.setAttribute('d', d); trail.setAttribute('d', d);
    const L = full.getTotalLength() || acc; trail.style.strokeDasharray = String(L); trail.style.strokeDashoffset = String(L);
    const times = [0, 1.85, 3.6, SW, SW + 2.2, WP + 1.6, PC + 1.4], sc = [1, 1.08, 0.3, 0.3, 0.3, 0.5, 0.62], o = { u: 0 };
    const place = () => { const pt = full.getPointAtLength(o.u * L); g.set(trav, { x: pt.x, y: pt.y }); trail.style.strokeDashoffset = String(L * (1 - o.u)); };
    g.set(trav, { xPercent: -50, yPercent: -50, x: pts[0][0], y: pts[0][1], scale: 1 });
    if (intro) g.fromTo(wrap, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2, delay: 0.9 }); else g.set(wrap, { autoAlpha: 1 });
    for (let i = 0; i < 6; i++) {
      const dur = times[i + 1] - times[i];
      tl.to(o, { u: cum[i + 1] / acc, duration: dur, ease: 'power2.inOut', onUpdate: place }, times[i]).to(trav, { scale: sc[i + 1], duration: dur, ease: 'power2.inOut' }, times[i]);
    }
    tl.to(trav, { rotation: -18, duration: 1.85, ease: 'power1.inOut' }, 0).to(trav, { rotation: 0, duration: 1.75, ease: 'power2.inOut' }, 1.85)
      .to(trav, { rotation: 360, duration: PC - (WP + 2.2), ease: 'none' }, WP + 2.2);
    const st1 = trav.querySelector('[data-st1]') as SVGPathElement, st2 = trav.querySelector('[data-st2]') as SVGPathElement;
    const split = (at: number, dur: number, amt: number) => {
      const ax = 0.27 * amt, ay = 0.96 * amt, h = dur / 2;
      tl.to(st1, { x: ax, y: -ay, duration: h, ease: 'power2.out' }, at).to(st2, { x: -ax, y: ay, duration: h, ease: 'power2.out' }, at)
        .to(st1, { x: 0, y: 0, duration: h, ease: 'power3.inOut' }, at + h).to(st2, { x: 0, y: 0, duration: h, ease: 'power3.inOut' }, at + h);
    };
    split(0.2, 1.9, 120); split(SW + 0.1, 2.0, 150); split(PC + 0.2, 1.8, 110);
    // shape morphing
    const TOPP = [[150, 620], [150, 500, 220, 420, 330, 330], [480, 210, 650, 125, 830, 125], [980, 125, 1090, 230, 1090, 355], [1090, 440, 1040, 478, 930, 478], [760, 485, 640, 520, 520, 610], [420, 690, 360, 755, 260, 755], [190, 755, 150, 700, 150, 620]];
    const BOTP = [[170, 865], [165, 815, 215, 797, 290, 790], [450, 775, 560, 720, 660, 625], [750, 550, 820, 520, 905, 520], [1050, 520, 1095, 620, 1095, 720], [1095, 850, 1030, 975, 950, 1060], [870, 1130, 770, 1142, 660, 1142], [510, 1142, 330, 1060, 230, 985], [195, 955, 172, 910, 170, 865]];
    const flat = (P: number[][]) => [...P[0], ...P.slice(1).flat()];
    const ell = (n: number, cx: number, cy: number, rx: number, ry: number) => {
      const ph = Math.PI, pt = (a: number) => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)], dv = (a: number) => [-rx * Math.sin(a), ry * Math.cos(a)], da = (2 * Math.PI) / n, k = (4 / 3) * Math.tan(da / 4), out = [...pt(ph)];
      for (let i = 0; i < n; i++) { const a0 = ph + i * da, a1 = a0 + da, p0 = pt(a0), p1 = pt(a1), t0 = dv(a0), t1 = dv(a1); out.push(p0[0] + k * t0[0], p0[1] + k * t0[1], p1[0] - k * t1[0], p1[1] - k * t1[1], p1[0], p1[1]); }
      return out;
    };
    const toD = (a: number[]) => { let dd = 'M' + a[0] + ' ' + a[1]; for (let i = 2; i < a.length; i += 6) dd += 'C' + a.slice(i, i + 6).join(' '); return dd + 'Z'; };
    const SH: Record<string, number[][]> = {
      L: [flat(TOPP), flat(BOTP)],
      A: [ell(7, 470, 633, 300, 300), ell(8, 790, 633, 300, 300)],
      B: [ell(7, 622, 430, 480, 150), ell(8, 622, 850, 480, 150)],
      C: [ell(7, 450, 633, 150, 470), ell(8, 800, 633, 150, 470)],
      D: [ell(7, 622, 360, 240, 240), ell(8, 622, 830, 390, 300)],
      R: [ell(7, 622, 633, 430, 430), ell(8, 622, 633, 290, 290)]
    };
    const keys: any[] = [[0.3, 'B', 1.3], [1.9, 'L', 1.0], [2.9, 'A', 0.9], [SV[1] - 0.7, 'B', 0.9], [SV[2] - 0.7, 'C', 0.9], [SV[3] - 0.7, 'D', 0.9], [SW + 0.1, 'L', 1.8], [W[1] + 0.4, 'B', 1.0], [W[2] + 0.4, 'C', 1.0], [W[3] + 0.4, 'D', 1.0], [WP + 0.3, 'R', 1.6], [PC + 0.1, 'L', 1.6]];
    const mEase = g.parseEase('power3.inOut'), sg = trav.querySelector('[data-sg]') as SVGElement;
    handle.morph = (t: number, ks: any[] = keys) => {
      let i = -1; for (let k = 0; k < ks.length; k++) if (ks[k][0] <= t) i = k;
      const cur = i < 0 ? 'L' : ks[i][1], prev = i <= 0 ? 'L' : ks[i - 1][1];
      const e = i < 0 ? 1 : mEase(Math.min(1, (t - ks[i][0]) / ks[i][2])), from = SH[prev], to = SH[cur];
      const SM: Record<string, number> = { L: 1, A: 1.3, B: 0.82, C: 1.12, D: 0.78, R: 1.5 }, bump = i < 0 ? 0 : (i % 2 ? -0.22 : 0.22) * Math.sin(Math.PI * e);
      g.set(sg, { scale: (SM[prev] + (SM[cur] - SM[prev]) * e) * (1 + bump), svgOrigin: '622 633' });
      st1.setAttribute('d', toD(from[0].map((v, j) => v + (to[0][j] - v) * e)));
      st2.setAttribute('d', toD(from[1].map((v, j) => v + (to[1][j] - v) * e)));
    };
    handle.morph(0);
    const tint = (at: number, c1: string, c2: string, ln: string) => tl.to(st1, { fill: c1, duration: 1.2 }, at).to(st2, { fill: c2, duration: 1.2 }, at).to([trail], { stroke: ln, duration: 1.2 }, at);
    tint(2.2, '#111', '#8d9196', '#111'); tint(SW + 0.6, '#111', '#a7a198', '#111'); tint(WP + 0.2, '#111', '#a7a198', '#111'); tint(PC + 0.6, '#111', '#8a857d', '#111');
    tl.to(trav, { scale: '+=0.12', duration: 0.5, yoyo: true, repeat: 1, ease: 'sine.inOut' }, W[1] + 0.9);
    handle.trEnd = { x: pts[6][0], y: pts[6][1], s: 0.62, r: 360 };
  }
  tl.to({}, { duration: 0.01 }, TOTAL);
  return handle;
}

export function buildFooter(g: G, ST: any, f: HTMLElement, handle: CinemaHandle | null) {
  const q = (x: string) => f.querySelector(x) as HTMLElement, qa = (x: string) => Array.from(f.querySelectorAll(x)) as HTMLElement[];
  g.to(q('[data-forbit]'), { rotation: 360, duration: 7, ease: 'none', repeat: -1 });
  g.to(q('[data-fring]'), { rotation: -360, scale: 1.06, duration: 14, ease: 'sine.inOut', repeat: -1, yoyo: true });
  const hh = qa('[data-fh]'), cols = qa('[data-fcol]');
  g.set(hh, { yPercent: 110 }); g.set(cols, { y: 28, autoAlpha: 0 }); g.set(q('[data-frule]'), { scaleX: 0 });
  g.timeline({ scrollTrigger: { trigger: f, start: 'top 70%', toggleActions: 'play none none reverse' }, defaults: { ease: 'power3.out' } })
    .to(hh, { yPercent: 0, duration: 1.0, stagger: 0.12 }, 0)
    .to(q('[data-frule]'), { scaleX: 1, duration: 1.2, ease: 'power2.inOut' }, 0.4)
    .to(cols, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 }, 0.3);
  const cleanups: Array<() => void> = [];

  // footer handoff: travelling logo lands on the footer ring logo
  const wrap = document.querySelector('[data-trav-wrap]') as HTMLElement | null, end = handle && handle.trEnd, img = q('[data-fimg]');
  if (wrap && end && img && handle) {
    const trav = wrap.querySelector('[data-trav]') as SVGElement, st1 = wrap.querySelector('[data-st1]') as SVGElement, st2 = wrap.querySelector('[data-st2]') as SVGElement, ease = g.parseEase('power2.inOut');
    const fk = [[0, 'A', 0.22], [0.28, 'D', 0.22], [0.54, 'B', 0.22], [0.78, 'L', 0.2]];
    const abs = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY, ringW = q('[data-fring]').parentElement as HTMLElement;
    const upd = (st: any) => {
      const pr = st.progress, p = ease(pr), r = img.getBoundingClientRect(), W0 = window.innerWidth;
      img.style.opacity = pr >= 1 ? '1' : '0'; wrap.style.visibility = pr >= 1 ? 'hidden' : 'visible';
      // before the footer is reached the hero timeline owns the logo; only park it at the end pose once that timeline has finished
      if (pr <= 0) { if (handle.st && handle.st.progress < 0.999) return; g.set(trav, { x: end.x, y: end.y, scale: end.s, rotation: end.r }); g.set([st1, st2], { x: 0, y: 0 }); handle.morph(1e4, [[0, 'L', 1]]); return; }
      const tx = r.left + r.width / 2, ty = r.top + r.height / 2, ts = r.width / (0.34 * window.innerHeight);
      const sw = Math.sin(pr * Math.PI * 3) * 0.07 * W0 * (1 - pr), amt = 120 * Math.abs(Math.sin(pr * Math.PI * 2.5)) * (1 - pr * 0.6);
      g.set(trav, { x: end.x + (tx - end.x) * p + sw, y: end.y + (ty - end.y) * p, scale: (end.s + (ts - end.s) * p) * (1 + 0.35 * Math.sin(pr * Math.PI)), rotation: end.r + 720 * pr });
      g.set(st1, { x: 0.27 * amt, y: -0.96 * amt }); g.set(st2, { x: -0.27 * amt, y: 0.96 * amt });
      handle.morph(pr, fk);
    };
    img.style.opacity = '0';
    ST.create({ start: () => abs(f) - window.innerHeight, end: () => abs(ringW) - window.innerHeight * 0.8, onUpdate: upd, onRefresh: upd });
  }
  return () => cleanups.forEach((c) => c());
}
