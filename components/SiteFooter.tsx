import Link from 'next/link';
import { STONE as D } from '@/data/stone';
import { css } from '@/lib/css';

const BG = 'radial-gradient(ellipse 65% 85% at 50% 50%, #FFFFFF 0%, #F8F7F4 50%, #EEEBE6 100%)';

export default function SiteFooter() {
  return (
    <>
      <section style={{ ...css('color:#111;padding:72px max(6vw,calc((100vw - 1640px) / 2)) 96px;font-family:Satoshi,sans-serif;display:flex;flex-wrap:wrap;gap:32px 6vw;align-items:flex-end;justify-content:space-between;border-top:1px solid rgba(17,17,17,.14)'), background: BG }}>
        <p data-cta style={css("margin:0;max-width:14ch;font:500 clamp(44px,6.6vw,110px)/.93 'Clash Display',sans-serif;letter-spacing:-.025em")}>Have a project in mind?</p>
        <Link data-cta href="/contact" style={css('display:inline-flex;align-items:center;gap:14px;height:56px;padding:0 26px;background:#111;color:#F5F5F2;font:500 16px/1 Satoshi,sans-serif;border-radius:2px')}>Start a Project →</Link>
      </section>
      <footer style={css('background:#F5F5F2;color:#4a4743;display:flex;flex-wrap:wrap;justify-content:space-between;gap:12px 32px;padding:24px 6vw;font:400 13px/1.4 Satoshi,sans-serif')}>
        <span>© 2026 Stone Labs — Creative Digital Studio</span>
        <span style={css('display:flex;flex-wrap:wrap;gap:6px 22px')}>
          {[['/', 'Home'], ['/services', 'Services'], ['/work', 'Work'], ['/studio', 'Studio'], ['/contact', 'Contact']].map(([h, l]) => <Link key={h} href={h} className="flink">{l}</Link>)}
          {D.contact.socials.map((so) => <a key={so.label} href={so.href} className="flink">{so.label} ↗</a>)}
        </span>
      </footer>
    </>
  );
}
