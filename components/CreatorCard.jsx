'use client';

import usePreviewPlayback from './usePreviewPlayback';
import styles from './discovery.module.css';

export function formatRate(min, max) {
  const k = (n) => `${Math.round(n / 1000)}k`;
  return `₹${k(min)}–${k(max)}`;
}

/**
 * The unit of the marketplace. The video is the card — name, category and meta
 * sit on top of it rather than beside it, so a client reads the work first.
 *
 * `readOnly` renders the exact same card without the shortlist and request
 * actions, which is how the creator side shows a creator what a brand sees.
 */
export default function CreatorCard({
  creator,
  saved = false,
  readOnly = false,
  onToggleSave,
  onRequest,
}) {
  const { playing, progress, containerProps, videoProps } = usePreviewPlayback();

  return (
    <article className={styles.card} {...containerProps}>
      <div className={`${styles.media} ${playing ? styles.playing : ''}`}>
        <img src={creator.preview.posterUrl} alt="" loading="lazy" />
        <video
          {...videoProps}
          src={creator.preview.previewUrl}
          tabIndex={-1}
          aria-label={`Portfolio preview from ${creator.name}`}
        />

        <div className={styles.scrim}>
          <div className={styles.topRow}>
            <span className={styles.rate}>{formatRate(creator.rateMin, creator.rateMax)}</span>
            {!readOnly && (
              <button
                type="button"
                className={`${styles.save} ${saved ? styles.saveOn : ''}`}
                aria-pressed={saved}
                aria-label={
                  saved ? `Remove ${creator.name} from shortlist` : `Shortlist ${creator.name}`
                }
                onClick={() => onToggleSave?.(creator.id)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M12 20.5S3.5 15 3.5 9.2A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.5 2.8c0 5.8-8.5 11.3-8.5 11.3Z"
                    fill={saved ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </div>

          <div className={styles.info}>
            <h3 className={styles.name}>
              {creator.name}
              <svg
                className={styles.check}
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                role="img"
                aria-label="Reviewed and approved by BCM"
              >
                <path
                  d="m12 2.6 2.4 1.9 3-.3 1 2.9 2.6 1.6-1 2.9 1 2.9-2.6 1.6-1 2.9-3-.3-2.4 1.9-2.4-1.9-3 .3-1-2.9L3 15.5l1-2.9-1-2.9 2.6-1.6 1-2.9 3 .3L12 2.6Z"
                  fill="currentColor"
                  opacity=".22"
                />
                <path
                  d="m8.6 12.1 2.3 2.3 4.5-4.8"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </h3>
            <p className={styles.category}>
              {creator.category} · {creator.contentStyles[0]}
            </p>
            <p className={styles.metaLine}>
              {creator.languages.join(' / ')} — {creator.city}
            </p>
            {!readOnly && (
              <button
                type="button"
                className={styles.request}
                onClick={() => onRequest?.(creator)}
              >
                Request this creator
              </button>
            )}
          </div>
        </div>

        <span className={styles.playbar} style={{ width: `${progress}%` }} aria-hidden="true" />
      </div>
    </article>
  );
}
