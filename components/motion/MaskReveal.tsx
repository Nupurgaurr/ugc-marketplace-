'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { EASE_SOFT, prefersReducedMotion } from '@/lib/animation/gsapConfig';

/** Clip-path wipe reveal, used on section headings instead of a fade.
 *  Plays once, the first time it scrolls into view. */
export default function MaskReveal({
  children,
  className,
  direction = 'left',
}: {
  children: ReactNode;
  className?: string;
  direction?: 'left' | 'up';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion()) {
      gsap.set(el, { clipPath: 'inset(0 0 0 0)' });
      return;
    }

    const hiddenClip = direction === 'left' ? 'inset(0 100% 0 0)' : 'inset(100% 0 0 0)';
    gsap.set(el, { clipPath: hiddenClip });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          gsap.to(el, { clipPath: 'inset(0 0 0 0)', duration: 0.9, ease: EASE_SOFT });
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
