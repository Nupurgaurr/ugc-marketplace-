import type { ReactNode } from 'react';
import { cx } from '@/lib/utils';
import styles from './Tag.module.css';

export function Tag({ children, on = false }: { children: ReactNode; on?: boolean }) {
  return <span className={cx(styles.tag, on && styles.on)}>{children}</span>;
}

/** Toggleable pill used across the multistep chip pickers (niche, styles, languages). */
export function Chip({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cx(styles.chip, active && styles.chipOn)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
