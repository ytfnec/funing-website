'use client';

import { useState } from 'react';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';

export default function QuotePage() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string }>({});
  const [form, setForm] = useState({
    product: '',
    quantity: '',
    specifications: '',
    name: '',
    email: '',
    company: '',
    phone: '',
    country: '',
    message: '',
  });

  const STEPS = [t('quote.step1'), t('quote.step2'), t('quote.step3'), t('quote.step4')];

  const products = [
    { slug: 'sauna-controller', name: t('quote.prod1'), sub: t('quote.prod1sub') },
    { slug: 'jacquard-driver', name: t('quote.prod2'), sub: t('quote.prod2sub') },
    { slug: 'branded-unit', name: t('quote.prod3'), sub: t('quote.prod3sub') },
    { slug: 'accessories', name: t('quote.prod4'), sub: t('quote.prod4sub') },
    { slug: 'oem-odm', name: t('quote.prod5'), sub: t('quote.prod5sub') },
  ];

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const selectProduct = (slug: string) => {
    updateForm('product', slug);
    // Auto-advance after selecting a product for a smoother flow
    window.setTimeout(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 180);
  };

  const selectQuantity = (qty: string) => {
    updateForm('quantity', qty);
    window.setTimeout(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 180);
  };

  const validateStep2 = (): boolean => {
    const errors: { name?: string; email?: string } = {};
    if (!form.name.trim()) errors.name = 'Please enter your name';
    if (!form.email.trim()) {
      errors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'quote',
          name: form.name,
          email: form.email,
          phone: form.phone,
          company: form.company,
          message: `Product: ${form.product}\nQuantity: ${form.quantity}\nSpecifications: ${form.specifications}\nCountry: ${form.country}\n\n${form.message}`,
          productInterest: form.product,
        }),
      });
      if (!res.ok) throw new Error('Submission failed');
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <section className="px-page py-[clamp(80px,10vw,140px)] min-h-[60vh] flex items-center justify-center bg-[#050505]">
        <div className="max-w-[500px] text-center">
          <div className="w-16 h-16 bg-[var(--amber)] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-[#050505]" />
          </div>
          <h1 className="text-[clamp(28px,3.5vw,42px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-4">
            {t('quote.success.title')}
          </h1>
          <p className="body-text mb-6">
            {t('quote.success.desc')}
          </p>
          <p className="text-[var(--gray)] text-sm mb-8">
            {t('quote.success.confirm')} {form.email}.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="btn btn-secondary">{t('quote.success.btn1')}</Link>
            <Link href="/" className="btn btn-primary">{t('quote.success.btn2')}</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-page py-[clamp(60px,8vw,100px)] bg-[#050505]">
      <div className="max-w-[800px] mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-between mb-12 max-w-[600px] mx-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                  i <= step
                    ? 'bg-[var(--amber)] border-[var(--amber)] text-[#050505]'
                    : 'border-[var(--line)] text-[var(--gray)]'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span
                className={`hidden sm:block ml-2 text-[11px] tracking-[0.14em] uppercase ${
                  i <= step ? 'text-white' : 'text-[var(--gray)]'
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`w-[clamp(20px,6vw,60px)] h-px mx-2 ${
                    i < step ? 'bg-[var(--amber)]' : 'bg-[var(--line)]'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-8">
          {/* Step 0: Select Product */}
          {step === 0 && (
            <>
              <h1 className="text-[clamp(24px,3vw,36px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-2">
                {t('quote.s1.title')}
              </h1>
              <p className="text-[var(--gray)] mb-8">{t('quote.s1.desc')}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => selectProduct(s.slug)}
                    className={`text-left p-5 border rounded-md transition-all duration-200 w-full ${
                      form.product === s.slug
                        ? 'border-[var(--amber)] bg-[rgba(216,163,90,0.08)] shadow-[0_0_0_1px_var(--amber)]'
                        : 'border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)]'
                    }`}
                  >
                    <div className="text-white text-lg font-bold mb-1">{s.name}</div>
                    <div className="text-[var(--gray)] text-sm">{s.sub}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 1: Quantity & Specs */}
          {step === 1 && (
            <>
              <h2 className="text-[clamp(24px,3vw,36px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-2">
                {t('quote.s2.title')}
              </h2>
              <p className="text-[var(--gray)] mb-8">{t('quote.s2.desc')}</p>
              <div className="space-y-6">
                <div>
                  <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-3">{t('quote.s2.qty')}</label>
                  <div className="grid grid-cols-4 gap-3">
                    {['50–100', '100–500', '500–1000', '1000+'].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => selectQuantity(qty)}
                        className={`p-4 border rounded-md text-center transition-all duration-200 ${
                          form.quantity === qty
                            ? 'border-[var(--amber)] bg-[rgba(216,163,90,0.08)] text-white shadow-[0_0_0_1px_var(--amber)]'
                            : 'border-[rgba(255,255,255,0.06)] text-[var(--gray)] hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.02)]'
                        }`}
                      >
                        <div className="text-lg font-bold">{qty}</div>
                        <div className="text-xs mt-1">{t('quote.s2.units')}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-3">
                    {t('quote.s2.spec')}
                  </label>
                  <textarea
                    value={form.specifications}
                    onChange={(e) => updateForm('specifications', e.target.value)}
                    rows={4}
                    placeholder={t('quote.s2.specPh')}
                    className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)] resize-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <>
              <h2 className="text-[clamp(24px,3vw,36px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-2">
                {t('quote.s3.title')}
              </h2>
              <p className="text-[var(--gray)] mb-8">{t('quote.s3.desc')}</p>

              {error && (
                <div className="mb-6 p-4 bg-[rgba(216,163,90,0.1)] border border-[rgba(216,163,90,0.3)] rounded text-[var(--amber)] text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('contact.form.name')} <span className="text-[var(--amber)]">*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => { updateForm('name', e.target.value); if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: undefined })); }}
                      className={`w-full px-4 py-3 bg-[#050505] border rounded-md text-white focus:outline-none focus:border-[var(--amber)] ${fieldErrors.name ? 'border-red-400/60' : 'border-[rgba(255,255,255,0.1)]'}`}
                    />
                    {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('contact.form.email')} <span className="text-[var(--amber)]">*</span></label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => { updateForm('email', e.target.value); if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: undefined })); }}
                      className={`w-full px-4 py-3 bg-[#050505] border rounded-md text-white focus:outline-none focus:border-[var(--amber)] ${fieldErrors.email ? 'border-red-400/60' : 'border-[rgba(255,255,255,0.1)]'}`}
                    />
                    {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('quote.s3.company')}</label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => updateForm('company', e.target.value)}
                      className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white focus:outline-none focus:border-[var(--amber)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('quote.s3.country')}</label>
                    <input
                      type="text"
                      value={form.country}
                      onChange={(e) => updateForm('country', e.target.value)}
                      placeholder={t('quote.s3.countryPh')}
                      className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('quote.s3.phone')}</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm('phone', e.target.value)}
                    placeholder="+86 138 XXXX XXXX"
                    className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mb-2">{t('quote.s3.notes')}</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => updateForm('message', e.target.value)}
                    rows={3}
                    placeholder={t('quote.s3.notesPh')}
                    className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)] resize-none"
                  />
                </div>

                {/* Review */}
                <div className="mt-6 p-4 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded-md space-y-2">
                  <h3 className="text-sm tracking-[0.14em] uppercase text-[var(--gray)] mb-2">{t('quote.s3.summary')}</h3>
                  <div className="text-sm text-[var(--soft-white)]">
                    <span className="text-[var(--gray)]">{t('quote.s3.product')}</span> {products.find(p => p.slug === form.product)?.name || t('quote.s3.notSelected')}
                  </div>
                  <div className="text-sm text-[var(--soft-white)]">
                    <span className="text-[var(--gray)]">{t('quote.s3.qty')}</span> {form.quantity || t('quote.s3.notSpecified')}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-10 pt-6 border-t border-[rgba(255,255,255,0.06)]">
            {step > 0 ? (
              <button onClick={handleBack} className="btn btn-secondary text-sm">
                {t('quote.back')}
              </button>
            ) : (
              <div />
            )}
            {step === 2 ? (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn btn-primary text-sm disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('quote.submitting')}
                  </span>
                ) : (
                  <>{t('quote.submit')} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={step === 0 ? !form.product : false}
                className="btn btn-primary text-sm disabled:opacity-50"
              >
                {t('quote.next')}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
