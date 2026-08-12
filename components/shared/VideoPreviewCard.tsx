'use client';

import Link from 'next/link';
import type { Creator } from '@/lib/types';
import { usePreviewPlayback } from './usePreviewPlayback';
import Button from './Button';
import { ROUTES } from '@/lib/routes';
import styles from './VideoPreviewCard.module.css';

export default function VideoPreviewCard({
  creator,
  isFavorited,
  onToggleFavorite,
  onRequest,
}: {
  creator: Creator;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  onRequest?: (creator: Creator) => void;
}) {
  const { videoRef, onEnter, onLeave } = usePreviewPlayback();

  return (
    <div className={styles.card}>
      <Link href={ROUTES.creatorProfile(creator.slug)} className={styles.media} onMouseEnter={onEnter} onMouseLeave={onLeave}>
        <img className={styles.poster} src={creator.preview.posterUrl} alt={`${creator.name} — sample video`} />
        <video
          ref={videoRef}
          className={styles.video}
          src={creator.preview.previewUrl}
          muted
          loop
          playsInline
          preload="none"
        />
      </Link>
      {onToggleFavorite && (
        <button
          type="button"
          className={`${styles.favorite} ${isFavorited ? styles.favoriteOn : ''}`}
          aria-pressed={isFavorited}
          aria-label={isFavorited ? 'Remove from shortlist' : 'Add to shortlist'}
          onClick={() => onToggleFavorite(creator.id)}
        >
          {isFavorited ? '★' : '☆'}
        </button>
      )}
      <div className={styles.body}>
        <Link href={ROUTES.creatorProfile(creator.slug)} className={styles.name}>
          {creator.name}
        </Link>
        <span className={styles.meta}>
          {creator.category} · {creator.city}
        </span>
        <div className={styles.footer}>
          <span className={styles.rating}>{creator.rating > 0 ? `★ ${creator.rating.toFixed(1)}` : 'New'}</span>
          {onRequest && (
            <Button variant="secondary" size="small" onClick={() => onRequest(creator)}>
              Request
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
