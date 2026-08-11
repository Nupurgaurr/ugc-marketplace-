import { Fragment, type ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './DataTable.module.css';

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
}

/** Generic admin table with an optional expandable row (used for the
 *  approval queues' "full application + notes" drawer). */
export default function DataTable<T extends { id: string }>({
  columns,
  rows,
  expandedId,
  onToggleExpand,
  renderExpanded,
  emptyLabel = 'Nothing here yet.',
}: {
  columns: Column<T>[];
  rows: T[];
  expandedId?: string | null;
  onToggleExpand?: (id: string) => void;
  renderExpanded?: (row: T) => ReactNode;
  emptyLabel?: string;
}) {
  if (rows.length === 0) {
    return (
      <div className={styles.wrap}>
        <p className={styles.empty}>{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {rows.map((row) => (
            <Fragment key={row.id}>
              <tr
                className={cx(styles.row, !onToggleExpand && styles.rowStatic)}
                onClick={() => onToggleExpand?.(row.id)}
              >
                {columns.map((col) => (
                  <td key={col.header}>{col.cell(row)}</td>
                ))}
              </tr>
              {expandedId === row.id && renderExpanded && (
                <tr className={styles.expanded}>
                  <td colSpan={columns.length}>{renderExpanded(row)}</td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
