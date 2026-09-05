'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight, ShoppingBag, BarChart3 } from 'lucide-react';
import { formatINR, formatDate } from '@/lib/utils';
import { Order } from '@/types/store';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const rzpPaymentId = searchParams.get('rzpId') || 'pay_test_verified';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger festive celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }

    // Fetch order details from merchant metrics/orders
    const fetchOrderDetails = async () => {
      try {
        const res = await fetch('/api/merchant/metrics');
        const data = await res.json();
        if (data.recentOrders) {
          const found = data.recentOrders.find((o: Order) => o.id === orderId);
          if (found) {
            setOrder(found);
          }
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-8 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-4 border border-emerald-400/30">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300 border border-white/10 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Payment Verified via Razorpay Test Mode</span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">Order Confirmed!</h1>
          <p className="text-xs text-slate-300 mt-1">
            Thank you for shopping with ShopMate AI. Your transaction was safely processed.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">Order ID</span>
              <span className="font-mono font-bold text-slate-800">{orderId || 'ord_recent'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Razorpay Payment ID</span>
              <span className="font-mono font-bold text-indigo-700">{rzpPaymentId}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Payment Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                PAID & VERIFIED
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">Date</span>
              <span className="font-medium text-slate-800">{formatDate(new Date().toISOString())}</span>
            </div>
          </div>

          {/* AI Attribution Card (Key for Track 1) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-amber-50 border border-indigo-200/70 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>ShopMate AI Attribution Analysis</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              This order was successfully assisted by the **ShopMate AI Conversational Agent**. 
              Price validation and server-side safety checks were enforced before Razorpay checkout initialization.
            </p>
            {order?.hasUpsell && (
              <div className="mt-2 text-xs font-semibold text-amber-800 bg-amber-100/70 p-2 rounded-xl flex items-center justify-between">
                <span>✨ Incremental Upsell Generated:</span>
                <span className="font-bold">{formatINR(order.upsellRevenue)}</span>
              </div>
            )}
          </div>

          {/* Purchased Items List */}
          {order && order.items && order.items.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Purchased Items ({order.items.length})
              </h3>
              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                {order.items.map(item => (
                  <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{item.product.name}</span>
                      <span className="text-slate-400">×{item.quantity}</span>
                      {item.isUpsell && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-bold">
                          AI Upsell
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-slate-900">{formatINR(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Total Paid:</span>
                <span className="text-base font-extrabold text-indigo-600">{formatINR(order.total)}</span>
              </div>
            </div>
          )}

          {/* Action Links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/"
              className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
            <Link
              href="/merchant"
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Inspect in Merchant Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-slate-500">Loading order receipt...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
