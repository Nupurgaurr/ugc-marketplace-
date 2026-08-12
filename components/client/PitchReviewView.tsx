'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import StatusPill from '@/components/shared/StatusPill';
import { getBriefById, getPitchesForBrief, setPitchStatus, selectPitch } from '@/lib/data/briefs';
import { formatDate } from '@/lib/utils';
import styles from './client.module.css';

export default function PitchReviewView({ briefId }: { briefId: string }) {
  const [, bump] = useState(0);
  const brief = getBriefById(briefId);
  const pitches = getPitchesForBrief(briefId);

  if (!brief) {
    return <p className={styles.empty}>Brief not found.</p>;
  }

  const isOpen = brief.status === 'open';

  return (
    <div>
      <div className={styles.pitchCard}>
        <div className={styles.pitchHead}>
          <span className={styles.pitchName}>{brief.title}</span>
          <StatusPill status={brief.status} />
        </div>
        <p className={styles.pitchMeta}>
          {brief.categories.join(', ')} · {brief.deliverables} · {brief.budgetBand} · due {formatDate(brief.deadline)}
        </p>
      </div>

      {pitches.length === 0 ? (
        <p className={styles.empty}>No pitches yet — creators in this category can see it now.</p>
      ) : (
        pitches.map((pitch) => (
          <div className={styles.pitchCard} key={pitch.id}>
            <div className={styles.pitchHead}>
              <span className={styles.pitchName}>{pitch.creatorName}</span>
              <StatusPill status={pitch.status} />
            </div>
            <p className={styles.pitchNote}>{pitch.note}</p>
            <p className={styles.pitchMeta}>
              {pitch.quotedRate} · {pitch.sampleLinks.join(', ') || 'no links given'} · sent {formatDate(pitch.createdAt)}
            </p>
            {isOpen && (pitch.status === 'submitted' || pitch.status === 'shortlisted') && (
              <div className={styles.pitchActions}>
                {pitch.status === 'submitted' && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      setPitchStatus(pitch.id, 'shortlisted');
                      bump((n) => n + 1);
                    }}
                  >
                    Shortlist
                  </Button>
                )}
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => {
                    selectPitch(pitch.id);
                    bump((n) => n + 1);
                  }}
                >
                  Select
                </Button>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    setPitchStatus(pitch.id, 'passed');
                    bump((n) => n + 1);
                  }}
                >
                  Pass
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
