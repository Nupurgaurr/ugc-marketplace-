'use client';

import { useRef, useState } from 'react';

/** Hover-to-preview: plays the muted loop on mouse-enter/focus, resets on
 *  leave. Used everywhere a creator's video-first card appears. */
export function usePreviewPlayback() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  const onEnter = () => {
    setActive(true);
    videoRef.current?.play().catch(() => {});
  };

  const onLeave = () => {
    setActive(false);
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return { videoRef, active, onEnter, onLeave };
}
