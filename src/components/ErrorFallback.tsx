'use client';

import { House, RotateCcw, TriangleAlert } from 'lucide-react';
import { useLang } from '@/lib/i18n';

/**
 * i18n-aware error UI shared by the root `error.tsx` boundary.
 * Wrapped by <LanguageProvider> (rendered in the root layout), so `useLang()`
 * is safe to use here. `reset` re-renders the failed route segment.
 */
export function ErrorFallback({ reset }: { reset: () => void }) {
  const { t } = useLang();

  return (
    <section className="px-page py-[clamp(80px,12vw,160px)] bg-[#050505] min-h-[70vh] flex items-center justify-center">
      <div className="max-w-[540px] mx-auto text-center">
        <div className="w-14 h-14 rounded-full border border-[rgba(216,163,90,0.3)] flex items-center justify-center mx-auto mb-6">
          <TriangleAlert className="w-6 h-6 text-[var(--amber)]" />
        </div>
        <p className="eyebrow mb-4">{t('error.eyebrow')}</p>
        <h1 className="text-[clamp(28px,4vw,44px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6">
          {t('error.title')}
        </h1>
        <p className="body-text mb-10 max-w-[430px] mx-auto">{t('error.desc')}</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button type="button" className="btn btn-primary" onClick={reset}>
            <RotateCcw className="w-4 h-4" /> {t('error.retry')}
          </button>
          <a href="/" className="btn btn-secondary">
            <House className="w-4 h-4" /> {t('error.home')}
          </a>
        </div>
      </div>
    </section>
  );
}
