import type { CSSProperties } from 'react';

/*
 * Skeleton loading primitives + route-specific skeleton screens.
 *
 * Pure presentational markup — safe to render from both server components
 * (route `loading.tsx` files) and client components (in-page data-fetching
 * states). Styling lives in globals.css under `.skeleton` (dark base block +
 * amber shimmer, disabled for prefers-reduced-motion).
 */

export function Skeleton({
  className = '',
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return <div aria-hidden="true" className={`skeleton ${className}`} style={style} />;
}

export function SkeletonText({
  lines = 3,
  className = '',
  style,
}: {
  lines?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div aria-hidden="true" className={`space-y-2.5 ${className}`} style={style}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: 13, width: i === lines - 1 ? '72%' : '100%' }}
        />
      ))}
    </div>
  );
}

/** Generic centered-hero skeleton used by the root `loading.tsx`. */
export function PageSkeleton() {
  return (
    <div className="px-page pt-[clamp(100px,14vw,180px)] pb-[clamp(60px,8vw,120px)]">
      <div className="max-w-[1000px] mx-auto flex flex-col items-center text-center">
        <Skeleton style={{ width: 180, height: 11, marginBottom: 24 }} />
        <Skeleton
          style={{
            width: 'min(90vw, 560px)',
            height: 'clamp(40px, 6vw, 72px)',
            marginBottom: 16,
          }}
        />
        <Skeleton
          style={{
            width: 'min(70vw, 380px)',
            height: 'clamp(30px, 4vw, 48px)',
            marginBottom: 40,
          }}
        />
        <SkeletonText lines={2} style={{ width: 'min(80vw, 460px)' }} />
      </div>
    </div>
  );
}

/** Mirrors /news list layout: hero + article rows (cover + text). */
export function NewsListSkeleton() {
  return (
    <>
      <section className="px-page pt-[clamp(120px,16vw,200px)] pb-[clamp(60px,8vw,100px)] bg-[#050505]">
        <div className="max-w-[1200px] mx-auto text-center">
          <Skeleton style={{ width: 150, height: 11, marginBottom: 24, marginInline: 'auto' }} />
          <Skeleton
            style={{
              width: 'min(80vw, 480px)',
              height: 'clamp(40px, 6vw, 80px)',
              marginBottom: 28,
              marginInline: 'auto',
            }}
          />
          <Skeleton
            style={{ width: 'min(72vw, 420px)', height: 16, marginInline: 'auto' }}
          />
        </div>
      </section>

      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808] min-h-[40vh]">
        <div className="max-w-[1100px] mx-auto space-y-[clamp(40px,5vw,64px)]">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-[clamp(24px,4vw,48px)] items-center"
            >
              <Skeleton
                style={{
                  aspectRatio: '4 / 3',
                  width: '100%',
                  borderRadius: 12,
                  height: 'auto',
                }}
              />
              <div className="space-y-3">
                <Skeleton style={{ width: 160, height: 12 }} />
                <Skeleton
                  style={{ width: 'min(62vw, 420px)', height: 'clamp(24px,3vw,36px)' }}
                />
                <Skeleton style={{ width: 'min(82vw, 520px)', height: 14 }} />
                <Skeleton style={{ width: 'min(70vw, 440px)', height: 14 }} />
                <Skeleton style={{ width: 120, height: 12 }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/** Mirrors /news/[slug] article layout: back link, title, meta, cover, body. */
export function NewsArticleSkeleton() {
  return (
    <>
      <section className="px-page pt-[clamp(120px,16vw,200px)] pb-[clamp(40px,5vw,72px)] bg-[#050505]">
        <div className="max-w-[860px] mx-auto">
          <Skeleton style={{ width: 110, height: 12, marginBottom: 32 }} />
          <Skeleton style={{ width: 130, height: 11, marginBottom: 20 }} />
          <Skeleton
            style={{ width: 'min(92vw, 760px)', height: 'clamp(32px,5vw,56px)', marginBottom: 14 }}
          />
          <Skeleton
            style={{ width: 'min(60vw, 420px)', height: 'clamp(28px,4vw,44px)', marginBottom: 40 }}
          />
          <Skeleton style={{ width: 240, height: 13 }} />
        </div>
      </section>

      <section className="px-page bg-[#050505]">
        <div className="max-w-[960px] mx-auto">
          <Skeleton style={{ width: '100%', aspectRatio: '21 / 9', borderRadius: 12 }} />
        </div>
      </section>

      <section className="px-page py-[clamp(48px,6vw,88px)] bg-[#080808]">
        <div className="max-w-[860px] mx-auto space-y-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              style={{ height: 16, width: i === 7 ? '65%' : '100%' }}
            />
          ))}
        </div>
      </section>
    </>
  );
}

