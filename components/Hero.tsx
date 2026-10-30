'use client';
import { useLayoutEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { css } from '@/lib/css';


// Real work in the frames: [position, aspect ratio, number, image, caption, alt text]
const FRAMES = [
  ['left:9vw;top:31vh;width:14vw;transform:rotate(-3deg)', '4/5', '01', '/images/work-04.jpg', 'Website', 'Skin Essential Plus website'],
  ['right:9vw;top:37vh;width:12vw;transform:rotate(2.5deg)', '1/1.2', '02', '/images/work-02.jpg', '3D visual', 'Contemporary interior render'],
  ['left:27vw;top:63vh;width:9vw;transform:rotate(4deg)', '1/1', '03', '/images/motion-05.jpg', 'Motion', 'Cream product animation'],
];

const TAG = 'font:500 12px/1.3 Satoshi,sans-serif;letter-spacing:.12em;text-transform:uppercase';

// The original Stone Labs hero: wordmark, photo frames and intro, as a single static screen (no pinning or scroll choreography).
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-l="word"]', { opacity: 0, y: 70, letterSpacing: '0.06em', duration: 1.6, delay: 0.3, ease: 'expo.out' });
      gsap.from('[data-hero-in]', { opacity: 0, y: 24, duration: 0.9, stagger: 0.07, delay: 0.8, ease: 'power3.out' });
      gsap.from('[data-hf-in]', { opacity: 0, y: 60, rotation: 3, duration: 1.2, stagger: 0.12, delay: 0.6, ease: 'power3.out' });
      gsap.fromTo('[data-cue]', { yPercent: -100 }, { yPercent: 300, duration: 1.6, ease: 'power2.inOut', repeat: -1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} aria-label="Stone Labs" style={css("position:relative;height:100vh;min-height:620px;overflow:hidden;font-family:Satoshi,sans-serif")}>
      <div aria-hidden="true" style={css('position:absolute;left:0;right:0;top:21vh;z-index:-1;perspective:900px;perspective-origin:50% 40%;pointer-events:none')}>
        <div data-l="word" style={css("display:flex;justify-content:center;font-family:'Clash Display',sans-serif;font-weight:300;font-size:15vw;line-height:.8;letter-spacing:-.01em;color:#222B33;white-space:nowrap")}>
          {'STONE LABS'.split('').map((c, i) => c === ' '
            ? <span key={i} style={css('display:inline-block;width:.28em')} />
            : <span key={i} style={css('display:inline-block')}>{c}</span>)}
        </div>
      </div>
      <h1 style={css('position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)')}>Stone Labs — Creative Digital Studio</h1>

      <div className="hm-frames" style={css('position:absolute;inset:0;pointer-events:none')}>
        {FRAMES.map(([pos, ar, n, src, cap, alt]) => (
          <div key={n} style={css('position:absolute;' + pos)}>
            <div data-hf-in style={css('background:#fff;padding:8px 8px 10px;box-shadow:0 1px 2px rgba(17,17,17,.08),0 28px 60px -20px rgba(17,17,17,.38)')}>
              <div style={{ position: 'relative', aspectRatio: ar, background: '#e4e0d8' }}>
                <Image src={src} alt={alt} fill sizes="14vw" style={{ objectFit: 'cover' }} draggable={false} />
              </div>
              <div style={css('display:flex;justify-content:space-between;padding-top:10px;font:500 10px/1 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#5f5b55')}><span>Fig. {n}</span><span>{cap}</span></div>
            </div>
          </div>
        ))}
      </div>

      <div style={css('position:absolute;inset:0;pointer-events:none')}>
        <div style={css('position:absolute;left:4vw;top:15vh;color:#222B33')}>
          <div data-hero-in style={css(`display:flex;flex-direction:column;gap:6px;${TAG}`)}><span>Creative</span><span>Digital Studio</span></div>
        </div>
        <div style={css('position:absolute;right:4vw;top:15vh;color:#222B33;text-align:right')}>
          <div data-hero-in style={css(`display:flex;flex-direction:column;gap:6px;${TAG}`)}><span>Motion · Web · Apps</span><span>3D Visualization</span></div>
        </div>
        <div className="hero-aux" style={css('position:absolute;left:4vw;bottom:7vh;max-width:24ch;color:#222B33')}>
          <p data-hero-in style={{ ...css('margin:0;font:400 14px/1.5 Satoshi,sans-serif'), textWrap: 'pretty' }}>A studio for motion graphics, websites, mobile apps and 3D visualization.</p>
        </div>
        <div className="hero-cta" style={css('position:absolute;left:50%;bottom:6vh;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:22px;width:max-content;max-width:92vw')}>
          <p data-hero-in style={css("margin:0;font:500 clamp(22px,2.1vw,34px)/1.05 'Clash Display',sans-serif;letter-spacing:-.01em;text-align:center;color:#222B33")}>Digital experiences.<br />Designed to move.</p>
          <div data-hero-in style={css('display:flex;flex-wrap:wrap;justify-content:center;gap:10px;pointer-events:auto')}>
            <a href="/work" className="btn-dark" style={css('display:inline-flex;align-items:center;height:46px;padding:0 22px;background:#222B33;color:#fff;font:500 14px/1 Satoshi,sans-serif;border-radius:2px')}>Explore Our Work</a>
            <a href="/contact" data-start-project className="btn-line" style={css('display:inline-flex;align-items:center;height:46px;padding:0 22px;border:1px solid #222B33;color:#222B33;font:500 14px/1 Satoshi,sans-serif;border-radius:2px')}>Start a Project</a>
          </div>
        </div>
        <div className="hero-aux" style={css('position:absolute;right:4vw;bottom:7vh;color:#222B33;display:flex;align-items:center;gap:14px')}>
          <span data-hero-in style={css('font:500 12px/1 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase')}>Scroll</span>
          <span data-hero-in style={css('position:relative;display:block;width:1px;height:46px;background:rgba(17,17,17,.2);overflow:hidden')}><span data-cue style={css('position:absolute;left:0;top:0;width:1px;height:16px;background:#111')} /></span>
        </div>
      </div>
    </section>
  );
}
