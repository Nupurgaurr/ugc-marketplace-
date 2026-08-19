import { Quote } from 'lucide-react';
import { cx } from '@/lib/utils';
import styles from './MemeBeat.module.css';

export interface Beat {
  line: string;
  caption?: string;
}

/**
 * The Hinglish beat beside each application step. Original copy, no
 * reproduced film quotes and no licensed stills.
 *
 * `card` opens and closes the form. `line` is the quieter middle register:
 * the same voice without a fifth identical card around it.
 */
export default function MemeBeat({
  line,
  caption,
  variant = 'card',
}: Beat & { variant?: 'card' | 'line' }) {
  if (variant === 'line') {
    return (
      <p className={styles.quiet}>
        {line}
        {caption && <span className={styles.quietCaption}>{caption}</span>}
      </p>
    );
  }

  return (
    <div className={cx(styles.card)}>
      <Quote className={styles.icon} size={20} aria-hidden="true" />
      <div className={styles.text}>
        <p className={styles.line}>{line}</p>
        {caption && <p className={styles.caption}>{caption}</p>}
      </div>
    </div>
  );
}
