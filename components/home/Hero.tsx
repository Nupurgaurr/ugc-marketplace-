'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Button from '@/components/shared/Button';
import { EASE_SOFT, prefersReducedMotion } from '@/lib/animation/gsapConfig';
import { ROUTES } from '@/lib/routes';
import styles from './Hero.module.css';

const LINE_ONE = ['We', 'built', 'the', 'standard.'];

const STATS = [
  { value: '500+', label: 'vetted creators' },
  { value: '12', label: 'languages' },
  { value: '₹0', label: 'monthly minimum' },
];

export default function Hero({ start }: { start: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const played = useRef(false);

  useEffect(() => {
    if (!start || played.current || !rootRef.current) return;
    played.current = true;
    const root = rootRef.current;

    if (prefersReducedMotion()) {
      gsap.set(root.querySelectorAll('[data-anim]'), { opacity: 1, y: 0 });
      return;
    }

    const words = root.querySelectorAll('[data-hero-word]');
    const tl = gsap.timeline({ defaults: { ease: EASE_SOFT } });

    tl.to(root.querySelector('[data-eyebrow]'), { opacity: 1, duration: 0.5 })
      .fromTo(words, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 }, '-=0.25')
      .to(root.querySelector('[data-lede]'), { opacity: 1, duration: 0.5 }, '-=0.15')
      .to(root.querySelector('[data-actions]'), { opacity: 1, duration: 0.5 }, '-=0.2')
      .to(root.querySelector('[data-stats]'), { opacity: 1, duration: 0.5 }, '-=0.2');
  }, [start]);

  return (
    <section className="section" ref={rootRef}>
      <div className="container">
        <p className={`eyebrow ${styles.eyebrow}`} data-eyebrow>
          India&rsquo;s UGC marketplace
        </p>

        <h1 className={`display--hero ${styles.headline}`}>
          {LINE_ONE.map((word) => (
            <span key={word} className={styles.headlineWord} data-hero-word>
              {word}{' '}
            </span>
          ))}
          <br />
          <em>
            <span className={styles.headlineWord} data-hero-word>
              Everyone
            </span>{' '}
            <span className={styles.headlineWord} data-hero-word>
              else
            </span>{' '}
            <span className={styles.headlineWord} data-hero-word>
              is
            </span>{' '}
            <span className={styles.headlineWord} data-hero-word>
              catching up.
            </span>
          </em>
        </h1>

        <p className={`lede ${styles.lede}`} data-lede>
          Vetted creators. Video-first browsing. No monthly minimum to even look.
        </p>

        <div className={styles.actions} data-actions>
          <Button href={ROUTES.client.discover} variant="primary" arrow>
            Find a creator
          </Button>
          <Button href={ROUTES.creator.register} variant="secondary">
            Become a creator
          </Button>
        </div>

        <div className={styles.stats} data-stats>
          {STATS.map((stat) => (
            <div className={styles.stat} key={stat.label}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
