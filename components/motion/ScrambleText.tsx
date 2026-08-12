'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/animation/gsapConfig';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Scrambles random characters, then settles into `text` left-to-right.
 *  Set `play` to trigger it (e.g. on scroll-into-view or a state change). */
export default function ScrambleText({
  text,
  play,
  className,
  frameMs = 32,
  revealEvery = 2,
}: {
  text: string;
  play: boolean;
  className?: string;
  frameMs?: number;
  revealEvery?: number;
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const rafId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!play) return;

    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }

    frame.current = 0;
    const totalFrames = text.length * revealEvery;

    rafId.current = setInterval(() => {
      frame.current += 1;
      const revealCount = Math.floor(frame.current / revealEvery);

      const next = text
        .split('')
        .map((ch, i) => {
          if (ch === ' ') return ' ';
          if (i < revealCount) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join('');

      setDisplay(next);

      if (frame.current >= totalFrames) {
        setDisplay(text);
        if (rafId.current) clearInterval(rafId.current);
      }
    }, frameMs);

    return () => {
      if (rafId.current) clearInterval(rafId.current);
    };
  }, [play, text, frameMs, revealEvery]);

  return (
    <span className={className} aria-label={text}>
      {display}
    </span>
  );
}
