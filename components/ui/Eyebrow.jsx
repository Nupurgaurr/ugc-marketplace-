import styles from './ui.module.css';

/** BCM uses a small marker + wide-tracked label above every section heading. */
export default function Eyebrow({ children, className = '' }) {
  return (
    <p className={`${styles.eyebrow} ${className}`}>
      <span className={styles.eyebrowMark} aria-hidden="true" />
      {children}
    </p>
  );
}
