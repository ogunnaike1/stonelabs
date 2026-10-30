'use client';
import { useState } from 'react';
import Image from 'next/image';
import { css } from '@/lib/css';

// Poster with a play button; the video file is only requested when it is played.
export default function WorkVideo({ src, poster, title, vertical }: { src: string; poster: string; title: string; vertical?: boolean }) {
  const [playing, setPlaying] = useState(false);
  const fit = vertical ? 'contain' : 'cover';
  return playing ? (
    <video src={src} poster={poster} controls autoPlay playsInline preload="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: fit, background: '#0b0b0b' }} />
  ) : (
    <>
      <Image src={poster} alt={title + ' — video preview'} fill sizes="(max-width:900px) 100vw, 50vw" style={{ objectFit: fit, background: '#0b0b0b' }} />
      <button type="button" onClick={() => setPlaying(true)} aria-label={'Play ' + title} style={css('position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:72px;height:72px;border-radius:50%;border:0;background:rgba(255,255,255,.94);color:#111;display:grid;place-items:center;cursor:pointer')}>
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
      </button>
    </>
  );
}
