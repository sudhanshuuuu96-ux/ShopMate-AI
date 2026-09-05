'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'indigo' | 'emerald' | 'amber' | 'purple';
}

export function StatCard({
  title,
  value,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  color = 'indigo',
}: StatCardProps) {
  const colorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${colorStyles[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {value}
        </span>
        {change && (
          <span
            className={`text-xs font-bold px-1.5 py-0.5 rounded ${
              isPositive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 line-clamp-1">
          {subtitle}
        </p>
      )}
    </div>
  );
}
