'use client';
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { STONE as D } from '@/data/stone';
import { css } from '@/lib/css';
import { buildCinema, buildFooter, LABELS, TOTAL, type CinemaHandle } from '@/lib/cinema';

const STONE1 = 'M150 620C150 500 220 420 330 330C480 210 650 125 830 125C980 125 1090 230 1090 355C1090 440 1040 478 930 478C760 485 640 520 520 610C420 690 360 755 260 755C190 755 150 700 150 620Z';
const STONE2 = 'M170 865C165 815 215 797 290 790C450 775 560 720 660 625C750 550 820 520 905 520C1050 520 1095 620 1095 720C1095 850 1030 975 950 1060C870 1130 770 1142 660 1142C510 1142 330 1060 230 985C195 955 172 910 170 865Z';

const Slot = ({ label, src }: { label: string; src?: string }) => (src ? <img src={src} alt="" className="img-fill" draggable={false} /> : <div className="img-slot">{label}</div>);

const SECTION_LABEL = 'font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase';

export default function StoneSite() {
  const footerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const handleRef = useRef<CinemaHandle | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const forceMotion = useRef(false);
  const last = useRef({ dark: false, chap: -1 });
  const t0 = useRef(typeof performance !== 'undefined' ? performance.now() : 0);

  const [env, setEnv] = useState({ mode: 'cinema' as 'cinema' | 'flow', mobile: false, narrow: false, reduced: false, osReduced: false, w: 0, h: 0 });
  const [ui, setUi] = useState({ dark: false, chap: -1 });
  const [menu, setMenu] = useState(false);
  const { mode, mobile, narrow, reduced, osReduced, w: vw, h: vh } = env;

  const compute = useCallback(() => {
    const osR = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const red = osR && !forceMotion.current;
    const w = window.innerWidth, h = window.innerHeight;
    return { reduced: red, osReduced: osR, mobile: w < 820 || (w < h && w < 1000), narrow: w < 760, mode: (!red && h >= 380 ? 'cinema' : 'flow') as 'cinema' | 'flow', w, h };
  }, []);

  useEffect(() => {
    setEnv(compute());
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setEnv((prev) => { const m = compute(); // the choreography is laid out in pixels, so rebuild whenever the viewport really changes size (ignore mobile URL-bar height jitter)
        const sizeChanged = Math.abs(m.w - prev.w) > 2 || Math.abs(m.h - prev.h) > (m.mobile ? 160 : 2);
        return m.mode !== prev.mode || m.mobile !== prev.mobile || m.narrow !== prev.narrow || m.reduced !== prev.reduced || sizeChanged ? m : prev; }), 220);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, [compute]);

  // page-load intro: white curtain lifts, then the navbar eases in (hero content is staged in buildCinema)
  useEffect(() => {
    const cur = document.querySelector<HTMLElement>('[data-curtain]');
    if (!cur) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { cur.style.display = 'none'; return; }
    const ctx = gsap.context(() => {
      const hdr = document.querySelector('header');
      const tl = gsap.timeline();
      tl.to(cur, { opacity: 0, duration: 0.8, ease: 'power2.inOut', onComplete: () => { cur.style.display = 'none'; } }, 0.2);
      if (hdr) tl.from(Array.from(hdr.children), { y: -30, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', clearProps: 'transform,opacity' }, 0.55);
    });
    return () => ctx.revert();
  }, []);

  // choreography
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    last.current = { dark: false, chap: -1 };
    setUi({ dark: false, chap: -1 });
    let lenis: Lenis | null = null, tick: ((t: number) => void) | null = null, cleanFooter: (() => void) | null = null;
    if (mode === 'cinema' && !mobile) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      tick = (t: number) => lenis && lenis.raf(t * 1000);
      gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
      lenisRef.current = lenis;
    }
    const ctx = gsap.context(() => {
      handleRef.current = null;
      if (mode === 'cinema' && stageRef.current) {
        handleRef.current = buildCinema(gsap, stageRef.current, {
          mobile,
          intro: performance.now() - t0.current < 2500,
          onChapter: (dark, chap) => { if (dark !== last.current.dark || chap !== last.current.chap) { last.current = { dark, chap }; setUi({ dark, chap }); } }
        });
      }
      if (!reduced && footerRef.current) cleanFooter = buildFooter(gsap, ScrollTrigger, footerRef.current, handleRef.current);
    });
    const refresh = () => ScrollTrigger.refresh();
    document.fonts && document.fonts.ready.then(refresh);
    return () => {
      ctx.revert();
      cleanFooter && cleanFooter();
      if (tick) gsap.ticker.remove(tick);
      if (lenis) lenis.destroy();
      lenisRef.current = null; handleRef.current = null;
    };
  }, [mode, mobile, reduced, vw, vh]);

  const scrollToY = (y: number) => {
    if (lenisRef.current) lenisRef.current.scrollTo(y, { duration: 1.8 });
    else window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  };
  const goSection = (name: string) => {
    setMenu(false);
    const st = handleRef.current && handleRef.current.st;
    if (st && LABELS[name] != null) return scrollToY(st.start + (st.end - st.start) * (LABELS[name] / TOTAL));
    const el = document.getElementById(name === 'top' ? 'main' : name);
    if (el) scrollToY(name === 'top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 70);
  };
  const nav = (n: string) => (e: React.MouseEvent) => { e.preventDefault(); goSection(n); };

  const dk = ui.dark;
  const pillBg = dk ? 'rgba(22,22,22,.62)' : 'rgba(255,255,255,.74)';
  const pillShadow = dk ? '0 10px 30px -10px rgba(0,0,0,.5)' : '0 10px 30px -12px rgba(17,17,17,.18)';
  const hdrFg = dk ? '#F5F5F2' : '#111', ctaFg = dk ? '#111' : '#F5F5F2', hdrLine = dk ? 'rgba(191,195,199,.16)' : 'rgba(17,17,17,.08)';
  const glass = { background: pillBg, backdropFilter: 'blur(18px) saturate(1.2)', WebkitBackdropFilter: 'blur(18px) saturate(1.2)', border: `1px solid ${hdrLine}`, boxShadow: pillShadow, transition: 'background .5s ease,border-color .5s ease' } as const;
  const navItems = [['top', 'Home'], ['services', 'Services'], ['work', 'Work'], ['studio', 'Studio'], ['contact', 'Contact']];
  const mailto = 'mailto:' + D.contact.email;
  const projects = D.projects.map((p, i) => ({ ...p, roleText: p.role.join(' · '), hasLink: !!p.url, slot: 'work-0' + (i + 1) }));
  const goTop = nav('top'), goWork = nav('work'), goContact = nav('contact');

  return (
    <>
      <div data-curtain aria-hidden="true" className="curtain" style={css('position:fixed;inset:0;z-index:200;background:#fff;pointer-events:none')} />
      <a href="#main" className="skip">Skip to content</a>

      <header style={{ ...css('position:fixed;top:16px;left:20px;right:20px;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:12px;font-family:Satoshi,sans-serif;pointer-events:none;transition:color .5s ease'), color: hdrFg }}>
        <a href="#top" onClick={goTop} aria-label="Stone Labs — back to top" style={{ ...css('pointer-events:auto;display:flex;align-items:center;gap:10px;height:48px;padding:0 20px 0 12px;border-radius:999px'), ...glass }}>
          <img src="/assets/logo-mark.png" alt="" width={28} height={28} style={{ display: 'block', width: 28, height: 28, filter: dk ? 'invert(1)' : 'none', transition: 'filter .5s ease' }} />
          <span style={css('font:600 15px/1 Satoshi,sans-serif;letter-spacing:-.01em;white-space:nowrap')}>Stone Labs</span>
        </a>
        {!narrow && (
          <nav aria-label="Primary" style={{ ...css('pointer-events:auto;display:flex;gap:2px;padding:4px;border-radius:999px'), ...glass }}>
            {navItems.map(([k, l], i) => (
              <a key={k} href={k !== 'top' ? '/' + k : '#' + k} onClick={k !== 'top' ? undefined : nav(k)} className="nav-link" style={{ ...css('display:inline-flex;align-items:center;height:40px;padding:0 20px;border-radius:999px;font:500 14px/1 Satoshi,sans-serif;transition:background .4s ease'), background: i === 0 ? (dk ? 'rgba(245,245,242,.18)' : 'rgba(17,17,17,.09)') : 'transparent', ['--hv' as string]: dk ? 'rgba(245,245,242,.1)' : 'rgba(17,17,17,.05)' }}>{l}</a>
            ))}
          </nav>
        )}
        <div style={css('pointer-events:auto;display:flex;align-items:center;gap:8px')}>
          <a href="#contact" onClick={goContact} className="cta-pill" style={{ ...css('display:inline-flex;align-items:center;gap:14px;height:48px;padding:0 8px 0 22px;border-radius:999px;font:500 14px/1 Satoshi,sans-serif;white-space:nowrap;transition:background .5s ease,color .5s ease,gap .2s'), background: hdrFg, color: ctaFg, boxShadow: pillShadow }}>
            {narrow ? 'Start' : 'Start a Project'} <span aria-hidden="true" style={{ ...css('display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;font-size:15px;transition:background .5s ease,color .5s ease'), background: ctaFg, color: hdrFg }}>→</span>
          </a>
          {narrow && (
            <button type="button" onClick={() => setMenu(!menu)} aria-expanded={menu} aria-controls="mnav" style={{ ...css('height:48px;padding:0 18px;border-radius:999px;color:inherit;font:500 14px/1 Satoshi,sans-serif;cursor:pointer'), ...glass }}>{menu ? 'Close' : 'Menu'}</button>
          )}
        </div>
      </header>
      {narrow && menu && (
        <nav id="mnav" aria-label="Mobile" style={css("position:fixed;top:76px;left:20px;right:20px;z-index:59;background:#F5F5F2;border:1px solid rgba(17,17,17,.1);border-radius:20px;overflow:hidden;display:flex;flex-direction:column;font:500 28px/1 'Clash Display',sans-serif;color:#111")}>
          {[['top', 'Home'], ['services', 'Services'], ['work', 'Work'], ['studio', 'Studio'], ['contact', 'Contact']].map(([k, l], i) => (
            <a key={k} href={k !== 'top' ? '/' + k : '#' + k} onClick={k !== 'top' ? undefined : nav(k)} style={{ padding: 20, borderBottom: i < 4 ? '1px solid #e4e0d8' : 'none' }}>{l}</a>
          ))}
        </nav>
      )}

      <main id="main">
        {mode === 'cinema' && (
          <>
            <div data-trav-wrap aria-hidden="true" style={css('position:fixed;inset:0;pointer-events:none;z-index:45;display:block')}>
              <svg style={css('position:absolute;inset:0;width:100%;height:100%;overflow:visible')} preserveAspectRatio="none">
                <path data-p-full fill="none" stroke="#888" strokeOpacity=".55" strokeWidth="1" strokeDasharray="2 7" />
                <path data-p-trail fill="none" stroke="#111" strokeOpacity=".9" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <svg data-trav viewBox="130 105 985 1055" style={css('position:absolute;left:0;top:0;width:34vh;height:36.4vh;overflow:visible;will-change:transform')}>
                <g data-sg><path data-st1 d={STONE1} style={{ fill: '#111' }} /><path data-st2 d={STONE2} style={{ fill: '#111' }} /></g>
              </svg>
            </div>
            <section id="top" ref={stageRef} aria-label="Stone Labs" style={css('position:relative;height:100vh;overflow:hidden;background:#111;font-family:Satoshi,sans-serif')}>
              <div data-l="bgLight" style={css('position:absolute;inset:0;background:radial-gradient(ellipse 65% 85% at 50% 50%, #FFFFFF 0%, #FDFDFC 55%, #F8F8F6 100%)')} />
              <div data-l="bgGraph" style={css('position:absolute;inset:0;background:radial-gradient(ellipse 65% 85% at 50% 50%, #FFFFFF 0%, #FDFDFC 55%, #F8F8F6 100%);opacity:0')} />
              <div data-l="bgBlack" style={css('position:absolute;inset:0;background:radial-gradient(ellipse 70% 80% at 70% 45%, #FDFDFC 0%, #F6F6F4 100%);opacity:0')} />

              <div aria-hidden="true" style={css('position:absolute;left:0;right:0;top:21vh;perspective:900px;perspective-origin:50% 40%;pointer-events:none')}>
                <div data-l="word" style={css("display:flex;justify-content:center;font-family:'Clash Display',sans-serif;font-weight:300;font-size:15vw;line-height:.8;letter-spacing:-.01em;color:#292929;transform-style:preserve-3d;white-space:nowrap")}>
                  {'STONE LABS'.split('').map((c, i) => c === ' '
                    ? <span key={i} data-ch style={css('display:inline-block;width:.28em')} />
                    : <span key={i} data-ch style={css('display:inline-block')}>{c}</span>)}
                </div>
              </div>
              <h1 style={css('position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)')}>Stone Labs — Creative Digital Studio</h1>

              <div aria-hidden="true" style={css('position:absolute;inset:0;overflow:hidden;pointer-events:none')}>
                {['SERVICES', 'WORK', 'PROCESS'].map((w) => (
                  <div key={w} data-gw style={css("position:absolute;left:0;top:50%;margin-top:-12vw;font:300 24vw/1 'Clash Display',sans-serif;letter-spacing:-.03em;color:#888;white-space:nowrap;opacity:0")}>{w}</div>
                ))}
              </div>

              <div data-hframes style={css('position:absolute;inset:0;pointer-events:none')}>
                {[
                  ['left:9vw;top:31vh;width:14vw;transform:rotate(-3deg)', '4/5', '01', 'Hero frame 01 — drop image', '/images/hero-01.jpg'],
                  ['right:9vw;top:37vh;width:12vw;transform:rotate(2.5deg)', '1/1.2', '02', 'Hero frame 02 — drop image', '/images/hero-02.jpg'],
                  ['left:27vw;top:63vh;width:9vw;transform:rotate(4deg)', '1/1', '03', 'Frame 03', '/images/hero-03.jpg']
                ].map(([pos, ar, n, ph, src]) => (
                  <div key={n} data-hf style={{ ...css('position:absolute;pointer-events:auto;' + pos) }}>
                    <div data-hf-in style={css('background:#fff;padding:8px 8px 10px;box-shadow:0 1px 2px rgba(17,17,17,.08),0 28px 60px -20px rgba(17,17,17,.38)')}>
                      <div style={{ position: 'relative', aspectRatio: ar, background: '#e4e0d8' }}><Slot label={ph} src={src} /></div>
                      <div style={css('display:flex;justify-content:space-between;padding-top:10px;font:500 10px/1 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#5f5b55')}><span>Fig. {n}</span><span>2026</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div aria-hidden="true" data-rail style={css('position:absolute;left:2vw;top:30vh;height:40vh;width:1px;mix-blend-mode:difference;pointer-events:none')}>
                <span style={css('position:absolute;inset:0;background:#fff;opacity:.3')} />
                <span data-rail-fill style={css('position:absolute;inset:0;background:#fff;transform-origin:top;transform:scaleY(0)')} />
              </div>

              <div data-dom style={css('position:absolute;inset:0;pointer-events:none;display:block')}>
                <div data-dring style={css('position:absolute;left:0;top:0;width:50vh;height:50vh;margin:-25vh 0 0 -25vh;border:1px solid #fff;border-radius:50%;mix-blend-mode:difference;opacity:0;visibility:hidden')}>
                  <span style={css('position:absolute;left:50%;top:-5px;width:10px;height:10px;margin-left:-5px;border-radius:50%;background:#fff')} />
                </div>
                {[
                  ['50%', 'Motion — drop a reel still', '01 — Motion', '/images/card-01.jpg'],
                  ['10px', 'Website — drop a screenshot', '02 — Web', '/images/card-02.jpg'],
                  ['44px', 'App — drop key screens', '03 — Apps', '/images/card-03.jpg'],
                  ['999px 999px 10px 10px', 'Architecture — drop a render', '04 — 3D Viz', '/images/card-04.jpg']
                ].map(([br, ph, cap, src]) => (
                  <div key={cap} data-card style={css('position:absolute;left:0;top:0;pointer-events:auto;opacity:0;visibility:hidden')}>
                    <div style={{ ...css('position:absolute;inset:0;overflow:hidden;background:linear-gradient(150deg,#f1eee8 0%,#d9d4ca 100%);box-shadow:inset 0 0 0 1px rgba(17,17,17,.1),0 50px 90px -34px rgba(17,17,17,.6)'), borderRadius: br }}><Slot label={ph} src={src} /></div>
                    <div style={css('position:absolute;left:0;top:100%;margin-top:14px;white-space:nowrap;color:#fff;mix-blend-mode:difference;font:500 11px/1 Satoshi,sans-serif;letter-spacing:.16em;text-transform:uppercase')}>{cap}</div>
                  </div>
                ))}
              </div>

              <div data-l="heroUI" style={css('position:absolute;inset:0;pointer-events:none')}>
                <div data-hero-l style={css('position:absolute;left:4vw;top:15vh;color:#111')}>
                  <div data-hero-in style={css('display:flex;flex-direction:column;gap:6px;font:500 12px/1.3 Satoshi,sans-serif;letter-spacing:.12em;text-transform:uppercase')}><span>Creative</span><span>Digital Studio</span></div>
                </div>
                <div data-hero-r style={css('position:absolute;right:4vw;top:15vh;color:#111;text-align:right')}>
                  <div data-hero-in style={css('display:flex;flex-direction:column;gap:6px;font:500 12px/1.3 Satoshi,sans-serif;letter-spacing:.12em;text-transform:uppercase')}><span>Motion · Web · Apps</span><span>3D Visualization</span></div>
                </div>
                <div className="hero-aux" data-hero-l style={css('position:absolute;left:4vw;bottom:7vh;max-width:24ch;color:#292929')}>
                  <p data-hero-in style={{ ...css('margin:0;font:400 14px/1.5 Satoshi,sans-serif'), textWrap: 'pretty' }}>A studio for motion graphics, websites, mobile apps and 3D visualization.</p>
                </div>
                <div data-hero-c style={css('position:absolute;left:50%;bottom:6vh;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:22px;width:max-content;max-width:92vw')}>
                  <p data-hero-in style={css("margin:0;font:500 clamp(22px,2.1vw,34px)/1.05 'Clash Display',sans-serif;letter-spacing:-.01em;text-align:center;color:#111")}>Digital experiences.<br />Designed to move.</p>
                  <div data-hero-in style={css('display:flex;flex-wrap:wrap;justify-content:center;gap:10px;pointer-events:auto')}>
                    <a href="#work" onClick={goWork} className="btn-dark" style={css('display:inline-flex;align-items:center;height:46px;padding:0 22px;background:#111;color:#F5F5F2;font:500 14px/1 Satoshi,sans-serif;border-radius:2px')}>Explore Our Work</a>
                    <a href="#contact" onClick={goContact} className="btn-line" style={css('display:inline-flex;align-items:center;height:46px;padding:0 22px;border:1px solid #111;color:#111;font:500 14px/1 Satoshi,sans-serif;border-radius:2px')}>Start a Project</a>
                  </div>
                </div>
                <div className="hero-aux" data-hero-r style={css('position:absolute;right:4vw;bottom:7vh;color:#111;display:flex;align-items:center;gap:14px')}>
                  <span data-hero-in style={css('font:500 12px/1 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase')}>Scroll</span>
                  <span data-hero-in style={css('position:relative;display:block;width:1px;height:46px;background:rgba(17,17,17,.2);overflow:hidden')}><span data-cue style={css('position:absolute;left:0;top:0;width:1px;height:16px;background:#111')} /></span>
                </div>
              </div>

              <div data-p="svc" id="services" style={css('position:absolute;left:6vw;bottom:8vh;width:min(560px,88vw);color:#111;visibility:hidden;display:flex;flex-direction:column;gap:20px')}>
                <h2 data-wipe style={css(`margin:0;display:flex;gap:14px;${SECTION_LABEL};color:#4a4743`)}><span>(01)</span><span>Services</span></h2>
                <div style={{ display: 'grid' }}>
                  {D.services.map((s) => <h3 key={s.id} data-svc-t style={{ ...css("grid-area:1/1;align-self:end;margin:0;font:500 clamp(38px,4.6vw,84px)/.94 'Clash Display',sans-serif;letter-spacing:-.02em"), textWrap: 'balance' }}>{s.name}</h3>)}
                </div>
                <div style={{ display: 'grid' }}>
                  {D.services.map((s) => (
                    <div key={s.id} data-svc-d style={css('grid-area:1/1;display:flex;flex-direction:column;gap:8px')}>
                      <p style={{ ...css('margin:0;max-width:40ch;font:400 15px/1.55 Satoshi,sans-serif;color:#4a4743'), textWrap: 'pretty' }}>{s.text}</p>
                      <span style={css('font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#8a857d')}>{s.tags}</span>
                    </div>
                  ))}
                </div>
                <ol data-wipe aria-label="Services index" style={css('margin:6px 0 0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px')}>
                  {D.services.map((s) => (
                    <li key={s.id} style={css('display:flex;flex-direction:column;gap:10px')}>
                      <span style={css('position:relative;display:block;height:1px;background:rgba(17,17,17,.14)')}><span data-svc-seg style={css('position:absolute;inset:0;background:#111;transform-origin:left;transform:scaleX(0)')} /></span>
                      <span data-svc-n style={css('font:500 12px/1.3 Satoshi,sans-serif;letter-spacing:.04em;color:#8a857d')}>{s.no} {s.short}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div data-p="work" id="work" style={css('position:absolute;right:6vw;bottom:8vh;width:min(410px,88vw);color:#111;visibility:hidden;display:flex;flex-direction:column;gap:26px')}>
                <div data-wipe style={css('display:flex;justify-content:space-between;align-items:baseline;padding-bottom:14px;border-bottom:1px solid rgba(17,17,17,.14);font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#5b5852')}>
                  <h2 style={css('margin:0;font:inherit;display:flex;gap:14px')}><span>(02)</span><span>Selected Work</span></h2>
                  <span style={css('display:flex;gap:6px;color:#111')}>
                    <span style={css('display:block;height:1.2em;overflow:hidden')}><span data-counter style={css('display:flex;flex-direction:column')}>{['01', '02', '03', '04'].map((n) => <span key={n} style={{ height: '1.2em' }}>{n}</span>)}</span></span>
                    <span style={{ color: '#5b5852' }}>/ 04</span>
                  </span>
                </div>
                <div style={{ display: 'grid' }}>
                  {projects.map((p) => (
                    <article key={p.id} data-proj style={css('grid-area:1/1;align-self:end;display:flex;flex-direction:column;align-items:flex-start;gap:16px;visibility:hidden')}>
                      <div data-pl style={css('font:500 12px/1.3 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#5b5852')}>{p.serviceLabel} · {p.year}</div>
                      <h3 data-pl style={{ ...css("margin:0;font:500 clamp(32px,3.4vw,60px)/.96 'Clash Display',sans-serif;letter-spacing:-.015em"), textWrap: 'balance' }}>{p.title}</h3>
                      <p data-pl style={{ ...css('margin:0;font:400 15px/1.55 Satoshi,sans-serif;color:#5b5852;max-width:38ch'), textWrap: 'pretty' }}>{p.summary}</p>
                      <div data-pl style={css('font:500 13px/1.4 Satoshi,sans-serif;color:#111')}>{p.roleText}</div>
                      {p.hasLink && <a data-pl href={p.url} style={css('display:inline-flex;align-items:center;gap:12px;font:500 14px/1 Satoshi,sans-serif;padding:8px 0 6px;border-bottom:1px solid #111')}>View project <span aria-hidden="true">→</span></a>}
                    </article>
                  ))}
                </div>
                <div data-wipe style={css('display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px')}>
                  {[0, 1, 2, 3].map((i) => <span key={i} style={css('display:block;height:1px;background:rgba(17,17,17,.14)')}><span data-wseg style={css('display:block;height:1px;background:#111;transform-origin:left;transform:scaleX(0)')} /></span>)}
                </div>
              </div>

              <div data-p="proc" id="studio" style={css('position:absolute;right:6vw;bottom:8vh;width:min(430px,88vw);color:#111;visibility:hidden;display:flex;flex-direction:column;gap:22px')}>
                <h2 data-wipe style={css(`margin:0;display:flex;gap:14px;${SECTION_LABEL};color:#4a4743`)}><span>(03)</span><span>Studio &amp; Process</span></h2>
                <p data-wipe style={{ ...css('margin:0;font:400 clamp(17px,1.35vw,21px)/1.4 Satoshi,sans-serif;color:#4a4743'), textWrap: 'pretty' }}>An independent studio for motion, interfaces and space. Every project moves from first sketch to final build in one set of hands.</p>
                <div style={css('display:grid;padding-top:10px;border-top:1px solid rgba(17,17,17,.2)')}>
                  {D.process.map((st) => (
                    <div key={st.no} data-stage style={css('grid-area:1/1;display:flex;flex-direction:column;gap:12px;padding-top:12px')}>
                      <div data-sl style={css('display:flex;gap:18px;align-items:baseline')}>
                        <span style={css('font:500 13px/1 Satoshi,sans-serif;color:#4a4743')}>{st.no}</span>
                        <h3 style={css("margin:0;font:500 clamp(40px,4.2vw,76px)/.95 'Clash Display',sans-serif;letter-spacing:-.02em")}>{st.name}</h3>
                      </div>
                      <p data-sl style={{ ...css('margin:0;font:400 15px/1.55 Satoshi,sans-serif;color:#4a4743;max-width:38ch'), textWrap: 'pretty' }}>{st.text}</p>
                    </div>
                  ))}
                </div>
                <ol data-wipe aria-label="Process steps" style={css('margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:6px 18px;font:500 12px/1.3 Satoshi,sans-serif;letter-spacing:.1em;text-transform:uppercase')}>
                  {D.process.map((st) => <li key={st.no} data-stn style={{ color: '#8a857d' }}>{st.name}</li>)}
                </ol>
              </div>

              <div data-p="contact" id="contact" style={css('position:absolute;left:6vw;bottom:9vh;width:min(760px,88vw);color:#111;visibility:hidden;display:flex;flex-direction:column;gap:30px')}>
                <h2 data-wipe style={css(`margin:0;display:flex;gap:14px;${SECTION_LABEL};color:#4a4743`)}><span>(04)</span><span>Contact</span></h2>
                <p style={css("margin:0;font:500 clamp(46px,6.6vw,124px)/.93 'Clash Display',sans-serif;letter-spacing:-.025em")}>
                  <span data-cl style={{ display: 'block' }}>Let’s build</span>
                  <span data-cl style={{ display: 'block' }}>something</span>
                  <span data-cl style={{ display: 'block' }}>worth seeing.</span>
                </p>
                <div data-wipe style={css('display:flex;flex-wrap:wrap;align-items:center;gap:18px 28px')}>
                  <a href={mailto} className="btn-contact" style={css('display:inline-flex;align-items:center;gap:14px;height:56px;padding:0 26px;background:#111;color:#F5F5F2;font:500 16px/1 Satoshi,sans-serif;border-radius:2px')}>Start a Project <span aria-hidden="true">→</span></a>
                  <a href={mailto} style={css('font:500 clamp(17px,1.5vw,22px)/1.2 Satoshi,sans-serif;border-bottom:1px solid rgba(17,17,17,.4);padding-bottom:4px')}>{D.contact.email}</a>
                </div>
                <ul data-wipe aria-label="Social" style={css('margin:0;padding:0;list-style:none;display:flex;flex-wrap:wrap;gap:10px 26px;font:500 14px/1 Satoshi,sans-serif;color:#4a4743')}>
                  {D.contact.socials.map((so) => <li key={so.label}><a href={so.href} style={css('display:inline-block;padding:8px 0')}>{so.label}</a></li>)}
                </ul>
              </div>
            </section>
          </>
        )}

        {mode === 'flow' && (
          <>
            <section id="top" style={css('position:relative;height:100svh;min-height:560px;overflow:hidden;background:radial-gradient(ellipse 60% 60% at 50% 50%, #FFFFFF 0%, #F5F3EF 60%, #E9E5DE 100%);font-family:Satoshi,sans-serif')}>
              <h1 style={css('position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)')}>Stone Labs — Creative Digital Studio</h1>
              {reduced && osReduced && (
                <div style={css('position:absolute;left:50%;top:92px;transform:translateX(-50%);z-index:5;display:flex;align-items:center;gap:14px;padding:8px 8px 8px 16px;background:#111;color:#F5F5F2;border-radius:2px;font:500 13px/1.2 Satoshi,sans-serif;width:max-content;max-width:92vw')}>
                  <span>Animations are reduced by your system settings.</span>
                  <button type="button" onClick={() => { forceMotion.current = true; window.scrollTo(0, 0); setEnv(compute()); }} style={css('height:34px;padding:0 14px;border:0;background:#F5F5F2;color:#111;font:500 13px/1 Satoshi,sans-serif;border-radius:2px;cursor:pointer')}>Play animations</button>
                </div>
              )}
              <div aria-hidden="true" style={css("position:absolute;left:0;right:0;top:20svh;text-align:center;font:300 clamp(72px,15vw,260px)/.82 'Clash Display',sans-serif;letter-spacing:-.01em;color:#292929")}>STONE LABS</div>
              <div style={css('position:absolute;inset:0;pointer-events:none')}>
                <img src="/assets/logo-mark.png" alt="" style={css('position:absolute;left:50%;top:52%;width:min(34vh,60vw);aspect-ratio:1;transform:translate(-50%,-50%)')} />
              </div>
              <div style={css('position:absolute;left:20px;right:20px;bottom:6vh;display:flex;flex-direction:column;align-items:center;gap:18px')}>
                <p style={css("margin:0;font:500 clamp(24px,2.2vw,34px)/1.05 'Clash Display',sans-serif;text-align:center;color:#111")}>Digital experiences.<br />Designed to move.</p>
                <div style={css('display:flex;flex-wrap:wrap;justify-content:center;gap:10px')}>
                  <a href="#work" onClick={goWork} style={css('display:inline-flex;align-items:center;height:48px;padding:0 20px;background:#111;color:#F5F5F2;font:500 15px/1 Satoshi,sans-serif;border-radius:2px')}>Explore Our Work</a>
                  <a href="#contact" onClick={goContact} style={css('display:inline-flex;align-items:center;height:48px;padding:0 20px;border:1px solid #111;color:#111;font:500 15px/1 Satoshi,sans-serif;border-radius:2px')}>Start a Project</a>
                </div>
              </div>
            </section>
            <section id="services" aria-labelledby="f-svc" style={css('background:radial-gradient(ellipse 65% 85% at 50% 50%, #FFFFFF 0%, #FDFDFC 55%, #F8F8F6 100%);color:#111;padding:96px 6vw;font-family:Satoshi,sans-serif')}>
              <h2 id="f-svc" style={css(`margin:0 0 36px;${SECTION_LABEL};color:#5b5852`)}>(01) Services</h2>
              <ul style={css('margin:0;padding:0;list-style:none;border-bottom:1px solid rgba(17,17,17,.14)')}>
                {D.services.map((s) => (
                  <li key={s.id} style={css('display:grid;grid-template-columns:48px minmax(0,1fr);gap:8px 16px;padding:26px 0;border-top:1px solid rgba(17,17,17,.14)')}>
                    <span style={css('font:500 13px/1.6 Satoshi,sans-serif;color:#5b5852')}>{s.no}</span>
                    <div style={css('display:flex;flex-direction:column;gap:10px')}>
                      <h3 style={css("margin:0;font:500 clamp(28px,4vw,56px)/1 'Clash Display',sans-serif;letter-spacing:-.015em")}>{s.name}</h3>
                      <p style={css('margin:0;max-width:52ch;font:400 15px/1.55 Satoshi,sans-serif;color:#5b5852')}>{s.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <section id="work" aria-labelledby="f-work" style={css('background:radial-gradient(ellipse 65% 85% at 50% 50%, #FFFFFF 0%, #FDFDFC 55%, #F8F8F6 100%);color:#111;padding:40px 6vw 96px;font-family:Satoshi,sans-serif')}>
              <h2 id="f-work" style={css(`margin:0 0 36px;${SECTION_LABEL};color:#5b5852`)}>(02) Selected Work</h2>
              <div style={css('display:flex;flex-direction:column;gap:72px')}>
                {projects.map((p) => (
                  <article key={p.id} style={css('display:flex;flex-wrap:wrap;gap:24px 4vw;align-items:flex-end')}>
                    <div style={css('flex:1 1 520px;position:relative;aspect-ratio:16/10;background:#E4E0D8')}><Slot label={p.title + ' — key image (16:10)'} src={`/images/${p.slot}.jpg`} /></div>
                    <div style={css('flex:1 1 280px;display:flex;flex-direction:column;align-items:flex-start;gap:14px;max-width:440px')}>
                      <div style={css('font:500 12px/1.3 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#5b5852')}>{p.serviceLabel} · {p.year}</div>
                      <h3 style={css("margin:0;font:500 clamp(30px,4vw,52px)/.98 'Clash Display',sans-serif;letter-spacing:-.015em")}>{p.title}</h3>
                      <p style={css('margin:0;font:400 15px/1.55 Satoshi,sans-serif;color:#5b5852')}>{p.summary}</p>
                      {p.hasLink && <a href={p.url} style={css('font:500 15px/1 Satoshi,sans-serif;padding:10px 0 6px;border-bottom:1px solid #111')}>View project →</a>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
            <section id="studio" aria-labelledby="f-studio" style={css('background:radial-gradient(ellipse 65% 85% at 50% 50%, #FFFFFF 0%, #FDFDFC 55%, #F8F8F6 100%);color:#111;padding:40px 6vw 96px;font-family:Satoshi,sans-serif')}>
              <h2 id="f-studio" style={css(`margin:0 0 24px;${SECTION_LABEL};color:#5b5852`)}>(03) Studio &amp; Process</h2>
              <p style={css("margin:0 0 40px;max-width:30ch;font:400 clamp(22px,2.4vw,36px)/1.2 'Clash Display',sans-serif")}>An independent studio for motion, interfaces and space. Every project moves from first sketch to final build in one set of hands.</p>
              <ol style={css('margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px 4vw')}>
                {D.process.map((st) => (
                  <li key={st.no} style={css('display:flex;flex-direction:column;gap:10px;padding-top:18px;border-top:1px solid rgba(17,17,17,.14)')}>
                    <span style={css('font:500 13px/1 Satoshi,sans-serif;color:#5b5852')}>{st.no}</span>
                    <h3 style={css("margin:0;font:500 32px/1 'Clash Display',sans-serif")}>{st.name}</h3>
                    <p style={css('margin:0;font:400 15px/1.55 Satoshi,sans-serif;color:#5b5852')}>{st.text}</p>
                  </li>
                ))}
              </ol>
            </section>
            <section id="contact" aria-labelledby="f-contact" style={css('background:radial-gradient(ellipse 65% 85% at 50% 50%, #FFFFFF 0%, #FDFDFC 55%, #F8F8F6 100%);color:#111;padding:96px 6vw;font-family:Satoshi,sans-serif;display:flex;flex-wrap:wrap;gap:40px 6vw;align-items:flex-end;justify-content:space-between')}>
              <div style={css('display:flex;flex-direction:column;gap:28px;max-width:760px')}>
                <h2 id="f-contact" style={css(`margin:0;${SECTION_LABEL};color:#5b5852`)}>(04) Contact</h2>
                <p style={css("margin:0;font:500 clamp(44px,6.6vw,120px)/.93 'Clash Display',sans-serif;letter-spacing:-.025em")}>Let’s build something worth seeing.</p>
                <div style={css('display:flex;flex-wrap:wrap;align-items:center;gap:18px 28px')}>
                  <a href={mailto} style={css('display:inline-flex;align-items:center;gap:14px;height:56px;padding:0 26px;background:#111;color:#F5F5F2;font:500 16px/1 Satoshi,sans-serif;border-radius:2px')}>Start a Project →</a>
                  <a href={mailto} style={css('font:500 20px/1.2 Satoshi,sans-serif;border-bottom:1px solid rgba(17,17,17,.4);padding-bottom:4px')}>{D.contact.email}</a>
                </div>
              </div>
              <img src="/assets/logo-mark.png" alt="" style={css('width:min(220px,40vw);aspect-ratio:1;opacity:.9')} />
            </section>
          </>
        )}
      </main>

      <footer ref={footerRef} style={css('position:relative;background:#FDFDFC;color:#111;overflow:hidden;font-family:Satoshi,sans-serif;border-top:1px solid rgba(17,17,17,.1)')}>
        <div style={css('display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:40px 6vw;padding:14vh 6vw 9vh')}>
          <div style={css('display:flex;flex-direction:column;gap:28px')}>
            <div data-fcol style={css(`${SECTION_LABEL};color:#8a857d`)}>(05) Say hello</div>
            <p style={css("margin:0;font:500 clamp(40px,6.4vw,112px)/.96 'Clash Display',sans-serif;letter-spacing:-.03em")}>
              <span style={css('display:block;overflow:hidden;padding-bottom:.08em')}><span data-fh style={{ display: 'block' }}>Let’s make</span></span>
              <span style={css('display:block;overflow:hidden;padding-bottom:.08em')}><span data-fh style={{ display: 'block', color: '#8a857d' }}>something move.</span></span>
            </p>
          </div>
          <a data-fcol href={mailto} className="btn-dark" style={css('display:inline-flex;align-items:center;gap:14px;height:56px;padding:0 28px;border-radius:999px;background:#111;color:#F5F5F2;font:500 16px/1 Satoshi,sans-serif')}>Start a project <span aria-hidden="true">→</span></a>
        </div>
        <span data-frule aria-hidden="true" style={css('display:block;height:1px;margin:0 6vw;background:rgba(17,17,17,.14);transform-origin:left')} />
        <div style={css('display:flex;flex-wrap:wrap;gap:44px 5vw;padding:7vh 6vw 8vh')}>
          <div data-fcol style={css('flex:2 1 300px;display:flex;flex-direction:column;gap:20px;align-items:flex-start')}>
            <div aria-hidden="true" style={css('position:relative;flex:none;width:84px;aspect-ratio:1')}>
              <span data-fring style={css('position:absolute;inset:0;border:1px solid rgba(17,17,17,.3);border-radius:50%')} />
              <span data-forbit style={css('position:absolute;inset:0')}><span style={css('position:absolute;left:50%;top:-4px;width:8px;height:8px;margin-left:-4px;border-radius:50%;background:#111')} /></span>
              <svg data-fimg viewBox="130 105 985 1055" style={css('position:absolute;left:25%;top:22.5%;width:50%;aspect-ratio:985/1055')}>
                <path d={STONE1} style={{ fill: '#111' }} /><path d={STONE2} style={{ fill: '#8a857d' }} />
              </svg>
            </div>
            <a href={mailto} style={css("font:500 clamp(18px,1.6vw,24px)/1.2 'Clash Display',sans-serif;border-bottom:1px solid rgba(17,17,17,.3);padding-bottom:4px")}>{D.contact.email}</a>
            <p style={css('margin:0;max-width:34ch;font:400 14px/1.6 Satoshi,sans-serif;color:#5b5852')}>Motion graphics, websites, mobile apps and 3D visualization — designed and built in one studio.</p>
          </div>
          <nav data-fcol aria-label="Footer" style={css('flex:1 1 140px;display:flex;flex-direction:column;gap:6px')}>
            <div style={css('font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8a857d;padding-bottom:12px')}>Navigate</div>
            {navItems.map(([k, l]) => <a key={k} href={k !== 'top' ? '/' + k : '#' + k} onClick={k !== 'top' ? undefined : nav(k)} className="flink" style={css('align-self:flex-start;padding:4px 0;font:500 15px/1.3 Satoshi,sans-serif;color:#111')}>{l}</a>)}
          </nav>
          <div data-fcol style={css('flex:1 1 140px;display:flex;flex-direction:column;gap:6px')}>
            <div style={css('font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8a857d;padding-bottom:12px')}>Services</div>
            {D.services.map((sv) => <a key={sv.id} href={'/services#' + sv.id} className="flink" style={css('align-self:flex-start;padding:4px 0;font:400 15px/1.3 Satoshi,sans-serif;color:#5b5852')}>{sv.name}</a>)}
          </div>
          <div data-fcol style={css('flex:1 1 140px;display:flex;flex-direction:column;gap:6px')}>
            <div style={css('font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8a857d;padding-bottom:12px')}>Elsewhere</div>
            {D.contact.socials.map((so) => <a key={so.label} href={so.href} className="flink" style={css('align-self:flex-start;padding:4px 0;font:500 15px/1.3 Satoshi,sans-serif;color:#111')}>{so.label} ↗</a>)}
          </div>
        </div>
        <div style={css('display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;padding:22px 6vw 28px;border-top:1px solid rgba(17,17,17,.1);font:400 13px/1.4 Satoshi,sans-serif;color:#5b5852')}>
          <span>© 2026 Stone Labs — Creative Digital Studio</span>
          {D.contact.emailPlaceholder && <span style={css('font:400 12px/1.4 ui-monospace,Menlo,monospace;color:#8a857d')}>Placeholder email and projects — edit data/stone.ts</span>}
          <a href="#top" onClick={goTop}>Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
