'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, Loader2, FolderOpen, Image as ImageIcon, Check, AlertCircle, Trash2 } from 'lucide-react';

interface MediaItem {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  r2_key: string;
  alt_text: string;
  created_at: string;
}

// Public base URL for R2 assets. Set NEXT_PUBLIC_R2_PUBLIC_URL in build env
// to enable image previews (e.g. your R2 bucket's custom domain / public URL).
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL || '';
const hasPublicUrl = R2_PUBLIC_URL.length > 0;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
}

export default function AdminMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploaded, setUploaded] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadMedia();
  }, []);

  const loadMedia = async () => {
    try {
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
      }
    } catch {}
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setUploaded('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      setUploaded(`${file.name} uploaded`);
      setMedia((prev) => [data.media, ...prev]);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.original_name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/media?id=${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Delete failed');
      }
      setMedia((prev) => prev.filter((m) => m.id !== item.id));
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    }
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
        <h1 className="text-2xl tracking-[0.06em] uppercase font-bold">Media Library</h1>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,image/avif"
            onChange={handleUpload}
            className="hidden"
            id="media-upload-input"
          />
          <label
            htmlFor="media-upload-input"
            className={`btn btn-primary text-sm py-2 px-4 cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
          >
            {uploading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="w-4 h-4" /> Upload</>
            )}
          </label>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[var(--amber)] text-sm mb-6 p-4 bg-[rgba(216,163,90,0.1)] border border-[rgba(216,163,90,0.3)] rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {uploaded && (
        <div className="flex items-center gap-2 text-green-400 text-sm mb-6 p-4 bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.3)] rounded-lg">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{uploaded}</span>
        </div>
      )}

      {media.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-8 text-center">
          <FolderOpen className="w-12 h-12 text-[var(--gray)] mx-auto mb-4" />
          <h2 className="text-lg font-bold mb-2">No Media Yet</h2>
          <p className="text-[var(--gray)] text-sm mb-6 max-w-[400px] mx-auto">
            Upload images and assets to your R2 bucket. Files are stored in Cloudflare R2 and served through the CDN.
          </p>
          <label htmlFor="media-upload-input" className="btn btn-primary text-sm cursor-pointer">
            <Upload className="w-4 h-4" /> Upload Your First Image
          </label>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg overflow-hidden group"
            >
              <div className="aspect-square bg-[#050505] flex items-center justify-center overflow-hidden">
                {item.mime_type.startsWith('image/') && hasPublicUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`${R2_PUBLIC_URL}/${item.r2_key}`}
                    alt={item.alt_text || item.original_name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="w-8 h-8 text-[var(--gray)]" />
                    <span className="text-[10px] text-[var(--gray)] px-3 text-center truncate max-w-full">
                      {item.mime_type}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="text-white text-sm font-medium truncate" title={item.original_name}>
                  {item.original_name}
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[var(--gray)] text-xs">{formatSize(item.size)}</span>
                  <span className="text-[var(--gray)] text-xs">{formatDate(item.created_at)}</span>
                </div>
                <button
                  onClick={() => handleDelete(item)}
                  className="mt-2 flex items-center gap-1 text-[11px] text-[var(--gray)] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-6 bg-[rgba(216,163,90,0.05)] border border-[rgba(216,163,90,0.15)] rounded-lg">
        <h3 className="text-sm font-bold mb-2">R2 Upload Guide</h3>
        <ul className="text-[var(--gray)] text-sm space-y-2">
          <li>• Images up to 10MB, formats: JPEG, PNG, WebP, GIF, SVG, AVIF</li>
          <li>• Files are served through Cloudflare R2 CDN — no bandwidth charges</li>
          <li>• Use descriptive filenames for better SEO (e.g., sauna-controller-panel.webp)</li>
          <li>• R2 bucket: funing-storage</li>
        </ul>
      </div>
    </div>
  );
}
