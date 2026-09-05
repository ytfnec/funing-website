import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <section className="px-page py-[clamp(60px,8vw,100px)] bg-cream">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-8">Privacy Policy</h1>
        <p className="text-[var(--gray)] mb-8">Last updated: January 2025</p>
        <div className="prose max-w-none space-y-8 text-[var(--soft-white)] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-4">Information We Collect</h2>
            <p>When you use our website, request a quote, or contact us, we may collect your name, email address, phone number, and any other information you choose to provide.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">How We Use Your Information</h2>
            <p>We use your information to respond to inquiries, provide quotes, process orders, and communicate with you about our products and services. We never sell your personal information.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">Cookies</h2>
            <p>Our website uses essential cookies for functionality and analytics cookies to understand how visitors use our site. You can control cookie preferences through your browser settings.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">Contact</h2>
            <p>For privacy-related inquiries, contact us at <Link href="mailto:info@fnec.net" className="text-[var(--amber)] hover:underline">info@fnec.net</Link>.</p>
          </section>
        </div>
      </div>
    </section>
  );
}