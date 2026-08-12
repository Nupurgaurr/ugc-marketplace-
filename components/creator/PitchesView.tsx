'use client';

import { useMemo } from 'react';
import Button from '@/components/shared/Button';
import StatusPill from '@/components/shared/StatusPill';
import { useAuth } from '@/lib/auth/useAuth';
import { getPitchesForCreator, getBriefById, getBriefsForCreator } from '@/lib/data/briefs';
import { randomRoast } from '@/content/roasts';
import { formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import styles from './creator.module.css';

export default function PitchesView() {
  const { session } = useAuth('creator');
  const pitches = session ? getPitchesForCreator(session.id) : [];
  const openCount = session ? getBriefsForCreator(session.id).matched.length : 0;
  // Stable per-render roast per passed pitch, not re-rolled on every render.
  const roasts = useMemo(() => new Map(pitches.filter((p) => p.status === 'passed').map((p) => [p.id, randomRoast()])), [session?.id]);

  if (pitches.length === 0) {
    return <p style={{ color: 'var(--bcm-ash-dim)', fontSize: 'var(--step--1)' }}>No pitches yet. Go find a brief.</p>;
  }

  return (
    <div className={styles.list}>
      {pitches.map((pitch) => {
        const brief = getBriefById(pitch.briefId);
        if (pitch.status === 'passed') {
          return (
            <div className={styles.roastCard} key={pitch.id}>
              <p className={styles.briefMeta}>{brief?.title ?? 'Brief'} · {brief?.clientBrand}</p>
              <p className={styles.roastLine}>{roasts.get(pitch.id)}</p>
              <Button href={ROUTES.creator.briefs} variant="ghost" size="small" arrow>
                {openCount} open brief{openCount === 1 ? '' : 's'} in your category
              </Button>
            </div>
          );
        }
        return (
          <div className={styles.listItem} key={pitch.id}>
            <div className={styles.listItemMain}>
              <span className={styles.listItemTitle}>{brief?.title ?? 'Brief'}</span>
              <span className={styles.listItemMeta}>
                {brief?.clientBrand} · {pitch.quotedRate} · sent {formatDate(pitch.createdAt)}
              </span>
            </div>
            <StatusPill status={pitch.status} />
          </div>
        );
      })}
    </div>
  );
}
