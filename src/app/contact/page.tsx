'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLang } from '@/lib/i18n';

export default function ContactPage() {
  const { t } = useLang();
  const router = useRouter();
  const [form, setForm] = useState({
    type: 'quote',
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    productInterest: '',
    website: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      // Redirect to the shared thank-you page on success.
      router.push('/thank-you');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#050505]">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[clamp(40px,6vw,80px)]">
        {/* Left: Info */}
        <div>
          <p className="text-[11px] tracking-[0.24em] uppercase text-[var(--amber)] mb-4">{t('contact.eyebrow')}</p>
          <h1 className="text-[clamp(36px,5vw,60px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-6">
            {t('contact.title')}
          </h1>
          <p className="body-text mb-10">
            {t('contact.desc')}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-[var(--amber)] mt-0.5" />
              <div>
                <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-1">{t('contact.phone')}</div>
                <div className="text-white">+86 535-6778069</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-[var(--amber)] mt-0.5" />
              <div>
                <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-1">{t('contact.email')}</div>
                <div className="text-white">info@fnec.net</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[var(--amber)] mt-0.5" />
              <div>
                <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-1">{t('contact.address')}</div>
                <div className="text-white">{t('contact.addr1')}</div>
                <div className="text-[var(--gray)] text-sm">{t('contact.addr2')}</div>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="w-5 h-5 text-[var(--amber)] mt-0.5" />
              <div>
                <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-1">{t('contact.hours')}</div>
                <div className="text-white">{t('contact.hoursVal')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Form */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-8">
          <h2 className="text-xl tracking-[0.06em] uppercase font-bold mb-6">{t('contact.form.title')}</h2>

          {error && (
            <div className="mb-6 p-4 bg-[rgba(216,163,90,0.1)] border border-[rgba(216,163,90,0.3)] rounded text-[var(--amber)] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Honeypot — hidden from humans, spam bots fill it in */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                type="text"
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={form.website || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('contact.form.type')}</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white focus:outline-none focus:border-[var(--amber)]"
              >
                <option value="quote">{t('contact.form.type1')}</option>
                <option value="oem">{t('contact.form.type2')}</option>
                <option value="product">{t('contact.form.type3')}</option>
                <option value="general">{t('contact.form.type4')}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('contact.form.name')}</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder={t('contact.form.name')}
                  className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
              <div>
                <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('contact.form.email')}</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="you@company.com"
                  className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('contact.form.company')}</label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder=""
                className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)]"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('contact.form.phone')}</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+86 138 XXXX XXXX"
                className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)]"
              />
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('contact.form.interest')}</label>
              <select
                name="productInterest"
                value={form.productInterest}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white focus:outline-none focus:border-[var(--amber)]"
              >
                <option value="">{t('contact.form.interest0')}</option>
                <option value="sauna-controllers">{t('contact.form.interest1')}</option>
                <option value="jacquard-drivers">{t('contact.form.interest2')}</option>
                <option value="branded-units">{t('contact.form.interest3')}</option>
                <option value="accessories">{t('contact.form.interest4')}</option>
                <option value="oem-odm">{t('contact.form.interest5')}</option>
                <option value="other">{t('contact.form.interest6')}</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('contact.form.msg')}</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                rows={4}
                placeholder={t('contact.form.msgPh')}
                className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full btn btn-primary py-3 disabled:opacity-50"
            >
              {status === 'loading' ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('contact.form.sending')}
                </span>
              ) : (
                t('contact.form.submit')
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
