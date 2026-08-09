'use client';

import usePreviewPlayback from './usePreviewPlayback';
import styles from './creator.module.css';

/**
 * A single portfolio upload. Same playback behaviour as the client-side card
 * (shared hook), stripped of the marketplace actions — inside a profile the
 * video is the only thing that matters.
 */
export default function PortfolioTile({ item, creatorName }) {
  const { playing, progress, containerProps, videoProps } = usePreviewPlayback();

  return (
    <div className={`${styles.tile} ${playing ? styles.tilePlaying : ''}`} {...containerProps}>
      <img src={item.posterUrl} alt="" loading="lazy" />
      <video
        {...videoProps}
        src={item.previewUrl}
        tabIndex={-1}
        aria-label={`${item.style} video by ${creatorName}`}
      />
      <span className={styles.tileLabel}>{item.style}</span>
      <span className={styles.tileBar} style={{ width: `${progress}%` }} aria-hidden="true" />
    </div>
  );
}
