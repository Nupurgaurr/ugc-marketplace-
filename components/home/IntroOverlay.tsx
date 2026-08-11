'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { EASE_SOFT, prefersReducedMotion } from '@/lib/animation/gsapConfig';
import styles from './IntroOverlay.module.css';

const SESSION_KEY = 'bcm_intro_seen';
const WORDMARK = 'blackcoffee.'.split('');

/**
 * First-load entrance: complete black screen → "Welcome to" fades up →
 * "blackcoffee." staggers in letter-by-letter from the left → "UGC" pops in
 * accent color → overlay fades to reveal the hero. Plays once per browser
 * session. See HANDOVER_GUIDE.md to retune timing/easing.
 */
export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLSpanElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(true);
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

    const letters = wordmarkRef.current?.querySelectorAll('[data-letter]');
    const tl = gsap.timeline({ defaults: { ease: EASE_SOFT }, onComplete: finish });

    tl.fromTo(welcomeRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5 })
      .fromTo(
        letters ?? [],
        { opacity: 0, x: -28 },
        { opacity: 1, x: 0, duration: 0.45, stagger: 0.035 },
        '-=0.15'
      )
      .fromTo(productRef.current, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.4 }, '-=0.1')
      .to(rootRef.current, { opacity: 0, duration: 0.55, delay: 0.45, pointerEvents: 'none' });

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div className={styles.overlay} ref={rootRef}>
      <div className={styles.stack}>
        <span className={styles.welcome} ref={welcomeRef}>
          Welcome to
        </span>
        <div className={styles.wordmarkLine}>
          <div className={styles.wordmark} ref={wordmarkRef}>
            {WORDMARK.map((ch, i) => (
              <span key={i} data-letter className={styles.letter}>
                {ch}
              </span>
            ))}
          </div>
          <span className={styles.product} ref={productRef}>
            UGC
          </span>
        </div>
      </div>
    </div>
  );
}
