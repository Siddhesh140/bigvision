'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { ScreenQuad } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

/**
 * Cinematic volumetric fog rendered as a fullscreen fragment shader.
 * Domain-warped fbm noise drifts over time; a pulsing cyan core lights the
 * mist from within, graded into the BigVision blue palette. The fog sampling
 * point is parallaxed by the (damped) pointer position.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform vec2  uMouse;
  uniform float uIntensity;
  uniform int   uOctaves;

  // --- value noise -------------------------------------------------------
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 8; i++) {
      if (i >= uOctaves) break;
      value += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return value;
  }

  void main() {
    // aspect-correct, centered coordinates
    vec2 uv = vUv;
    vec2 p = (uv - 0.5);
    p.x *= uResolution.x / uResolution.y;

    float t = uTime * 0.05;

    // base frequency — high enough that several billows fill the screen
    float freq = 3.2;

    // parallax + slow drift
    vec2 drift = vec2(t, t * 0.6) + uMouse * 0.2;

    // domain warping for organic, billowing fog
    vec2 q = vec2(fbm(p * freq + drift),
                  fbm(p * freq + drift + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(p * freq + 1.8 * q + vec2(1.7, 9.2) + t * 0.6),
                  fbm(p * freq + 1.8 * q + vec2(8.3, 2.8) - t * 0.6));
    float fog = fbm(p * freq + 2.2 * r + drift);

    // contrast: crush the lows to dark negative space, keep bright wisps
    fog = clamp(pow(fog * 1.25, 1.6), 0.0, 1.0);

    // BigVision palette: deep navy -> royal blue -> cyan highlights
    vec3 deep  = vec3(0.020, 0.027, 0.055);   // near-black navy
    vec3 blue  = vec3(0.133, 0.075, 0.768);   // ~#2213C4
    vec3 cyan  = vec3(0.192, 0.635, 0.953);   // ~#31A2F3

    vec3 color = mix(deep, blue, smoothstep(0.30, 0.85, fog));
    color = mix(color, cyan, smoothstep(0.70, 1.0, fog));

    // pulsing cyan core glow (echoes the brand's centre glow)
    float pulse = 0.5 + 0.5 * sin(uTime * 0.6);
    vec2  core = uMouse * 0.12;
    float d = length(p - core);
    float glow = exp(-d * 1.8) * (0.30 + 0.22 * pulse);
    color += cyan * glow * (0.5 + 0.5 * fog);

    // darken toward the bottom so headline text stays legible
    color *= mix(1.05, 0.45, smoothstep(0.15, 1.0, uv.y));

    // soft vignette
    float vig = smoothstep(1.15, 0.35, length(p));
    color *= mix(0.55, 1.0, vig);

    color *= uIntensity;

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function FogScene({ tier = 'high' }) {
  const materialRef = useRef(null);
  const { size, viewport } = useThree();

  // pointer state, damped toward the target for smooth parallax
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 1.0 },
      uOctaves: { value: tier === 'high' ? 6 : 4 },
    }),
    [tier]
  );

  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;

    // pointer in -1..1, y up
    const pointer = state.pointer;
    target.current.set(pointer.x, pointer.y);
    mouse.current.lerp(target.current, Math.min(1, delta * 2.5));

    mat.uniforms.uTime.value += delta;
    mat.uniforms.uMouse.value.copy(mouse.current);
    mat.uniforms.uResolution.value.set(
      size.width * viewport.dpr,
      size.height * viewport.dpr
    );
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={materialRef}
        key={tier}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}
