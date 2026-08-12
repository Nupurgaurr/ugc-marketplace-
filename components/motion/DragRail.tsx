'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { cx } from '@/lib/utils';
import styles from './DragRail.module.css';

/** Horizontal rail you can drag with the mouse/touch, with inertia on
 *  release. Used for the home creator strip and portfolio grids. */
export default function DragRail({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let inertiaTween: gsap.core.Tween | null = null;

    const onDown = (e: PointerEvent) => {
      isDown = true;
      inertiaTween?.kill();
      startX = e.clientX;
      startScroll = el.scrollLeft;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      el.setPointerCapture(e.pointerId);
    };

    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      el.scrollLeft = startScroll - dx;

      const now = performance.now();
      const dt = now - lastT || 16;
      velocity = ((e.clientX - lastX) / dt) * -16;
      lastX = e.clientX;
      lastT = now;
    };

    const onUp = () => {
      if (!isDown) return;
      isDown = false;
      if (Math.abs(velocity) > 0.5) {
        const target = { v: velocity };
        inertiaTween = gsap.to(target, {
          v: 0,
          duration: 1.1,
          ease: 'power2.out',
          onUpdate: () => {
            el.scrollLeft += target.v;
          },
        });
      }
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      inertiaTween?.kill();
    };
  }, []);

  return (
    <div ref={ref} className={cx(styles.rail, className)}>
      {children}
    </div>
  );
}
