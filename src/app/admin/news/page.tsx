'use client';

import { useState, useEffect } from 'react';
import {
  Newspaper, Plus, Pencil, Trash2, Loader2, Save, Check, AlertCircle,
  Search, X, Eye, EyeOff,
} from 'lucide-react';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_image: string | null;
  author: string | null;
  status: string;
  published_at: string | null;
  created_at: string | null;
}

const EMPTY_FORM = {
  id: '',
  slug: '',
  title: '',
  excerpt: '',
  content: '',
  cover_image: '',
  author: '',
  status: 'draft',
};

export default function AdminNews() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<'new' | Article | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/news');
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
      }
    } catch {}
    setLoading(false);
  };

  const openNew = () => {
    setEditing('new');
    setForm(EMPTY_FORM);
    setError('');
  };

  const openEdit = (a: Article) => {
    setEditing(a);
    setForm({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt || '',
      content: a.content || '',
      cover_image: a.cover_image || '',
      author: a.author || '',
      status: a.status,
    });
    setError('');
  };

  const closeEdit = () => {
    setEditing(null);
    setError('');
  };

  const update = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Auto-suggest a kebab-case slug from the title when creating a new article.
  const autoSlug = (title: string) =>
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          slug: form.slug || autoSlug(form.title),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');
      setSaved(data.created ? 'Article created' : 'Article updated');
      setTimeout(() => setSaved(''), 2500);
      setEditing(null);
      await load();
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a: Article) => {
    if (!confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/news?id=${a.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }
      setArticles((prev) => prev.filter((x) => x.id !== a.id));
      if (editing && typeof editing !== 'string' && editing.id === a.id) setEditing(null);
    } catch (e: any) {
      setError(e.message || 'Delete failed');
    }
  };

  const toggleStatus = async (a: Article) => {
    const next = a.status === 'published' ? 'draft' : 'published';
    try {
      const res = await fetch('/api/admin/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: a.id,
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt || '',
          status: next,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Update failed');
      setSaved(next === 'published' ? 'Article published' : 'Article moved to draft');
      setTimeout(() => setSaved(''), 2500);
      await load();
    } catch (e: any) {
      setError(e.message || 'Update failed');
    }
  };

  const filtered = articles.filter(
    (a) =>
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--amber)]" />
      </div>
    );
  }

  const inputClass =
    'w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.2)] focus:outline-none focus:border-[var(--amber)] transition-colors';
  const labelClass = 'block text-[10px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl tracking-[0.06em] uppercase font-bold">News Management</h1>
        <button onClick={openNew} className="btn btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> New Article
        </button>
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

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="w-4 h-4 text-[var(--gray)] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles…"
          className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0a] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.25)] focus:outline-none focus:border-[var(--amber)] text-sm"
        />
      </div>

      {/* Editor panel */}
      {editing && (
        <div className="mb-6 bg-[#0a0a0a] border border-[rgba(216,163,90,0.25)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg tracking-[0.06em] uppercase font-bold">
              {editing === 'new' ? 'New Article' : `Edit: ${editing.title}`}
            </h2>
            <button onClick={closeEdit} className="text-[var(--gray)] hover:text-white" aria-label="Close editor">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Title <span className="text-[var(--amber)]">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    update('title', e.target.value);
                    if (editing === 'new' && !form.slug) {
                      update('slug', autoSlug(e.target.value));
                    }
                  }}
                  placeholder="New product launch 2026"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Slug <span className="text-[var(--amber)]">*</span></label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => update('slug', e.target.value)}
                  placeholder="new-product-launch-2026"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => update('excerpt', e.target.value)}
                rows={2}
                placeholder="Short summary shown on the news list…"
                className={inputClass + ' resize-none'}
              />
            </div>

            <div>
              <label className={labelClass}>Content</label>
              <textarea
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                rows={8}
                placeholder="Full article body (plain text / multi-line)…"
                className={inputClass + ' resize-y'}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Cover Image URL</label>
                <input
                  type="text"
                  value={form.cover_image}
                  onChange={(e) => update('cover_image', e.target.value)}
                  placeholder="https://pub-xxx.r2.dev/news/cover.jpg"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Author</label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => update('author', e.target.value)}
                  placeholder="Funing Electronics"
                  className={inputClass}
                />
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.status === 'published'}
                onChange={(e) => update('status', e.target.checked ? 'published' : 'draft')}
                className="w-4 h-4 accent-[var(--amber)]"
              />
              <span className="text-sm text-[var(--soft-white)]">Published (visible on the live site)</span>
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeEdit} className="btn btn-secondary text-sm py-2 px-4">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title.trim() || !form.slug.trim()}
                className="btn btn-primary text-sm py-2 px-4 disabled:opacity-50"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="w-4 h-4" /> Save Article</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Article list */}
      {filtered.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-10 text-center">
          <Newspaper className="w-10 h-10 text-[var(--gray)] mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">
            {articles.length === 0 ? 'No news articles yet' : 'No matching articles'}
          </h2>
          <p className="text-[var(--gray)] text-sm mb-6 max-w-[400px] mx-auto">
            Publish product launches, company announcements, and industry updates for your visitors.
          </p>
          <button onClick={openNew} className="btn btn-primary text-sm">
            <Plus className="w-4 h-4" /> Create Article
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-4 flex items-center gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white font-medium">{a.title}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] tracking-[0.12em] uppercase flex items-center gap-1 ${
                      a.status === 'published'
                        ? 'bg-[rgba(52,211,153,0.15)] text-green-400'
                        : 'bg-[rgba(255,255,255,0.08)] text-[var(--gray)]'
                    }`}
                  >
                    {a.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {a.status}
                  </span>
                </div>
                <p className="text-[var(--gray)] text-sm truncate mt-1">
                  /news/{a.slug}
                  {a.published_at && <span className="ml-3 text-[var(--gray)]/70">{new Date(a.published_at).toLocaleDateString()}</span>}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => toggleStatus(a)}
                  className="p-2 text-[var(--gray)] hover:text-[var(--amber)] transition-colors"
                  title={a.status === 'published' ? 'Move to draft' : 'Publish'}
                >
                  {a.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => openEdit(a)}
                  className="p-2 text-[var(--gray)] hover:text-white transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(a)}
                  className="p-2 text-[var(--gray)] hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
