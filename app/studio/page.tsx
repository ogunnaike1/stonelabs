/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import PageShell, { PageHero, LABEL } from '@/components/PageShell';
import { STONE as D } from '@/data/stone';
import { css } from '@/lib/css';

export const metadata: Metadata = {
  title: 'Studio — Stone Labs',
  description: 'An independent studio for motion, interfaces and space.',
};

const PRINCIPLES = [
  ['One set of hands', 'Every project moves from first sketch to final build without hand-offs, so intent survives to delivery.'],
  ['Motion as a method', 'We test ideas in movement, not only in stills — it is how we find what feels right.'],
  ['Built to last', 'Clean builds, fast pages and files that are easy to hand over and maintain.'],
];

export default function StudioPage() {
  return (
    <PageShell active="Studio">
      <PageHero label="(03) Studio & Process" title="Independent by design." intro="An independent studio for motion, interfaces and space. Every project moves from first sketch to final build in one set of hands." />

      <section className="svc-row" data-row style={{ paddingTop: 0, borderTop: 0 }}>
        <div className="svc-media" data-media style={{ aspectRatio: '4/5', maxWidth: 520 }}><img src="/images/hero-01.jpg" alt="Behind the lens" className="img-fill" /></div>
        <div className="svc-copy" data-copy>
          <div style={css(`${LABEL};color:#5b5852`)}>Our approach</div>
          <h2 style={css("margin:0;font:500 clamp(32px,3.8vw,60px)/1 'Clash Display',sans-serif;letter-spacing:-.02em")}>Craft over volume.</h2>
          <p style={css('margin:0;font:400 17px/1.55 Satoshi,sans-serif;color:#4a4743')}>Stone Labs is a small studio that takes on a few projects at a time. We work across motion graphics, websites, mobile apps and 3D visualization, and treat each as part of one connected practice.</p>
        </div>
      </section>

      <section aria-labelledby="prin" style={css('padding:56px 0;border-top:1px solid rgba(17,17,17,.14)')}>
        <h2 id="prin" data-fade style={css(`margin:0 0 40px;${LABEL};color:#5b5852`)}>Principles</h2>
        <ul data-steps style={css('margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:32px 4vw')}>
          {PRINCIPLES.map(([t, d], i) => (
            <li key={t} data-step style={css('display:flex;flex-direction:column;gap:12px;padding-top:18px;border-top:1px solid rgba(17,17,17,.14)')}>
              <span style={css('font:500 13px/1 Satoshi,sans-serif;color:#5b5852')}>0{i + 1}</span>
              <h3 style={css("margin:0;font:500 30px/1.05 'Clash Display',sans-serif")}>{t}</h3>
              <p style={css('margin:0;font:400 15px/1.55 Satoshi,sans-serif;color:#5b5852')}>{d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="proc" style={css('padding:56px 0 96px;border-top:1px solid rgba(17,17,17,.14)')}>
        <h2 id="proc" data-fade style={css(`margin:0 0 40px;${LABEL};color:#5b5852`)}>How a project runs</h2>
        <ol data-steps style={css('margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px 4vw')}>
          {D.process.map((st) => (
            <li key={st.no} data-step style={css('display:flex;flex-direction:column;gap:10px;padding-top:18px;border-top:1px solid rgba(17,17,17,.14)')}>
              <span style={css('font:500 13px/1 Satoshi,sans-serif;color:#5b5852')}>{st.no}</span>
              <h3 style={css("margin:0;font:500 32px/1 'Clash Display',sans-serif")}>{st.name}</h3>
              <p style={css('margin:0;font:400 15px/1.55 Satoshi,sans-serif;color:#5b5852')}>{st.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </PageShell>
  );
}
