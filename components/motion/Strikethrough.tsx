'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/animation/gsapConfig';
import styles from './Strikethrough.module.css';

/** Draws a line through its children the first time it scrolls into view —
 *  used for "what we don't do" refusals on the home page. */
export default function Strikethrough({ children, className }: { children: ReactNode; className?: string }) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line) return;

    if (prefersReducedMotion()) {
      gsap.set(line, { width: '104%' });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(line, { width: '104%', duration: 0.7, ease: 'power3.inOut', delay: 0.15 });
          observer.unobserve(wrap);
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  return (
    <span className={`${styles.wrap} ${className ?? ''}`} ref={wrapRef}>
      {children}
      <span className={styles.line} ref={lineRef} aria-hidden="true" />
    </span>
  );
}
