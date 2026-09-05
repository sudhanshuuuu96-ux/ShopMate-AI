'use client';

import React from 'react';
import { Cart } from '@/types/store';
import { formatINR } from '@/lib/utils';
import { ShoppingBag, ShieldCheck, ArrowRight, CheckCircle, CreditCard } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface CartPreviewWidgetProps {
  cart?: Cart;
  onConfirm?: () => void;
}

export function CartPreviewWidget({ cart: propCart, onConfirm }: CartPreviewWidgetProps) {
  const { cart: contextCart, setIsCartOpen } = useStore();
  const cart = propCart || contextCart;

  if (!cart || cart.items.length === 0) return null;

  return (
    <div className="my-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
          <ShoppingBag className="w-4 h-4 text-indigo-600" />
          <span>Server-Verified Cart ({cart.itemCount} items)</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
          <ShieldCheck className="w-3 h-3" />
          <span>Verified Prices</span>
        </div>
      </div>

      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {cart.items.map(item => (
          <div key={item.productId} className="flex items-center justify-between text-xs py-1">
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="font-medium text-slate-700 truncate">{item.product.name}</span>
              <span className="text-slate-400">×{item.quantity}</span>
              {item.isUpsell && (
                <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.2 rounded font-semibold">
                  AI Upsell
                </span>
              )}
            </div>
            <span className="font-semibold text-slate-900 flex-shrink-0">
              {formatINR(item.subtotal)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-100 pt-2 space-y-1">
        {cart.discount > 0 && (
          <div className="flex justify-between text-xs text-emerald-600 font-semibold">
            <span>Promo Discount (SHOPMATE10):</span>
            <span>-{formatINR(cart.discount)}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Payable Total:</span>
          <span className="text-sm font-extrabold text-indigo-600">
            {formatINR(cart.total)}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 pt-1">
        {onConfirm && (
          <button
            onClick={onConfirm}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Confirm Total & Proceed to Payment</span>
          </button>
        )}

        <button
          onClick={() => setIsCartOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Detailed Breakdown</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
