import type { ReactNode } from 'react';
import styles from './discoverSections.module.css';

export default function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className={styles.eyebrowRow}>
      <span className={styles.eyebrowRule} aria-hidden="true" />
      <span className={styles.eyebrowText}>{children}</span>
    </p>
  );
}
