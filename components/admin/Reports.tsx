'use client';

import StatCard from '@/components/shared/StatCard';
import { getAdminOverview } from '@/lib/data/admin';
import { requests } from '@/lib/data/requests';
import styles from './admin.module.css';

export default function Reports() {
  const overview = getAdminOverview();
  const byStatus = requests.reduce<Record<string, number>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className={styles.statGrid}>
        <StatCard label="Approved creators" value={overview.approvedCreators} />
        <StatCard label="Pending creators" value={overview.pendingCreators} />
        <StatCard label="Approved clients" value={overview.approvedClients} />
        <StatCard label="Avg. review time" value={`${overview.avgReviewHours} hrs`} />
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Requests by status</p>
        <div className={styles.statGrid}>
          {Object.entries(byStatus).map(([status, count]) => (
            <StatCard key={status} label={status.replace(/_/g, ' ')} value={count} />
          ))}
        </div>
      </div>

      <p style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash-dim)' }}>
        Placeholder reporting — wire real charts once there is real volume to show (see HANDOVER_GUIDE.md).
      </p>
    </div>
  );
}
