'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Check, AlertCircle } from 'lucide-react';

interface Settings {
  site_name: string;
  site_tagline: string;
  contact_email: string;
  contact_phone: string;
  ga_measurement_id: string;
  gtm_id: string;
}

const DEFAULT_SETTINGS: Settings = {
  site_name: 'Funing Electronics',
  site_tagline: 'Precision Electronic Control Systems. Engineered in Yantai, China.',
  contact_email: 'info@fnec.net',
  contact_phone: '+86 535-6778069',
  ga_measurement_id: '',
  gtm_id: '',
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings((prev) => ({ ...prev, ...data.settings }));
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const update = (key: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Save failed');
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e.message || 'Failed to save settings');
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

  const inputClass = "w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.2)] focus:outline-none focus:border-[var(--amber)] transition-colors";
  const labelClass = "block text-[10px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl tracking-[0.06em] uppercase font-bold">Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary text-sm py-2 px-4 disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="w-4 h-4" /> Saved</>
          ) : (
            <><Save className="w-4 h-4" /> Save</>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[var(--amber)] text-sm mb-6 p-4 bg-[rgba(216,163,90,0.1)] border border-[rgba(216,163,90,0.3)] rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-[600px] space-y-6">
        {/* Site Info */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">Site Information</h2>
          <div className="space-y-4">
            {[
              { key: 'site_name', label: 'Site Name' },
              { key: 'site_tagline', label: 'Tagline' },
            ].map((field) => (
              <div key={field.key}>
                <label className={labelClass}>{field.label}</label>
                <input
                  type="text"
                  value={settings[field.key as keyof Settings]}
                  onChange={(e) => update(field.key as keyof Settings, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">Contact Information</h2>
          <div className="space-y-4">
            {[
              { key: 'contact_email', label: 'Email', type: 'email' },
              { key: 'contact_phone', label: 'Phone', type: 'tel' },
            ].map((field) => (
              <div key={field.key}>
                <label className={labelClass}>{field.label}</label>
                <input
                  type={field.type}
                  value={settings[field.key as keyof Settings]}
                  onChange={(e) => update(field.key as keyof Settings, e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">Analytics & Tracking</h2>
          <div className="space-y-4">
            {[
              { key: 'ga_measurement_id', label: 'Google Analytics ID', placeholder: 'G-XXXXXXXXXX' },
              { key: 'gtm_id', label: 'Google Tag Manager ID', placeholder: 'GTM-XXXXXXX' },
            ].map((field) => (
              <div key={field.key}>
                <label className={labelClass}>{field.label}</label>
                <input
                  type="text"
                  value={settings[field.key as keyof Settings]}
                  onChange={(e) => update(field.key as keyof Settings, e.target.value)}
                  placeholder={field.placeholder}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
