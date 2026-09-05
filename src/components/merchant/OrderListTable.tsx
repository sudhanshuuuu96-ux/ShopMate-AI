'use client';

import React from 'react';
import { Order } from '@/types/store';
import { formatINR, formatDate } from '@/lib/utils';
import { Sparkles, CheckCircle, Clock } from 'lucide-react';

interface OrderListTableProps {
  orders: Order[];
}

export function OrderListTable({ orders }: OrderListTableProps) {
  if (orders.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
        <p className="text-xs text-slate-500">No orders recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Recent AI Orders</h3>
          <p className="text-xs text-slate-500">Real-time transactions and conversational attributions</p>
        </div>
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
          {orders.length} total orders
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Order / Razorpay ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">AI Attribution</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-medium text-slate-900">
                  <div>{order.id}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                    {order.razorpayOrderId}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="font-semibold text-slate-800">{order.customer.name}</div>
                  <div className="text-[10px] text-slate-400">{order.customer.email}</div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="text-slate-700 max-w-[200px] truncate">
                    {order.items.map(i => `${i.product.name} (×${i.quantity})`).join(', ')}
                  </div>
                </td>

                <td className="py-3.5 px-4">
                  <div className="flex flex-col gap-1 items-start">
                    {order.isAiAssisted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                        <Sparkles className="w-3 h-3" />
                        AI Assisted
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                        Organic
                      </span>
                    )}

                    {order.hasUpsell && (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full border border-amber-200">
                        +₹{order.upsellRevenue} Upsell
                      </span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {formatINR(order.total)}
                </td>

                <td className="py-3.5 px-4">
                  {order.status === 'paid' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3" /> Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                      <Clock className="w-3 h-3" /> Created
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                  {formatDate(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
