import Link from 'next/link';
import { STONE as D } from '@/data/stone';
import { css } from '@/lib/css';

const BG = 'radial-gradient(ellipse 65% 85% at 50% 50%, #FFFFFF 0%, #FDFDFC 55%, #F8F8F6 100%)';
const LBL = 'font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#8a857d;padding-bottom:12px';
const PAD = 'max(6vw,calc((100vw - 1640px) / 2))';
const NAV = [['/', 'Home'], ['/services', 'Services'], ['/work', 'Work'], ['/studio', 'Studio'], ['/contact', 'Contact']];

export default function SiteFooter({ brand = false }: { brand?: boolean }) {
  return (
    <footer style={css('background:#FDFDFC;color:#111;font-family:Satoshi,sans-serif;border-top:1px solid rgba(17,17,17,.1)')}>
      <div style={{ ...css('display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:32px 6vw;padding-top:12vh;padding-bottom:8vh'), background: BG, paddingLeft: PAD, paddingRight: PAD }}>
        <p data-cta style={css("margin:0;max-width:14ch;font:500 clamp(40px,6.4vw,112px)/.96 'Clash Display',sans-serif;letter-spacing:-.03em")}>Have a project in mind?</p>
        <Link data-cta href="/contact" data-start-project className="btn-dark" style={css('display:inline-flex;align-items:center;gap:14px;height:56px;padding:0 28px;border-radius:999px;background:#111;color:#F5F5F2;font:500 16px/1 Satoshi,sans-serif')}>Start a project <span aria-hidden="true">→</span></Link>
      </div>
      <div style={{ ...css('display:flex;flex-wrap:wrap;gap:44px 5vw;padding-top:7vh;padding-bottom:8vh;border-top:1px solid rgba(17,17,17,.14)'), paddingLeft: PAD, paddingRight: PAD }}>
        <div style={css('flex:2 1 300px;display:flex;flex-direction:column;gap:20px;align-items:flex-start')}>
          {brand ? (
            <div style={css('display:flex;align-items:center;gap:14px')}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img data-footer-logo src="/assets/logo-mark.png" alt="" width={44} height={44} style={css('display:block;width:44px;height:44px')} />
              <span style={css("font:500 24px/1 'Clash Display',sans-serif;letter-spacing:-.01em")}>Stone Labs</span>
            </div>
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src="/assets/logo-mark.png" alt="" width={44} height={44} style={css('display:block;width:44px;height:44px')} />
          )}
          <a href={'mailto:' + D.contact.email} style={css("font:500 clamp(18px,1.6vw,24px)/1.2 'Clash Display',sans-serif;border-bottom:1px solid rgba(17,17,17,.3);padding-bottom:4px")}>{D.contact.email}</a>
          <p style={css('margin:0;max-width:34ch;font:400 14px/1.6 Satoshi,sans-serif;color:#5b5852')}>Motion graphics, websites, mobile apps and 3D visualization — designed and built in one studio.</p>
        </div>
        <nav aria-label="Footer" style={css('flex:1 1 140px;display:flex;flex-direction:column;gap:6px')}>
          <div style={css(LBL)}>Navigate</div>
          {NAV.map(([h, l]) => <Link key={h} href={h} className="flink" style={css('align-self:flex-start;padding:4px 0;font:500 15px/1.3 Satoshi,sans-serif')}>{l}</Link>)}
        </nav>
        <div style={css('flex:1 1 140px;display:flex;flex-direction:column;gap:6px')}>
          <div style={css(LBL)}>Services</div>
          {D.services.map((s) => <Link key={s.id} href={'/services#' + s.id} className="flink" style={css('align-self:flex-start;padding:4px 0;font:400 15px/1.3 Satoshi,sans-serif;color:#5b5852')}>{s.name}</Link>)}
        </div>
        <div style={css('flex:1 1 140px;display:flex;flex-direction:column;gap:6px')}>
          <div style={css(LBL)}>Elsewhere</div>
          {D.contact.socials.map((so) => <a key={so.label} href={so.href} className="flink" style={css('align-self:flex-start;padding:4px 0;font:500 15px/1.3 Satoshi,sans-serif')}>{so.label} ↗</a>)}
        </div>
      </div>
      <div style={{ ...css('display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px;padding-top:22px;padding-bottom:28px;border-top:1px solid rgba(17,17,17,.1);font:400 13px/1.4 Satoshi,sans-serif;color:#5b5852'), paddingLeft: PAD, paddingRight: PAD }}>
        <span>© 2026 Stone Labs — Creative Digital Studio</span>
        <Link href="/">Back to home ↑</Link>
      </div>
    </footer>
  );
}
