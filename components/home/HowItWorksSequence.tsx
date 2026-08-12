'use client';

import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/utils';
import styles from './HowItWorksSequence.module.css';

const BEATS = [
  'A person checks every creator.',
  'You browse the whole list without an account.',
  'Pick who you want, or post a brief and let them come to you.',
];

/** Three beats revealed one at a time in the same sticky viewport slot, tied
 *  to scroll position — not a row of cards. */
export default function HowItWorksSequence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const triggers = wrapRef.current?.querySelectorAll<HTMLDivElement>('[data-trigger]');
    if (!triggers || triggers.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(Number((entry.target as HTMLElement).dataset.trigger));
          }
        });
      },
      { threshold: 0, rootMargin: '-45% 0px -45% 0px' }
    );

    triggers.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section--ruled" id="how-it-works">
      <div className={styles.wrap} ref={wrapRef}>
        {BEATS.map((_, i) => (
          <div key={i} className={styles.trigger} data-trigger={i} />
        ))}
        <div className={styles.sticky}>
          <div className={styles.inner}>
            <p className={styles.index}>{String(active + 1).padStart(2, '0')} / {String(BEATS.length).padStart(2, '0')}</p>
            {BEATS.map((beat, i) => (
              <p key={i} className={cx(styles.beat, i === active && styles.beatActive)}>
                {beat}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
