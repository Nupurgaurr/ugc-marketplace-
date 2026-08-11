'use client';

import { useState } from 'react';
import type { Creator } from '@/lib/types';
import VideoPreviewCard from '@/components/shared/VideoPreviewCard';
import { useAuth } from '@/lib/auth/useAuth';
import { useShortlist } from './useShortlist';
import RequestModal from './RequestModal';
import styles from './client.module.css';

export default function ShortlistView({ creators }: { creators: Creator[] }) {
  const { session } = useAuth('client');
  const { ids, toggle, isShortlisted } = useShortlist(session?.id);
  const [requesting, setRequesting] = useState<Creator | null>(null);

  const shortlisted = creators.filter((c) => ids.includes(c.id));

  if (shortlisted.length === 0) {
    return <p className={styles.empty}>Nothing shortlisted yet — browse creators and tap the star to save one.</p>;
  }

  return (
    <>
      <div className={styles.grid}>
        {shortlisted.map((creator) => (
          <VideoPreviewCard
            key={creator.id}
            creator={creator}
            isFavorited={isShortlisted(creator.id)}
            onToggleFavorite={toggle}
            onRequest={setRequesting}
          />
        ))}
      </div>
      <RequestModal creator={requesting} onClose={() => setRequesting(null)} onSent={() => {}} />
    </>
  );
}
