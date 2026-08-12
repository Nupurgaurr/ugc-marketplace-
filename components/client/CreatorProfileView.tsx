'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Creator, PortfolioItem } from '@/lib/types';
import { Tag } from '@/components/shared/Tag';
import Button from '@/components/shared/Button';
import { usePreviewPlayback } from '@/components/shared/usePreviewPlayback';
import { useAuth } from '@/lib/auth/useAuth';
import { useShortlist } from './useShortlist';
import RequestModal from './RequestModal';
import AuthGateModal from './AuthGateModal';
import { ROUTES } from '@/lib/routes';
import styles from './client.module.css';
import cardStyles from '@/components/shared/VideoPreviewCard.module.css';

function PortfolioTile({ item }: { item: PortfolioItem }) {
  const { videoRef, onEnter, onLeave } = usePreviewPlayback();
  return (
    <div className={cardStyles.media} onMouseEnter={onEnter} onMouseLeave={onLeave} style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--bcm-line)' }}>
      <img className={cardStyles.poster} src={item.posterUrl} alt={item.title} />
      <video ref={videoRef} className={cardStyles.video} src={item.previewUrl} muted loop playsInline preload="none" />
    </div>
  );
}

export default function CreatorProfileView({ creator }: { creator: Creator }) {
  const { session } = useAuth('client');
  const { isShortlisted, toggle } = useShortlist(session?.id);
  const [requesting, setRequesting] = useState(false);
  const [gate, setGate] = useState<{ open: boolean; context: string }>({ open: false, context: '' });

  const handleFavorite = () => {
    if (!session) {
      setGate({ open: true, context: 'Save this shortlist across sessions.' });
      return;
    }
    toggle(creator.id);
  };

  const handleRequest = () => {
    if (!session) {
      setGate({ open: true, context: `Send a request to ${creator.name}.` });
      return;
    }
    setRequesting(true);
  };

  return (
    <div>
      <Link href={ROUTES.discover} style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)' }}>
        ← All creators
      </Link>

      <div className={styles.profileHead} style={{ marginTop: '1.2rem' }}>
        <div>
          <h1 className={`display ${styles.profileName}`}>{creator.name}</h1>
          <p className={styles.profileMeta}>
            {creator.category} · {creator.city} · {creator.rating > 0 ? `★ ${creator.rating.toFixed(1)}` : 'New'}
          </p>
          <div className={styles.profileTags}>
            {creator.contentStyles.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
            {creator.languages.map((l) => (
              <Tag key={l}>{l}</Tag>
            ))}
            <Tag>{creator.turnaround}</Tag>
            <Tag>{creator.shootSetup}</Tag>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <Button variant="secondary" onClick={handleFavorite}>
            {isShortlisted(creator.id) ? '★ Shortlisted' : '☆ Shortlist'}
          </Button>
          <Button variant="primary" arrow onClick={handleRequest}>
            Request
          </Button>
        </div>
      </div>

      {creator.bio && <p className={styles.profileBio}>{creator.bio}</p>}

      <div className={styles.portfolioGrid}>
        {creator.portfolio.map((item) => (
          <PortfolioTile item={item} key={item.id} />
        ))}
      </div>

      <RequestModal creator={requesting ? creator : null} onClose={() => setRequesting(false)} onSent={() => {}} />
      <AuthGateModal open={gate.open} context={gate.context} onClose={() => setGate({ open: false, context: '' })} />
    </div>
  );
}
