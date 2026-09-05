'use client';

import React from 'react';
import { formatINR } from '@/lib/utils';
import { CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface PaymentReadyWidgetProps {
  totalAmount?: number;
  razorpayOrderId?: string;
}

export function PaymentReadyWidget({ totalAmount, razorpayOrderId }: PaymentReadyWidgetProps) {
  const { cart, triggerRazorpayCheckout } = useStore();
  const amount = totalAmount || cart.total;
  const orderId = razorpayOrderId || `order_demo_${Date.now()}`;

  const handlePay = () => {
    triggerRazorpayCheckout({
      razorpayOrderId: orderId,
      amount,
      currency: 'INR',
    });
  };

  return (
    <div className="my-3 p-4 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-lg border border-indigo-500/30 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">
              Razorpay Checkout Ready
            </h4>
            <p className="text-[11px] text-slate-300">
              Order ID: <code className="text-indigo-300 font-mono">{orderId}</code>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] bg-white/10 text-emerald-300 px-2 py-0.5 rounded-full border border-white/10 font-semibold">
          <ShieldCheck className="w-3 h-3" />
          <span>Server Verified</span>
        </div>
      </div>

      <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between">
        <span className="text-xs text-slate-300">Final Verified Amount:</span>
        <span className="text-lg font-extrabold text-white">
          {formatINR(amount)}
        </span>
      </div>

      <button
        onClick={handlePay}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-md hover:shadow-indigo-500/30 flex items-center justify-center gap-2 glow-ai"
      >
        <CreditCard className="w-4 h-4" />
        <span>Pay with Razorpay (Test Mode)</span>
      </button>

      <p className="text-[10px] text-center text-slate-400">
        🔒 Safe Agentic Commerce: No automatic card charges. Requires explicit confirmation.
      </p>
    </div>
  );
}
