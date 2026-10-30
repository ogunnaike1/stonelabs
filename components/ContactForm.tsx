'use client';
import { useState } from 'react';

const SERVICES = ['Websites', 'Mobile Apps', 'Motion Graphics', '3D Architectural Visuals', 'Not sure yet'];

type Status = 'idle' | 'sending' | 'sent' | 'fallback' | 'error';

export default function ContactForm({ email, defaultService, autoFocus = false }: { email: string; defaultService?: string; autoFocus?: boolean }) {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const initial = SERVICES.find((x) => x.toLowerCase() === (defaultService || '').toLowerCase()) ?? SERVICES[0];

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    const data = { name: f.get('name'), email: f.get('email'), service: f.get('service'), message: f.get('message'), company: f.get('company') };
    setStatus('sending'); setError('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) { setStatus('sent'); form.reset(); return; }
      const j = await res.json().catch(() => ({}));
      if (res.status === 400) { setError(j.error || 'Please check the form and try again.'); setStatus('error'); return; }
      throw new Error('send failed');
    } catch {
      // the server could not send it: open the visitor's email app with the message ready instead
      const body = `Name: ${data.name}\nEmail: ${data.email}\nService: ${data.service}\n\n${data.message}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent('Project enquiry — ' + data.service)}&body=${encodeURIComponent(body)}`;
      setStatus('fallback');
    }
  };

  if (status === 'sent') {
    return (
      <div className="cf-done" role="status" aria-live="polite">
        <span className="cf-tick" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
        <h3>Message sent</h3>
        <p>Thank you. We have your details and will reply by email soon.</p>
        <button type="button" className="cf-again" onClick={() => setStatus('idle')}>Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="cf">
      <div className="cf-row">
        <label className="cf-field">
          <span className="cf-label">Your name</span>
          <input className="cf-input" name="name" required maxLength={120} autoComplete="name" autoFocus={autoFocus} placeholder="Full name" />
        </label>
        <label className="cf-field">
          <span className="cf-label">Email</span>
          <input className="cf-input" name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@company.com" />
        </label>
      </div>
      <fieldset className="cf-field cf-fieldset">
        <legend className="cf-label">What do you need?</legend>
        <div className="cf-chips">
          {SERVICES.map((s) => (
            <label key={s} className="cf-chip">
              <input type="radio" name="service" value={s} defaultChecked={s === initial} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="cf-field">
        <span className="cf-label">About your project</span>
        <textarea className="cf-input cf-area" name="message" required maxLength={5000} rows={4} placeholder="What are you making, and when do you need it?" />
      </label>
      <div aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
        <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <button type="submit" disabled={status === 'sending'} className="cf-submit">{status === 'sending' ? 'Sending…' : 'Send enquiry'}<span aria-hidden="true">→</span></button>
      <p role="status" aria-live="polite" className={'cf-msg' + (status === 'error' ? ' cf-err' : '')}>
        {status === 'fallback' && <>We could not send this automatically, so your email app should open with the message ready. You can also write to <a href={'mailto:' + email} className="flink">{email}</a>.</>}
        {status === 'error' && error}
      </p>
    </form>
  );
}
