import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PageShell, { PageHero, LABEL } from '@/components/PageShell';
import { STONE as D } from '@/data/stone';
import { css } from '@/lib/css';

export const metadata: Metadata = {
  title: 'Services — Stone Labs',
  description: 'Websites, mobile apps, motion graphics and 3D architectural visuals from one studio.',
};

const byId = (id: string) => D.projects.find((p) => p.id === id)!;

const ICONS: Record<string, string> = {
  app: 'M8 6V3h8v18H8V6h8',
  motion: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18ZM10 8v8l7-4-7-4',
};

export default function ServicesPage() {
  return (
    <PageShell active="Services">
      <PageHero label="(01) Services" title="What we can do for your business." intro="Websites, mobile apps, motion graphics and 3D architectural visuals — designed and built by one team, so you always know who to talk to." />
      <div data-hero style={css('display:flex;flex-wrap:wrap;gap:10px;margin:-32px 0 56px')}>
        {D.services.map((s) => (
          <a key={s.id} href={'#' + s.id} className="btn-line" style={css('display:inline-flex;align-items:center;height:42px;padding:0 18px;border:1px solid #111;font:500 14px/1 Satoshi,sans-serif')}>{s.short}</a>
        ))}
      </div>

      <section aria-label="Services">
        {D.services.map((s) => (
          <article key={s.id} id={s.id} className="svc-row" data-row style={{ scrollMarginTop: 90 }}>
            <div className="svc-media" data-media>
              {s.image ? (
                <Image src={s.image} alt={s.name + ' — example of our work'} fill sizes="(max-width:900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
              ) : (
                <div style={css('position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;padding:24px')}>
                  <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="#8a857d" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={ICONS[s.id]} /></svg>
                  <span style={css('font:500 14px/1.5 Satoshi,sans-serif;color:#5b5852;max-width:28ch')}>Examples available on request.</span>
                </div>
              )}
            </div>
            <div className="svc-copy" data-copy>
              <div style={css(`${LABEL};color:#5b5852`)}>{s.no} — {s.tags}</div>
              <h2 style={css("margin:0;font:500 clamp(34px,4.2vw,64px)/1 'Clash Display',sans-serif;letter-spacing:-.02em")}>{s.name}</h2>
              <p style={css('margin:0;font:400 17px/1.55 Satoshi,sans-serif;color:#4a4743')}>{s.lead}</p>
              <p style={css('margin:0;font:400 16px/1.55 Satoshi,sans-serif;color:#4a4743')}><strong style={{ fontWeight: 700, color: '#111' }}>How it helps:</strong> {s.helps}</p>
              <ul className="svc-list" style={css('margin:0;padding:0;list-style:none;border-bottom:1px solid rgba(17,17,17,.1)')}>
                {s.deliverables.map((d) => <li key={d}>{d}</li>)}
              </ul>
              <div style={css('display:flex;flex-direction:column;gap:6px;align-items:flex-start')}>
                <div style={css(`${LABEL};color:#8a857d;padding-bottom:4px`)}>Related work</div>
                {s.work.length > 0
                  ? s.work.map((id) => { const p = byId(id); return <a key={id} href={p.video ? '/work/' + s.slug + '#' + id : p.url} {...(p.video ? {} : { target: '_blank', rel: 'noopener noreferrer' })} className="flink" style={css('font:500 15px/1.4 Satoshi,sans-serif;padding:2px 0')}>{p.title} {p.video ? '→' : '↗'}</a>; })
                  : <Link href="/contact" data-start-project data-service={s.name} className="flink" style={css('font:500 15px/1.4 Satoshi,sans-serif;padding:2px 0')}>Ask about examples →</Link>}
                {s.work.length > 0 && <Link href={'/work/' + s.slug} className="flink" style={css('font:500 15px/1.4 Satoshi,sans-serif;padding:8px 0 2px')}>See all {s.name.toLowerCase()} work →</Link>}
              </div>
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="proc" style={css('padding:56px 0 96px;border-top:1px solid rgba(17,17,17,.14)')}>
        <h2 id="proc" data-fade style={css(`margin:0 0 40px;${LABEL};color:#5b5852`)}>(02) How we work</h2>
        <ol data-steps style={css('margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px 4vw')}>
          {D.home.process.map((st) => (
            <li key={st.no} data-step style={css('display:flex;flex-direction:column;gap:10px;padding-top:18px;border-top:1px solid rgba(17,17,17,.14)')}>
              <span style={css('font:500 13px/1 Satoshi,sans-serif;color:#5b5852')}>0{st.no}</span>
              <h3 style={css("margin:0;font:500 32px/1 'Clash Display',sans-serif")}>{st.name}</h3>
              <p style={css('margin:0;font:400 15px/1.55 Satoshi,sans-serif;color:#5b5852')}>{st.text}</p>
            </li>
          ))}
        </ol>
        <div data-fade style={css('margin-top:56px;display:flex;flex-wrap:wrap;align-items:center;gap:16px 24px')}>
          <p style={css("margin:0;font:500 clamp(24px,2.6vw,38px)/1.1 'Clash Display',sans-serif;letter-spacing:-.01em")}>Tell us about your project.</p>
          <Link href="/contact" data-start-project className="btn-dark" style={css('display:inline-flex;align-items:center;gap:14px;height:52px;padding:0 26px;border-radius:999px;background:#111;color:#F5F5F2;font:500 15px/1 Satoshi,sans-serif')}>Start a project <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </PageShell>
  );
}
