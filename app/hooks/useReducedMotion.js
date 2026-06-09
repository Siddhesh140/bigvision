'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true when the user prefers reduced motion, or while we don't yet
 * know (SSR / first paint). Components use this to gate heavy WebGL effects
 * and fall back to static posters.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);

    const onChange = (event) => setReduced(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return reduced;
}
