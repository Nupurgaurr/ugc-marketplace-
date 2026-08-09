'use client';

import Button from './ui/Button';
import styles from './discovery.module.css';

/**
 * Appears the moment a client shortlists anyone. Both actions are the point
 * where the report says an account becomes necessary.
 */
export default function ShortlistTray({ creators, onSave, onRequestAll, onClear }) {
  if (creators.length === 0) return null;

  return (
    <div className={styles.tray} role="status">
      <div className={styles.trayThumbs}>
        {creators.slice(0, 4).map((c) => (
          <img key={c.id} src={c.preview.posterUrl} alt="" />
        ))}
      </div>
      <p className={styles.trayText}>
        <b>{creators.length}</b> shortlisted
      </p>
      <div className={styles.trayActions}>
        <Button variant="ghost" size="small" onClick={onClear}>
          Clear
        </Button>
        <Button variant="secondary" size="small" onClick={onSave}>
          Save
        </Button>
        <Button variant="primary" size="small" arrow onClick={onRequestAll}>
          Request
        </Button>
      </div>
    </div>
  );
}
