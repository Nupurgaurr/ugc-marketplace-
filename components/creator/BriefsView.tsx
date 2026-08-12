'use client';

import { useState } from 'react';
import type { Brief } from '@/lib/types';
import Button from '@/components/shared/Button';
import { useAuth } from '@/lib/auth/useAuth';
import { getBriefsForCreator, hasPitched } from '@/lib/data/briefs';
import { formatDate } from '@/lib/utils';
import PitchModal from './PitchModal';
import styles from './creator.module.css';

export default function BriefsView() {
  const { session } = useAuth('creator');
  const [tab, setTab] = useState<'matched' | 'other'>('matched');
  const [pitching, setPitching] = useState<Brief | null>(null);
  const [, bump] = useState(0);

  const { matched, other } = session ? getBriefsForCreator(session.id) : { matched: [], other: [] };
  const list = tab === 'matched' ? matched : other;

  return (
    <div>
      <div className={styles.tabs}>
        <Button variant={tab === 'matched' ? 'primary' : 'secondary'} size="small" onClick={() => setTab('matched')}>
          For you ({matched.length})
        </Button>
        <Button variant={tab === 'other' ? 'primary' : 'secondary'} size="small" onClick={() => setTab('other')}>
          Everything else ({other.length})
        </Button>
      </div>

      {tab === 'other' && (
        <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash-dim)', marginBottom: '1.2rem' }}>
          Not your category. Pitch anyway if you can actually pull it off.
        </p>
      )}

      {list.length === 0 ? (
        <p style={{ color: 'var(--bcm-ash-dim)', fontSize: 'var(--step--1)' }}>
          {tab === 'matched' ? (
            <>
              No briefs in your category right now.{' '}
              <button type="button" onClick={() => setTab('other')} style={{ color: 'var(--bcm-accent)' }}>
                Go look at everything else →
              </button>
            </>
          ) : (
            'Nothing here either. Check back soon.'
          )}
        </p>
      ) : (
        <div className={styles.briefGrid}>
          {list.map((brief) => {
            const already = session ? hasPitched(brief.id, session.id) : false;
            return (
              <div className={`${styles.briefCard} ${tab === 'other' ? styles.briefCardDim : ''}`} key={brief.id}>
                <p className={styles.briefTitle}>{brief.title}</p>
                <p className={styles.briefMeta}>{brief.clientBrand} · {brief.categories.join(', ')}</p>
                <p className={styles.briefMeta}>{brief.deliverables} · {brief.budgetBand} · due {formatDate(brief.deadline)}</p>
                <div className={styles.briefFooter}>
                  <span className={styles.briefMeta}>{brief.languages.join(', ')}</span>
                  <Button variant="secondary" size="small" disabled={already} onClick={() => setPitching(brief)}>
                    {already ? 'Pitched' : 'Pitch'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PitchModal
        brief={pitching}
        onClose={() => setPitching(null)}
        onSent={() => bump((n) => n + 1)}
      />
    </div>
  );
}
