'use client';

import { useEffect } from 'react';

/**
 * Lightweight page-view tracker.
 * Sends a fire-and-forget beacon to /api/views on mount.
 * Best placed once in the root layout so every page navigation is counted.
 *
 * Throttled to one beacon per path per browser session (sessionStorage) so a
 * single visitor refresh-looping or paging around doesn't hammer the free-tier
 * D1 write quota. Analytics remain per-visitor-per-path, which is what the
 * dashboard's "Page Views in 24h" needs.
 */
export function ViewTracker() {
  useEffect(() => {
    const path = window.location.pathname + window.location.search;

    // Dedupe by path within this browser session. The value is a timestamp;
    // the first visit in a session reports, later visits to the same path skip.
    try {
      const key = `fnec-viewed:${path}`;
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, String(Date.now()));
    } catch {
      // Storage unavailable (private mode / blocked) — proceed to report.
    }

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
