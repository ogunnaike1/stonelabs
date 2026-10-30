import { NextResponse } from 'next/server';
import { STONE } from '@/data/stone';

export const dynamic = 'force-dynamic';

const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }); }

  if (clean(body.company, 200)) return NextResponse.json({ success: true }); // honeypot: pretend success to bots
  const name = clean(body.name, 120), email = clean(body.email, 200), service = clean(body.service, 80), message = clean(body.message, 5000);
  if (!name || !email || !message) return NextResponse.json({ error: 'Please fill in your name, email and message.' }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: 'Email sending is not set up yet.' }, { status: 503 });

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || 'Stone Labs Website <onboarding@resend.dev>',
      to: [process.env.CONTACT_TO || STONE.contact.email],
      reply_to: email,
      subject: `New project enquiry from ${name}${service ? ' — ' + service : ''}`,
      html: `<div style="font-family:sans-serif;max-width:600px">
        <h2 style="margin:0 0 4px">New project enquiry</h2>
        <p style="color:#666;margin:0 0 16px">Sent from the Stone Labs website contact form.</p>
        <p><strong>Name:</strong> ${esc(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${esc(email)}">${esc(email)}</a></p>
        ${service ? `<p><strong>Service:</strong> ${esc(service)}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p style="background:#f5f5f2;padding:16px;white-space:pre-wrap">${esc(message)}</p>
      </div>`
    })
  }).catch(() => null);

  if (!res || !res.ok) {
    if (res) console.error('Contact email failed:', res.status, await res.text().catch(() => ''));
    return NextResponse.json({ error: 'The message could not be sent.' }, { status: 502 });
  }
  return NextResponse.json({ success: true });
}
