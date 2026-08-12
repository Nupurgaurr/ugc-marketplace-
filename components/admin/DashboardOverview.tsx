'use client';

import StatCard from '@/components/shared/StatCard';
import StatusPill from '@/components/shared/StatusPill';
import { getAdminOverview } from '@/lib/data/admin';
import { getPendingCreators } from '@/lib/data/creators';
import { getPendingClients } from '@/lib/data/clients';
import { getPendingBriefs } from '@/lib/data/briefs';
import { requests } from '@/lib/data/requests';
import { formatDate } from '@/lib/utils';
import styles from './admin.module.css';

export default function DashboardOverview() {
  const overview = getAdminOverview();
  const pendingCreators = getPendingCreators();
  const pendingClients = getPendingClients();
  const pendingBriefs = getPendingBriefs();

  return (
    <div>
      <div className={styles.statGrid}>
        <StatCard label="Pending creators" value={overview.pendingCreators} hint="awaiting review" />
        <StatCard label="Pending clients" value={overview.pendingClients} hint="awaiting review" />
        <StatCard label="Pending briefs" value={overview.pendingBriefs} hint="awaiting review" />
        <StatCard label="Active requests" value={overview.activeRequests} />
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <p className={styles.sectionTitle}>Needs a decision</p>
        </div>
        {pendingCreators.length === 0 && pendingClients.length === 0 && pendingBriefs.length === 0 ? (
          <p style={{ color: 'var(--bcm-ash-dim)', fontSize: 'var(--step--1)' }}>Queue is clear.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.7rem' }}>
            {pendingCreators.map((c) => (
              <div key={c.id} className={styles.noteItem} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.name} · creator application</span>
                <StatusPill status={c.status} />
              </div>
            ))}
            {pendingClients.map((c) => (
              <div key={c.id} className={styles.noteItem} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{c.brand} · brand account</span>
                <StatusPill status={c.status} />
              </div>
            ))}
            {pendingBriefs.map((b) => (
              <div key={b.id} className={styles.noteItem} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{b.title} · brief from {b.clientBrand}</span>
                <StatusPill status={b.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Recent request activity</p>
        <div style={{ display: 'grid', gap: '0.7rem' }}>
          {requests.slice(0, 5).map((r) => (
            <div key={r.id} className={styles.noteItem} style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span>
                {r.clientBrand} → {r.creatorName} · {formatDate(r.createdAt)}
              </span>
              <StatusPill status={r.status} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
