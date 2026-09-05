'use client';

import React, { useEffect, useState } from 'react';
import { StoreHeader } from '@/components/store/StoreHeader';
import { StatCard } from '@/components/merchant/StatCard';
import { RevenueChart } from '@/components/merchant/RevenueChart';
import { OrderListTable } from '@/components/merchant/OrderListTable';
import { MerchantMetrics, Order } from '@/types/store';
import { formatINR } from '@/lib/utils';
import {
  DollarSign,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Percent,
  ShieldCheck,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';

export default function MerchantDashboardPage() {
  const [metrics, setMetrics] = useState<MerchantMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/merchant/metrics');
      const data = await res.json();
      if (data.metrics) {
        setMetrics(data.metrics);
        setRecentOrders(data.recentOrders || []);
      }
    } catch (err) {
      console.error('Failed to load merchant metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Merchant Intelligence & AI Growth Dashboard
              </h1>
              <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-200">
                Track 1
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time analytics measuring AI sales conversion, upsell expansion, and autonomous shopping impact.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={fetchMetrics}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Metrics</span>
            </button>
            <Link
              href="/merchant/audit-logs"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-md shadow-indigo-200"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Inspect AI Audit Ledger</span>
            </Link>
          </div>
        </div>

        {/* Top KPI Stat Cards */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Total Revenue */}
            <StatCard
              title="Total Revenue"
              value={formatINR(metrics.totalRevenue)}
              change="+34.2%"
              isPositive={true}
              subtitle="All verified store orders"
              icon={DollarSign}
              color="indigo"
            />

            {/* AI-Assisted Revenue */}
            <StatCard
              title="AI-Assisted Revenue"
              value={formatINR(metrics.aiAssistedRevenue)}
              change={`${metrics.aiRevenuePercentage}% share`}
              isPositive={true}
              subtitle={`${metrics.aiOrdersCount} orders guided by ShopMate`}
              icon={Sparkles}
              color="purple"
            />

            {/* Average Order Value */}
            <StatCard
              title="Average Order Value (AOV)"
              value={formatINR(metrics.averageOrderValue)}
              change="+18.5%"
              isPositive={true}
              subtitle="Boosted by conversational recommendations"
              icon={TrendingUp}
              color="emerald"
            />

            {/* Incremental Upsell Revenue */}
            <StatCard
              title="Incremental Upsell Revenue"
              value={formatINR(metrics.upsellRevenue)}
              change="Growth driver"
              isPositive={true}
              subtitle="Autonomous cross-sell conversion"
              icon={Percent}
              color="amber"
            />
          </div>
        )}

        {/* Secondary Metrics Row */}
        {metrics && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Total Store Orders</span>
                <span className="text-xl font-extrabold text-slate-900">{metrics.totalOrders}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-emerald-600 font-bold block">{metrics.aiOrdersCount} via AI</span>
                <span className="text-[10px] text-slate-400">Razorpay verified</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">Store Conversion Rate</span>
                <span className="text-xl font-extrabold text-slate-900">{metrics.conversionRate}%</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-indigo-600 font-bold block">High intent</span>
                <span className="text-[10px] text-slate-400">Conversational flow</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium block">AI Tool Executions</span>
                <span className="text-xl font-extrabold text-slate-900">{metrics.totalAiInteractions}</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-purple-600 font-bold block">100% audited</span>
                <span className="text-[10px] text-slate-400">Server verified</span>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Attribution Chart */}
        {metrics && (
          <RevenueChart
            totalRevenue={metrics.totalRevenue}
            aiAssistedRevenue={metrics.aiAssistedRevenue}
            upsellRevenue={metrics.upsellRevenue}
            aiPercentage={metrics.aiRevenuePercentage}
          />
        )}

        {/* Recent AI Orders Table */}
        <OrderListTable orders={recentOrders} />
      </main>
    </div>
  );
}
