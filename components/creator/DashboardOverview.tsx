'use client';

import StatCard from '@/components/shared/StatCard';
import Button from '@/components/shared/Button';
import StatusPill from '@/components/shared/StatusPill';
import StatusTracker from './StatusTracker';
import { useAuth } from '@/lib/auth/useAuth';
import { getCreatorById } from '@/lib/data/creators';
import { getRequestsForCreator } from '@/lib/data/requests';
import { ROUTES } from '@/lib/routes';
import styles from './creator.module.css';

export default function DashboardOverview() {
  const { session } = useAuth('creator');
  const creator = session ? getCreatorById(session.id) : undefined;
  const requests = session ? getRequestsForCreator(session.id) : [];

  if (!creator) return null;

  return (
    <div>
      <StatusTracker status={creator.status} />

      <div className={styles.statGrid}>
        <StatCard label="Portfolio videos" value={creator.portfolio.length} />
        <StatCard label="Rating" value={creator.rating > 0 ? creator.rating.toFixed(1) : '—'} />
        <StatCard label="Incoming requests" value={requests.length} />
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Quick links</p>
        <div className={styles.quickLinks}>
          <Button href={ROUTES.creator.profile} variant="secondary" arrow>
            Edit profile & portfolio
          </Button>
          <Button href={ROUTES.creator.requests} variant="ghost">
            View requests
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Recent requests</p>
        {requests.length === 0 ? (
          <p className={styles.empty}>Nothing yet — requests land here once a brand reaches out.</p>
        ) : (
          <div className={styles.list}>
            {requests.slice(0, 5).map((r) => (
              <div className={styles.listItem} key={r.id}>
                <div className={styles.listItemMain}>
                  <span className={styles.listItemTitle}>{r.clientBrand}</span>
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
