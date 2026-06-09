'use client';

import { useEffect, useState } from 'react';

/**
 * Coarse device capability detection used to scale 3D quality.
 * Returns one of: 'low' | 'high'. Defaults to 'low' until mounted so the
 * server render and first paint never assume an expensive scene.
 */
export function useDeviceTier() {
  const [tier, setTier] = useState('low');

  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 2;
    const memory = navigator.deviceMemory || 2;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const narrow = window.innerWidth < 768;

    // Treat phones / low-core / low-memory devices as the low tier.
    const isLow = coarsePointer || narrow || cores <= 4 || memory <= 4;
    setTier(isLow ? 'low' : 'high');
  }, []);

  return tier;
}
