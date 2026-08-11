'use client';

import { useEffect, useState } from 'react';
import { getSession, logout, type Role, type Session } from './mockAuth';

/** Reactive read of the mock session for a given portal role. */
export function useAuth(role: Role) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    setSession(getSession(role));
    const onChange = () => setSession(getSession(role));
    window.addEventListener('bcm-session-change', onChange);
    window.addEventListener('storage', onChange);
    return () => {
      window.removeEventListener('bcm-session-change', onChange);
      window.removeEventListener('storage', onChange);
    };
  }, [role]);

  return {
    session,
    isLoading: session === undefined,
    signOut: () => logout(role),
  };
}
