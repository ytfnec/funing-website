import Link from 'next/link';

export default function CookiesPage() {
  return (
    <section className="px-page py-[clamp(60px,8vw,100px)] bg-cream">
      <div className="max-w-[800px] mx-auto">
        <h1 className="text-[clamp(32px,4vw,48px)] leading-[1.1] tracking-[0.06em] uppercase font-bold mb-8">Cookie Policy</h1>
        <p className="text-[var(--gray)] mb-8">Last updated: January 2025</p>
        <div className="space-y-8 text-[var(--soft-white)] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold mb-4">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and understand how you use our site.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">How We Use Cookies</h2>
            <p>We use essential cookies for site functionality and analytics cookies to measure usage. We do not use advertising or tracking cookies.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Disabling cookies may affect certain site features.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-4">Contact</h2>
            <p>For questions, contact <Link href="mailto:info@fnec.net" className="text-[var(--amber)] hover:underline">info@fnec.net</Link>.</p>
          </section>
        </div>
      </div>
    </section>
  );
}