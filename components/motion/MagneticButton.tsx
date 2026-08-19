'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/animation/gsapConfig';

/** Wraps any element and pulls it toward the cursor within `radius`px,
 *  snapping back on leave. Used on primary CTAs. See PROJECT_REPORT.md's
 *  interaction inventory. */
export default function MagneticButton({
  children,
  radius = 90,
  strength = 0.4,
  className,
}: {
  children: ReactNode;
  radius?: number;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        xTo(dx * strength);
        yTo(dy * strength);
      } else {
        xTo(0);
        yTo(0);
      }
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [radius, strength]);

  return (
    <div ref={ref} className={className} style={{ display: 'inline-block', willChange: 'transform' }}>
      {children}
    </div>
  );
}
