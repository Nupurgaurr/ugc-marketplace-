'use client';

import { useState, useTransition } from 'react';
import DataTable, { type Column } from '@/components/shared/DataTable';
import StatusPill from '@/components/shared/StatusPill';
import Button from '@/components/shared/Button';
import { reviewCreator } from '@/app/actions/review';
import { languageLabel } from '@/lib/languages';
import { formatDate } from '@/lib/utils';
import type { CreatorRow } from '@/lib/data/admin';
import styles from './admin.module.css';

export default function CreatorQueue({ rows }: { rows: CreatorRow[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  const visible =
    tab === 'pending' ? rows.filter((c) => c.status === 'applied' || c.status === 'in_review') : rows;

  const review = (id: string, status: 'in_review' | 'approved' | 'rejected') => {
    setError('');
    startTransition(async () => {
      const result = await reviewCreator(id, status);
      if (!result.ok) setError(result.message);
    });
  };

  const columns: Column<CreatorRow>[] = [
    { header: 'Creator', cell: (c) => <span className={styles.name}>{c.full_name}</span> },
    { header: 'Category', cell: (c) => c.category_label ?? 'None' },
    { header: 'Submitted', cell: (c) => formatDate(c.created_at) },
    {
      header: 'Sample links',
      cell: (c) => `${c.sample_links.length} link${c.sample_links.length === 1 ? '' : 's'}`,
    },
    { header: 'Status', cell: (c) => <StatusPill status={c.status} /> },
    {
      header: 'Action',
      cell: (c) =>
        c.status === 'applied' || c.status === 'in_review' ? (
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            {c.status === 'applied' && (
              <Button variant="ghost" size="small" disabled={isPending} onClick={() => review(c.id, 'in_review')}>
                Start review
              </Button>
            )}
            <Button variant="secondary" size="small" disabled={isPending} onClick={() => review(c.id, 'approved')}>
              Approve
            </Button>
            <Button variant="danger" size="small" disabled={isPending} onClick={() => review(c.id, 'rejected')}>
              Reject
            </Button>
          </div>
        ) : (
          <span className={styles.muted}>None</span>
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

      {error && <p className={styles.queueError}>{error}</p>}

      <DataTable
        columns={columns}
        rows={visible}
        expandedId={expandedId}
        onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
        emptyLabel="Nothing here."
        renderExpanded={(c) => (
          <div className={styles.expandBody}>
            <div>
              <p className={styles.detailLabel}>Contact</p>
              <p className={styles.detailValue}>
                {c.email} · {c.phone} · {c.city}
              </p>
            </div>
            <div>
              <p className={styles.detailLabel}>Languages</p>
              <p className={styles.detailValue}>{c.languages.map(languageLabel).join(', ') || 'None'}</p>
            </div>
            <div>
              <p className={styles.detailLabel}>Content styles</p>
              <p className={styles.detailValue}>{c.content_styles.join(', ') || 'None'}</p>
            </div>
            <div>
              <p className={styles.detailLabel}>Social profiles</p>
              <p className={styles.detailValue}>{c.social_handles.join(' · ') || 'None'}</p>
            </div>
            <div>
              <p className={styles.detailLabel}>Sample links</p>
              <p className={styles.detailValue}>{c.sample_links.join(' · ') || 'None'}</p>
            </div>
          </div>
        )}
      />
    </div>
  );
}
