import { cx } from '@/lib/utils';
import styles from './StatusPill.module.css';

type Tone = 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const STATUS_TONE: Record<string, Tone> = {
  approved: 'success',
  delivered: 'success',
  live: 'success',
  accepted: 'info',
  in_review: 'warning',
  pending: 'warning',
  requested: 'warning',
  applied: 'neutral',
  rejected: 'danger',
  declined: 'danger',
  flagged: 'danger',
};

const LABEL: Record<string, string> = {
  in_review: 'In review',
};

export default function StatusPill({ status }: { status: string }) {
  const tone = STATUS_TONE[status] ?? 'neutral';
  const label = LABEL[status] ?? status.replace(/_/g, ' ');
  return <span className={cx(styles.pill, styles[tone])}>{label}</span>;
}
