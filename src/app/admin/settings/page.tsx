'use client';

import { useState } from 'react';
import { Save, Loader2, Check } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    site_name: 'Funing Electronics',
    site_tagline: 'Precision Electronic Control Systems. Engineered in Yantai, China.',
    contact_email: 'info@fnec.net',
    contact_phone: '+86 535-6778069',
    ga_measurement_id: '',
    gtm_id: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Mock save
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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

      <div className="max-w-[600px] space-y-6">
        {/* Site Info */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold mb-6">Site Information</h2>
          <div className="space-y-4">
            {[
              { key: 'site_name', label: 'Site Name' },
              { key: 'site_tagline', label: 'Tagline' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-[10px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{field.label}</label>
                <input
                  type="text"
                  value={(settings as any)[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white focus:outline-none focus:border-[var(--amber)]"
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
            ].map(field => (
              <div key={field.key}>
                <label className="block text-[10px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{field.label}</label>
                <input
                  type={field.type}
                  value={(settings as any)[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white focus:outline-none focus:border-[var(--amber)]"
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
            ].map(field => (
              <div key={field.key}>
                <label className="block text-[10px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{field.label}</label>
                <input
                  type="text"
                  value={(settings as any)[field.key]}
                  onChange={(e) => update(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.2)] focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}