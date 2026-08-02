import { PageSkeleton } from '@/components/Skeleton';

/**
 * Root loading boundary — shows during route streaming / client-side chunk
 * loading for any segment without its own, more specific loading.tsx.
 */
export default function Loading() {
  return <PageSkeleton />;
}
