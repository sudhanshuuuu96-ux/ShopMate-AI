'use client';

import React, { useState } from 'react';
import { AuditLog } from '@/types/store';
import { formatDate } from '@/lib/utils';
import { ShieldCheck, ShieldAlert, AlertTriangle, Code2, ChevronDown, ChevronRight } from 'lucide-react';

interface AuditLogTableProps {
  logs: AuditLog[];
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const toggleRow = (id: string) => {
    setExpandedRow(prev => (prev === id ? null : id));
  };

  const statusBadges = {
    passed: {
      icon: ShieldCheck,
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Verified & Passed',
    },
    warning: {
      icon: AlertTriangle,
      style: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Warning',
    },
    rejected: {
      icon: ShieldAlert,
      style: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Blocked by Safety Gate',
    },
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">AI Agent Audit & Safety Ledger</h3>
            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
              Immutable Trace
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time audit record of every Gemini function call, input payload, server-side price check, and safety gate.
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full w-fit">
          {logs.length} logged events
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-8"></th>
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Tool Invoked</th>
              <th className="py-3 px-4">Action Summary</th>
              <th className="py-3 px-4">Server Safety Check</th>
              <th className="py-3 px-4">Session</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {logs.map(log => {
              const isExpanded = expandedRow === log.id;
              const badge = statusBadges[log.serverValidationStatus] || statusBadges.passed;
              const Icon = badge.icon;

              return (
                <React.Fragment key={log.id}>
                  <tr
                    onClick={() => toggleRow(log.id)}
                    className={`cursor-pointer transition-colors ${
                      isExpanded ? 'bg-indigo-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-slate-400">
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      <span className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                        {log.toolName || log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                      {log.details}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.style}`}
                      >
                        <Icon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 truncate max-w-[100px]">
                      {log.sessionId}
                    </td>
                  </tr>

                  {/* Expanded JSON Inspector */}
                  {isExpanded && (
                    <tr className="bg-slate-50/80 border-b border-slate-200">
                      <td colSpan={6} className="p-4 space-y-3">
                        <div className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                          <strong className="text-slate-900 block mb-1">Safety & Execution Note:</strong>
                          {log.details}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                              📥 Input Arguments (Gemini LLM)
                            </span>
                            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48">
                              {JSON.stringify(log.inputParameters || {}, null, 2)}
                            </pre>
                          </div>

                          <div>
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                              📤 Server Execution Result & Verification
                            </span>
                            <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto max-h-48">
                              {JSON.stringify(log.outputResult || {}, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
