'use client';

import { useState } from 'react';
import type { ClientAccount } from '@/lib/types';
import DataTable, { type Column } from '@/components/shared/DataTable';
import StatusPill from '@/components/shared/StatusPill';
import Button from '@/components/shared/Button';
import { clients, setClientStatus } from '@/lib/data/clients';
import { getNotesFor, addNote } from '@/lib/data/requests';
import { formatDate } from '@/lib/utils';
import styles from './admin.module.css';

export default function ClientQueue() {
  const [, rerender] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [noteDraft, setNoteDraft] = useState('');
  const [tab, setTab] = useState<'pending' | 'all'>('pending');

  const bump = () => rerender((n) => n + 1);

  const rows = tab === 'pending' ? clients.filter((c) => c.status === 'pending') : clients;

  const columns: Column<ClientAccount>[] = [
    { header: 'Brand', cell: (c) => <span className={styles.name}>{c.brand}</span> },
    { header: 'Industries', cell: (c) => c.industries.join(', ') },
    { header: 'Submitted', cell: (c) => formatDate(c.submittedAt) },
    { header: 'Budget', cell: (c) => c.monthlyBudgetBand },
    { header: 'Status', cell: (c) => <StatusPill status={c.status} /> },
    {
      header: 'Action',
      cell: (c) =>
        c.status === 'pending' ? (
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            <Button variant="secondary" size="small" onClick={() => { setClientStatus(c.id, 'approved'); bump(); }}>
              Approve
            </Button>
            <Button variant="danger" size="small" onClick={() => { setClientStatus(c.id, 'flagged'); bump(); }}>
              Flag
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
          All clients
        </Button>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        expandedId={expandedId}
        onToggleExpand={(id) => setExpandedId(expandedId === id ? null : id)}
        emptyLabel="Nothing here."
        renderExpanded={(c) => {
          const notes = getNotesFor('client', c.id);
          return (
            <div className={styles.expandBody}>
              <div>
                <p className={styles.detailLabel}>Contact</p>
                <p className={styles.detailValue}>{c.contactName} · {c.email} · {c.phone}</p>
              </div>
              <div>
                <p className={styles.detailLabel}>Website</p>
                <p className={styles.detailValue}>{c.website || '—'}</p>
              </div>
              <div>
                <p className={styles.detailLabel}>Typical volume</p>
                <p className={styles.detailValue}>{c.typicalVolume}</p>
              </div>
              <div>
                <p className={styles.detailLabel}>Budget band</p>
                <p className={styles.detailValue}>{c.monthlyBudgetBand}</p>
              </div>
              <div>
                <p className={styles.detailLabel}>Sells where</p>
                <p className={styles.detailValue}>{c.sellsWhere.join(', ') || '—'}</p>
              </div>
              <div>
                <p className={styles.detailLabel}>Usage rights</p>
                <p className={styles.detailValue}>{c.usageRights || '—'}</p>
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
                      addNote('client', c.id, noteDraft.trim());
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
