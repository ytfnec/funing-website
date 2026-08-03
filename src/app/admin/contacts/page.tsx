'use client';

import { useState, useEffect } from 'react';
import { Phone, MapPin, Loader2, ChevronDown, ExternalLink, Building2, Save, Check, Mail, Clock, Trash2, AlertCircle } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface Contact {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  location: string | null;
  message: string | null;
  product_interest: string | null;
  preferred_contact: string | null;
  best_time: string | null;
  status: string;
  notes: string | null;
  submitted_at: string;
}

export default function AdminContacts() {
  const { t } = useLang();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [savedNotes, setSavedNotes] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [deleted, setDeleted] = useState('');
  // Custom confirm dialog state (replaces native confirm())
  const [confirmState, setConfirmState] = useState<null | { type: 'single'; contact: Contact } | { type: 'bulk'; count: number }>(null);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const res = await fetch('/api/admin/contacts');
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
      }
    } catch {}
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/contacts?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    } catch {}
  };

  const startEditNotes = (c: Contact) => {
    setEditingNotes(c.id);
    setNotesDraft(c.notes || '');
    setSavedNotes(false);
  };

  const saveNotes = async (c: Contact) => {
    try {
      const res = await fetch(`/api/admin/contacts?id=${c.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesDraft }),
      });
      if (!res.ok) throw new Error(t('admin.contacts.saveFailed'));
      setContacts(prev => prev.map(x => x.id === c.id ? { ...x, notes: notesDraft } : x));
      setEditingNotes(null);
      setSavedNotes(true);
      setTimeout(() => setSavedNotes(false), 2000);
    } catch {}
  };

  const allSelected = contacts.length > 0 && contacts.every((c) => selected.has(c.id));

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(contacts.map((c) => c.id)));
  };

  const handleDelete = async (c: Contact) => {
    try {
      const res = await fetch(`/api/admin/contacts?id=${c.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(t('admin.contacts.deleteFailed'));
      setContacts(prev => prev.filter(x => x.id !== c.id));
      setSelected(prev => {
        const next = new Set(prev);
        next.delete(c.id);
        return next;
      });
      setDeleted(t('admin.contacts.deleted')?.replace?.('{n}', '1') || 'Deleted');
      setTimeout(() => setDeleted(''), 2500);
    } catch (err: any) {
      setError(err.message || t('admin.contacts.deleteFailed'));
    }
  };

  const runBulkDelete = async () => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/contacts/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) throw new Error(t('admin.contacts.bulkFailed'));
      setDeleted(t('admin.contacts.deleted')?.replace?.('{n}', String(ids.length)) || 'Deleted');
      setTimeout(() => setDeleted(''), 2500);
      setSelected(new Set());
      setContacts(prev => prev.filter(x => !ids.includes(x.id)));
    } catch (err: any) {
      setError(err.message || t('admin.contacts.bulkFailed'));
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--amber)]" />
      </div>
    );
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-[rgba(216,163,90,0.2)] text-[var(--amber)]',
      contacted: 'bg-[rgba(96,165,250,0.2)] text-blue-400',
      quoted: 'bg-[rgba(168,85,247,0.2)] text-purple-400',
      closed: 'bg-[rgba(52,211,153,0.2)] text-green-400',
    };
    return `px-2 py-1 rounded-full text-[10px] tracking-[0.14em] uppercase ${colors[status] || colors.new}`;
  };

  return (
    <div>
      <h1 className="text-2xl tracking-[0.06em] uppercase font-bold mb-8">{t('admin.contacts.title')}</h1>

      {error && (
        <div className="flex items-center gap-2 text-[var(--amber)] text-sm mb-4 p-4 bg-[rgba(216,163,90,0.1)] border border-[rgba(216,163,90,0.3)] rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {deleted && (
        <div className="flex items-center gap-2 text-green-400 text-sm mb-4 p-4 bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] rounded-lg">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{deleted}</span>
        </div>
      )}

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="text-center py-20 text-[var(--gray)]">{t('admin.contacts.empty')}</div>
        ) : (
          <>
          {/* Bulk delete toolbar */}
          <div className="mb-4 bg-[#0a0a0a] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-4 h-4 accent-[var(--amber)]"
              />
              <span className="text-sm text-[var(--soft-white)]">
                {selected.size > 0 ? t('admin.contacts.selected').replace('{n}', String(selected.size)) : t('admin.contacts.selectAll')}
              </span>
            </label>
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                onClick={() => setConfirmState({ type: 'bulk', count: selected.size })}
                disabled={selected.size === 0 || busy}
                className="btn btn-secondary text-xs py-1.5 px-3 text-red-400 hover:border-red-400/50 disabled:opacity-40"
              >
                {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />} {t('admin.contacts.deleteSelected')}
              </button>
            </div>
          </div>
          {contacts.map((c) => (
            <div key={c.id} className={`bg-[#0a0a0a] border rounded-lg overflow-hidden transition-colors ${
              selected.has(c.id) ? 'border-[rgba(216,163,90,0.55)]' : 'border-[rgba(255,255,255,0.06)]'
            }`}>
              <button
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selected.has(c.id)}
                      onChange={() => toggleSelect(c.id)}
                      className="w-4 h-4 accent-[var(--amber)] flex-shrink-0"
                    />
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    c.type === 'call' ? 'bg-blue-500/20 text-blue-400' :
                    c.type === 'quote' ? 'bg-[rgba(216,163,90,0.2)] text-[var(--amber)]' :
                    'bg-[rgba(255,255,255,0.1)] text-white'
                  }`}>
                    {c.name[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white text-sm font-medium truncate">{c.name}</div>
                    <div className="text-[var(--gray)] text-xs">{c.email} · {new Date(c.submitted_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={statusBadge(c.status)}>{t(`admin.contacts.status.${c.status}` as any) || c.status}</span>
                  <span className="text-[10px] tracking-[0.14em] uppercase text-[var(--gray)] capitalize">{t(`admin.contacts.type.${c.type}` as any) || c.type}</span>
                  <ChevronDown className={`w-4 h-4 text-[var(--gray)] transition-transform ${expanded === c.id ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {expanded === c.id && (
                <div className="px-5 pb-5 border-t border-[rgba(255,255,255,0.06)] pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {c.company && (
                      <div className="flex items-center gap-2 text-sm text-[var(--gray)]">
                        <Building2 className="w-4 h-4" /> {c.company}
                      </div>
                    )}
                    {c.phone && (
                      <div className="flex items-center gap-2 text-sm text-[var(--gray)]">
                        <Phone className="w-4 h-4" /> {c.phone}
                      </div>
                    )}
                    {c.location && (
                      <div className="flex items-center gap-2 text-sm text-[var(--gray)]">
                        <MapPin className="w-4 h-4" /> {c.location}
                      </div>
                    )}
                    {c.product_interest && (
                      <div className="flex items-center gap-2 text-sm text-[var(--gray)]">
                        <ExternalLink className="w-4 h-4" /> {c.product_interest}
                      </div>
                    )}
                    {c.preferred_contact && (
                      <div className="flex items-center gap-2 text-sm text-[var(--gray)]">
                        <Mail className="w-4 h-4" /> {t('admin.contacts.prefers')} {c.preferred_contact}
                      </div>
                    )}
                    {c.best_time && (
                      <div className="flex items-center gap-2 text-sm text-[var(--gray)]">
                        <Clock className="w-4 h-4" /> {t('admin.contacts.best')} {c.best_time}
                      </div>
                    )}
                  </div>
                  {c.message && (
                    <div className="bg-[#050505] rounded p-4 text-sm text-[var(--soft-white)] leading-relaxed">
                      {c.message}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-[var(--gray)]">{t('admin.contacts.updateStatus')}</span>
                    {['new', 'contacted', 'quoted', 'closed'].map((s) => (
                      <button
                        key={s}
                        onClick={() => updateStatus(c.id, s)}
                        className={`px-3 py-1 rounded-full text-[10px] tracking-[0.14em] uppercase border transition-colors ${
                          c.status === s
                            ? 'border-white text-white'
                            : 'border-[rgba(255,255,255,0.1)] text-[var(--gray)] hover:border-[rgba(255,255,255,0.3)]'
                        }`}
                      >
                        {t(`admin.contacts.status.${s}` as any)}
                      </button>
                    ))}
                  </div>

                  {/* Internal notes */}
                  <div className="pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] tracking-[0.18em] uppercase text-[var(--gray)]">
                        {t('admin.contacts.internalNotes')}
                      </span>
                      {savedNotes && (
                        <span className="flex items-center gap-1 text-[11px] text-green-400">
                          <Check className="w-3 h-3" /> {t('admin.contacts.saved')}
                        </span>
                      )}
                    </div>
                    {editingNotes === c.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={notesDraft}
                          onChange={(e) => setNotesDraft(e.target.value)}
                          rows={3}
                          placeholder="Add follow-up notes for this lead…"
                          className="w-full px-3 py-2 bg-[#050505] border border-[rgba(255,255,255,0.12)] rounded text-sm text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)] resize-none"
                        />
                        <div className="flex gap-3">
                          <button
                            onClick={() => saveNotes(c)}
                            className="flex items-center gap-1 text-[12px] text-[var(--amber)] hover:text-white transition-colors"
                          >
                            <Save className="w-3.5 h-3.5" /> {t('admin.contacts.saveNotes')}
                          </button>
                          <button
                            onClick={() => setEditingNotes(null)}
                            className="text-[12px] text-[var(--gray)] hover:text-white transition-colors"
                          >
                            {t('admin.contacts.cancel')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditNotes(c)}
                        className="w-full text-left text-sm leading-relaxed hover:bg-[rgba(255,255,255,0.02)] rounded p-2 transition-colors"
                      >
                        {c.notes ? (
                          <span className="text-[var(--soft-white)]">{c.notes}</span>
                        ) : (
                          <span className="text-[var(--gray)]/60 italic">No notes yet — click to add</span>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Delete this submission */}
                  <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex justify-end">
                    <button
                      onClick={() => setConfirmState({ type: 'single', contact: c })}
                      className="flex items-center gap-1 text-[12px] text-[var(--gray)] hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> {t('admin.contacts.delete')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
          </>
        )}
      </div>

      {/* Custom confirm dialog */}
      <ConfirmDialog
        open={confirmState !== null}
        title={t('admin.contacts.delete')}
        message={
          confirmState?.type === 'bulk'
            ? t('admin.contacts.bulkDeleteConfirm').replace('{n}', String(confirmState.count))
            : t('admin.contacts.deleteConfirm')
        }
        confirmLabel={t('admin.contacts.delete')}
        busy={busy}
        onConfirm={() => {
          if (confirmState?.type === 'single') {
            void handleDelete(confirmState.contact);
          } else if (confirmState?.type === 'bulk') {
            void runBulkDelete();
          }
          setConfirmState(null);
        }}
        onCancel={() => setConfirmState(null)}
      />
    </div>
  );
}