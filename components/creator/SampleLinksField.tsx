'use client';

import { Plus, X } from 'lucide-react';
import styles from './SocialProfilesField.module.css';

const MAX_LINKS = 3;

/**
 * Optional, up to three, added one at a time. Separate from social profiles:
 * a handle says where a creator posts, a sample link is one specific piece of
 * work. Instagram reel links are expected here.
 */
export default function SampleLinksField({
  value,
  onChange,
  errors,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  errors?: Record<number, string | undefined>;
}) {
  const setLink = (index: number, next: string) =>
    onChange(value.map((link, i) => (i === index ? next : link)));

  return (
    <div className={styles.wrap}>
      {value.map((link, index) => (
        // eslint-disable-next-line react/no-array-index-key -- rows are positional and reorderable only by removal
        <div className={styles.row} key={index}>
          <div className={styles.rowHead}>
            <span className={styles.platform}>Sample {index + 1}</span>
            <button
              type="button"
              className={styles.remove}
              onClick={() => onChange(value.filter((_, i) => i !== index))}
              aria-label={`Remove sample ${index + 1}`}
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>

          <input
            className={styles.input}
            value={link}
            placeholder="https://instagram.com/reel/..."
            aria-label={`Sample link ${index + 1}`}
            onChange={(e) => setLink(index, e.target.value)}
          />

          {errors?.[index] && <p className={styles.error}>{errors[index]}</p>}
        </div>
      ))}

      {value.length < MAX_LINKS && (
        <button type="button" className={styles.add} onClick={() => onChange([...value, ''])}>
          <Plus size={16} aria-hidden="true" />
          {value.length === 0 ? 'Add a sample link' : 'Add another'}
        </button>
      )}
    </div>
  );
}
