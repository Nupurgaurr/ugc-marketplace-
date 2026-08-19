'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { prefersReducedMotion } from '@/lib/animation/gsapConfig';

/** A button that flees the cursor when it gets close, capped at
 *  `maxDodges`. After the cap it goes still and calls `onSettled()`. The
 *  joke has to end, the button becomes a real click target again. Used for
 *  the "Nahi" button on the Roast page. */
export default function DodgeButton({
  children,
  onSettled,
  maxDodges = 3,
  triggerRadius = 140,
  className,
  onClick,
}: {
  children: ReactNode;
  onSettled?: () => void;
  maxDodges?: number;
  triggerRadius?: number;
  className?: string;
  onClick?: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const dodgeCount = useRef(0);
  const settled = useRef(false);
  const [isSettled, setIsSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) {
      setIsSettled(true);
      onSettled?.();
      return;
    }

    const onMove = (e: PointerEvent) => {
      if (settled.current) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist > triggerRadius) return;

      dodgeCount.current += 1;

      if (dodgeCount.current > maxDodges) {
        settled.current = true;
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.6)' });
        setIsSettled(true);
        onSettled?.();
        return;
      }

      const parent = el.offsetParent as HTMLElement | null;
      const bounds = parent?.getBoundingClientRect();
      const maxX = bounds ? bounds.width / 2 - rect.width / 2 : 220;
      const maxY = bounds ? bounds.height / 2 - rect.height / 2 : 80;
      const angle = Math.atan2(cy - e.clientY, cx - e.clientX) + (Math.random() - 0.5) * 0.8;
      const jumpDist = 90 + Math.random() * 70;
      const nextX = gsap.utils.clamp(-maxX, maxX, Math.cos(angle) * jumpDist);
      const nextY = gsap.utils.clamp(-maxY, maxY, Math.sin(angle) * jumpDist);

      gsap.to(el, { x: nextX, y: nextY, duration: 0.35, ease: 'back.out(2)' });
    };

    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [maxDodges, triggerRadius, onSettled]);

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      onClick={onClick}
      style={{ willChange: 'transform', position: 'relative' }}
      data-settled={isSettled}
    >
      {children}
    </button>
  );
}
