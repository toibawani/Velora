import { useEffect, useState } from 'react';
import { backendEnabled } from './supabaseClient';
import { getSessionUser, onAuthChange } from './api';

/**
 * Whether this browser has a signed-in account.
 *
 * One hook instead of the same effect copied into three components. `ready` is
 * false only while the session is being read, because a screen that renders
 * "signed out" and then flips to "signed in" is a screen that lied for a moment.
 * With no backend configured it is ready immediately and always signed out.
 */
export function useSessionUser() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!backendEnabled);

  useEffect(() => {
    if (!backendEnabled) return undefined;
    let mounted = true;

    getSessionUser()
      .then((sessionUser) => {
        if (mounted) setUser(sessionUser);
      })
      .catch(() => {
        if (mounted) setUser(null);
      })
      .finally(() => {
        if (mounted) setReady(true);
      });

    const unsubscribe = onAuthChange((sessionUser) => {
      if (mounted) {
        setUser(sessionUser);
        setReady(true);
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  return { user, ready, backendEnabled };
}
