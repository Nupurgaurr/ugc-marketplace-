'use client';

import { useMemo, useState } from 'react';
import type { Creator, FilterSelection } from '@/lib/types';
import VideoPreviewCard from '@/components/shared/VideoPreviewCard';
import { Chip } from '@/components/shared/Tag';
import { FILTER_GROUPS, applyFilters, emptySelection, searchCreators, countSelected } from '@/lib/data/filters';
import { useAuth } from '@/lib/auth/useAuth';
import { useShortlist } from './useShortlist';
import RequestModal from './RequestModal';
import AuthGateModal from './AuthGateModal';
import styles from './client.module.css';

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
      <aside>
        {countSelected(selection) > 0 && (
          <button
            type="button"
            onClick={() => setSelection(emptySelection())}
            style={{ fontSize: 'var(--step--1)', color: 'var(--bcm-accent)', marginBottom: '1.2rem' }}
          >
            Clear filters ({countSelected(selection)})
          </button>
        )}
        {FILTER_GROUPS.map((group) => (
          <div className={styles.filterGroup} key={group.id}>
            <p className={styles.filterGroupLabel}>{group.label}</p>
            <div className={styles.filterChips}>
              {group.options.map((opt) => (
                <Chip key={opt} active={selection[group.id].includes(opt)} onClick={() => toggleFilter(group.id, opt)}>
                  {opt}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </aside>

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
          <p className={styles.empty}>No creators match those filters. Try clearing a few.</p>
        ) : (
          <div className={styles.grid}>
            {results.map((creator) => (
              <VideoPreviewCard
                key={creator.id}
                creator={creator}
                isFavorited={isShortlisted(creator.id)}
                onToggleFavorite={handleFavorite}
                onRequest={handleRequest}
              />
            ))}
          </div>
        )}
      </div>

      <RequestModal creator={requesting} onClose={() => setRequesting(null)} onSent={() => {}} />
      <AuthGateModal open={gate.open} context={gate.context} onClose={() => setGate({ open: false, context: '' })} />
    </div>
  );
}
