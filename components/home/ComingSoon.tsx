'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { EASE_SOFT, prefersReducedMotion, revealDistance } from '@/lib/animation/gsapConfig';
import styles from './ComingSoon.module.css';

/** The whole home page. One line, centred, nothing else. */
export default function ComingSoon({ start }: { start: boolean }) {
  const lineRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = lineRef.current;
    if (!el || !start) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: revealDistance() },
      { opacity: 1, y: 0, duration: 0.9, ease: EASE_SOFT }
    );

    return () => {
      tween.kill();
    };
  }, [start]);

  return (
    <section className={styles.stage}>
      <p className={styles.line} ref={lineRef}>
        Something good is brewing.
      </p>
    </section>
  );
}
