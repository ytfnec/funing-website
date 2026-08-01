import { Image, Upload, FolderOpen } from 'lucide-react';

export default function AdminMedia() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl tracking-[0.06em] uppercase font-bold">Media Library</h1>
        <button className="btn btn-primary text-sm py-2 px-4">
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      <div className="bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] rounded-lg p-8 text-center">
        <FolderOpen className="w-12 h-12 text-[var(--gray)] mx-auto mb-4" />
        <h2 className="text-lg font-bold mb-2">No Media Yet</h2>
        <p className="text-[var(--gray)] text-sm mb-6 max-w-[400px] mx-auto">
          Upload images and assets to your R2 bucket. Files will be automatically optimized and served through Cloudflare's CDN.
        </p>
        <button className="btn btn-primary text-sm">
          <Upload className="w-4 h-4" /> Upload Your First Image
        </button>
      </div>

      <div className="mt-6 p-6 bg-[rgba(216,163,90,0.05)] border border-[rgba(216,163,90,0.15)] rounded-lg">
        <h3 className="text-sm font-bold mb-2">R2 Upload Guide</h3>
        <ul className="text-[var(--gray)] text-sm space-y-2">
          <li>• Images under 10MB are automatically optimized</li>
          <li>• WebP format is generated automatically for supported browsers</li>
          <li>• Use descriptive filenames for better SEO (e.g., sauna-controller-panel.webp)</li>
          <li>• R2 provides unlimited egress — no bandwidth charges</li>
        </ul>
      </div>
    </div>
  );
}