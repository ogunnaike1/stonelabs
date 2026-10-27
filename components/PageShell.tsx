import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PageMotion from '@/components/PageMotion';
import { css } from '@/lib/css';

const BG = 'radial-gradient(ellipse 65% 85% at 50% 50%, #FFFFFF 0%, #F8F7F4 50%, #EEEBE6 100%)';
export const LABEL = 'font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase';

export default function PageShell({ active, children }: { active: string; children: React.ReactNode }) {
  return (
    <>
      <SiteHeader active={active} />
      <PageMotion />
      <main style={{ ...css('color:#111;font-family:Satoshi,sans-serif;padding:0 max(6vw,calc((100vw - 1640px) / 2))'), background: BG }}>{children}</main>
      <SiteFooter />
    </>
  );
}

export function PageHero({ label, title, intro }: { label: string; title: string; intro: string }) {
  return (
    <section style={css('padding:19vh 0 72px;display:flex;flex-direction:column;gap:28px')}>
      <div data-hero style={css(`${LABEL};color:#5b5852`)}>{label}</div>
      <h1 data-hero style={css("margin:0;font:500 clamp(48px,8vw,140px)/.93 'Clash Display',sans-serif;letter-spacing:-.03em;max-width:12ch")}>{title}</h1>
      <p data-hero style={css('margin:0;max-width:52ch;font:400 clamp(16px,1.4vw,20px)/1.55 Satoshi,sans-serif;color:#4a4743')}>{intro}</p>
    </section>
  );
}
