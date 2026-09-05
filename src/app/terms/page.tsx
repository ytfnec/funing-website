import Link from 'next/link';

export default function TermsPage() {
  return (
    <section className="px-page py-[clamp(60px,8vw,100px)] bg-cream">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-8">Terms of Service</h1>
        <p className="text-[var(--gray)] mb-8">Last updated: January 2025</p>
        <div className="space-y-8 text-[var(--soft-white)] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using the Funing Electronics website, you agree to be bound by these Terms of Service. If you do not agree, please do not use our site.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">2. Products & Pricing</h2>
            <p>All product descriptions and pricing are subject to change without notice. We reserve the right to discontinue any product at any time. Final pricing is confirmed at time of order.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">3. Orders & Payment</h2>
            <p>Orders are subject to acceptance and availability. Payment terms are specified at time of purchase. Custom orders require a non-refundable deposit.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">4. Contact</h2>
            <p>For questions about these terms, contact us at <Link href="mailto:info@fnec.net" className="text-[var(--amber)] hover:underline">info@fnec.net</Link>.</p>
          </section>
        </div>
      </div>
    </section>
  );
}