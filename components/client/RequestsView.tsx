'use client';

import StatusPill from '@/components/shared/StatusPill';
import { useAuth } from '@/lib/auth/useAuth';
import { getRequestsForClient } from '@/lib/data/requests';
import { formatDate } from '@/lib/utils';
import styles from './client.module.css';

export default function RequestsView() {
  const { session } = useAuth('client');
  const requests = session ? getRequestsForClient(session.id) : [];

  if (requests.length === 0) {
    return <p className={styles.empty}>No requests sent yet.</p>;
  }

  return (
    <div className={styles.list}>
      {requests.map((r) => (
        <div className={styles.listItem} key={r.id}>
          <div className={styles.listItemMain}>
            <span className={styles.listItemTitle}>{r.creatorName}</span>
            <span className={styles.listItemMeta}>
              {r.campaign} · {r.need} · sent {formatDate(r.createdAt)}
            </span>
          </div>
          <StatusPill status={r.status} />
        </div>
      ))}
    </div>
  );
}
