'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import FogScene from './FogScene';

/**
 * WebGL hero canvas. Kept deliberately light: a single fullscreen fog shader
 * plus bloom/vignette. Loaded lazily (see HeroBackground) so it never blocks
 * first paint — a static poster is the LCP element underneath it.
 */
export default function HeroCanvas({ tier = 'high' }) {
  return (
    <Canvas
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
      dpr={tier === 'high' ? [1, 1.75] : [1, 1.25]}
      camera={{ position: [0, 0, 1] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <FogScene tier={tier} />
      <EffectComposer disableNormalPass>
        <Bloom
          intensity={tier === 'high' ? 0.9 : 0.55}
          luminanceThreshold={0.45}
          luminanceSmoothing={0.85}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.25} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
