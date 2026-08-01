'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Check, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  slug: string;
  name: string;
  sub_title: string;
  price_range: string;
  category: string;
  in_stock: number;
  sort_order: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch {}
    setLoading(false);
  };

  const toggleStock = async (id: string, current: number) => {
    try {
      await fetch('/api/admin/products', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, in_stock: current ? 0 : 1 }),
      });
      setProducts(prev => prev.map(p => p.id === id ? { ...p, in_stock: current ? 0 : 1 } : p));
    } catch {}
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--amber)]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl tracking-[0.06em] uppercase font-bold">Products</h1>
        <button className="btn btn-primary text-sm py-2 px-4">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)]">
                <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Product</th>
                <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Category</th>
                <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Price</th>
                <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Status</th>
                <th className="text-left p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Order</th>
                <th className="text-right p-4 text-[10px] tracking-[0.22em] uppercase text-[var(--gray)]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="p-4">
                    <div className="text-white text-sm font-medium">{p.name}</div>
                    <div className="text-[var(--gray)] text-xs">{p.sub_title}</div>
                  </td>
                  <td className="p-4 text-sm text-[var(--gray)] capitalize">{p.category.replace(/-/g, ' ')}</td>
                  <td className="p-4 text-sm" style={{ color: 'var(--wood)' }}>{p.price_range}</td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleStock(p.id, p.in_stock)}
                      className={`px-2 py-1 rounded-full text-[10px] tracking-[0.14em] uppercase ${
                        p.in_stock ? 'bg-[rgba(52,211,153,0.2)] text-green-400' : 'bg-[rgba(255,75,75,0.2)] text-red-400'
                      }`}
                    >
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="p-4 text-sm text-[var(--gray)]">{p.sort_order}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.slug}`}
                        className="p-2 text-[var(--gray)] hover:text-white transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(p.id, p.name)}
                        className="p-2 text-[var(--gray)] hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}