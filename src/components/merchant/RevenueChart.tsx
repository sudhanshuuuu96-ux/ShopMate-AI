'use client';

import React from 'react';
import { formatINR } from '@/lib/utils';
import { Sparkles, TrendingUp, DollarSign } from 'lucide-react';

interface RevenueChartProps {
  totalRevenue: number;
  aiAssistedRevenue: number;
  upsellRevenue: number;
  aiPercentage: number;
}

export function RevenueChart({
  totalRevenue,
  aiAssistedRevenue,
  upsellRevenue,
  aiPercentage,
}: RevenueChartProps) {
  const standardRevenue = Math.max(0, totalRevenue - aiAssistedRevenue);
  const standardPercentage = totalRevenue > 0 ? Math.round((standardRevenue / totalRevenue) * 100) : 0;
  const upsellPercentage = totalRevenue > 0 ? Math.round((upsellRevenue / totalRevenue) * 100) : 0;

  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Revenue Attribution Breakdown
          </h3>
          <p className="text-xs text-slate-500">
            Comparing AI conversational sales vs traditional storefront purchases
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold w-fit">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>{aiPercentage}% AI-Driven Revenue</span>
        </div>
      </div>

      {/* Multi-segment progress bar */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
          <div
            style={{ width: `${aiPercentage}%` }}
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-700"
            title={`AI-Assisted: ${aiPercentage}%`}
          />
          <div
            style={{ width: `${standardPercentage}%` }}
            className="h-full bg-slate-300 transition-all duration-700"
            title={`Standard Organic: ${standardPercentage}%`}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
            AI Conversational Commerce: {aiPercentage}%
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
            Organic Catalog Purchases: {standardPercentage}%
          </span>
        </div>
      </div>

      {/* Comparative Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100">
          <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider block mb-1">
            AI-Assisted Sales
          </span>
          <span className="text-xl font-extrabold text-indigo-950 block">
            {formatINR(aiAssistedRevenue)}
          </span>
          <span className="text-[11px] text-indigo-600 mt-1 block">
            Guided by Gemini copilot
          </span>
        </div>

        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
            Incremental Upsell Uplift
          </span>
          <span className="text-xl font-extrabold text-amber-950 block">
            {formatINR(upsellRevenue)}
          </span>
          <span className="text-[11px] text-amber-700 mt-1 block">
            {upsellPercentage}% of total store revenue
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Total Gross Revenue
          </span>
          <span className="text-xl font-extrabold text-slate-900 block">
            {formatINR(totalRevenue)}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Processed via Razorpay Test Mode
          </span>
        </div>
      </div>
    </div>
  );
}
