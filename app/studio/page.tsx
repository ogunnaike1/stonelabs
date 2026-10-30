import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PageShell, { PageHero, LABEL } from '@/components/PageShell';
import { STONE as D } from '@/data/stone';
import { css } from '@/lib/css';

export const metadata: Metadata = {
  title: 'Studio — Stone Labs',
  description: 'Stone Labs is a small creative studio for websites, mobile apps, motion graphics and 3D architectural visuals.',
};

const PRINCIPLES = [
  ['One team', 'Your project moves from the first conversation to delivery with the same people, so nothing is lost along the way.'],
  ['Made to be seen', 'We design for how the work will actually be used: on a phone, in a feed, or on a screen in front of a client.'],
  ['Built to last', 'Clean builds, fast pages and files that are easy to hand over and maintain.'],
];

const byId = (id: string) => D.projects.find((p) => p.id === id)!;
const RECENT = ['skin-essential-plus', 'interior-concept', 'salt-sapphire-explainer'].map(byId);

export default function StudioPage() {
  return (
    <PageShell active="Studio">
      <PageHero label="(03) Studio & Process" title="A small studio. One team." intro="Stone Labs designs and builds websites and mobile apps, makes motion graphics and produces 3D architectural visuals." />

      <section className="svc-row" data-row style={{ paddingTop: 0, borderTop: 0 }}>
        <Link href="/work/motion-graphics#stone-labs-film" className="svc-media" data-media style={{ aspectRatio: '16/10' }} aria-label="Watch the Stone Labs brand film">
          <Image src="/images/motion-01.jpg" alt="Stone Labs brand film" fill priority sizes="(max-width:900px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
        </Link>
        <div className="svc-copy" data-copy>
          <div style={css(`${LABEL};color:#5b5852`)}>Our approach</div>
          <h2 style={css("margin:0;font:500 clamp(32px,3.8vw,60px)/1 'Clash Display',sans-serif;letter-spacing:-.02em")}>Craft over volume.</h2>
          <p style={css('margin:0;font:400 17px/1.55 Satoshi,sans-serif;color:#4a4743')}>{D.home.about}</p>
          <Link href="/work/motion-graphics#stone-labs-film" className="flink" style={css('align-self:flex-start;font:500 15px/1.4 Satoshi,sans-serif')}>Watch the Stone Labs brand film →</Link>
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

      <section aria-labelledby="what" style={css('padding:56px 0;border-top:1px solid rgba(17,17,17,.14)')}>
        <h2 id="what" data-fade style={css(`margin:0 0 40px;${LABEL};color:#5b5852`)}>What we do</h2>
        <ul data-steps style={css('margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px 4vw')}>
          {D.services.map((s) => (
            <li key={s.id} data-step style={css('display:flex;flex-direction:column;gap:10px;padding-top:18px;border-top:1px solid rgba(17,17,17,.14)')}>
              <h3 style={css("margin:0;font:500 26px/1.1 'Clash Display',sans-serif")}>{s.name}</h3>
              <p style={css('margin:0;font:400 15px/1.55 Satoshi,sans-serif;color:#5b5852')}>{s.text}</p>
              <Link href={'/work/' + s.slug} className="flink" style={css('align-self:flex-start;font:500 14px/1.4 Satoshi,sans-serif;margin-top:4px')}>See the work →</Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="proc" style={css('padding:56px 0;border-top:1px solid rgba(17,17,17,.14)')}>
        <h2 id="proc" data-fade style={css(`margin:0 0 40px;${LABEL};color:#5b5852`)}>How a project runs</h2>
        <ol data-steps style={css('margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:32px 4vw')}>
          {D.home.process.map((st) => (
            <li key={st.no} data-step style={css('display:flex;flex-direction:column;gap:10px;padding-top:18px;border-top:1px solid rgba(17,17,17,.14)')}>
              <span style={css('font:500 13px/1 Satoshi,sans-serif;color:#5b5852')}>0{st.no}</span>
              <h3 style={css("margin:0;font:500 32px/1 'Clash Display',sans-serif")}>{st.name}</h3>
              <p style={css('margin:0;font:400 15px/1.55 Satoshi,sans-serif;color:#5b5852')}>{st.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="recent" style={css('padding:56px 0 96px;border-top:1px solid rgba(17,17,17,.14)')}>
        <div data-fade style={css('display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:12px 24px;margin-bottom:32px')}>
          <h2 id="recent" style={css(`margin:0;${LABEL};color:#5b5852`)}>Recent work</h2>
          <Link href="/work" className="flink" style={css('font:500 15px/1.4 Satoshi,sans-serif')}>See all work →</Link>
        </div>
        <ul data-steps style={css('margin:0;padding:0;list-style:none;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px 24px')}>
          {RECENT.map((p) => (
            <li key={p.id} data-step>
              <Link href={`/work/${D.services.find((s) => s.id === p.svc)!.slug}#${p.id}`} style={css('display:flex;flex-direction:column;gap:12px')}>
                <span style={css('position:relative;display:block;aspect-ratio:16/10;overflow:hidden;background:#E4E0D8')}><Image src={p.image} alt={p.title} fill sizes="(max-width:700px) 100vw, 33vw" style={{ objectFit: 'cover' }} /></span>
                <span style={css(`${LABEL};color:#5b5852`)}>{p.serviceLabel}</span>
                <span style={css("font:500 24px/1.1 'Clash Display',sans-serif")}>{p.title}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div data-fade style={css('margin-top:56px;display:flex;flex-wrap:wrap;align-items:center;gap:16px 24px')}>
          <p style={css("margin:0;font:500 clamp(24px,2.6vw,38px)/1.1 'Clash Display',sans-serif;letter-spacing:-.01em")}>Tell us about your project.</p>
          <Link href="/contact" data-start-project className="btn-dark" style={css('display:inline-flex;align-items:center;gap:14px;height:52px;padding:0 26px;border-radius:999px;background:#111;color:#F5F5F2;font:500 15px/1 Satoshi,sans-serif')}>Start a project <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </PageShell>
  );
}
