'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Mail, FileText, TrendingUp, Activity, Users, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 4,
    contacts: 12,
    pages: 9,
    views: 1234,
  });
  const [recentContacts, setRecentContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/contacts?limit=5');
        if (res.ok) {
          const data = await res.json();
          setRecentContacts(data.contacts || []);
        }
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { label: 'Products', value: stats.products, icon: Package, href: '/admin/products', color: 'var(--amber)' },
    { label: 'New Contacts', value: stats.contacts, icon: Mail, href: '/admin/contacts', color: '#60a5fa' },
    { label: 'Content Pages', value: stats.pages, icon: FileText, href: '/admin/content', color: '#34d399' },
  ];

  return (
    <div>
      <h1 className="text-2xl tracking-[0.06em] uppercase font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 hover:border-[rgba(255,255,255,0.15)] transition-colors group"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              <ArrowUpRight className="w-4 h-4 text-[var(--gray)] group-hover:text-white transition-colors" />
            </div>
            <div className="text-[clamp(28px,3vw,40px)] font-bold text-white mb-1">{stat.value}</div>
            <div className="text-[var(--gray)] text-sm tracking-[0.04em]">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Contacts */}
      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden">
        <div className="p-6 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <h2 className="text-lg tracking-[0.06em] uppercase font-bold">Recent Contacts</h2>
          <Link href="/admin/contacts" className="text-[var(--amber)] text-sm hover:underline">View all →</Link>
        </div>
        {loading ? (
          <div className="p-6 text-center text-[var(--gray)]">Loading...</div>
        ) : recentContacts.length === 0 ? (
          <div className="p-6 text-center text-[var(--gray)]">No contacts yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)]">
                  <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Name</th>
                  <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Type</th>
                  <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Email</th>
                  <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Date</th>
                  <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentContacts.map((c: any) => (
                  <tr key={c.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="p-4 text-white text-sm">{c.name}</td>
                    <td className="p-4 text-sm text-[var(--gray)] capitalize">{c.type}</td>
                    <td className="p-4 text-sm text-[var(--gray)]">{c.email}</td>
                    <td className="p-4 text-sm text-[var(--gray)]">{new Date(c.submitted_at).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] tracking-[0.14em] uppercase ${
                        c.status === 'new' ? 'bg-[rgba(216,163,90,0.2)] text-[var(--amber)]' :
                        c.status === 'contacted' ? 'bg-[rgba(96,165,250,0.2)] text-blue-400' :
                        'bg-[rgba(52,211,153,0.2)] text-green-400'
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between p-5 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg hover:border-[rgba(255,255,255,0.15)] transition-colors"
        >
          <span className="text-white text-sm">View Live Site</span>
          <ArrowUpRight className="w-4 h-4 text-[var(--gray)]" />
        </Link>
        <Link
          href="/admin/content"
          className="flex items-center justify-between p-5 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg hover:border-[rgba(255,255,255,0.15)] transition-colors"
        >
          <span className="text-white text-sm">Edit Homepage</span>
          <ArrowUpRight className="w-4 h-4 text-[var(--gray)]" />
        </Link>
        <Link
          href="/admin/products"
          className="flex items-center justify-between p-5 bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg hover:border-[rgba(255,255,255,0.15)] transition-colors"
        >
          <span className="text-white text-sm">Manage Products</span>
          <ArrowUpRight className="w-4 h-4 text-[var(--gray)]" />
        </Link>
      </div>
    </div>
  );
}