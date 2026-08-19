'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { EASE_SOFT, prefersReducedMotion } from '@/lib/animation/gsapConfig';
import styles from './IntroOverlay.module.css';

const SESSION_KEY = 'bcm_intro_seen';
const WORDS = ['welcome', 'to', 'blackcoffee.ugc'];

/**
 * First-load entrance, home page only. A full black screen, the words
 * staggering in, then a lift to reveal the page.
 *
 * Runs once per browser session. On a repeat visit, or a client-side
 * navigation back to home, `sessionStorage` short-circuits it before the
 * first paint, so there is no flash of black. Under `prefers-reduced-motion`
 * it never runs at all.
 */
export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLParagraphElement>(null);
  const completedRef = useRef(false);

  // Decided during the first render so the overlay never mounts when it
  // should be skipped.
  const [visible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem(SESSION_KEY) && !prefersReducedMotion();
  });

  useEffect(() => {
    if (completedRef.current) return;

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      sessionStorage.setItem(SESSION_KEY, '1');
      onComplete();
    };

    if (!visible) {
      finish();
      return;
    }

    const words = lineRef.current?.querySelectorAll('[data-word]');
    if (!words?.length) {
      finish();
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: EASE_SOFT } });
    tl.fromTo(
      words,
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.12 }
    )
      .to({}, { duration: 0.5 })
      .to(rootRef.current, { yPercent: -100, duration: 0.85 })
      .call(finish);

    return () => {
      tl.kill();
    };
  }, [visible, onComplete]);

  if (!visible) return null;

  return (
    <div className={styles.overlay} ref={rootRef} aria-hidden="true">
      <p className={styles.line} ref={lineRef}>
        {WORDS.map((word) => (
          <span className={styles.wordMask} key={word}>
            <span className={styles.word} data-word>
              {word}
            </span>
          </span>
        ))}
      </p>
    </div>
  );
}
