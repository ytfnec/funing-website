'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLang } from '@/lib/i18n';
import { Package, Mail, Eye, Newspaper, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useLang();
  const [stats, setStats] = useState({
    products: 0,
    contacts: 0,
    views: 0,
    viewsToday: 0,
    news: 0,
  });
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, contactsRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/contacts?limit=5'),
        ]);

        const [statsData, contactsData] = await Promise.all([
          statsRes.ok ? statsRes.json() : { stats: {} },
          contactsRes.ok ? contactsRes.json() : { contacts: [] },
        ]);

        setStats((prev) => ({
          ...prev,
          ...(statsData.stats || {}),
        }));
        setRecentContacts(contactsData.contacts || []);
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: t('admin.dash.products'), value: stats.products, icon: Package, href: '/admin/products', color: 'var(--amber)' },
    { label: t('admin.dash.newsArticles'), value: stats.news, icon: Newspaper, href: '/admin/news', color: '#c084fc' },
    { label: t('admin.dash.newContacts'), value: stats.contacts, icon: Mail, href: '/admin/contacts', color: '#60a5fa' },
    { label: t('admin.dash.pageViews'), value: stats.views, icon: Eye, href: '#', color: '#34d399', sub: `${stats.viewsToday} ${t('admin.dash.in24h')}` },
  ];

  return (
    <div>
      <h1 className="text-2xl tracking-[0.06em] uppercase font-bold mb-8">{t('admin.dash.title')}</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-card border border-[rgba(32,29,23,0.06)] rounded-lg p-6 hover:border-[rgba(32,29,23,0.15)] transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              <ArrowUpRight className="w-4 h-4 text-[var(--gray)] group-hover:text-ink transition-colors" />
            </div>
            <div className="text-[clamp(28px,3vw,40px)] font-bold text-ink mb-1">{stat.value}</div>
            <div className="text-[var(--gray)] text-sm tracking-[0.04em]">{stat.label}</div>
            {stat.sub && <div className="text-[11px] text-[var(--amber)] mt-1">{stat.sub}</div>}
          </Link>
        ))}
      </div>

      {/* Recent Contacts */}
      <div className="bg-card border border-[rgba(32,29,23,0.06)] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[rgba(32,29,23,0.06)] flex items-center justify-between">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold">{t('admin.dash.recentContacts')}</h2>
          <Link href="/admin/contacts" className="text-[var(--amber)] text-sm hover:underline">{t('admin.dash.viewAll')} →</Link>
        </div>
        {loading ? (
          <div className="p-6 text-center text-[var(--gray)]">{t('admin.dash.loading')}</div>
        ) : recentContacts.length === 0 ? (
          <div className="p-6 text-center text-[var(--gray)]">{t('admin.dash.noContacts')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(32,29,23,0.06)]">
                  <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">{t('admin.dash.name')}</th>
                  <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">{t('admin.dash.type')}</th>
                  <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">{t('admin.dash.email')}</th>
                  <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">{t('admin.dash.date')}</th>
                  <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">{t('admin.dash.status')}</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((c: any) => (
                  <tr key={c.id} className="border-b border-[rgba(32,29,23,0.03)] hover:bg-[rgba(32,29,23,0.02)]">
                    <td className="p-4 text-ink text-sm">{c.name}</td>
                    <td className="p-4 text-sm text-[var(--gray)] capitalize">{c.type}</td>
                    <td className="p-4 text-sm text-[var(--gray)]">{c.email}</td>
                    <td className="p-4 text-sm text-[var(--gray)]">{new Date(c.submitted_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] tracking-[0.14em] uppercase ${
                        c.status === 'new' ? 'bg-[rgba(168,118,58,0.2)] text-[var(--amber)]' :
                        c.status === 'contacted' ? 'bg-[rgba(96,165,250,0.2)] text-blue-700' :
                        'bg-[rgba(52,211,153,0.2)] text-green-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between p-5 bg-card border border-[rgba(32,29,23,0.06)] rounded-lg hover:border-[rgba(32,29,23,0.15)] transition-colors"
        >
          <span className="text-ink text-sm">{t('admin.viewLiveSite')}</span>
          <ArrowUpRight className="w-4 h-4 text-[var(--gray)]" />
        </Link>
        <Link
          href="/admin/content"
          className="flex items-center justify-between p-5 bg-card border border-[rgba(32,29,23,0.06)] rounded-lg hover:border-[rgba(32,29,23,0.15)] transition-colors"
        >
          <span className="text-ink text-sm">{t('admin.dash.editHomepage')}</span>
          <ArrowUpRight className="w-4 h-4 text-[var(--gray)]" />
        </Link>
        <Link
          href="/admin/products"
          className="flex items-center justify-between p-5 bg-card border border-[rgba(32,29,23,0.06)] rounded-lg hover:border-[rgba(32,29,23,0.15)] transition-colors"
        >
          <span className="text-ink text-sm">{t('admin.dash.manageProducts')}</span>
          <ArrowUpRight className="w-4 h-4 text-[var(--gray)]" />
        </Link>
        <Link
          href="/admin/news"
          className="flex items-center justify-between p-5 bg-card border border-[rgba(32,29,23,0.06)] rounded-lg hover:border-[rgba(32,29,23,0.15)] transition-colors"
        >
          <span className="text-ink text-sm">{t('admin.dash.manageNews')}</span>
          <ArrowUpRight className="w-4 h-4 text-[var(--gray)]" />
        </Link>
      </div>
    </div>
  );
}