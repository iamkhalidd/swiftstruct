'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface AnimatedMarqueeHeroProps {
  title: React.ReactNode;
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  images: string[];
  /** Full-bleed backdrop photograph. Rendered grayscale and veiled so the
   *  black type stays legible. Omit for a plain white canvas. */
  backgroundImage?: string;
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
 * - The scroll effect is transform-only (`useScroll` + `useTransform`). Scroll
 *   progress is never lifted into React state, so scrolling does not re-render
 *   this tree — and every transform is skipped when motion is reduced.
 */
export const AnimatedMarqueeHero: React.FC<AnimatedMarqueeHeroProps> = ({
  title,
  description,
  ctaText,
  ctaHref,
  secondaryCtaText,
  secondaryCtaHref,
  images,
  backgroundImage,
  className,
}) => {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Tracks the hero's own travel: 0 while it fills the viewport, 1 once it has
  // scrolled fully past the top. Everything is derived from the one motion
  // value, so this stays a transform-only effect with no re-renders on scroll.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, -32]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const marqueeY = useTransform(scrollYProgress, [0, 1], [0, -18]);

  // Duplicate the set so the -50% translation below loops seamlessly.
  const duplicatedImages = [...images, ...images];

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative w-full min-h-[calc(100vh-5rem)] overflow-hidden',
        'bg-gradient-to-b from-white via-neutral-50 to-neutral-100',
        'flex flex-col',
        className,
      )}
    >
      {/* Background photograph. Held at grayscale so it sits inside the
          monochrome palette, behind a vertical veil that is near-opaque across
          the copy band and tapers to almost nothing at the bottom — so the
          architecture reads clearly without ever costing the type contrast. */}
      {backgroundImage && (
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover grayscale"
            loading="eager"
            fetchPriority="high"
          />
          {/* Veil shaped to the layout: near-opaque across the copy band so the
              black type keeps its contrast, then tapering off so the lower half
              of the photograph reads clearly around and behind the marquee. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.88)_15%,rgba(255,255,255,0.86)_50%,rgba(255,255,255,0.50)_72%,rgba(255,255,255,0.24)_100%)]" />
        </div>
      )}

      {/* Blueprint dot grid, faded at the edges. Drifts slowly downward while
          the content lifts, which reads as depth without moving much. Held at
          20% now that the photograph supplies most of the texture. */}
      <motion.div
        style={reduceMotion ? undefined : { y: gridY }}
        className="pointer-events-none absolute inset-0 opacity-[0.2] bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
      />

      <motion.div
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pt-20 pb-14 text-center lg:pt-24"
      >
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
      </motion.div>

      {/* Animated image marquee. In normal flow (not absolute) so it can never
          overlap the CTAs when they stack on narrow viewports. */}
      <motion.div
        style={reduceMotion ? undefined : { y: marqueeY }}
        className="relative z-10 h-56 w-full shrink-0 md:h-80 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)]"
      >
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
      </motion.div>
    </section>
  );
};
