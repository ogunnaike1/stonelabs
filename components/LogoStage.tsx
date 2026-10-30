'use client';
import { useEffect, useRef } from 'react';
import { initLogoStage } from '@/lib/logoStage';

// Scroll-driven logo layer for the landing page: sits behind the content, in page coordinates.
export default function LogoStage() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = ref.current;
    if (!svg || !svg.parentElement) return;
    return initLogoStage(svg, svg.parentElement);
  }, []);
  return <svg ref={ref} className="hm-stage" aria-hidden="true" focusable="false" />;
}
