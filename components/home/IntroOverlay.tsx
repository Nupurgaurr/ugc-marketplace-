'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { EASE_SOFT, prefersReducedMotion } from '@/lib/animation/gsapConfig';
import styles from './IntroOverlay.module.css';

const SESSION_KEY = 'bcm_intro_seen';
const PHASES = ['black coffee.', 'no sugar.'];

/**
 * First-load entrance: complete black screen, typed one line at a time —
 * "black coffee." then "no sugar." — then lifts to reveal the hero. Plays
 * once per browser session. See HANDOVER_GUIDE.md to retune timing.
 */
export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);
  const completedRef = useRef(false);

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    sessionStorage.setItem(SESSION_KEY, '1');
    setVisible(false);
    onComplete();
  };

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) || prefersReducedMotion()) {
      finish();
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!visible || completedRef.current) return;
    const letters = lineRef.current?.querySelectorAll('[data-letter]');
    if (!letters) return;

    const tl = gsap.timeline({ defaults: { ease: EASE_SOFT } });
    tl.fromTo(letters, { opacity: 0 }, { opacity: 1, duration: 0.03, stagger: 0.055 });

    if (phase < PHASES.length - 1) {
      tl.to({}, { duration: 0.6 }).call(() => setPhase((p) => p + 1));
    } else {
      tl.to({}, { duration: 0.7 }).to(rootRef.current, { opacity: 0, duration: 0.55, pointerEvents: 'none' }).call(finish);
    }

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, phase]);

  if (!visible) return null;

  return (
    <div className={styles.overlay} ref={rootRef}>
      <div className={styles.line} ref={lineRef} key={phase}>
        {PHASES[phase].split('').map((ch, i) => (
          <span key={i} data-letter className={styles.letter}>
            {ch}
          </span>
        ))}
        <span className={styles.cursor} aria-hidden="true" />
      </div>
    </div>
  );
}
