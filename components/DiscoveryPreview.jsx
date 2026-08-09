'use client';

import { useMemo, useState } from 'react';
import Eyebrow from './ui/Eyebrow';
import FilterBar from './FilterBar';
import CreatorGrid from './CreatorGrid';
import ShortlistTray from './ShortlistTray';
import { applyFilters, emptySelection, searchCreators } from '@/lib/filters';
import styles from './discovery.module.css';

/**
 * Sections 3 and 4 of the brief live together on purpose: the report's own
 * wireframe puts filters and the video grid on one screen, and a filter row is
 * only convincing when it visibly moves a real result set.
 */
export default function DiscoveryPreview({ creators, savedIds, onToggleSave, onAuth, onClearSaved }) {
  const [selection, setSelection] = useState(emptySelection);
  const [query, setQuery] = useState('');

  const results = useMemo(
    () => applyFilters(searchCreators(creators, query), selection),
    [creators, selection, query]
  );
  const savedCreators = creators.filter((c) => savedIds.includes(c.id));
  const reset = () => {
    setSelection(emptySelection());
    setQuery('');
  };

  return (
    <section className="section section--ruled" id="discover">
      <div className="container">
        <div className={styles.head}>
          <div>
            <Eyebrow>Browse creators</Eyebrow>
            <h2 className="display">
              The grid plays. <em>You don&apos;t open profiles.</em>
            </h2>
            <p className={styles.headCopy}>
              Every tile is a real portfolio video. Hover on desktop, scroll on mobile —
              you see what a creator actually makes before you commit a single click.
            </p>
          </div>
        </div>
      </div>

      <FilterBar
        selection={selection}
        onChange={setSelection}
        onClear={reset}
        query={query}
        onQueryChange={setQuery}
      />

      <div className="container">
        <div className={styles.meter}>
          <p className={styles.count}>
            <b>{results.length}</b> of {creators.length} creators match
          </p>
          <p className={styles.hint}>Shortlist as you go — no account needed to browse</p>
        </div>

        <CreatorGrid
          creators={results}
          savedIds={savedIds}
          onToggleSave={onToggleSave}
          onRequest={(creator) => onAuth('request', `Requesting ${creator.name}.`)}
          onReset={reset}
        />
      </div>

      <ShortlistTray
        creators={savedCreators}
        onClear={onClearSaved}
        onSave={() => onAuth('save')}
        onRequestAll={() =>
          onAuth(
            'request',
            `Requesting ${savedCreators.length} shortlisted ${
              savedCreators.length === 1 ? 'creator' : 'creators'
            }.`
          )
        }
      />
    </section>
  );
}
