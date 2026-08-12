'use client';

import { useState } from 'react';
import type { Brief } from '@/lib/types';
import DataTable, { type Column } from '@/components/shared/DataTable';
import StatusPill from '@/components/shared/StatusPill';
import Button from '@/components/shared/Button';
import { briefs, approveBrief, rejectBrief, getPitchesForBrief } from '@/lib/data/briefs';
import { getNotesFor, addNote } from '@/lib/data/requests';
import { formatDate } from '@/lib/utils';
import styles from './admin.module.css';

export default function BriefQueue() {
  const [, rerender] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [tab, setTab] = useState<'pending' | 'all'>('pending');

  const bump = () => rerender((n) => n + 1);

  const rows = tab === 'pending' ? briefs.filter((b) => b.status === 'pending') : briefs;

  const columns: Column<Brief>[] = [
    { header: 'Brief', cell: (b) => <span className={styles.name}>{b.title}</span> },
    { header: 'Brand', cell: (b) => b.clientBrand },
    { header: 'Category', cell: (b) => b.categories.join(', ') },
    { header: 'Submitted', cell: (b) => formatDate(b.createdAt) },
    { header: 'Status', cell: (b) => <StatusPill status={b.status} /> },
    {
      header: 'Action',
      cell: (b) =>
        b.status === 'pending' ? (
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            <Button variant="secondary" size="small" onClick={() => { approveBrief(b.id); bump(); }}>
              Approve
            </Button>
            <Button variant="danger" size="small" onClick={() => { rejectBrief(b.id); bump(); }}>
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
          All briefs
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        expandedId={expandedId}
        onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
        emptyLabel="Nothing here."
        renderExpanded={(b) => {
          const notes = getNotesFor('brief', b.id);
          const pitchCount = getPitchesForBrief(b.id).length;
          return (
            <div className={styles.expandBody}>
              <div>
                <p className={styles.detailLabel}>Description</p>
                <p className={styles.detailValue}>{b.description}</p>
              </div>
              <div>
                <p className={styles.detailLabel}>Deliverables</p>
                <p className={styles.detailValue}>{b.deliverables} · due {formatDate(b.deadline)}</p>
              </div>
              <div>
                <p className={styles.detailLabel}>Content styles / languages</p>
                <p className={styles.detailValue}>{b.contentStyles.join(', ') || '—'} · {b.languages.join(', ') || '—'}</p>
              </div>
              <div>
                <p className={styles.detailLabel}>Pitches so far</p>
                <p className={styles.detailValue}>{pitchCount}</p>
              </div>
              <div className={styles.notes}>
                <p className={styles.detailLabel}>Internal notes (private)</p>
                {notes.map((n) => (
                  <div key={n.id} className={styles.noteItem}>
                    {n.body} <span style={{ color: 'var(--bcm-ash-dim)' }}>— {n.author}, {formatDate(n.createdAt)}</span>
                  </div>
                ))}
                <div className={styles.noteForm}>
                  <input
                    className={styles.noteInput}
                    placeholder="Add a private note…"
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                  />
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      if (!noteDraft.trim()) return;
                      addNote('brief', b.id, noteDraft.trim());
                      setNoteDraft('');
                      bump();
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          );
        }}
      />
    </div>
  );
}
