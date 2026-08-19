'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  prefersReducedMotion,
  REVEAL_ROOT_MARGIN,
  REVEAL_THRESHOLD,
} from '@/lib/animation/gsapConfig';
import { ROUTES } from '@/lib/routes';
import Spotlight from '@/components/motion/Spotlight';
import SmoothScroll from '@/components/motion/SmoothScroll';
import {
  ScreenColdOpen,
  ScreenFirstCut,
  ScreenLine,
  ScreenMemeA,
  ScreenQuestion,
  ScreenTurn,
  ScreenMemeB,
  ScreenWhatWeAre,
  ScreenBar,
  ScreenAsk,
  type ScreenProps,
} from './screens';
import styles from './RoastStage.module.css';
import { cx } from '@/lib/utils';

const SCREENS: Array<(props: ScreenProps) => JSX.Element> = [
  ScreenColdOpen,
  ScreenFirstCut,
  ScreenLine,
  ScreenMemeA,
  ScreenQuestion,
  ScreenTurn,
  ScreenMemeB,
  ScreenWhatWeAre,
  ScreenBar,
  ScreenAsk,
];

const TOTAL = SCREENS.length;

/**
 * A normal stacked-scroll page — NOT scroll-jacked/pinned. An earlier
 * ScrollTrigger-pin version was fragile (huge blank scroll track when the
 * pin failed to engage). Each screen reveals itself via IntersectionObserver
 * as it enters the viewport; that's simple, robust, and still reads as a
 * sequence. See HANDOVER_GUIDE.md.
 */
export default function RoastStage() {
  const router = useRouter();
  const screenRefs = useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set([0]));
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    // A screen reveals once and stays revealed. Tying visibility to a single
    // activeIndex meant every screen faded back out as the next one arrived,
    // which is what made the page feel like it was assembling and
    // disassembling itself as you scrolled.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = screenRefs.current.findIndex((el) => el === entry.target);
          if (idx < 0) return;
          setActiveIndex(idx);
          setRevealed((prev) => (prev.has(idx) ? prev : new Set(prev).add(idx)));
        });
      },
      { threshold: REVEAL_THRESHOLD, rootMargin: REVEAL_ROOT_MARGIN }
    );

    screenRefs.current.forEach((el) => el && observer.observe(el));

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [ready]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        router.push(ROUTES.becomeCreatorApply);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = screenRefs.current[Math.min(activeIndex + 1, TOTAL - 1)];
        next?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = screenRefs.current[Math.max(activeIndex - 1, 0)];
        prev?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeIndex, router]);

  if (!ready) return <div className={styles.bootstrap} />;

  return (
    <div className={styles.wrapper}>
      <SmoothScroll />

      <Link href={ROUTES.becomeCreatorApply} className={styles.skip}>
        Skip to application →
      </Link>

      {SCREENS.map((Screen, i) => {
        const isRevealed = reduced || revealed.has(i);
        return (
          <section
            key={i}
            className={styles.screen}
            ref={(el) => {
              screenRefs.current[i] = el;
            }}
          >
            {i === 3 || i === 6 ? <Spotlight bright /> : <Spotlight />}
            <div className={cx(styles.screenContent, isRevealed && styles.screenContentActive)}>
              <Screen active={reduced || i === activeIndex} reduced={reduced} />
            </div>
          </section>
        );
      })}

      {!reduced && (
        <div className={styles.progress}>
          <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
        </div>
      )}
    </div>
  );
}
