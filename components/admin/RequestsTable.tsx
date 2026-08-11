'use client';

import type { MatchRequest } from '@/lib/types';
import DataTable, { type Column } from '@/components/shared/DataTable';
import StatusPill from '@/components/shared/StatusPill';
import { requests } from '@/lib/data/requests';
import { formatDate } from '@/lib/utils';
import styles from './admin.module.css';

const columns: Column<MatchRequest>[] = [
  { header: 'Brand', cell: (r) => <span className={styles.name}>{r.clientBrand}</span> },
  { header: 'Creator', cell: (r) => r.creatorName },
  { header: 'Campaign', cell: (r) => r.campaign },
  { header: 'Need', cell: (r) => r.need },
  { header: 'Sent', cell: (r) => formatDate(r.createdAt) },
  { header: 'Status', cell: (r) => <StatusPill status={r.status} /> },
];

export default function RequestsTable() {
  return <DataTable columns={columns} rows={requests} emptyLabel="No requests yet." />;
}
