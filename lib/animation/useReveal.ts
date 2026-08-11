'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { EASE_SOFT, prefersReducedMotion } from './gsapConfig';

interface RevealOptions {
  y?: number;
  delay?: number;
  duration?: number;
}

/** Fades + lifts an element in the first time it scrolls into view. Attach
 *  the returned ref to the element; give it className="reveal" so it starts
 *  hidden even before JS/GSAP runs (see globals.css .reveal). */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options: RevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const { y = 20, delay = 0, duration = 0.7 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            el,
            { opacity: 0, y },
            { opacity: 1, y: 0, duration, delay, ease: EASE_SOFT }
          );
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [y, delay, duration]);

  return ref;
}

/** Same idea, staggered across a container's direct children — used for
 *  card grids and feature lists. */
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
        if (entry.isIntersecting) {
          gsap.fromTo(
            children,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, stagger, ease: EASE_SOFT }
          );
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [stagger]);

  return ref;
}
