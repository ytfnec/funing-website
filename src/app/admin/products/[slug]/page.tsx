'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, Check, ArrowLeft, AlertCircle, Image as ImageIcon, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { resolveImageSrc, R2_PUBLIC_URL } from '@/lib/image';

interface Product {
  id: string;
  slug: string;
  name: string;
  sub_title: string;
  price_range: string;
  category: string;
  short_description: string;
  long_description: string;
  hero_image: string;
  gallery_images: string;
  features: string;
  in_stock: number;
  sort_order: number;
}

interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  r2_key: string;
  mime_type: string;
}

export default function EditProduct() {
  const { t } = useLang();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Partial<Product>>({});
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          const product = (data.products || []).find((p: Product) => p.slug === slug);
          if (product) setForm(product);
          else setError(t('admin.product.notFound'));
        } else {
          setError(t('admin.product.loadFailed'));
        }
      } catch {
        setError(t('admin.product.connError'));
      }
      setLoading(false);
    }
    load();
  }, [slug]);

  // Load the media library on demand (used by the hero-image picker).
  const loadMedia = async () => {
    if (mediaItems.length > 0) {
      setShowMediaPicker((v) => !v);
      return;
    }
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMediaItems((data.media || []).filter((m: MediaItem) => m.mime_type.startsWith('image/')));
        setShowMediaPicker(true);
      }
    } catch {}
  };

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.id) return;
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: form.id, ...form }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('admin.product.saveFailed'));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e.message || t('admin.product.saveFailedGeneric'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--amber)]" />
      </div>
    );
  }

  if (error && !form.id) {
    return (
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-2 text-[var(--amber)] text-sm mb-6 hover:underline">
          <ArrowLeft className="w-4 h-4" /> {t('admin.product.back')}
        </Link>
        <div className="flex items-center gap-2 text-[var(--amber)] text-sm p-6 bg-[rgba(216,163,90,0.1)] border border-[rgba(216,163,90,0.3)] rounded-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)] transition-colors";
  const labelClass = "block text-[10px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link href="/admin/products" className="inline-flex items-center gap-2 text-[var(--amber)] text-sm mb-2 hover:underline">
            <ArrowLeft className="w-4 h-4" /> {t('admin.product.back')}
          </Link>
          <h1 className="text-2xl tracking-[0.06em] uppercase font-bold">{t('admin.product.edit').replace('{name}', form.name || '')}</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !form.id}
          className="btn btn-primary text-sm py-2 px-4 disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {t('admin.product.saving')}</>
          ) : saved ? (
            <><Check className="w-4 h-4" /> {t('admin.product.saved')}</>
          ) : (
            <><Save className="w-4 h-4" /> {t('admin.product.saveChanges')}</>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[var(--amber)] text-sm mb-6 p-4 bg-[rgba(216,163,90,0.1)] border border-[rgba(216,163,90,0.3)] rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-[800px] space-y-6">
        {/* Basic Info */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">{t('admin.product.basicInfo')}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('admin.product.name')}</label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => update('name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t('admin.product.slug')}</label>
                <input
                  type="text"
                  value={form.slug || ''}
                  onChange={(e) => update('slug', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>{t('admin.product.subTitle')}</label>
              <input
                type="text"
                value={form.sub_title || ''}
                onChange={(e) => update('sub_title', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>{t('admin.product.category')}</label>
                <select
                  value={form.category || 'sauna-control'}
                  onChange={(e) => update('category', e.target.value)}
                  className={inputClass}
                >
                  {[
                    { value: 'sauna-control', label: t('admin.product.cat.sauna') },
                    { value: 'industrial-control', label: t('admin.product.cat.industrial') },
                    { value: 'components', label: t('admin.product.cat.components') },
                    { value: 'custom', label: t('admin.product.cat.custom') },
                  ].map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>{t('admin.product.priceRange')}</label>
                <input
                  type="text"
                  value={form.price_range || ''}
                  onChange={(e) => update('price_range', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>{t('admin.product.sortOrder')}</label>
                <input
                  type="number"
                  value={form.sort_order ?? 0}
                  onChange={(e) => update('sort_order', parseInt(e.target.value) || 0)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">{t('admin.product.descriptions')}</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>{t('admin.product.shortDesc')}</label>
              <textarea
                value={form.short_description || ''}
                onChange={(e) => update('short_description', e.target.value)}
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className={labelClass}>{t('admin.product.longDesc')}</label>
              <textarea
                value={form.long_description || ''}
                onChange={(e) => update('long_description', e.target.value)}
                rows={5}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        </div>

        {/* Product Image */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-2">{t('admin.product.productImage')}</h2>
          <p className="text-[var(--gray)] text-xs mb-4">
            {t('admin.product.imageHint')}
          </p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={form.hero_image || ''}
              onChange={(e) => update('hero_image', e.target.value)}
              placeholder="https://pub-xxx.r2.dev/products/sauna-controller.webp"
              className={inputClass}
            />
            <button
              type="button"
              onClick={loadMedia}
              className="btn btn-secondary text-sm py-3 px-4 whitespace-nowrap flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              {showMediaPicker ? t('admin.product.hideLibrary') : t('admin.product.browseMedia')}
            </button>
          </div>

          {form.hero_image && (
            <div className="mt-4 flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveImageSrc(form.hero_image)}
                alt="Hero image preview"
                className="w-40 aspect-[4/3] object-cover rounded-md border border-[rgba(255,255,255,0.12)] bg-[#050505]"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0.25'; }}
              />
              <div className="text-[var(--gray)] text-xs">
                <div className="mb-1">{t('admin.product.preview')}</div>
                <div className="break-all max-w-[360px]">{resolveImageSrc(form.hero_image) || form.hero_image}</div>
              </div>
            </div>
          )}

          {showMediaPicker && (
            <div className="mt-4">
              {mediaItems.length === 0 ? (
                <div className="text-[var(--gray)] text-sm p-4 border border-dashed border-[rgba(255,255,255,0.15)] rounded-md">
                  {t('admin.product.noMediaHint')}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[260px] overflow-y-auto pr-1">
                  {mediaItems.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => update('hero_image', item.r2_key)}
                      className="bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md p-2 text-left hover:border-[var(--amber)] transition-colors group"
                      title={item.original_name || item.r2_key}
                    >
                      <div className="aspect-[4/3] bg-[#0a0a0a] rounded overflow-hidden mb-2 flex items-center justify-center">
                        {R2_PUBLIC_URL ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={resolveImageSrc(item.r2_key)}
                            alt={item.original_name || t('admin.product.mediaItemAlt')}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              const el = e.currentTarget as HTMLImageElement;
                              el.style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-[var(--gray)]" />
                        )}
                      </div>
                      <div className="text-[10px] text-[var(--gray)] truncate group-hover:text-white transition-colors">
                        {item.original_name || item.filename}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              <p className="mt-3 text-[11px] text-[var(--gray)]">
                {t('admin.product.r2Hint')}{' '}
                <code className="text-[var(--amber)]">NEXT_PUBLIC_R2_PUBLIC_URL</code> {t('admin.product.r2Hint2')}
              </p>
            </div>
          )}
        </div>

        {/* Features (one per line) */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-2">{t('admin.product.features')}</h2>
          <p className="text-[var(--gray)] text-xs mb-4">{t('admin.product.featuresHint')}</p>
          <textarea
            value={form.features || ''}
            onChange={(e) => update('features', e.target.value)}
            rows={5}
            className={inputClass + " resize-none font-mono text-sm"}
          />
        </div>

        {/* Status */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">{t('admin.product.status')}</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.in_stock === 1}
              onChange={(e) => update('in_stock', e.target.checked ? 1 : 0)}
              className="w-4 h-4 accent-[var(--amber)]"
            />
            <span className="text-sm text-[var(--soft-white)]">{t('admin.product.inStockVisible')}</span>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products" className="btn btn-secondary text-sm py-2 px-4">
            {t('admin.product.cancel')}
          </Link>
          <button
            onClick={handleSave}
            disabled={saving || !form.id}
            className="btn btn-primary text-sm py-2 px-4 disabled:opacity-50"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
            ) : saved ? (
              <><Check className="w-4 h-4" /> Saved</>
            ) : (
              <><Save className="w-4 h-4" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
