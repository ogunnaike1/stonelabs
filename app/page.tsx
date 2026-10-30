import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Hero from '@/components/Hero';
import LogoStage from '@/components/LogoStage';
import WorkCard from '@/components/WorkCard';
import { STONE as D } from '@/data/stone';

const byId = (id: string) => D.projects.find((p) => p.id === id)!;
const featured = D.home.featured.map(byId);

export default function Page() {
  const { services, about, process } = D.home;
  return (
    <>
      <SiteHeader active="Home" />
      <div className="hm">
        <LogoStage />
        <main>
          <Hero />

          <section id="about" className="hm-wrap hm-section" aria-labelledby="hm-about">
            <div className="hm-intro">
              <h2 id="hm-about">About Stone Labs</h2>
              <p className="hm-lead">{about}</p>
            </div>
          </section>

          <section id="work" className="hm-wrap hm-section" aria-labelledby="hm-work">
            <div className="hm-head">
              <h2 id="hm-work">Selected work</h2>
            </div>
            <div className="hm-grid">{featured.slice(0, 3).map((p) => <WorkCard key={p.id} p={p} />)}</div>
          </section>

          <section id="more-work" className="hm-wrap hm-section" aria-labelledby="hm-more">
            <div className="hm-head">
              <h2 id="hm-more">More projects</h2>
              <Link href="/work" className="hm-link">See all projects →</Link>
            </div>
            <div className="hm-grid">{featured.slice(3).map((p) => <WorkCard key={p.id} p={p} />)}</div>
          </section>

          <section id="services" className="hm-wrap hm-section" aria-labelledby="hm-services">
            <div className="hm-head">
              <h2 id="hm-services">What we can do for your business</h2>
              <span className="hm-hlogo" data-hlogo aria-hidden="true" />
            </div>
            <div className="hm-services">
              {services.map((s) => (
                <div key={s.id} className="hm-service">
                  <div className="hm-service-top"><span className="hm-ico" data-ico={s.id} aria-hidden="true" /><h3>{s.name}</h3></div>
                  <p>{s.gets}</p>
                  <p className="hm-helps"><strong>How it helps:</strong> {s.helps}</p>
                  <div className="hm-svc-work">
                    {s.work.length > 0
                      ? s.work.map((id) => <a key={id} href={featured.some((f) => f.id === id) ? '#' + id : '/work/' + (D.services.find((x) => x.id === s.id)?.slug ?? '') + '#' + id} className="hm-link">{byId(id).title}</a>)
                      : <Link href="/contact" data-start-project data-service={s.name} className="hm-link">Ask about examples →</Link>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="process" className="hm-wrap hm-section" aria-labelledby="hm-process">
            <div className="hm-about">
              <div className="hm-proc-left">
                <h2 id="hm-process">How we work</h2>
                <p className="hm-lead">A simple four-step process, from the first conversation to delivery.</p>
                <span className="hm-plogo" data-plogo aria-hidden="true" />
              </div>
              <ol className="hm-process" aria-label="How we work">
                {process.map((s) => (
                  <li key={s.no}><span className="hm-no">{s.no}</span><div><h3>{s.name}</h3><p>{s.text}</p></div></li>
                ))}
              </ol>
            </div>
          </section>

          <section id="contact" className="hm-wrap hm-section hm-contact-sec" aria-labelledby="hm-contact">
            <div className="hm-contact">
              <h2 id="hm-contact">Tell us about your project</h2>
              <p className="hm-lead">Send a few details about what you need and we will reply with next steps.</p>
              <div className="hm-actions">
                <Link href="/contact" data-start-project className="hm-btn hm-btn-dark">Start a Project</Link>
              </div>
              <ul className="hm-socials">
                <li><a href={'tel:' + D.contact.phone.replace(/\s/g, '')} className="flink">{D.contact.phone}</a></li>
                {D.contact.socials.map((so) => <li key={so.label}><a href={so.href} target="_blank" rel="noopener noreferrer" className="flink">{so.label} ↗</a></li>)}
              </ul>
            </div>
          </section>
        </main>
        <SiteFooter brand />
      </div>
    </>
  );
}
