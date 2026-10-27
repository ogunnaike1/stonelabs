import type { CSSProperties } from 'react';

// Converts a verbatim CSS declaration string (as written in the design prototype) into a React style object.
const cache = new Map<string, CSSProperties>();
export function css(str: string): CSSProperties {
  const hit = cache.get(str);
  if (hit) return hit;
  const out: Record<string, string> = {};
  for (const decl of str.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const k = decl.slice(0, i).trim(), v = decl.slice(i + 1).trim();
    if (!k) continue;
    const key = k.startsWith('--') ? k : k.replace(/^-webkit-/, 'Webkit-').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = v;
  }
  cache.set(str, out as CSSProperties);
  return out as CSSProperties;
}
