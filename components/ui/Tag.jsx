import styles from './ui.module.css';

export default function Tag({ accent = false, children, className = '' }) {
  return (
    <span className={`${styles.tag} ${accent ? styles.tagAccent : ''} ${className}`}>
      {children}
    </span>
  );
}
