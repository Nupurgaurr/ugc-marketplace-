import CreatorCard from './CreatorCard';
import Button from './ui/Button';
import styles from './discovery.module.css';

/** Presentational. Owns no state — filtering and shortlisting live one level up. */
export default function CreatorGrid({ creators, savedIds = [], onToggleSave, onRequest, onReset }) {
  if (creators.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No creators match those filters yet.</p>
        <p className={styles.emptyBody}>
          Loosen a filter, or tell us what you need and we&apos;ll look across the full
          network — including creators still in review.
        </p>
        <Button variant="secondary" onClick={onReset}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          saved={savedIds.includes(creator.id)}
          onToggleSave={onToggleSave}
          onRequest={onRequest}
        />
      ))}
    </div>
  );
}
