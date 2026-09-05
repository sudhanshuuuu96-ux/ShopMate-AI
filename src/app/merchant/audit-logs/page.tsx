'use client';

import React, { useEffect, useState } from 'react';
import { StoreHeader } from '@/components/store/StoreHeader';
import { AuditLogTable } from '@/components/merchant/AuditLogTable';
import { AuditLog } from '@/types/store';
import { ShieldCheck, ShieldAlert, RefreshCw, Lock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/merchant/audit-logs');
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <StoreHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href="/merchant"
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
              </Link>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>AI Agent Safety & Audit Ledger</span>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200">
                100% Traceable
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Compliance ledger tracking every autonomous function call, prompt rationale, price verification, and Razorpay order.
            </p>
          </div>

          <button
            onClick={fetchLogs}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-all flex items-center gap-1.5 shadow-sm w-fit"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {/* Safety Guarantees Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Zero Autonomous Charging</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                The agent cannot charge customers on its own. All transactions require explicit client confirmation and Razorpay modal authorization.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Server Price Authority</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                Cart subtotals and Razorpay amounts are computed server-side directly from the product database. Client or LLM price tampering is blocked.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Cryptographic HMAC Verification</h4>
              <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                Every payment return is validated with HMAC SHA256 signatures before being marked paid in the merchant database.
              </p>
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <AuditLogTable logs={logs} />
      </main>
    </div>
  );
}
