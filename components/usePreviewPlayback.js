'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Hover-to-play on pointer devices, play-when-visible on touch.
 *
 * Shared by every video surface in the product — the client discovery grid and
 * the creator portfolio grid behave identically because they run the same hook.
 * Returns prop bundles to spread onto the container and the <video>.
 */
export default function usePreviewPlayback() {
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(hover: none)').matches;
    if (!coarse || !rootRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.intersectionRatio > 0.55),
      { threshold: [0, 0.55, 1] }
    );
    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      const play = video.play();
      if (play?.catch) play.catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
      setReady(false);
      setProgress(0);
    }
  }, [active]);

  return {
    playing: active && ready,
    progress: active && ready ? progress : 0,
    containerProps: {
      ref: rootRef,
      onMouseEnter: () => setActive(true),
      onMouseLeave: () => setActive(false),
      onFocus: () => setActive(true),
      onBlur: (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setActive(false);
      },
    },
    videoProps: {
      ref: videoRef,
      muted: true,
      loop: true,
      playsInline: true,
      preload: 'none',
      onPlaying: () => setReady(true),
      onTimeUpdate: (e) => {
        const el = e.currentTarget;
        if (el.duration) setProgress((el.currentTime / el.duration) * 100);
      },
    },
  };
}
