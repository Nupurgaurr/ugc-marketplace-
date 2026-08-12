'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Link from 'next/link';
import { EASE_SOFT, prefersReducedMotion } from '@/lib/animation/gsapConfig';
import { ROUTES } from '@/lib/routes';
import styles from './Hero.module.css';

export default function Hero({ start }: { start: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (!start || played.current || !rootRef.current) return;
    played.current = true;
    const root = rootRef.current;

    const targets = ['[data-headline]', '[data-lede]', '[data-links]']
      .map((sel) => root.querySelector(sel))
      .filter(Boolean);

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    gsap.fromTo(targets, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: EASE_SOFT });
  }, [start]);

  return (
    <section className="section" id="top" ref={rootRef}>
      <div className="container">
        <h1 className={`display--hero ${styles.headline}`} data-headline>
          Pick creators from their work. <em>Not their bio.</em>
        </h1>

        <p className={styles.lede} data-lede>
          A vetted UGC creator network for Indian brands. Watch real portfolio videos, narrow by
          category, language, city and rate, and shortlist in a single pass.
        </p>

        <div className={styles.links} data-links>
          <Link href={ROUTES.discover} className={styles.link}>
            Find a creator →
          </Link>
          <Link href={ROUTES.client.briefNew} className={styles.link}>
            Post a brief →
          </Link>
        </div>
      </div>
    </section>
  );
}
