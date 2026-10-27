import type { Metadata } from 'next';
import PageShell, { PageHero, LABEL } from '@/components/PageShell';
import ContactForm from '@/components/ContactForm';
import { STONE as D } from '@/data/stone';
import { css } from '@/lib/css';

export const metadata: Metadata = {
  title: 'Contact — Stone Labs',
  description: 'Start a project with Stone Labs.',
};

export default function ContactPage() {
  return (
    <PageShell active="Contact">
      <PageHero label="(04) Contact" title="Let’s build something worth seeing." intro="Tell us what you are making and where it needs to go. We reply to every enquiry." />
      <section data-fade style={css('display:flex;flex-wrap:wrap;gap:56px 6vw;padding:0 0 96px')}>
        <ContactForm email={D.contact.email} />
        <aside style={css('flex:1 1 260px;display:flex;flex-direction:column;gap:36px')}>
          <div style={css('display:flex;flex-direction:column;gap:12px')}>
            <div style={css(`${LABEL};color:#8a857d`)}>Email</div>
            <a href={'mailto:' + D.contact.email} style={css("font:500 clamp(20px,2vw,32px)/1.1 'Clash Display',sans-serif;border-bottom:1px solid rgba(17,17,17,.4);padding-bottom:6px;align-self:flex-start")}>{D.contact.email}</a>
          </div>
          <div style={css('display:flex;flex-direction:column;gap:8px')}>
            <div style={css(`${LABEL};color:#8a857d;padding-bottom:6px`)}>Elsewhere</div>
            {D.contact.socials.map((so) => <a key={so.label} href={so.href} className="flink" style={css('align-self:flex-start;padding:6px 0;font:500 16px/1.3 Satoshi,sans-serif')}>{so.label} ↗</a>)}
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
