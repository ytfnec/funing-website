'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard, Package, FileText, Mail, Settings, LogOut, ChevronRight, Menu, X, Image as ImageIcon, Newspaper
} from 'lucide-react';

const sidebarLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/content', icon: FileText, label: 'Content' },
  { href: '/admin/news', icon: Newspaper, label: 'News' },
  { href: '/admin/contacts', icon: Mail, label: 'Contacts' },
  { href: '/admin/media', icon: ImageIcon, label: 'Media' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(!isLoginPage);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoginPage) return; // Don't check auth on login page

    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth');
        if (!res.ok) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  // Login page: render without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[var(--amber)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-[rgba(255,255,255,0.06)] flex flex-col transition-transform duration-300
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-[rgba(255,255,255,0.06)]">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="text-[var(--amber,#d8a35a)] text-[15px] tracking-[0.12em] uppercase font-bold">
              Funing
            </span>
            <span className="text-[var(--gray)] text-[10px] tracking-[0.16em] uppercase hidden sm:inline">
              Electronics
            </span>
          </Link>
          <p className="text-[10px] tracking-[0.22em] uppercase text-[var(--gray)] mt-2">Admin</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-[14px] rounded-md transition-colors ${
                  isActive
                    ? 'bg-[rgba(216,163,90,0.1)] text-[var(--amber)] font-medium'
                    : 'text-[var(--gray)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]'
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center gap-3 px-4 py-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-[var(--amber)] flex items-center justify-center text-[#050505] text-xs font-bold">
              {user.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm truncate">{user.email}</div>
              <div className="text-[var(--gray)] text-[10px] uppercase tracking-[0.14em]">{user.role}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-[14px] text-[var(--gray)] hover:text-white hover:bg-[rgba(255,255,255,0.03)] rounded-md transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between px-6 bg-[#050505] sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-[var(--gray)] hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <Link href="/" target="_blank" className="text-[var(--gray)] hover:text-white text-sm transition-colors">
              View Site →
            </Link>
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}