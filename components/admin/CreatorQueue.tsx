'use client';

import { useState } from 'react';
import type { Creator } from '@/lib/types';
import DataTable, { type Column } from '@/components/shared/DataTable';
import StatusPill from '@/components/shared/StatusPill';
import Button from '@/components/shared/Button';
import { creators, setCreatorStatus } from '@/lib/data/creators';
import { formatDate } from '@/lib/utils';
import styles from './admin.module.css';

export default function CreatorQueue() {
  const [, rerender] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tab, setTab] = useState<'pending' | 'all'>('pending');

  const bump = () => rerender((n) => n + 1);

  const rows = tab === 'pending' ? creators.filter((c) => c.status === 'applied' || c.status === 'in_review') : creators;

  const columns: Column<Creator>[] = [
    { header: 'Creator', cell: (c) => <span className={styles.name}>{c.name}</span> },
    { header: 'Category', cell: (c) => c.category || '—' },
    { header: 'Submitted', cell: (c) => formatDate(c.submittedAt) },
    { header: 'Sample links', cell: (c) => `${c.handles.length} link${c.handles.length === 1 ? '' : 's'}` },
    { header: 'Status', cell: (c) => <StatusPill status={c.status} /> },
    {
      header: 'Action',
      cell: (c) =>
        c.status === 'applied' || c.status === 'in_review' ? (
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                setCreatorStatus(c.id, 'approved');
                bump();
              }}
            >
              Approve
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => {
                setCreatorStatus(c.id, 'rejected');
                bump();
              }}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span style={{ color: 'var(--bcm-ash-dim)', fontSize: 'var(--step--1)' }}>—</span>
        ),
    },
  ];

  return (
    <div>
      <div className={styles.tabs}>
        <Button variant={tab === 'pending' ? 'primary' : 'secondary'} size="small" onClick={() => setTab('pending')}>
          Pending
        </Button>
        <Button variant={tab === 'all' ? 'primary' : 'secondary'} size="small" onClick={() => setTab('all')}>
          All creators
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        expandedId={expandedId}
        onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
        emptyLabel="Nothing here."
        renderExpanded={(c) => (
          <div className={styles.expandBody}>
            <div>
              <p className={styles.detailLabel}>Contact</p>
              <p className={styles.detailValue}>{c.email} · {c.phone} · {c.city}</p>
            </div>
            <div>
              <p className={styles.detailLabel}>Languages</p>
              <p className={styles.detailValue}>{c.languages.join(', ') || '—'}</p>
            </div>
            <div>
              <p className={styles.detailLabel}>Content styles</p>
              <p className={styles.detailValue}>{c.contentStyles.join(', ') || '—'}</p>
            </div>
            <div>
              <p className={styles.detailLabel}>Handles / links</p>
              <p className={styles.detailValue}>{c.handles.join(', ') || '—'}</p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
