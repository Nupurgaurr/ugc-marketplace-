import { Quote } from 'lucide-react';
import styles from './MemeBeat.module.css';

/** The beat shown on every application step. Original copy, no reproduced
 *  film quotes and no licensed stills. */
export default function MemeBeat({ line, caption }: { line: string; caption?: string }) {
  return (
    <div className={styles.card}>
      <Quote className={styles.icon} size={20} aria-hidden="true" />
      <div className={styles.text}>
        <p className={styles.line}>{line}</p>
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
    </div>
  );
}
