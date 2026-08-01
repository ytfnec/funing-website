import { FileText, Globe, Settings as SettingsIcon, Clock } from 'lucide-react';

export default function AdminContent() {
  const pages = [
    { slug: 'home', name: 'Homepage', sections: ['hero', 'products', 'why-funing', 'oem', 'faq', 'cta'] },
    { slug: 'products', name: 'Products', sections: ['hero', 'listing', 'cta'] },
    { slug: 'oem', name: 'OEM/ODM', sections: ['hero', 'services', 'process', 'cta'] },
    { slug: 'about', name: 'About', sections: ['main'] },
    { slug: 'privacy', name: 'Privacy Policy', sections: ['main'] },
    { slug: 'terms', name: 'Terms of Service', sections: ['main'] },
    { slug: 'cookies', name: 'Cookie Policy', sections: ['main'] },
  ];

  return (
    <div>
      <h1 className="text-2xl tracking-[0.06em] uppercase font-bold mb-8">Content Management</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pages.map((page) => (
          <div
            key={page.slug}
            className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              {page.slug === 'home' ? (
                <Globe className="w-5 h-5 text-[var(--amber)]" />
              ) : ['products', 'oem'].includes(page.slug) ? (
                <FileText className="w-5 h-5 text-blue-400" />
              ) : (
                <SettingsIcon className="w-5 h-5 text-[var(--gray)]" />
              )}
              <h2 className="text-white font-bold tracking-[0.06em] uppercase">{page.name}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {page.sections.map((section) => (
                <span key={section} className="px-2 py-1 bg-[#050505] border border-[rgba(255,255,255,0.06)] rounded text-[10px] tracking-[0.14em] uppercase text-[var(--gray)]">
                  {section.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 text-[10px] tracking-[0.14em] uppercase text-[var(--gray)]/70">
              <Clock className="w-3.5 h-3.5" />
              Editor coming soon
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-[rgba(216,163,90,0.05)] border border-[rgba(216,163,90,0.15)] rounded-lg">
        <h2 className="text-lg font-bold mb-2">About Content Management</h2>
        <p className="text-[var(--gray)] text-sm leading-relaxed">
          This section lists the pages that will support editable <strong className="text-white">content blocks</strong>.
          The block editor is currently in development — content is still managed in code via <code className="text-[var(--amber)]">src/lib/i18n.tsx</code>.
          Once the editor ships, blocks will be stored in D1 and rendered dynamically with changes appearing immediately on the live site.
        </p>
      </div>
    </div>
  );
}