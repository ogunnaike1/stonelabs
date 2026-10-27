'use client';
import { useState } from 'react';
import Link from 'next/link';
import { css } from '@/lib/css';

const ITEMS = [['/', 'Home'], ['/services', 'Services'], ['/work', 'Work'], ['/studio', 'Studio'], ['/contact', 'Contact']];

export default function SiteHeader({ active }: { active: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
    <header style={css('position:fixed;top:16px;left:20px;right:20px;z-index:60;display:flex;align-items:center;justify-content:space-between;gap:12px;font-family:Satoshi,sans-serif;pointer-events:none;color:#111')}>
      <Link href="/" aria-label="Stone Labs — home" className="glass-pill" style={css('pointer-events:auto;display:flex;align-items:center;gap:10px;height:48px;padding:0 20px 0 12px;border-radius:999px')}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo-mark.png" alt="" width={28} height={28} style={{ display: 'block', width: 28, height: 28 }} />
        <span style={css('font:600 15px/1 Satoshi,sans-serif;letter-spacing:-.01em;white-space:nowrap')}>Stone Labs</span>
      </Link>
      <nav aria-label="Primary" className="glass-pill sp-nav" style={css('pointer-events:auto;gap:2px;padding:4px;border-radius:999px')}>
        {ITEMS.map(([href, label]) => (
          <Link key={href} href={href} className="nav-link" aria-current={label === active ? 'page' : undefined}
            style={{ ...css('display:inline-flex;align-items:center;height:40px;padding:0 20px;border-radius:999px;font:500 14px/1 Satoshi,sans-serif'), background: label === active ? 'rgba(17,17,17,.09)' : 'transparent', ['--hv' as string]: 'rgba(17,17,17,.05)' }}>{label}</Link>
        ))}
      </nav>
      <Link href="/contact" className="cta-pill" style={css('pointer-events:auto;display:inline-flex;align-items:center;gap:14px;height:48px;padding:0 8px 0 22px;border-radius:999px;font:500 14px/1 Satoshi,sans-serif;white-space:nowrap;background:#111;color:#F5F5F2')}>
        <span className="cta-long">Start a Project</span><span className="cta-short">Start</span> <span aria-hidden="true" style={css('display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;font-size:15px;background:#F5F5F2;color:#111')}>→</span>
      </Link>
      <button type="button" className="glass-pill sp-menu" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="sp-mnav" style={css('pointer-events:auto;height:48px;padding:0 18px;border-radius:999px;color:inherit;font:500 14px/1 Satoshi,sans-serif;cursor:pointer')}>{open ? 'Close' : 'Menu'}</button>
    </header>
    {open && (
      <nav id="sp-mnav" aria-label="Mobile" className="sp-mnav" style={css("position:fixed;top:76px;left:20px;right:20px;z-index:59;background:#F5F5F2;border:1px solid rgba(17,17,17,.1);border-radius:20px;overflow:hidden;flex-direction:column;font:500 28px/1 'Clash Display',sans-serif;color:#111")}>
        {ITEMS.map(([href, label], i) => (
          <Link key={href} href={href} onClick={() => setOpen(false)} style={{ padding: 20, borderBottom: i < ITEMS.length - 1 ? '1px solid #e4e0d8' : 'none' }}>{label}</Link>
        ))}
      </nav>
    )}
    </>
  );
}
