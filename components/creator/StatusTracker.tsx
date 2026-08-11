import { cx } from '@/lib/utils';
import type { CreatorApplicationStatus } from '@/lib/types';
import styles from './creator.module.css';

const STAGES: { key: CreatorApplicationStatus | 'live'; label: string }[] = [
  { key: 'applied', label: 'Applied' },
  { key: 'in_review', label: 'In review' },
  { key: 'approved', label: 'Approved' },
  { key: 'live', label: 'Live' },
];

const ORDER: Record<string, number> = { applied: 0, in_review: 1, approved: 2, live: 3, rejected: -1 };

export default function StatusTracker({ status }: { status: CreatorApplicationStatus }) {
  const currentIndex = ORDER[status] ?? 0;

  if (status === 'rejected') {
    return (
      <div className={styles.tracker}>
        <p style={{ color: 'var(--status-danger)', fontSize: 'var(--step--1)' }}>
          This application wasn&rsquo;t approved this time. Reach out to the team for details.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.tracker}>
      {STAGES.map((stage, i) => (
        <div key={stage.key} className={cx(styles.trackerStep, i <= currentIndex && styles.trackerStepDone)}>
          <span className={styles.trackerLabel}>{stage.label}</span>
        </div>
      ))}
    </div>
  );
}
