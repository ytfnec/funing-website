'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Globe, Plus, Pencil, Trash2,
  Loader2, Save, Check, AlertCircle, Search, X, Power,
} from 'lucide-react';
import { defaultTranslations, useLang, type TKey } from '@/lib/i18n';

interface ContentBlock {
  id: string;
  slug: string;
  page: string;
  section: string;
  type: string;
  title: string;
  content: string;
  is_active: number;
  sort_order: number;
  updated_at: string;
}

interface PageInfo {
  slug: string;
  name: string;
  sections: string[];
}

const KNOWN_PAGES: PageInfo[] = [
  { slug: 'home', name: 'admin.content.page.home', sections: ['hero', 'products', 'why-funing', 'oem', 'faq', 'cta'] },
  { slug: 'products', name: 'admin.content.page.products', sections: ['hero', 'listing', 'cta'] },
  { slug: 'oem', name: 'admin.content.page.oem', sections: ['hero', 'services', 'process', 'cta'] },
  { slug: 'about', name: 'admin.content.page.about', sections: ['main'] },
  { slug: 'contact', name: 'admin.content.page.contact', sections: ['main'] },
  { slug: 'quote', name: 'admin.content.page.quote', sections: ['main'] },
  { slug: 'privacy', name: 'admin.content.page.privacy', sections: ['main'] },
  { slug: 'terms', name: 'admin.content.page.terms', sections: ['main'] },
  { slug: 'cookies', name: 'admin.content.page.cookies', sections: ['main'] },
];

const EMPTY_FORM = { slug: '', content: '', page: '', section: '', title: '', is_active: 1 };

