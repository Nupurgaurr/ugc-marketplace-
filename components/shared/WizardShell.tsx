'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { EASE_SOFT, prefersReducedMotion } from '@/lib/animation/gsapConfig';
import { cx } from '@/lib/utils';
import Button from './Button';
import styles from './WizardShell.module.css';

/** Shared multistep chrome: progress bar, animated step transitions, and
 *  Back/Next footer. Both the client and creator registration wizards use
 *  this — only the step content and copy differ. */
export default function WizardShell({
  stepLabels,
  activeIndex,
  children,
  onBack,
  onNext,
  isLast,
  nextLabel = 'Continue',
  nextDisabled = false,
  submitting = false,
}: {
  stepLabels: string[];
  activeIndex: number;
  children: ReactNode;
  onBack: () => void;
  onNext: () => void;
  isLast: boolean;
  nextLabel?: string;
  nextDisabled?: boolean;
  submitting?: boolean;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    if (firstRun.current) {
      firstRun.current = false;
      if (!prefersReducedMotion()) {
        gsap.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: EASE_SOFT });
      }
      return;
    }

    if (prefersReducedMotion()) return;
    gsap.fromTo(el, { opacity: 0, x: 16 }, { opacity: 1, x: 0, duration: 0.4, ease: EASE_SOFT });
  }, [activeIndex]);

  return (
    <div className={styles.wrap}>
      <div className={styles.progress}>
        {stepLabels.map((label, i) => (
          <div
            key={label}
            className={cx(styles.segment, i < activeIndex && styles.segmentDone, i === activeIndex && styles.segmentActive)}
          >
            <div className={styles.segmentFill} />
          </div>
        ))}
      </div>
      <p className={styles.stepCounter}>
        Step {activeIndex + 1} of {stepLabels.length} — {stepLabels[activeIndex]}
      </p>

      <div className={styles.viewport} ref={viewportRef}>
        {children}
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" onClick={onBack} disabled={activeIndex === 0}>
          Back
        </Button>
        <Button variant="primary" arrow={!isLast} onClick={onNext} disabled={nextDisabled || submitting}>
          {submitting ? 'Submitting…' : isLast ? 'Submit' : nextLabel}
        </Button>
      </div>
    </div>
  );
}
