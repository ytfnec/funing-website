'use client';

import { AlertTriangle, Loader2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  busy?: boolean;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Lightweight custom confirm dialog matching the site's dark/amber design.
 * Replaces native `window.confirm()` so confirmation works everywhere
 * (native confirm blocks automation/headless browsers and can't be styled).
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  busy,
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useLang();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={busy ? undefined : onCancel}
      />
      {/* Card */}
      <div className="relative bg-card border border-[rgba(32,29,23,0.12)] rounded-xl shadow-2xl w-full max-w-[420px] p-6">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
            danger ? 'bg-red-500/15 text-red-400' : 'bg-[rgba(168,118,58,0.15)] text-[var(--amber)]'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-ink font-bold text-base leading-snug">{title}</h3>
            <p className="text-[var(--gray)] text-sm mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="btn btn-secondary text-sm py-2 px-4 disabled:opacity-50"
          >
            {cancelLabel || t('admin.contacts.cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`btn text-sm py-2 px-4 disabled:opacity-50 ${
              danger ? 'bg-red-600/90 hover:bg-red-600 text-ivory' : 'btn-primary'
            }`}
          >
            {busy ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> {t('admin.contacts.deleting')}</>
            ) : (
              confirmLabel || t('admin.contacts.delete')
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
