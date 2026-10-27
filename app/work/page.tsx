/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import PageShell, { PageHero, LABEL } from '@/components/PageShell';
import { STONE as D } from '@/data/stone';
import { css } from '@/lib/css';

export const metadata: Metadata = {
  title: 'Work — Stone Labs',
  description: 'Selected motion, web, app and 3D visualization projects from Stone Labs.',
};

export default function WorkPage() {
  return (
    <PageShell active="Work">
      <PageHero label="(02) Selected Work" title="Made to be seen." intro="A selection of projects across motion, web, apps and 3D visualization. Placeholder case studies for now — swap in real ones in data/stone.ts." />
      <section aria-label="Projects">
        {D.projects.map((p, i) => (
          <article key={p.id} className="svc-row" data-row style={{ scrollMarginTop: 90 }}>
            <div className="svc-media" data-media style={{ aspectRatio: '16/10' }}><img src={`/images/work-0${i + 1}.jpg`} alt={p.title} className="img-fill" /></div>
            <div className="svc-copy" data-copy>
              <div style={css(`${LABEL};color:#5b5852`)}>0{i + 1} — {p.serviceLabel} · {p.year}</div>
              <h2 style={css("margin:0;font:500 clamp(36px,4.6vw,72px)/.98 'Clash Display',sans-serif;letter-spacing:-.02em")}>{p.title}</h2>
              <p style={css('margin:0;font:400 17px/1.55 Satoshi,sans-serif;color:#4a4743')}>{p.summary}</p>
              <ul className="svc-list" style={css('margin:0;padding:0;list-style:none;border-bottom:1px solid rgba(17,17,17,.1)')}>
                {p.role.map((r) => <li key={r}>{r}</li>)}
              </ul>
              {p.url && <a href={p.url} style={css('align-self:flex-start;font:500 15px/1 Satoshi,sans-serif;padding:10px 0 6px;border-bottom:1px solid #111')}>View project →</a>}
            </div>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
