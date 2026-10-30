/* eslint-disable @next/next/no-img-element */
import WorkVideo from '@/components/WorkVideo';
import { LABEL } from '@/components/PageShell';
import { css } from '@/lib/css';

export interface WorkRow {
  id: string; title: string; serviceLabel: string; year: string; summary: string; role: string[]; url: string;
  image: string; video: string; vertical?: boolean; svc: string;
}

// Project rows shared by the Work page and the per-service pages.
export default function WorkRows({ items, eagerFirst = 2 }: { items: WorkRow[]; eagerFirst?: number }) {
  return (
    <>
      {items.map((p, i) => (
        <article key={p.id} id={p.id} className="svc-row" data-row style={{ scrollMarginTop: 90, borderTop: 0 }}>
          <div className="svc-media" data-media style={{ aspectRatio: '16/10' }}>
            {p.video
              ? <WorkVideo src={p.video} poster={p.image} title={p.title} vertical={p.vertical} />
              : <img src={p.image} alt={`${p.title} — ${p.serviceLabel}`} className="img-fill" loading={i < eagerFirst ? 'eager' : 'lazy'} />}
          </div>
          <div className="svc-copy" data-copy>
            <div style={css(`${LABEL};color:#5b5852`)}>{String(i + 1).padStart(2, '0')} — {p.serviceLabel} · {p.year}</div>
            <h3 style={css("margin:0;font:500 clamp(34px,4.2vw,64px)/.98 'Clash Display',sans-serif;letter-spacing:-.02em")}>{p.title}</h3>
            <p style={css('margin:0;font:400 17px/1.55 Satoshi,sans-serif;color:#4a4743')}>{p.summary}</p>
            <ul className="svc-list" style={css('margin:0;padding:0;list-style:none;border-bottom:1px solid rgba(17,17,17,.1)')}>
              {p.role.map((r) => <li key={r}>{r}</li>)}
            </ul>
            {p.video && <span style={css('font:500 14px/1.4 Satoshi,sans-serif;color:#5b5852')}>Press play on the preview to watch.</span>}
            {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" style={css('align-self:flex-start;font:500 15px/1 Satoshi,sans-serif;padding:10px 0 6px;border-bottom:1px solid #111')}>{p.svc === 'viz' ? 'View 360° tour' : 'Visit website'} →</a>}
          </div>
        </article>
      ))}
    </>
  );
}
