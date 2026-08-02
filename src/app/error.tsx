'use client';

import { useEffect } from 'react';
import { ErrorFallback } from '@/components/ErrorFallback';

/**
 * Root error boundary. Catches render errors from any route segment below
 * the root layout and shows the i18n-aware fallback with a retry button.
 * (Errors in the root layout itself are handled by `global-error.tsx`.)
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[route error]', error);
  }, [error]);

  return <ErrorFallback reset={reset} />;
}
