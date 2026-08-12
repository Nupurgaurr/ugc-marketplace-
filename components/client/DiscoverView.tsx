'use client';

import { useMemo, useState, Fragment } from 'react';
import Link from 'next/link';
import type { Creator, FilterSelection } from '@/lib/types';
import VideoPreviewCard from '@/components/shared/VideoPreviewCard';
import FilterDropdown from './FilterDropdown';
import { FILTER_GROUPS, applyFilters, emptySelection, searchCreators, countSelected } from '@/lib/data/filters';
import { useAuth } from '@/lib/auth/useAuth';
import { ROUTES } from '@/lib/routes';
import { useShortlist } from './useShortlist';
import RequestModal from './RequestModal';
import AuthGateModal from './AuthGateModal';
import styles from './client.module.css';

const INTERRUPT_AFTER = 12;

export default function DiscoverView({ creators }: { creators: Creator[] }) {
  const { session } = useAuth('client');
  const { isShortlisted, toggle } = useShortlist(session?.id);
  const [selection, setSelection] = useState<FilterSelection>(emptySelection());
  const [query, setQuery] = useState('');
  const [requesting, setRequesting] = useState<Creator | null>(null);
  const [gate, setGate] = useState<{ open: boolean; context: string }>({ open: false, context: '' });

  const results = useMemo(() => {
    return searchCreators(applyFilters(creators, selection), query);
  }, [creators, selection, query]);

  const toggleFilter = (group: keyof FilterSelection, value: string) => {
    setSelection((sel) => {
      const current = sel[group];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...sel, [group]: next };
    });
  };

  const handleFavorite = (creatorId: string) => {
    if (!session) {
      setGate({ open: true, context: 'Save this shortlist across sessions.' });
      return;
    }
    toggle(creatorId);
  };

  const handleRequest = (creator: Creator) => {
    if (!session) {
      setGate({ open: true, context: `Send a request to ${creator.name}.` });
      return;
    }
    setRequesting(creator);
  };

  return (
    <div className={styles.discoverLayout}>
      <div className={styles.filterBar}>
        {FILTER_GROUPS.map((group) => (
          <FilterDropdown
            key={group.id}
            label={group.label}
            options={group.options}
            selected={selection[group.id]}
            onToggle={(value) => toggleFilter(group.id, value)}
            onClear={() => setSelection((sel) => ({ ...sel, [group.id]: [] }))}
          />
        ))}
        {countSelected(selection) > 0 && (
          <button type="button" onClick={() => setSelection(emptySelection())} className={styles.clearAllLink}>
            Clear all ({countSelected(selection)})
          </button>
        )}
      </div>

      <div>
        <div className={styles.resultsHead}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by name, category, city…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <span style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-ash)' }}>{results.length} creators</span>
        </div>

        {results.length === 0 ? (
          <p className={styles.empty}>
            Nothing matches that.{' '}
            <Link href={ROUTES.client.briefNew} style={{ color: 'var(--bcm-accent)' }}>
              Post a brief and let them come to you →
            </Link>
          </p>
        ) : (
          <div className={styles.grid}>
            {results.map((creator, i) => (
              <Fragment key={creator.id}>
                <VideoPreviewCard
                  creator={creator}
                  isFavorited={isShortlisted(creator.id)}
                  onToggleFavorite={handleFavorite}
                  onRequest={handleRequest}
                />
                {i === INTERRUPT_AFTER - 1 && (
                  <div className={styles.interruptCard}>
                    <span className={styles.interruptText}>Be on the other side of the camera.</span>
                    <Link href={ROUTES.becomeCreator} className={styles.interruptLink}>
                      Become a creator →
                    </Link>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>

      <RequestModal creator={requesting} onClose={() => setRequesting(null)} onSent={() => {}} />
      <AuthGateModal open={gate.open} context={gate.context} onClose={() => setGate({ open: false, context: '' })} />
    </div>
  );
}
