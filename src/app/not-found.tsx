import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="px-page py-[clamp(80px,10vw,140px)] min-h-[60vh] flex items-center justify-center bg-[#050505]">
      <div className="max-w-[500px] text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="text-[clamp(40px,6vw,72px)] leading-[1.05] tracking-[0.06em] uppercase font-bold mb-6">Page Not Found</h1>
        <p className="body-text mb-10">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/" className="btn btn-primary">Back to Home</Link>
          <Link href="/contact" className="btn btn-secondary">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}