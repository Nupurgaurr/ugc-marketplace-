'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '@/lib/animation/gsapConfig';

/**
 * Smooth scrolling, driven off the GSAP ticker rather than its own rAF loop
 * so ScrollTrigger and Lenis advance in the same frame. Two loops is what
 * makes reveals land a frame behind the scroll position and read as
 * out of sync.
 *
 * Under prefers-reduced-motion Lenis never starts, so the browser's own
 * scrolling is left completely alone.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true });

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return null;
}
