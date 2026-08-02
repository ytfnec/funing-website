'use client';

import { useState, useEffect } from 'react';
import { Phone, MapPin, Loader2, ChevronDown, ExternalLink, Building2, Save, Check } from 'lucide-react';

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
  status: string;
  notes: string | null;
  submitted_at: string;
}

export default function AdminContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [savedNotes, setSavedNotes] = useState(false);

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
      if (!res.ok) throw new Error('Save failed');
      setContacts(prev => prev.map(x => x.id === c.id ? { ...x, notes: notesDraft } : x));
      setEditingNotes(null);
      setSavedNotes(true);
      setTimeout(() => setSavedNotes(false), 2000);
    } catch {}
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
      <h1 className="text-2xl tracking-[0.06em] uppercase font-bold mb-8">Contact Submissions</h1>

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="text-center py-20 text-[var(--gray)]">No submissions yet</div>
        ) : (
          contacts.map((c) => (
            <div key={c.id} className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === c.id ? null : c.id)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-[rgba(255,255,255,0.02)] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
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
                  <span className={statusBadge(c.status)}>{c.status}</span>
                  <span className="text-[10px] tracking-[0.14em] uppercase text-[var(--gray)] capitalize">{c.type}</span>
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
                  </div>
                  {c.message && (
                    <div className="bg-[#050505] rounded p-4 text-sm text-[var(--soft-white)] leading-relaxed">
                      {c.message}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xs text-[var(--gray)]">Update status:</span>
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
                        {s}
                      </button>
                    ))}
                  </div>

                  {/* Internal notes */}
                  <div className="pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] tracking-[0.18em] uppercase text-[var(--gray)]">
                        Internal Notes
                      </span>
                      {savedNotes && (
                        <span className="flex items-center gap-1 text-[11px] text-green-400">
                          <Check className="w-3 h-3" /> Saved
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
                            <Save className="w-3.5 h-3.5" /> Save Notes
                          </button>
                          <button
                            onClick={() => setEditingNotes(null)}
                            className="text-[12px] text-[var(--gray)] hover:text-white transition-colors"
                          >
                            Cancel
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
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}