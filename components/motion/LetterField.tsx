'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/animation/gsapConfig';
import styles from './LetterField.module.css';

/** A word set in huge type, letters repelled by the cursor and settling
 *  back with ease. Re-mount with a `key` prop to change the word. Tap
 *  scatters harder on touch devices. Used on the pending/waiting stage. */
export default function LetterField({ word }: { word: string }) {
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field || prefersReducedMotion()) return;

    const letters = Array.from(field.querySelectorAll<HTMLSpanElement>('[data-letter]'));
    const movers = letters.map((el) => ({
      el,
      xTo: gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' }),
      yTo: gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' }),
    }));

    const repel = (clientX: number, clientY: number, force: number) => {
      movers.forEach(({ el, xTo, yTo }) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = cx - clientX;
        const dy = cy - clientY;
        const dist = Math.hypot(dx, dy) || 1;
        const radius = 160;
        if (dist < radius) {
          const push = ((radius - dist) / radius) * force;
          xTo((dx / dist) * push);
          yTo((dy / dist) * push);
        } else {
          xTo(0);
          yTo(0);
        }
      });
    };

    const onMove = (e: PointerEvent) => repel(e.clientX, e.clientY, 70);
    const onTap = (e: PointerEvent) => repel(e.clientX, e.clientY, 160);

    field.addEventListener('pointermove', onMove);
    field.addEventListener('pointerdown', onTap);
    return () => {
      field.removeEventListener('pointermove', onMove);
      field.removeEventListener('pointerdown', onTap);
    };
  }, [word]);

  return (
    <div className={styles.field} ref={fieldRef} aria-label={word}>
      {word.split('').map((ch, i) => (
        <span key={i} data-letter className={styles.letter} aria-hidden="true">
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </div>
  );
}
