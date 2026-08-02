'use client';

import { useEffect } from 'react';

/**
 * Lightweight page-view tracker.
 * Sends a fire-and-forget beacon to /api/views on mount.
 * Best placed once in the root layout so every page navigation is counted.
 */
export function ViewTracker() {
  useEffect(() => {
    const path = window.location.pathname + window.location.search;

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify({ path })], {
          type: 'application/json',
        });
        navigator.sendBeacon('/api/views', blob);
      } else {
        fetch('/api/views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path }),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // Analytics must never break the page.
    }
  }, []);

  return null;
}
