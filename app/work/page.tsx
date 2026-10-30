import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell, { PageHero, LABEL } from '@/components/PageShell';
import WorkRows from '@/components/WorkRows';
import { STONE as D } from '@/data/stone';
import { css } from '@/lib/css';

export const metadata: Metadata = {
  title: 'Work — Stone Labs',
  description: 'Selected website, motion graphics and 3D architectural visual projects from Stone Labs, organised by service.',
};

const MAX = 5;

export default function WorkPage() {
  return (
    <PageShell active="Work">
      <PageHero label="(02) Selected Work" title="Made to be seen." intro="Our projects, organised by service: websites, mobile apps, motion graphics and 3D architectural visuals. Every service has its own page you can share." />
      <div data-hero style={css('display:flex;flex-wrap:wrap;gap:10px;margin:-32px 0 24px')}>
        {D.services.map((s) => (
          <a key={s.id} href={'#' + s.id} className="btn-line" style={css('display:inline-flex;align-items:center;height:42px;padding:0 18px;border:1px solid #111;font:500 14px/1 Satoshi,sans-serif')}>{s.name}</a>
        ))}
      </div>

      {D.services.map((s) => {
        const all = D.projects.filter((p) => p.svc === s.id);
        const items = all.slice(0, MAX);
        return (
          <section key={s.id} id={s.id} aria-labelledby={'w-' + s.id} style={{ scrollMarginTop: 90 }}>
            <div data-fade style={css('display:flex;flex-wrap:wrap;align-items:baseline;justify-content:space-between;gap:10px 24px;padding:56px 0 8px;border-top:1px solid rgba(17,17,17,.14)')}>
              <h2 id={'w-' + s.id} style={css("margin:0;font:500 clamp(28px,3.2vw,48px)/1.05 'Clash Display',sans-serif;letter-spacing:-.02em")}>{s.name}</h2>
              <div style={css('display:flex;align-items:baseline;gap:20px')}>
                <span style={css(`${LABEL};color:#5b5852`)}>{all.length > 0 ? `${all.length} project${all.length > 1 ? 's' : ''}` : 'Coming soon'}</span>
                <Link href={'/work/' + s.slug} className="flink" style={css('font:500 15px/1.4 Satoshi,sans-serif')}>{s.name} page →</Link>
              </div>
            </div>
            {all.length > 0 ? (
              <>
                <WorkRows items={items} eagerFirst={s.id === 'web' ? 2 : 0} />
                {all.length > MAX && (
                  <div data-fade style={css('padding:8px 0 56px')}>
                    <Link href={'/work/' + s.slug} className="btn-line" style={css('display:inline-flex;align-items:center;gap:12px;height:48px;padding:0 24px;border:1px solid #111;border-radius:999px;font:500 15px/1 Satoshi,sans-serif')}>See more {s.name.toLowerCase()} ({all.length - MAX} more) <span aria-hidden="true">→</span></Link>
                  </div>
                )}
              </>
            ) : (
              <div data-fade style={css('padding:24px 0 56px;display:flex;flex-wrap:wrap;align-items:center;gap:12px 24px')}>
                <p style={css('margin:0;max-width:56ch;font:400 17px/1.55 Satoshi,sans-serif;color:#4a4743')}>We are adding {s.name.toLowerCase()} projects to this page. {s.lead}</p>
                <Link href="/contact" data-start-project data-service={s.name} className="flink" style={css('font:500 15px/1.4 Satoshi,sans-serif')}>Ask about examples →</Link>
              </div>
            )}
          </section>
        );
      })}
    </PageShell>
  );
}
