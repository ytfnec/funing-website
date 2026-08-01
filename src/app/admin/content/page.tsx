'use client';

import { useState, useEffect } from 'react';
import {
  Globe, Plus, Pencil, Trash2,
  Loader2, Save, Check, AlertCircle, Search, X, Power,
} from 'lucide-react';

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
  { slug: 'home', name: 'Homepage', sections: ['hero', 'products', 'why-funing', 'oem', 'faq', 'cta'] },
  { slug: 'products', name: 'Products', sections: ['hero', 'listing', 'cta'] },
  { slug: 'oem', name: 'OEM/ODM', sections: ['hero', 'services', 'process', 'cta'] },
  { slug: 'about', name: 'About', sections: ['main'] },
  { slug: 'contact', name: 'Contact', sections: ['main'] },
  { slug: 'quote', name: 'Quote', sections: ['main'] },
  { slug: 'privacy', name: 'Privacy Policy', sections: ['main'] },
  { slug: 'terms', name: 'Terms of Service', sections: ['main'] },
  { slug: 'cookies', name: 'Cookie Policy', sections: ['main'] },
];

const EMPTY_FORM = { slug: '', content: '', page: '', section: '', title: '', is_active: 1 };

export default function AdminContent() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ContentBlock | 'new' | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [pageFilter, setPageFilter] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    load();
  }, []);

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
        throw new Error(data.error || 'Save failed');
      }
      setSaved(data.created ? 'Block created' : 'Block updated');
      setTimeout(() => setSaved(''), 2000);
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (block: ContentBlock) => {
    if (!confirm(`Delete "${block.slug}"? This reverts that copy to its default.`)) return;
    try {
      const res = await fetch(`/api/admin/content?id=${block.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }
      setBlocks((prev) => prev.filter((b) => b.id !== block.id));
      if (editing && typeof editing !== 'string' && editing.id === block.id) setEditing(null);
    } catch (e: any) {
      setError(e.message || 'Delete failed');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--amber)]" />
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.2)] focus:outline-none focus:border-[var(--amber)] transition-colors";
  const labelClass = "block text-[10px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl tracking-[0.06em] uppercase font-bold">Content Management</h1>
        <button onClick={openNew} className="btn btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> New Block
        </button>
      </div>

      {/* How it works */}
      <div className="mb-6 p-5 bg-[rgba(216,163,90,0.05)] border border-[rgba(216,163,90,0.15)] rounded-lg text-[var(--gray)] text-sm leading-relaxed">
        <strong className="text-white">How it works:</strong> content blocks override the site&apos;s built-in copy.
        The slug format is <code className="text-[var(--amber)]">&lt;lang&gt;__&lt;key&gt;</code> — e.g. <code className="text-[var(--amber)]">en__home.hero.title1</code> or <code className="text-[var(--amber)]">zh__home.cta.title</code>.
        Save a block and the live site picks it up (cached ~60s). Delete a block to revert to the default copy.
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[var(--amber)] text-sm mb-6 p-4 bg-[rgba(216,163,90,0.1)] border border-[rgba(216,163,90,0.3)] rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {saved && (
        <div className="flex items-center gap-2 text-green-400 text-sm mb-6 p-4 bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] rounded-lg">
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
            placeholder="Search blocks…"
            className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.25)] focus:outline-none focus:border-[var(--amber)] text-sm"
          />
        </div>
        <select
          value={pageFilter}
          onChange={(e) => setPageFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded-md text-white focus:outline-none focus:border-[var(--amber)] text-sm"
        >
          <option value="">All pages</option>
          {KNOWN_PAGES.map((p) => (
            <option key={p.slug} value={p.slug}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Editor panel */}
      {editing && (
        <div className="mb-6 bg-[#0a0a0a] border border-[rgba(216,163,90,0.25)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg tracking-[0.06em] uppercase font-bold">
              {editing === 'new' ? 'New Content Block' : `Edit: ${editing.slug}`}
            </h2>
            <button onClick={closeEdit} className="text-[var(--gray)] hover:text-white" aria-label="Close editor">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className={labelClass}>Slug <span className="text-[var(--amber)]">*</span></label>
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
                <label className={labelClass}>Page (optional)</label>
                <select
                  value={form.page}
                  onChange={(e) => update('page', e.target.value)}
                  className={inputClass}
                >
                  <option value="">—</option>
                  {KNOWN_PAGES.map((p) => (
                    <option key={p.slug} value={p.slug}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Content <span className="text-[var(--amber)]">*</span></label>
              <textarea
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                rows={4}
                placeholder="The override text shown on the live site…"
                className={inputClass + " resize-none"}
              />
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active === 1}
                onChange={(e) => update('is_active', e.target.checked ? 1 : 0)}
                className="w-4 h-4 accent-[var(--amber)]"
              />
              <span className="text-sm text-[var(--soft-white)]">Active (visible on site)</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeEdit} className="btn btn-secondary text-sm py-2 px-4">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.slug.trim() || !form.content.trim()}
                className="btn btn-primary text-sm py-2 px-4 disabled:opacity-50"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Block</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block list */}
      {filtered.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-10 text-center">
          <Globe className="w-10 h-10 text-[var(--gray)] mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">No content blocks yet</h2>
          <p className="text-[var(--gray)] text-sm mb-6 max-w-[400px] mx-auto">
            Create your first block to override a piece of site copy.
          </p>
          <button onClick={openNew} className="btn btn-primary text-sm">
            <Plus className="w-4 h-4" /> Create Block
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((block) => (
            <div key={block.id} className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden">
              <div className="p-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <code className="text-[13px] text-[var(--amber)]">{block.slug}</code>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] tracking-[0.12em] uppercase ${
                      block.is_active ? 'bg-[rgba(52,211,153,0.15)] text-green-400' : 'bg-[rgba(255,255,255,0.08)] text-[var(--gray)]'
                    }`}>
                      {block.is_active ? 'Active' : 'Paused'}
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
                    title={block.is_active ? 'Pause' : 'Activate'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openEdit(block)}
                    className="p-2 text-[var(--gray)] hover:text-white transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(block)}
                    className="p-2 text-[var(--gray)] hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
