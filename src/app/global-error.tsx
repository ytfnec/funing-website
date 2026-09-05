'use client';

import { useEffect } from 'react';

/**
 * Top-level error boundary. Replaces the entire root layout (so it must
 * render its own <html>/<body>) when even the layout fails to render.
 * Text is hard-coded bilingual because <LanguageProvider> lives inside the
 * root layout that this boundary replaces.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[global error]', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center bg-cream text-ink">
        <div className="text-center px-6 max-w-[540px]">
          <div className="w-14 h-14 rounded-full border border-[rgba(168,118,58,0.3)] flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-6 h-6 text-amber"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="eyebrow mb-4">Something Went Wrong · 出错了</p>
          <h1 className="text-[clamp(28px,4vw,44px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-6">
            Critical Error
          </h1>
          <p className="text-[#9a9a9a] mb-10">
            An unexpected error occurred. Please reload the page. 页面发生意外错误，请刷新重试。
          </p>
          <button type="button" className="btn btn-primary" onClick={reset}>
            Reload Page · 重新加载
          </button>
        </div>
      </body>
    </html>
  );
}
