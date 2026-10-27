'use client';
import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scroll choreography for these pages. Targets: data-hero, data-row/data-media/data-copy, data-steps>data-step, data-fade, data-line, data-cta.
export default function PageMotion() {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', { opacity: 0, y: 48, duration: 1, stagger: 0.1, delay: 0.15, ease: 'power3.out' });

      gsap.utils.toArray<HTMLElement>('[data-row]').forEach((row) => {
        const media = row.querySelector<HTMLElement>('[data-media]');
        const img = media?.querySelector('img');
        const copy = row.querySelectorAll('[data-copy] > *');
        const rev = row.matches(':nth-child(even)');
        const tl = gsap.timeline({ scrollTrigger: { trigger: row, start: 'top 75%', toggleActions: 'play none none none' } });
        if (media) tl.from(media, { clipPath: rev ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)', duration: 1.1, ease: 'power3.inOut' });
        if (img) tl.from(img, { scale: 1.25, duration: 1.4, ease: 'power3.out' }, 0);
        if (copy.length) tl.from(copy, { opacity: 0, y: 36, duration: 0.8, stagger: 0.09, ease: 'power3.out' }, 0.25);
        if (img) gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', immediateRender: false, scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true } });
      });

      gsap.utils.toArray<HTMLElement>('[data-steps]').forEach((g) => gsap.from(g.querySelectorAll('[data-step]'), { opacity: 0, y: 40, duration: 0.8, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: g, start: 'top 85%' } }));
      gsap.utils.toArray<HTMLElement>('[data-line]').forEach((el) => gsap.from(el, { scaleX: 0, transformOrigin: 'left', duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 92%' } }));
      gsap.utils.toArray<HTMLElement>('[data-fade]').forEach((el) => gsap.from(el, { opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
      gsap.from('[data-cta]', { opacity: 0, y: 48, duration: 0.9, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '[data-cta]', start: 'top 90%' } });
    });
    return () => ctx.revert();
  }, []);
  return null;
}
