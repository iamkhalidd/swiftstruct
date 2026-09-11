'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface AnimatedMarqueeHeroProps {
  tagline: string;
  taglineIcon?: React.ReactNode;
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  images: string[];
  className?: string;
}

const FADE_IN: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

const PRIMARY_CTA =
  'inline-flex items-center justify-center gap-2 rounded-full bg-black px-8 py-3.5 font-semibold text-white shadow-lg shadow-black/20 transition-colors hover:bg-neutral-800';

const SECONDARY_CTA =
  'inline-flex items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-8 py-3.5 font-semibold text-neutral-800 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-100';

/**
 * Light "architectural canvas" hero with a scrolling image marquee.
 *
 * Notes on the light treatment:
 * - The section fades from white to neutral-100 so it meets the `bg-white`
 *   section below without a visible seam.
 * - Marquee cards sit in a white photo-mat frame; a bare shadow reads washed
 *   out against a light background.
 * - `framer-motion` animations are JS-driven and are NOT covered by the
 *   `prefers-reduced-motion` CSS block in globals.css, so `useReducedMotion`
 *   is required to honour that preference here.
 */
export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  tagline,
  taglineIcon,
  title,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  images,
  className,
}) => {
  const reduceMotion = useReducedMotion();

  // Duplicate the set so the -50% translation below loops seamlessly.
  const duplicatedImages = [...images, ...images];

  return (
    <section
      className={cn(
        'relative w-full min-h-[calc(100vh-5rem)] overflow-hidden',
        'bg-gradient-to-b from-white via-neutral-50 to-neutral-100',
        'flex flex-col',
        className,
      )}
    >
      {/* Blueprint dot grid, faded at the edges */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      {/* Soft neutral glow behind the headline */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-neutral-200/60 blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-14 text-center lg:pt-24">
        {/* Tagline */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-700 shadow-sm backdrop-blur"
        >
          {taglineIcon}
          {tagline}
        </motion.div>

        {/* Main title */}
        <motion.h1
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
          className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-neutral-900"
        >
          {typeof title === 'string' ? (
            title.split(' ').map((word, i) => (
              <motion.span key={i} variants={FADE_IN} className="inline-block">
                {word}&nbsp;
              </motion.span>
            ))
          ) : (
            title
          )}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.5 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600"
        >
          {description}
        </motion.p>

        {/* Calls to action */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={FADE_IN}
          transition={{ delay: 0.6 }}
          className="mt-9 flex flex-col gap-4 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link href={ctaHref} className={PRIMARY_CTA}>
              {ctaText} <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </motion.div>

          {secondaryCtaText && secondaryCtaHref && (
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href={secondaryCtaHref} className={SECONDARY_CTA}>
                {secondaryCtaText}
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Animated image marquee. In normal flow (not absolute) so it can never
          overlap the CTAs when they stack on narrow viewports. */}
      <div className="relative z-10 h-56 w-full shrink-0 md:h-80 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]">
        <motion.div
          className="flex h-full items-center gap-5"
          animate={reduceMotion ? undefined : { x: ['0%', '-50%'] }}
          transition={
            reduceMotion ? undefined : { ease: 'linear', duration: 40, repeat: Infinity }
          }
        >
          {duplicatedImages.map((src, index) => (
            <div
              key={index}
              className="relative aspect-[3/4] h-48 flex-shrink-0 rounded-2xl bg-white p-2 shadow-xl shadow-black/10 ring-1 ring-black/5 md:h-64"
              style={{ rotate: `${index % 2 === 0 ? -2 : 5}deg` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Showcase image ${index + 1}`}
                className="h-full w-full rounded-xl object-cover"
                loading={index > 3 ? 'lazy' : 'eager'}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
