import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <section className="px-page py-[clamp(80px,10vw,140px)] min-h-[60vh] flex items-center justify-center bg-[#050505]">
      <div className="max-w-[500px] text-center">
        <div className="w-16 h-16 bg-[var(--amber)] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">✓</span>
        </div>
        <h1 className="text-[clamp(28px,3.5vw,42px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-4">Thank You!</h1>
        <p className="body-text mb-8">We've received your request. Our team will be in touch shortly.</p>
        <Link href="/" className="btn btn-primary">Back to Home</Link>
      </div>
    </section>
  );
}

export const metadata = { title: 'Thank You' };