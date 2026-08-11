'use client';

import { useCallback, useEffect, useState } from 'react';

const keyFor = (clientId: string) => `bcm_shortlist_${clientId}`;

/** Per-client shortlist, persisted to localStorage. Real version becomes a
 *  `client_shortlist` join table behind a couple of API calls. */
export function useShortlist(clientId: string | undefined) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    if (!clientId) return;
    const raw = localStorage.getItem(keyFor(clientId));
    setIds(raw ? JSON.parse(raw) : []);
  }, [clientId]);

  const persist = useCallback(
    (next: string[]) => {
      if (!clientId) return;
      setIds(next);
      localStorage.setItem(keyFor(clientId), JSON.stringify(next));
    },
    [clientId]
  );

  const toggle = useCallback(
    (creatorId: string) => {
      persist(ids.includes(creatorId) ? ids.filter((id) => id !== creatorId) : [...ids, creatorId]);
    },
    [ids, persist]
  );

  const isShortlisted = useCallback((creatorId: string) => ids.includes(creatorId), [ids]);

  return { ids, toggle, isShortlisted };
}
