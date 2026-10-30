'use client';
import { useState } from 'react';
import Image from 'next/image';

export interface WorkCardProject {
  id: string; title: string; service: string; purpose: string; image: string; url: string; video: string; vertical?: boolean;
}

const PLAY = <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>;

export default function WorkCard({ p }: { p: WorkCardProject }) {
  const [playing, setPlaying] = useState(false);
  const is3d = p.service.startsWith('3D');
  const action = p.video ? 'Watch' : is3d ? 'View 360° tour' : 'Visit website';
  return (
    <article id={p.id} className="hm-card">
      <div className={"hm-thumb" + (p.vertical ? " hm-thumb-v" : "")}>
        {playing && p.video ? (
          <video src={p.video} poster={p.image} controls autoPlay playsInline preload="none" />
        ) : (
          <>
            <Image src={p.image} alt={`${p.title} — ${p.service}`} fill sizes="(max-width:700px) 100vw, (max-width:1100px) 50vw, 33vw" />
            {p.video && <button type="button" className="hm-play" onClick={() => setPlaying(true)} aria-label={`Play ${p.title}`}>{PLAY}</button>}
            {!p.video && p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="hm-thumb-link" tabIndex={-1} aria-hidden="true" />}
          </>
        )}
      </div>
      <div className="hm-card-body">
        <div className="hm-eyebrow">{p.service}</div>
        <h3>{p.title}</h3>
        <p>{p.purpose}</p>
        {p.video ? (
          <button type="button" className="hm-link" onClick={() => setPlaying(true)}>{action} →</button>
        ) : p.url ? (
          <a className="hm-link" href={p.url} target="_blank" rel="noopener noreferrer">{action} →</a>
        ) : null}
      </div>
    </article>
  );
}
