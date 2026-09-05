'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';

export interface ToastData {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastNotificationProps {
  toast: ToastData | null;
  onClose: () => void;
}

export function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'warning':
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white border border-indigo-500/40 shadow-2xl shadow-indigo-900/40 max-w-md">
        <div className="flex-shrink-0 p-1 rounded-xl bg-white/10">
          {getIcon()}
        </div>
        <p className="text-xs font-medium text-slate-100 flex-1 leading-snug">
          {toast.message}
        </p>
        {toast.actionLabel && toast.onAction && (
          <button
            onClick={() => {
              toast.onAction?.();
              onClose();
            }}
            className="flex-shrink-0 px-3 py-1 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[11px] font-bold hover:brightness-110 shadow-sm transition-all"
          >
            {toast.actionLabel}
          </button>
        )}
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
