'use client';

import { MEME_MANIFEST } from '@/content/memes';
import { useReveal } from '@/lib/animation/useReveal';
import { cx } from '@/lib/utils';
import styles from './MemeSlot.module.css';

/**
 * Renders a real meme asset if the manifest entry has a `src`, otherwise a
 * bold animated typographic fallback built from `caption`. See
 * content/memes.ts — every slot ships empty by default.
 */
export default function MemeSlot({
  id,
  caption,
  className,
}: {
  id: string;
  caption?: string;
  className?: string;
}) {
  const entry = MEME_MANIFEST[id];
  const ref = useReveal<HTMLDivElement>({ y: 16, duration: 0.6 });

  if (entry?.src) {
    return (
      <div className={cx(styles.slot, className)}>
        <img className={styles.image} src={entry.src} alt={entry.alt} />
      </div>
    );
  }

  return (
    <div className={cx(styles.slot, styles.fallback, className)} ref={ref}>
      <p className={cx(styles.fallbackText, 'reveal')}>{caption ?? entry?.alt ?? ''}</p>
    </div>
  );
}
