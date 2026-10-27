'use client';
import { useState } from 'react';
import { css } from '@/lib/css';

const FIELD = 'width:100%;padding:16px 0;border:0;border-bottom:1px solid rgba(17,17,17,.3);background:transparent;color:#111;font:400 17px/1.4 Satoshi,sans-serif;outline-offset:4px;border-radius:0';
const SERVICES = ['Motion Graphics', 'Web Development', 'Mobile App Development', '3D Visualization', 'Not sure yet'];

export default function ContactForm({ email }: { email: string }) {
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `Name: ${f.get('name')}\nEmail: ${f.get('email')}\nService: ${f.get('service')}\n\n${f.get('message')}`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent('Project enquiry — ' + f.get('service'))}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <form onSubmit={submit} style={css('display:flex;flex-direction:column;gap:18px;flex:1 1 380px;max-width:640px')}>
      <label style={css('display:flex;flex-direction:column;font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#5b5852')}>Name
        <input name="name" required autoComplete="name" style={css(FIELD)} /></label>
      <label style={css('display:flex;flex-direction:column;font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#5b5852')}>Email
        <input name="email" type="email" required autoComplete="email" style={css(FIELD)} /></label>
      <label style={css('display:flex;flex-direction:column;font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#5b5852')}>Service
        <select name="service" style={css(FIELD)}>{SERVICES.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label style={css('display:flex;flex-direction:column;font:500 12px/1.2 Satoshi,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#5b5852')}>Tell us about the project
        <textarea name="message" required rows={5} style={{ ...css(FIELD), resize: 'vertical' }} /></label>
      <button type="submit" className="btn-dark" style={css('align-self:flex-start;height:56px;padding:0 26px;border:0;background:#111;color:#F5F5F2;font:500 16px/1 Satoshi,sans-serif;border-radius:2px;cursor:pointer')}>Send enquiry →</button>
      {sent && <p role="status" style={css('margin:0;font:400 14px/1.5 Satoshi,sans-serif;color:#5b5852')}>Your email app should open with the message ready to send.</p>}
    </form>
  );
}
