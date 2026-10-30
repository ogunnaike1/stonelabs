'use client';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import ContactForm from '@/components/ContactForm';
import { STONE } from '@/data/stone';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select,textarea,[tabindex]:not([tabindex="-1"])';

// Opens the contact form in a dialog from any link marked data-start-project. Without JavaScript those links still go to /contact.
export default function ProjectModal() {
  const [open, setOpen] = useState(false);
  const [service, setService] = useState<string | undefined>();
  const [run, setRun] = useState(0);
  const pathname = usePathname();
  const opener = useRef<HTMLElement | null>(null);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[data-start-project]') as HTMLAnchorElement | null;
      if (!a || pathname === '/contact') return;       // the contact page already is the form
      e.preventDefault(); e.stopPropagation();
      opener.current = a; setService(a.dataset.service); setRun((n) => n + 1); setOpen(true);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [pathname]);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const close = () => setOpen(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab' || !box.current) return;
      const els = Array.from(box.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null);
      if (!els.length) return;
      const first = els[0], last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; opener.current?.focus?.(); };
  }, [open]);

  if (!open) return null;
  const wa = `https://wa.me/${STONE.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent('Hi Stone Labs, I would like to talk about a project.')}`;
  return (
    <div className="pm-back" onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
      <div ref={box} className="pm" role="dialog" aria-modal="true" aria-labelledby="pm-title">
        <button type="button" className="pm-close" onClick={() => setOpen(false)} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <div className="pm-eyebrow">Start a project</div>
        <h2 id="pm-title">Tell us about your project</h2>
        <p className="pm-lead">Share a few details and we will reply by email with next steps.</p>
        <ContactForm key={run} email={STONE.contact.email} defaultService={service} autoFocus />
        <div className="pm-alt">
          <span>Prefer another way?</span>
          <a href={wa} target="_blank" rel="noopener noreferrer" className="flink">WhatsApp</a>
          <a href={'mailto:' + STONE.contact.email} className="flink">Email</a>
        </div>
      </div>
    </div>
  );
}
