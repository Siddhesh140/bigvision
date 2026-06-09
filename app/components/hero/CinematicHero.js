'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * "Sunrise of Authority" — the cinematic hero background.
 *
 * A layered, parallaxed dawn scene built from the brand's real assets. The
 * brand logo rises like a sun through a feathered valley of clouds. Cloud /
 * mist PNGs are authored on opaque black, so every image layer is composited
 * with `mix-blend-mode: screen` (black drops out) and edge-feathered with CSS
 * masks — this is what prevents the hard rectangles/seams. An intro timeline
 * plays once; afterwards the scene breathes and tracks the pointer.
 * Reduced-motion users get the composed final frame, no animation.
 *
 * Layer order (back -> front): sky -> ember -> high clouds -> god-rays ->
 * halo -> logo "sun" -> side cloud banks (feathered to clear the centre) ->
 * foreground mist -> legibility wash -> vignette -> film grain.
 */

const EASE_OUT = [0.16, 1, 0.3, 1];

// faint film grain so the scene reads as "shot", not flat-rendered
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function CinematicHero() {
  const reduced = useReducedMotion();

  // normalized pointer (-1..1), spring-smoothed for a gliding parallax dolly
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 45, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 45, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [reduced, px, py]);

  // parallax offsets — deeper layers move less, foreground most
  const highX = useTransform(sx, [-1, 1], [10, -10]);
  const rayX = useTransform(sx, [-1, 1], [6, -6]);
  const haloX = useTransform(sx, [-1, 1], [14, -14]);
  const haloY = useTransform(sy, [-1, 1], [10, -10]);
  const logoX = useTransform(sx, [-1, 1], [22, -22]);
  const logoY = useTransform(sy, [-1, 1], [14, -14]);
  const leftX = useTransform(sx, [-1, 1], [-30, 12]);
  const rightX = useTransform(sx, [-1, 1], [-12, 30]);
  const cloudY = useTransform(sy, [-1, 1], [20, -20]);
  const mistX = useTransform(sx, [-1, 1], [-18, 18]);
  const mistY = useTransform(sy, [-1, 1], [30, -30]);

  const intro = (config) => (reduced ? {} : config);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 1 — Sky: deep navy with a sunrise glow rising from low-centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(130% 100% at 50% 70%, rgba(49,162,243,0.18) 0%, rgba(34,19,196,0.12) 26%, rgba(9,11,20,1) 64%)',
        }}
      />

      {/* 2 — Ember: a soft horizon glow that simmers up from the bottom */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 100%, rgba(49,162,243,0.28) 0%, rgba(34,19,196,0.12) 45%, transparent 75%)',
        }}
        {...intro({
          initial: { opacity: 0.2 },
          animate: { opacity: [0.55, 0.75, 0.55] },
          transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        })}
      />

      {/* 3 — High clouds: faint band that fills the dead upper space */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[55%]"
        {...intro({
          initial: { opacity: 0 },
          animate: { opacity: 0.22 },
          transition: { duration: 3, delay: 1, ease: EASE_OUT },
        })}
        style={reduced ? { opacity: 0.22 } : undefined}
      >
        <motion.div
          className="relative h-full w-full"
          style={{
            x: highX,
            WebkitMaskImage:
              'linear-gradient(to bottom, #000 0%, transparent 92%)',
            maskImage: 'linear-gradient(to bottom, #000 0%, transparent 92%)',
          }}
        >
          <Image
            src="/ss2.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center top',
              mixBlendMode: 'screen',
              transform: 'scaleY(-1)',
            }}
          />
        </motion.div>
      </motion.div>

      {/* 4 — God-rays: slow-rotating conic streaks behind the sun */}
      <motion.div
        className="absolute left-1/2 top-[50%] h-[1500px] w-[1500px] -translate-x-1/2 -translate-y-1/2"
        style={{
          x: rayX,
          background:
            'repeating-conic-gradient(from 0deg at 50% 50%, rgba(150,210,255,0.11) 0deg 3.5deg, transparent 3.5deg 12deg)',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.95) 0%, transparent 60%)',
          maskImage:
            'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.95) 0%, transparent 60%)',
          filter: 'blur(2px)',
        }}
        initial={reduced ? false : { opacity: 0 }}
        animate={reduced ? { opacity: 0.5 } : { opacity: 0.5, rotate: 360 }}
        transition={
          reduced
            ? undefined
            : {
                opacity: { duration: 3, delay: 0.6 },
                rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
              }
        }
      />

      {/* 5 — Sun halo: blooms as the logo rises, then pulses like a heartbeat */}
      <motion.div
        className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2"
        style={{ x: haloX, y: haloY }}
      >
        <motion.div
          className="h-[960px] w-[960px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(160,215,255,0.95) 0%, rgba(49,162,243,0.55) 18%, rgba(34,19,196,0.30) 42%, rgba(34,19,196,0) 70%)',
          }}
          {...intro({
            initial: { scale: 0.35, opacity: 0 },
            animate: { scale: [1, 1.06, 1], opacity: 1 },
            transition: {
              opacity: { duration: 2, delay: 0.4, ease: EASE_OUT },
              scale: {
                duration: 6,
                delay: 0.4,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
              },
            },
          })}
        />
      </motion.div>

      {/* 6 — The logo "sun": rises from below centre, then floats gently */}
      <motion.div
        className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2"
        style={{ x: logoX, y: logoY }}
      >
        <motion.div
          {...intro({
            initial: { y: 320, scale: 0.55, opacity: 0 },
            animate: { y: 0, scale: 1, opacity: 1 },
            transition: { duration: 2.2, ease: EASE_OUT, delay: 0.3 },
          })}
        >
          <motion.div
            {...intro({
              animate: { y: [0, -14, 0] },
              transition: {
                duration: 7,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: 2.5,
              },
            })}
            style={{
              filter:
                'drop-shadow(0 0 30px rgba(49,162,243,0.9)) drop-shadow(0 0 90px rgba(49,162,243,0.5))',
            }}
          >
            <Image
              src="/Vector.svg"
              alt="BigVision"
              width={360}
              height={200}
              priority
              style={{ width: 'clamp(180px, 24vw, 360px)', height: 'auto' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 7 — Left cloud bank: sweeps in from the left, inner edge feathered */}
      <motion.div
        className="absolute inset-y-0 left-0 w-[60%] overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, #000 0%, #000 42%, transparent 86%)',
          maskImage:
            'linear-gradient(to right, #000 0%, #000 42%, transparent 86%)',
          ...(reduced ? { transform: 'translateX(-5%)' } : {}),
        }}
        {...intro({
          initial: { x: '-70%', opacity: 0 },
          animate: { x: '-5%', opacity: 1 },
          transition: { duration: 2.6, ease: EASE_OUT, delay: 0.5 },
        })}
      >
        <motion.div
          className="relative h-full w-full"
          {...intro({
            animate: { scale: [1, 1.03, 1] },
            transition: { duration: 12, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' },
          })}
          style={{ x: leftX, y: cloudY }}
        >
          <Image
            src="/fullcloud.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="60vw"
            style={{ objectFit: 'cover', objectPosition: 'left top', mixBlendMode: 'screen' }}
          />
        </motion.div>
      </motion.div>

      {/* 8 — Right cloud bank: mirrored, sweeps in from the right */}
      <motion.div
        className="absolute inset-y-0 right-0 w-[60%] overflow-hidden"
        style={{
          WebkitMaskImage:
            'linear-gradient(to left, #000 0%, #000 42%, transparent 86%)',
          maskImage:
            'linear-gradient(to left, #000 0%, #000 42%, transparent 86%)',
          ...(reduced ? { transform: 'translateX(5%)' } : {}),
        }}
        {...intro({
          initial: { x: '70%', opacity: 0 },
          animate: { x: '5%', opacity: 1 },
          transition: { duration: 2.6, ease: EASE_OUT, delay: 0.5 },
        })}
      >
        <motion.div
          className="relative h-full w-full"
          {...intro({
            animate: { scale: [1, 1.03, 1] },
            transition: { duration: 11, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: 1.5 },
          })}
          style={{ x: rightX, y: cloudY }}
        >
          <Image
            src="/fullcloud.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="60vw"
            style={{ objectFit: 'cover', objectPosition: 'left top', mixBlendMode: 'screen', transform: 'scaleX(-1)' }}
          />
        </motion.div>
      </motion.div>

      {/* 9 — Foreground mist: the low ground the sun crests, rises into place */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          WebkitMaskImage: 'linear-gradient(to top, #000 35%, transparent 100%)',
          maskImage: 'linear-gradient(to top, #000 35%, transparent 100%)',
        }}
        {...intro({
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 0.85, y: 0 },
          transition: { duration: 2, ease: EASE_OUT, delay: 0.8 },
        })}
      >
        <motion.div className="relative h-full w-full" style={{ x: mistX, y: mistY }}>
          <Image
            src="/ss2.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center bottom', mixBlendMode: 'screen' }}
          />
        </motion.div>
      </motion.div>

      {/* 10 — Legibility wash: keep the headline readable over the brightest light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(9,11,20,0.50) 0%, rgba(9,11,20,0) 30%, rgba(9,11,20,0) 72%, rgba(9,11,20,0.55) 100%)',
        }}
      />

      {/* 11 — Vignette: close the corners so the eye stays centred */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, transparent 55%, rgba(9,11,20,0.65) 100%)',
        }}
      />

      {/* 12 — Film grain: subtle texture so it feels shot */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: GRAIN,
          opacity: 0.05,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
}