/** Mirrors /products listing layout: hero + filter pills + alternating rows. */
export function ProductsListSkeleton() {
  return (
    <>
      <section className="px-page pt-[clamp(80px,12vw,140px)] pb-[clamp(60px,8vw,100px)] bg-[#050505]">
        <div className="max-w-[1200px] mx-auto text-center">
          <Skeleton style={{ width: 150, height: 11, marginBottom: 24, marginInline: 'auto' }} />
          <Skeleton
            style={{
              width: 'min(84vw, 560px)',
              height: 'clamp(40px, 6vw, 80px)',
              marginBottom: 14,
              marginInline: 'auto',
            }}
          />
          <Skeleton
            style={{
              width: 'min(76vw, 560px)',
              height: 'clamp(28px, 4vw, 48px)',
              marginBottom: 28,
              marginInline: 'auto',
            }}
          />
          <Skeleton style={{ width: 'min(70vw, 440px)', height: 16, marginInline: 'auto' }} />
        </div>
      </section>

      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808]">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-wrap justify-center gap-3 mb-[clamp(48px,6vw,72px)]">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} style={{ width: 110, height: 36, borderRadius: 999 }} />
            ))}
          </div>

          <div className="space-y-[clamp(48px,7vw,80px)]">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,80px)] items-center"
              >
                <Skeleton
                  style={{
                    width: '100%',
                    aspectRatio: '4 / 3',
                    borderRadius: 12,
                    order: i % 2 === 1 ? 2 : 1,
                  }}
                />
                <div className="space-y-3" style={{ order: i % 2 === 1 ? 1 : 2 }}>
                  <Skeleton style={{ width: 140, height: 11 }} />
                  <Skeleton style={{ width: 'min(60vw, 380px)', height: 'clamp(28px,3.5vw,44px)' }} />
                  <SkeletonText lines={2} style={{ width: 'min(80vw, 440px)' }} />
                  <Skeleton style={{ width: 180, height: 44, borderRadius: 999, marginTop: 16 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/** Mirrors /products/[slug] detail layout: breadcrumb, hero, features/specs. */
export function ProductDetailSkeleton() {
  return (
    <>
      <section className="px-page pt-[clamp(60px,8vw,100px)] pb-[clamp(60px,8vw,100px)] bg-[#050505]">
        <div className="max-w-[1280px] mx-auto">
          <Skeleton style={{ width: 240, height: 12, marginBottom: 32 }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,80px)] items-center">
            <div>
              <Skeleton style={{ width: 160, height: 11, marginBottom: 20 }} />
              <Skeleton
                style={{ width: 'min(80vw, 520px)', height: 'clamp(40px,6vw,68px)', marginBottom: 16 }}
              />
              <Skeleton
                style={{ width: 'min(84vw, 480px)', height: 'clamp(28px,4vw,44px)', marginBottom: 24 }}
              />
              <SkeletonText lines={3} style={{ width: 'min(82vw, 460px)', marginBottom: 28 }} />
              <Skeleton style={{ width: 260, height: 48, borderRadius: 999 }} />
            </div>

            <Skeleton
              style={{
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: 12,
                minHeight: 240,
              }}
            />
          </div>
        </div>
      </section>

      <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#080808]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,80px)]">
          {[0, 1].map((col) => (
            <div key={col}>
              <Skeleton style={{ width: 200, height: 24, marginBottom: 24 }} />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} style={{ height: 14, width: j === 3 ? '70%' : '100%' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
