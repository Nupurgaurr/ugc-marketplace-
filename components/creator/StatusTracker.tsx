import { cx } from '@/lib/utils';
import type { CreatorStatus } from '@/lib/types';
import styles from './creator.module.css';

const STAGES: { key: CreatorStatus; label: string }[] = [
  { key: 'applied', label: 'Applied' },
  { key: 'in_review', label: 'In review' },
  { key: 'approved', label: 'Approved' },
];

const ORDER: Record<CreatorStatus, number> = { applied: 0, in_review: 1, approved: 2, rejected: -1 };

export default function StatusTracker({ status }: { status: CreatorStatus }) {
  if (status === 'rejected') {
    return (
      <div className={styles.tracker}>
        <p className={styles.trackerRejected}>
          This application wasn&rsquo;t approved this time. Reach out to the team for details.
        </p>
      </div>
    );
  }

  const currentIndex = ORDER[status];

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
