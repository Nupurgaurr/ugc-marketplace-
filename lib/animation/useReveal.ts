'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  EASE_SOFT,
  prefersReducedMotion,
  revealDistance,
  REVEAL_DURATION,
  REVEAL_ROOT_MARGIN,
  REVEAL_THRESHOLD,
} from './gsapConfig';

/** Fades and lifts an element in the first time it scrolls meaningfully into
 *  view. Attach the returned ref to the element and give it
 *  className="reveal" so it starts hidden even before GSAP runs.
 *
 *  Distance, duration, easing and threshold are all shared: nothing here
 *  takes an override, because per-element tuning is what made reveals across
 *  a page land at visibly different speeds. */
export function useReveal<T extends HTMLElement = HTMLDivElement>(delay = 0) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: revealDistance() },
          { opacity: 1, y: 0, duration: REVEAL_DURATION, delay, ease: EASE_SOFT }
        );
        observer.unobserve(el);
      },
      { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}

/** Same reveal, staggered across a container's direct children. */
export function useRevealGroup<T extends HTMLElement = HTMLDivElement>(stagger = 0.08) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = Array.from(el.children) as HTMLElement[];
    if (!children.length) return;

    if (prefersReducedMotion()) {
      gsap.set(children, { opacity: 1, y: 0 });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(
          children,
          { opacity: 0, y: revealDistance() },
          { opacity: 1, y: 0, duration: REVEAL_DURATION, stagger, ease: EASE_SOFT }
        );
        observer.unobserve(el);
      },
      { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  return ref;
}
