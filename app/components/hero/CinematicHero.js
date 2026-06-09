'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useEffect } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * "Sunrise of Authority" — the cinematic hero background.
 *
 * Layered, parallaxed composition built from the brand's real assets:
 *   sky glow -> god-rays -> sun halo -> rising logo "sun" -> side cloud banks
 *   -> foreground mist. An intro timeline plays once on load; afterwards the
 *   scene breathes and tracks the pointer. Reduced-motion users get the
 *   composed final frame with no animation.
 */

const EASE_OUT = [0.16, 1, 0.3, 1];

export default function CinematicHero() {
  const reduced = useReducedMotion();

  // normalized pointer (-1..1), smoothed for buttery parallax
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

  // parallax offsets per layer (deeper layers move less)
  const haloX = useTransform(sx, [-1, 1], [18, -18]);
  const haloY = useTransform(sy, [-1, 1], [12, -12]);
  const logoX = useTransform(sx, [-1, 1], [26, -26]);
  const logoY = useTransform(sy, [-1, 1], [16, -16]);
  const leftCloudX = useTransform(sx, [-1, 1], [-34, 14]);
  const rightCloudX = useTransform(sx, [-1, 1], [-14, 34]);
  const cloudY = useTransform(sy, [-1, 1], [22, -22]);
  const mistY = useTransform(sy, [-1, 1], [30, -30]);

  // gate animation props on reduced-motion
  const intro = (config) => (reduced ? {} : config);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 1 — Sky: deep navy with a sunrise glow low-centre */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(135% 95% at 50% 80%, rgba(49,162,243,0.20) 0%, rgba(34,19,196,0.14) 24%, rgba(9,11,20,1) 62%)',
        }}
      />

      {/* 2 — God-rays: slow-rotating conic streaks behind the sun */}
      <motion.div
        className="absolute left-1/2 top-[58%] h-[1400px] w-[1400px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'repeating-conic-gradient(from 0deg at 50% 50%, rgba(140,205,255,0.10) 0deg 4deg, transparent 4deg 13deg)',
          WebkitMaskImage:
            'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.9) 0%, transparent 62%)',
          maskImage:
            'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.9) 0%, transparent 62%)',
          filter: 'blur(2px)',
        }}
        initial={reduced ? false : { opacity: 0 }}
        animate={reduced ? { opacity: 0.55 } : { opacity: 0.55, rotate: 360 }}
        transition={
          reduced
            ? undefined
            : {
                opacity: { duration: 3, delay: 0.6 },
                rotate: { duration: 120, repeat: Infinity, ease: 'linear' },
              }
        }
      />

      {/* 3 — Sun halo: blooms as the logo rises, then gently pulses */}
      <motion.div
        className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2"
        style={{ x: haloX, y: haloY }}
      >
        <motion.div
          className="h-[760px] w-[760px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(150,210,255,0.95) 0%, rgba(49,162,243,0.55) 16%, rgba(34,19,196,0.30) 38%, rgba(34,19,196,0) 68%)',
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

      {/* 4 — The logo "sun": rises from below centre, then floats gently */}
      <motion.div
        className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2"
        style={{ x: logoX, y: logoY }}
      >
        <motion.div
          {...intro({
            initial: { y: 300, scale: 0.6, opacity: 0 },
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
                delay: 2.4,
              },
            })}
            style={{
              filter:
                'drop-shadow(0 0 28px rgba(49,162,243,0.85)) drop-shadow(0 0 70px rgba(49,162,243,0.45))',
            }}
          >
            <Image
              src="/Vector.svg"
              alt="BigVision"
              width={300}
              height={167}
              priority
              style={{ width: 'clamp(150px, 22vw, 300px)', height: 'auto' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 5 — Left cloud bank: slides in from the left edge */}
      <motion.div
        className="absolute inset-y-0 left-0 w-[72%]"
        {...intro({
          initial: { x: '-72%', opacity: 0 },
          animate: { x: '-6%', opacity: 1 },
          transition: { duration: 2.6, ease: EASE_OUT, delay: 0.5 },
        })}
        style={reduced ? { transform: 'translateX(-6%)' } : undefined}
      >
        <motion.div className="relative h-full w-full" style={{ x: leftCloudX, y: cloudY }}>
          <Image
            src="/fullcloud.png"
            alt=""
            aria-hidden="true"
            fill
            priority
            sizes="72vw"
            style={{ objectFit: 'cover', objectPosition: 'right top' }}
          />
        </motion.div>
      </motion.div>

      {/* 6 — Right cloud bank: mirrored, slides in from the right edge */}
      <motion.div
        className="absolute inset-y-0 right-0 w-[72%]"
        {...intro({
          initial: { x: '72%', opacity: 0 },
          animate: { x: '6%', opacity: 1 },
          transition: { duration: 2.6, ease: EASE_OUT, delay: 0.5 },
        })}
        style={reduced ? { transform: 'translateX(6%)' } : undefined}
      >
        <motion.div className="relative h-full w-full" style={{ x: rightCloudX, y: cloudY }}>
          <Image
            src="/fullcloud.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="72vw"
            style={{ objectFit: 'cover', objectPosition: 'right top', transform: 'scaleX(-1)' }}
          />
        </motion.div>
      </motion.div>

      {/* 7 — Foreground mist: low band the sun rises from behind */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[45%]"
        {...intro({
          initial: { opacity: 0, y: 40 },
          animate: { opacity: 0.8, y: 0 },
          transition: { duration: 2, ease: EASE_OUT, delay: 0.8 },
        })}
      >
        <motion.div className="relative h-full w-full" style={{ y: mistY }}>
          <Image
            src="/ss2.png"
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center bottom' }}
          />
        </motion.div>
      </motion.div>

      {/* 8 — Legibility wash so the headline reads over the brightest light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(9,11,20,0.55) 0%, rgba(9,11,20,0) 35%, rgba(9,11,20,0) 70%, rgba(9,11,20,0.55) 100%)',
        }}
      />
    </div>
  );
}
