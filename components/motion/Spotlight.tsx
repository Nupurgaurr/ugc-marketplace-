'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/animation/gsapConfig';
import { cx } from '@/lib/utils';
import styles from './Spotlight.module.css';

/** A cursor-following radial glow on a dark surface. Attach inside a
 *  `position: relative` container: it fills it. `bright` toggles the
 *  stronger variant used on meme beats. */
export default function Spotlight({ bright = false }: { bright?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, '--spot-x', { duration: 0.5, ease: 'power2.out' });
    const yTo = gsap.quickTo(el, '--spot-y', { duration: 0.5, ease: 'power2.out' });

    const onMove = (e: PointerEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      xTo(x);
      yTo(y);
    };

    parent.addEventListener('pointermove', onMove);
    return () => parent.removeEventListener('pointermove', onMove);
  }, []);

  return <div ref={ref} className={cx(styles.spotlight, bright && styles.bright)} aria-hidden="true" />;
}
