'use client';

import StatCard from '@/components/shared/StatCard';
import Button from '@/components/shared/Button';
import StatusPill from '@/components/shared/StatusPill';
import { useAuth } from '@/lib/auth/useAuth';
import { useShortlist } from './useShortlist';
import { getRequestsForClient } from '@/lib/data/requests';
import { ROUTES } from '@/lib/routes';
import styles from './client.module.css';

export default function DashboardOverview() {
  const { session } = useAuth('client');
  const { ids } = useShortlist(session?.id);
  const requests = session ? getRequestsForClient(session.id) : [];
  const active = requests.filter((r) => r.status === 'requested' || r.status === 'accepted').length;

  return (
    <div>
      <div className={styles.statGrid}>
        <StatCard label="Shortlisted creators" value={ids.length} />
        <StatCard label="Active requests" value={active} />
        <StatCard label="Total requests sent" value={requests.length} />
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Quick links</p>
        <div className={styles.quickLinks}>
          <Button href={ROUTES.client.discover} variant="secondary" arrow>
            Browse creators
          </Button>
          <Button href={ROUTES.client.brief} variant="secondary">
            Post a brief
          </Button>
          <Button href={ROUTES.client.shortlist} variant="ghost">
            View shortlist
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Recent requests</p>
        {requests.length === 0 ? (
          <p className={styles.empty}>No requests yet — shortlist a creator and request them.</p>
        ) : (
          <div className={styles.list}>
            {requests.slice(0, 5).map((r) => (
              <div className={styles.listItem} key={r.id}>
                <div className={styles.listItemMain}>
                  <span className={styles.listItemTitle}>{r.creatorName}</span>
                  <span className={styles.listItemMeta}>{r.campaign} · {r.need}</span>
                </div>
                <StatusPill status={r.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