export default function AdminContent() {
  const { t } = useLang();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ContentBlock | 'new' | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [pageFilter, setPageFilter] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load();
  }, []);

  // Drop the selection whenever filters change so hidden rows can't be bulk-deleted.
  useEffect(() => {
    setSelected(new Set());
  }, [search, pageFilter]);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        setBlocks(data.blocks || []);
      }
    } catch {}
    setLoading(false);
  };

  const openNew = () => {
    setEditing('new');
    setForm(EMPTY_FORM);
    setError('');
  };

  const openEdit = (block: ContentBlock) => {
    setEditing(block);
    setForm({
      slug: block.slug,
      content: block.content || '',
      page: block.page || '',
      section: block.section || '',
      title: block.title || '',
      is_active: block.is_active,
    });
    setError('');
  };

  const closeEdit = () => {
    setEditing(null);
    setError('');
  };

  const update = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t('admin.content.saveFailed'));
      }
      setSaved(data.created ? t('admin.content.created') : t('admin.content.updated'));
      setTimeout(() => setSaved(''), 2000);
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e.message || t('admin.content.saveFailedGeneric'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (block: ContentBlock) => {
    if (!confirm(t('admin.content.deleteConfirm').replace('{slug}', block.slug))) return;
    try {
      const res = await fetch(`/api/admin/content?id=${block.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || t('admin.content.deleteFailed'));
      }
      setBlocks((prev) => prev.filter((b) => b.id !== block.id));
      if (editing && typeof editing !== 'string' && editing.id === block.id) setEditing(null);
    } catch (e: any) {
      setError(e.message || t('admin.content.deleteFailed'));
    }
  };

  const toggleActive = async (block: ContentBlock) => {
    const next = block.is_active ? 0 : 1;
    // Optimistic update
    setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, is_active: next } : b)));
    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: block.slug, content: block.content, page: block.page, section: block.section, title: block.title, type: block.type, is_active: next }),
      });
      if (!res.ok) {
        // Revert on failure
        setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, is_active: block.is_active } : b)));
      }
    } catch {
      setBlocks((prev) => prev.map((b) => (b.id === block.id ? { ...b, is_active: block.is_active } : b)));
    }
  };

  const filtered = blocks.filter((b) => {
    const matchesSearch = !search || b.slug.toLowerCase().includes(search.toLowerCase()) || b.content?.toLowerCase().includes(search.toLowerCase());
    const matchesPage = !pageFilter || b.page === pageFilter;
    return matchesSearch && matchesPage;
  });

  const allFilteredSelected = filtered.length > 0 && filtered.every((b) => selected.has(b.id));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected(allFilteredSelected ? new Set() : new Set(filtered.map((b) => b.id)));
  };

  const runBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (action === 'delete' && !confirm(t('admin.content.bulkDeleteConfirm').replace('{n}', String(ids.length)))) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/content/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t('admin.content.bulkFailed'));
      const label = action === 'delete' ? t('admin.content.deleted') : action === 'activate' ? t('admin.content.activated') : t('admin.content.pausedBulk');
      setSaved(label.replace('{n}', String(ids.length)));
      setTimeout(() => setSaved(''), 2500);
      setSelected(new Set());
      await load();
    } catch (e: any) {
      setError(e.message || t('admin.content.bulkFailed'));
    } finally {
      setBusy(false);
    }
  };

  // Derive live preview from the slug `<lang>__<i18n-key>`.
  const previewDefault = useMemo(() => {
    const parts = form.slug.split('__');
    if (parts.length !== 2) return null;
    const [lang, key] = parts;
    if (lang !== 'en' && lang !== 'zh') return null;
    const dict = defaultTranslations[lang] as Record<string, string> | undefined;
    return dict?.[key] ?? null;
  }, [form.slug]);
  const previewLang = form.slug.startsWith('zh__') ? '中文' : form.slug.startsWith('en__') ? 'English' : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--amber)]" />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-card border border-[rgba(32,29,23,0.1)] rounded-md text-ink placeholder-[rgba(32,29,23,0.2)] focus:outline-none focus:border-[var(--amber)] transition-colors";
  const labelClass = "block text-[10px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl tracking-[0.06em] uppercase font-bold">{t('admin.content.title')}</h1>
        <button onClick={openNew} className="btn btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> {t('admin.content.newBlock')}
        </button>
      </div>

      {/* How it works */}
      <div className="mb-6 p-5 bg-[rgba(168,118,58,0.05)] border border-[rgba(168,118,58,0.15)] rounded-lg text-[var(--gray)] text-sm leading-relaxed">
        <strong className="text-ink">{t('admin.content.howTitle')}</strong> {t('admin.content.how1')} <code className="text-[var(--amber)]">&lt;lang&gt;__&lt;key&gt;</code> — e.g. <code className="text-[var(--amber)]">en__home.hero.title1</code> or <code className="text-[var(--amber)]">zh__home.cta.title</code>. {t('admin.content.how2')}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[var(--amber)] text-sm mb-6 p-4 bg-[rgba(168,118,58,0.1)] border border-[rgba(168,118,58,0.3)] rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 text-green-700 text-sm mb-6 p-4 bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] rounded-lg">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{saved}</span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[var(--gray)] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('admin.content.searchPlaceholder')}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-[rgba(32,29,23,0.1)] rounded-md text-ink placeholder-[rgba(32,29,23,0.25)] focus:outline-none focus:border-[var(--amber)] text-sm"
          />
        </div>
        <select
          value={pageFilter}
          onChange={(e) => setPageFilter(e.target.value)}
          className="px-4 py-2.5 bg-card border border-[rgba(32,29,23,0.1)] rounded-md text-ink focus:outline-none focus:border-[var(--amber)] text-sm"
        >
          <option value="">{t('admin.content.allPages')}</option>
          {KNOWN_PAGES.map((p) => (
            <option key={p.slug} value={p.slug}>{t(p.name as TKey)}</option>
          ))}
        </select>
      </div>

      {/* Editor panel */}
      {editing && (
        <div className="mb-6 bg-card border border-[rgba(168,118,58,0.25)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg tracking-[0.06em] uppercase font-bold">
              {editing === 'new' ? t('admin.content.newBlockTitle') : t('admin.content.editTitle').replace('{slug}', editing.slug)}
            </h2>
            <button onClick={closeEdit} className="text-[var(--gray)] hover:text-ink" aria-label={t('admin.content.closeEditor')}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>{t('admin.content.slug')} <span className="text-[var(--amber)]">*</span></label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => update('slug', e.target.value)}
                  placeholder="en__home.hero.title1"
                  disabled={editing !== 'new'}
                  className={inputClass + (editing !== 'new' ? ' opacity-60 cursor-not-allowed' : '')}
                />
              </div>
              <div>
                <label className={labelClass}>{t('admin.content.pageOptional')}</label>
                <select
                  value={form.page}
                  onChange={(e) => update('page', e.target.value)}
                  className={inputClass}
                >
                  <option value="">—</option>
                  {KNOWN_PAGES.map((p) => (
                    <option key={p.slug} value={p.slug}>{t(p.name as TKey)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>{t('admin.content.contentField')} <span className="text-[var(--amber)]">*</span></label>
              <textarea
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                rows={4}
                placeholder={t('admin.content.contentPlaceholder')}
                className={inputClass + " resize-none"}
              />
            </div>

            {/* Live preview */}
            {previewDefault !== null && (
              <div className="rounded-lg border border-[rgba(32,29,23,0.08)] overflow-hidden">
                <div className="px-4 py-2 bg-card border-b border-[rgba(32,29,23,0.06)] text-[10px] tracking-[0.18em] uppercase text-[var(--gray)] flex items-center justify-between">
                  <span>{t('admin.content.preview')}</span>
                  <span className="text-[var(--amber)]">{previewLang}</span>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div>
                    <div className="text-[9px] tracking-[0.16em] uppercase text-[var(--gray)]/60 mb-1">{t('admin.content.defaultLabel')}</div>
                    <div className="text-sm text-[var(--gray)] leading-relaxed">{previewDefault || '—'}</div>
                  </div>
                  <div>
                    <div className="text-[9px] tracking-[0.16em] uppercase text-[var(--amber)]/70 mb-1">{t('admin.content.overrideLive')}</div>
                    <div className="text-sm text-[var(--soft-white)] leading-relaxed font-medium">
                      {form.content.trim() || '—'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active === 1}
                onChange={(e) => update('is_active', e.target.checked ? 1 : 0)}
                className="w-4 h-4 accent-[var(--amber)]"
              />
              <span className="text-sm text-[var(--soft-white)]">{t('admin.content.activeVisible')}</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeEdit} className="btn btn-secondary text-sm py-2 px-4">
                {t('admin.content.cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.slug.trim() || !form.content.trim()}
                className="btn btn-primary text-sm py-2 px-4 disabled:opacity-50"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> {t('admin.content.saving')}</>
                ) : (
                  <><Save className="w-4 h-4" /> {t('admin.content.saveBlock')}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block list */}
      {filtered.length === 0 ? (
        <div className="bg-card border border-[rgba(32,29,23,0.06)] rounded-lg p-10 text-center">
          <Globe className="w-10 h-10 text-[var(--gray)] mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">{t('admin.content.noBlocks')}</h2>
          <p className="text-[var(--gray)] text-sm mb-6 max-w-[400px] mx-auto">
            {t('admin.content.noBlocksDesc')}
          </p>
          <button onClick={openNew} className="btn btn-primary text-sm">
            <Plus className="w-4 h-4" /> {t('admin.content.createBlock')}
          </button>
        </div>
      ) : (
        <>
        {/* Bulk action toolbar */}
        <div className="mb-4 bg-card border border-[rgba(32,29,23,0.08)] rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={toggleSelectAll}
              className="w-4 h-4 accent-[var(--amber)]"
            />
            <span className="text-sm text-[var(--soft-white)]">
              {selected.size > 0 ? t('admin.content.selected').replace('{n}', String(selected.size)) : t('admin.content.selectAll')}
            </span>
          </label>
          <div className="flex items-center gap-2 sm:ml-auto">
            <button
              onClick={() => runBulkAction('activate')}
              disabled={selected.size === 0 || busy}
              className="btn btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
              title={t('admin.content.activateTitle')}
            >
              <Power className="w-3.5 h-3.5" /> {t('admin.content.activate')}
            </button>
            <button
              onClick={() => runBulkAction('deactivate')}
              disabled={selected.size === 0 || busy}
              className="btn btn-secondary text-xs py-1.5 px-3 disabled:opacity-40"
              title={t('admin.content.pauseTitle')}
            >
              <Power className="w-3.5 h-3.5 opacity-50" /> {t('admin.content.pause')}
            </button>
            <button
              onClick={() => runBulkAction('delete')}
              disabled={selected.size === 0 || busy}
              className="btn btn-secondary text-xs py-1.5 px-3 text-red-400 hover:border-red-400/50 disabled:opacity-40"
              title={t('admin.content.deleteTitle')}
            >
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} {t('admin.content.delete')}
            </button>
          </div>
        </div>
        <div className="space-y-3">
          {filtered.map((block) => (
            <div key={block.id} className={`bg-card border rounded-lg overflow-hidden transition-colors ${
              selected.has(block.id) ? 'border-[rgba(168,118,58,0.5)]' : 'border-[rgba(32,29,23,0.06)]'
            }`}>
              <div className="p-4 flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selected.has(block.id)}
                  onChange={() => toggleSelect(block.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 accent-[var(--amber)] flex-shrink-0"
                  title={t('admin.content.selectTitle').replace('{slug}', block.slug)}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-[13px] text-[var(--amber)]">{block.slug}</code>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] tracking-[0.12em] uppercase ${
                      block.is_active ? 'bg-[rgba(52,211,153,0.15)] text-green-700' : 'bg-[rgba(32,29,23,0.08)] text-[var(--gray)]'
                    }`}>
                      {block.is_active ? t('admin.content.activeLabel') : t('admin.content.pausedLabel')}
                    </span>
                  </div>
                  {block.content && (
                    <p className="text-[var(--gray)] text-sm truncate mt-1 max-w-[600px]">{block.content}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => toggleActive(block)}
                    className="p-2 text-[var(--gray)] hover:text-[var(--amber)] transition-colors"
                    title={block.is_active ? t('admin.content.pauseAction') : t('admin.content.activateAction')}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEdit(block)}
                    className="p-2 text-[var(--gray)] hover:text-ink transition-colors"
                    title={t('admin.content.editAction')}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(block)}
                    className="p-2 text-[var(--gray)] hover:text-red-400 transition-colors"
                    title={t('admin.content.deleteAction')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
