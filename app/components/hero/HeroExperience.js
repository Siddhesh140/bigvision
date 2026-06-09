'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { FONTS } from '../../constants/styles';
import { useReducedMotion } from '../../hooks/useReducedMotion';

/**
 * Hero experience — matches the BV brand-design Figma.
 *
 * A tall, pinned scroll sequence on a near-black stage:
 *   • At rest: giant headline + two stat counters, clouds peeking at the
 *     bottom (Frame 1).
 *   • On scroll: the headline/stats lift away, the cloud bank rises, and the
 *     blue BigVision logo is REVEALED emerging from the parting clouds — the
 *     clouds (opaque on near-black) genuinely occlude its lower half (Frame 2),
 *     handing off into "What We Do".
 *
 * fullcloud.png is normal-blended (its dark areas are opaque ~#141414 on the
 * #0A0A0A stage, and its top is transparent, so it feathers into black with
 * no seam). Reduced-motion users get a static composed frame.
 */

const STAGE = '#0A0A0A';
const NUM_GRADIENT =
  'linear-gradient(90deg, #FFFFFF 0%, #EBEBEB 30%, #9A9A9A 75%, #6A6A6A 100%)';

function Stat({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span
        className="font-bold text-transparent bg-clip-text leading-none text-5xl sm:text-6xl md:text-7xl"
        style={{ fontFamily: FONTS.heading, backgroundImage: NUM_GRADIENT }}
      >
        {value}
      </span>
      <span
        className="text-white/80 uppercase tracking-[0.18em] text-sm sm:text-base"
        style={{ fontFamily: FONTS.body }}
      >
        {label}
      </span>
    </div>
  );
}

export default function HeroExperience() {
  const reduced = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  // Scroll-driven choreography
  const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.5], [0, -160]);
  const cloudY = useTransform(scrollYProgress, [0, 0.85], ['60%', '0%']);
  const cloudScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.25]);
  const logoOpacity = useTransform(scrollYProgress, [0.35, 0.72], [0, 1]);
  const logoScale = useTransform(scrollYProgress, [0.35, 0.95], [0.55, 1]);
  const logoY = useTransform(scrollYProgress, [0.35, 0.95], [70, 0]);
  const glowOpacity = useTransform(scrollYProgress, [0.4, 0.85], [0, 0.95]);
  const glowScale = useTransform(scrollYProgress, [0.4, 1], [0.6, 1.1]);

  // In reduced-motion, pin nothing and show a calm composed frame instead.
  const stageStyle = reduced
    ? {}
    : { y: cloudY, scale: cloudScale };

  return (
    <section
      ref={ref}
      className="relative w-full"
      style={{ height: reduced ? '100vh' : '240vh', backgroundColor: STAGE }}
      aria-label="Hero"
    >
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ backgroundColor: STAGE }}
      >
        {/* Radial glow that grows behind the logo as it is revealed */}
        <motion.div
          className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
          style={{
            width: 900,
            height: 900,
            opacity: reduced ? 0.6 : glowOpacity,
            scale: reduced ? 1 : glowScale,
            background:
              'radial-gradient(circle, rgba(49,162,243,0.55) 0%, rgba(34,19,196,0.25) 38%, rgba(34,19,196,0) 70%)',
          }}
          aria-hidden="true"
        />

        {/* The BigVision logo "sun" — sits BEHIND the clouds, revealed on scroll */}
        <motion.div
          className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
          style={{
            opacity: reduced ? 1 : logoOpacity,
            scale: reduced ? 1 : logoScale,
            y: reduced ? 0 : logoY,
            filter:
              'drop-shadow(0 0 40px rgba(49,162,243,0.65)) drop-shadow(0 0 120px rgba(49,162,243,0.35))',
          }}
          aria-hidden="true"
        >
          <Image
            src="/Vector.svg"
            alt=""
            width={520}
            height={289}
            priority
            style={{ width: 'clamp(220px, 34vw, 520px)', height: 'auto' }}
          />
        </motion.div>

        {/* Cloud bank — rises from the bottom, occludes the logo's lower half */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[88%]"
          style={{
            ...(reduced ? { transform: 'translateY(8%)' } : stageStyle),
          }}
          aria-hidden="true"
        >
          <Image
            src="/fullcloud.png"
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center 35%' }}
          />
        </motion.div>

        {/* Headline + stats (Frame 1) — lift away as you scroll */}
        <motion.div
          className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4"
          style={{ opacity: reduced ? 1 : textOpacity, y: reduced ? 0 : textY }}
        >
          <motion.h1
            className="text-center font-bold text-white uppercase leading-[0.95] max-w-[15ch] text-5xl sm:text-7xl md:text-8xl"
            style={{ fontFamily: FONTS.heading }}
            initial={reduced ? false : { y: 60, opacity: 0, filter: 'blur(12px)' }}
            animate={reduced ? false : { y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            Where B2B Brands Become Industry Authorities
          </motion.h1>

          <motion.div
            className="mt-14 flex items-start justify-center gap-16 sm:gap-28"
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={reduced ? false : { opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
          >
            <Stat value="4000+" label="Leads Generated" />
            <Stat value="12+" label="Brands Scaled" />
          </motion.div>
        </motion.div>

        {/* Vignette to keep the corners dark and the eye centred */}
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              'radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,0.7) 100%)',
          }}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
