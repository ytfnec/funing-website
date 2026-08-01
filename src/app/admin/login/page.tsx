'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="text-[var(--amber)] text-[22px] tracking-[0.12em] uppercase font-bold">
            Funing
          </div>
          <div className="text-[11px] tracking-[0.22em] uppercase text-[var(--gray)] mt-1">
            Electronics
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-8">
          <h1 className="text-2xl font-bold tracking-[0.06em] uppercase mb-2">Sign In</h1>
          <p className="text-[var(--gray)] mb-8">Admin dashboard access</p>

          {error && (
            <div className="flex items-center gap-2 text-[var(--amber)] text-sm mb-6 p-3 bg-[rgba(216,163,90,0.1)] border border-[rgba(216,163,90,0.3)] rounded">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs tracking-[0.22em] uppercase text-[var(--gray)] mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)] focus:ring-1 focus:ring-[var(--amber)] transition-colors"
                placeholder="admin@fnec.net"
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs tracking-[0.22em] uppercase text-[var(--gray)] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-[#050505] border border-[rgba(255,255,255,0.1)] rounded-md text-white placeholder-[rgba(255,255,255,0.3)] focus:outline-none focus:border-[var(--amber)] focus:ring-1 focus:ring-[var(--amber)] transition-colors pr-12"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--gray)] hover:text-white transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ marginTop: '4px' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[var(--gray)] text-sm mt-6">
          Funing Electronics Admin • {' '}
          <a href="/" className="text-[var(--amber)] hover:underline">View Site</a>
        </p>
      </div>
    </div>
  );
}