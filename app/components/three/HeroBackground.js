'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useDeviceTier } from '../../hooks/useDeviceTier';

// Code-split the WebGL bundle: it only downloads/executes on capable,
// motion-allowing clients. The static poster below is always the LCP element.
const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

/**
 * Hero background orchestrator.
 *  - Always renders a static fog poster (instant paint, SEO/LCP friendly).
 *  - Mounts the WebGL fog over it (fading in) when motion is allowed.
 *  - Falls back to poster-only for reduced-motion users.
 */
export default function HeroBackground() {
  const reduced = useReducedMotion();
  const tier = useDeviceTier();
  const [canvasReady, setCanvasReady] = useState(false);

  // small delay so the poster paints first, then the canvas fades in
  useEffect(() => {
    if (reduced) return;
    const id = requestAnimationFrame(() => setCanvasReady(true));
    return () => cancelAnimationFrame(id);
  }, [reduced]);

  return (
    <div className="absolute inset-0">
      {/* Static poster — immediate paint, also the reduced-motion fallback */}
      <Image
        src="/Frame 3.svg"
        alt=""
        aria-hidden="true"
        fill
        priority
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />

      {/* WebGL fog, faded in over the poster */}
      {!reduced && canvasReady && (
        <div
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: 1 }}
        >
          <HeroCanvas tier={tier} />
        </div>
      )}
    </div>
  );
}
