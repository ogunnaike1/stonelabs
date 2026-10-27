/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageMotion from '@/components/PageMotion';
import { STONE as D } from '@/data/stone';
import { css } from '@/lib/css';

export const metadata: Metadata = {
  title: 'Services — Stone Labs',
  description: 'Motion graphics, web development, mobile apps and 3D visualization from one studio.',
};

const BG = 'radial-gradient(ellipse 65% 85% at 50% 50%, #FFFFFF 0%, #FDFDFC 55%, #F8F8F6 100%)';
const LABEL = 'font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase';

export default function ServicesPage() {
  return (
    <>
      <SiteHeader active="Services" />
      <PageMotion />
      <main style={{ ...css('color:#111;font-family:Satoshi,sans-serif;padding:0 max(6vw,calc((100vw - 1640px) / 2))'), background: BG }}>
        <section style={css('padding:19vh 0 72px;display:flex;flex-direction:column;gap:28px')}>
          <div data-hero style={css(`${LABEL};color:#5b5852`)}>(01) Services</div>
          <h1 data-hero style={css("margin:0;font:500 clamp(48px,8vw,140px)/.93 'Clash Display',sans-serif;letter-spacing:-.03em;max-width:12ch")}>One studio. Four crafts.</h1>
          <p data-hero style={css('margin:0;max-width:52ch;font:400 clamp(16px,1.4vw,20px)/1.55 Satoshi,sans-serif;color:#4a4743')}>
            Motion graphics, websites, mobile apps and 3D visualization — designed and built in one set of hands, so nothing is lost between idea and delivery.
          </p>
          <div data-hero style={css('display:flex;flex-wrap:wrap;gap:10px')}>
            {D.services.map((s) => (
              <a key={s.id} href={'#' + s.id} className="btn-line" style={css('display:inline-flex;align-items:center;height:42px;padding:0 18px;border:1px solid #111;font:500 14px/1 Satoshi,sans-serif')}>{s.short}</a>
            ))}
          </div>
        </section>

        <section aria-label="Services">
          {D.services.map((s) => (
            <article key={s.id} id={s.id} className="svc-row" data-row style={{ scrollMarginTop: 90 }}>
              <div className="svc-media" data-media><img src={s.image} alt={s.name} className="img-fill" /></div>
              <div className="svc-copy" data-copy>
                <div style={css(`${LABEL};color:#5b5852`)}>{s.no} — {s.tags}</div>
                <h2 style={css("margin:0;font:500 clamp(36px,4.6vw,72px)/.98 'Clash Display',sans-serif;letter-spacing:-.02em")}>{s.name}</h2>
                <p style={css('margin:0;font:400 17px/1.55 Satoshi,sans-serif;color:#4a4743')}>{s.lead}</p>
                <ul className="svc-list" style={css('margin:0;padding:0;list-style:none;border-bottom:1px solid rgba(17,17,17,.1)')}>
                  {s.deliverables.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </section>

        <section aria-labelledby="proc" style={css('padding:56px 0 96px;border-top:1px solid rgba(17,17,17,.14)')}>
          <h2 id="proc" style={css(`margin:0 0 40px;${LABEL};color:#5b5852`)}>(02) How we work</h2>
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
      </main>

      <SiteFooter />
    </>
  );
}
