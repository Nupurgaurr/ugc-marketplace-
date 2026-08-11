'use client';

import { useState } from 'react';
import Button from '@/components/shared/Button';
import StatusPill from '@/components/shared/StatusPill';
import { useAuth } from '@/lib/auth/useAuth';
import { getRequestsForCreator, updateRequestStatus } from '@/lib/data/requests';
import { formatDate } from '@/lib/utils';
import styles from './creator.module.css';

export default function RequestInbox() {
  const { session } = useAuth('creator');
  const [, forceRerender] = useState(0);
  const requests = session ? getRequestsForCreator(session.id) : [];

  const act = (id: string, status: 'accepted' | 'declined') => {
    updateRequestStatus(id, status);
    forceRerender((n) => n + 1);
  };

  if (requests.length === 0) {
    return <p className={styles.empty}>No requests yet — they&rsquo;ll show up here once a brand reaches out.</p>;
  }

  return (
    <div className={styles.list}>
      {requests.map((r) => (
        <div className={styles.listItem} key={r.id}>
          <div className={styles.listItemMain}>
            <span className={styles.listItemTitle}>{r.clientBrand}</span>
            <span className={styles.listItemMeta}>
              {r.campaign} · {r.need} · {formatDate(r.createdAt)}
            </span>
          </div>
          {r.status === 'requested' ? (
            <div className={styles.listItemActions}>
              <Button variant="secondary" size="small" onClick={() => act(r.id, 'accepted')}>
                Accept
              </Button>
              <Button variant="ghost" size="small" onClick={() => act(r.id, 'declined')}>
                Decline
              </Button>
            </div>
          ) : (
            <StatusPill status={r.status} />
          )}
        </div>
      ))}
    </div>
  );
}
