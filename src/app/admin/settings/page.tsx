'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Check, AlertCircle } from 'lucide-react';
import { useLang } from '@/lib/i18n';

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
  const { t } = useLang();
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
        throw new Error(data.error || t('admin.settings.saveFailed'));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e: any) {
      setError(e.message || t('admin.settings.saveFailedGeneric'));
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

  const inputClass = "w-full px-4 py-3 bg-card border border-[rgba(32,29,23,0.1)] rounded-md text-ink placeholder-[rgba(32,29,23,0.2)] focus:outline-none focus:border-[var(--amber)] transition-colors";
  const labelClass = "block text-[10px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl tracking-[0.06em] uppercase font-bold">{t('admin.settings.title')}</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary text-sm py-2 px-4 disabled:opacity-50"
        >
          {saving ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> {t('admin.settings.saving')}</>
          ) : saved ? (
            <><Check className="w-4 h-4" /> {t('admin.settings.saved')}</>
          ) : (
            <><Save className="w-4 h-4" /> {t('admin.settings.save')}</>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[var(--amber)] text-sm mb-6 p-4 bg-[rgba(168,118,58,0.1)] border border-[rgba(168,118,58,0.3)] rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="max-w-[600px] space-y-6">
        {/* Site Info */}
        <div className="bg-card border border-[rgba(32,29,23,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">{t('admin.settings.siteInfo')}</h2>
          <div className="space-y-4">
            {[
              { key: 'site_name', label: t('admin.settings.siteName') },
              { key: 'site_tagline', label: t('admin.settings.tagline') },
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
        <div className="bg-card border border-[rgba(32,29,23,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">{t('admin.settings.contactInfo')}</h2>
          <div className="space-y-4">
            {[
              { key: 'contact_email', label: t('admin.settings.email'), type: 'email' },
              { key: 'contact_phone', label: t('admin.settings.phone'), type: 'tel' },
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
        <div className="bg-card border border-[rgba(32,29,23,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">{t('admin.settings.analytics')}</h2>
          <div className="space-y-4">
            {[
              { key: 'ga_measurement_id', label: t('admin.settings.gaId'), placeholder: 'G-XXXXXXXXXX' },
              { key: 'gtm_id', label: t('admin.settings.gtmId'), placeholder: 'GTM-XXXXXXX' },
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
