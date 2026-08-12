'use client';

import Link from 'next/link';
import Button from '@/components/shared/Button';
import StatusPill from '@/components/shared/StatusPill';
import { useAuth } from '@/lib/auth/useAuth';
import { getBriefsForClient, getPitchesForBrief } from '@/lib/data/briefs';
import { formatDate } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import styles from './client.module.css';

export default function BriefsView() {
  const { session } = useAuth('client');
  const briefs = session ? getBriefsForClient(session.id) : [];

  return (
    <div>
      <div className={styles.section} style={{ marginBottom: '1.8rem' }}>
        <Button href={ROUTES.client.briefNew} variant="primary" arrow>
          Post a new brief
        </Button>
      </div>

      {briefs.length === 0 ? (
        <p className={styles.empty}>No briefs yet — post one and let creators come to you.</p>
      ) : (
        <div className={styles.list}>
          {briefs.map((brief) => {
            const pitchCount = getPitchesForBrief(brief.id).length;
            return (
              <Link href={ROUTES.client.briefPitches(brief.id)} className={styles.listItem} key={brief.id} style={{ cursor: 'pointer' }}>
                <div className={styles.listItemMain}>
                  <span className={styles.listItemTitle}>{brief.title}</span>
                  <span className={styles.listItemMeta}>
                    {brief.categories.join(', ')} · {pitchCount} pitch{pitchCount === 1 ? '' : 'es'} · due {formatDate(brief.deadline)}
                  </span>
                </div>
                <StatusPill status={brief.status} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
