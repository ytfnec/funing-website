'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, Loader2, Check, ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  slug: string;
  name: string;
  sub_title: string;
  price_range: string;
  category: string;
  short_description: string;
  long_description: string;
  features: string;
  in_stock: number;
  sort_order: number;
}

const CATEGORIES = [
  { value: 'sauna-control', label: 'Sauna Control' },
  { value: 'industrial-control', label: 'Industrial Control' },
  { value: 'components', label: 'Components & Accessories' },
  { value: 'custom', label: 'Custom OEM/ODM' },
];

export default function EditProduct() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<Partial<Product>>({});

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          const product = (data.products || []).find((p: Product) => p.slug === slug);
          if (product) setForm(product);
          else setError('Product not found');
        } else {
          setError('Failed to load product');
        }
      } catch {
        setError('Connection error');
      }
      setLoading(false);
    }
    load();
  }, [slug]);

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
        throw new Error(data.error || 'Save failed');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e.message || 'Failed to save');
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
          <ArrowLeft className="w-4 h-4" /> Back to Products
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
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <h1 className="text-2xl tracking-[0.06em] uppercase font-bold">Edit: {form.name}</h1>
        </div>
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

      {error && (
        <div className="flex items-center gap-2 text-[var(--amber)] text-sm mb-6 p-4 bg-[rgba(216,163,90,0.1)] border border-[rgba(216,163,90,0.3)] rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-[800px] space-y-6">
        {/* Basic Info */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">Basic Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={form.name || ''}
                  onChange={(e) => update('name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Slug</label>
                <input
                  type="text"
                  value={form.slug || ''}
                  onChange={(e) => update('slug', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Sub Title</label>
              <input
                type="text"
                value={form.sub_title || ''}
                onChange={(e) => update('sub_title', e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <select
                  value={form.category || 'sauna-control'}
                  onChange={(e) => update('category', e.target.value)}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Price Range</label>
                <input
                  type="text"
                  value={form.price_range || ''}
                  onChange={(e) => update('price_range', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Sort Order</label>
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
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">Descriptions</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Short Description</label>
              <textarea
                value={form.short_description || ''}
                onChange={(e) => update('short_description', e.target.value)}
                rows={3}
                className={inputClass + " resize-none"}
              />
            </div>
            <div>
              <label className={labelClass}>Long Description</label>
              <textarea
                value={form.long_description || ''}
                onChange={(e) => update('long_description', e.target.value)}
                rows={5}
                className={inputClass + " resize-none"}
              />
            </div>
          </div>
        </div>

        {/* Features (one per line) */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-2">Features</h2>
          <p className="text-[var(--gray)] text-xs mb-4">One feature per line</p>
          <textarea
            value={form.features || ''}
            onChange={(e) => update('features', e.target.value)}
            rows={5}
            className={inputClass + " resize-none font-mono text-sm"}
          />
        </div>

        {/* Status */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">Status</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.in_stock === 1}
              onChange={(e) => update('in_stock', e.target.checked ? 1 : 0)}
              className="w-4 h-4 accent-[var(--amber)]"
            />
            <span className="text-sm text-[var(--soft-white)]">In stock (visible on site)</span>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Link href="/admin/products" className="btn btn-secondary text-sm py-2 px-4">
            Cancel
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
