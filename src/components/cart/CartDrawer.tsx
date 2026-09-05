'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/utils';
import { X, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Sparkles, CreditCard, Tag, Check, Plus, Minus } from 'lucide-react';

export function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    applyPromo,
    triggerRazorpayCheckout,
    setIsChatOpen,
    setChatInitialPrompt,
  } = useStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyPromo = async (codeToApply?: string) => {
    const code = codeToApply || promoCodeInput;
    if (!code) return;
    setPromoLoading(true);
    await applyPromo(code);
    setPromoLoading(false);
    setPromoCodeInput('');
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: cart.sessionId,
          customer: {
            name: 'Valued Shopper',
            email: 'shopper@example.com',
            phone: '+919876543210',
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIsCartOpen(false);
        triggerRazorpayCheckout({
          razorpayOrderId: data.razorpayOrderId,
          amount: data.amount,
          currency: 'INR',
        });
      } else {
        alert(data.error || 'Failed to create order');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAskAIToCheckout = () => {
    setIsCartOpen(false);
    setIsChatOpen(true);
    setChatInitialPrompt("I'm ready to checkout my cart. Please verify the total and let's proceed.");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Your Shopping Cart</h2>
                <span className="text-[10px] text-slate-400">
                  {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'} in session
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Ribbon */}
          <div className="px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold">⚡ FREE Express Delivery Unlocked!</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 uppercase">Track 1 Special</span>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-indigo-400">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
                    Discover competitive gaming headsets, mechanical keyboards, and matching accessories.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsChatOpen(true);
                    setChatInitialPrompt('I need gaming headphones under ₹3000.');
                  }}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-200 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Ask ShopMate AI to Suggest</span>
                </button>
              </div>
            ) : (
              cart.items.map(item => (
                <div key={item.productId} className="py-3.5 flex gap-3 group">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0 border border-slate-200/80"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-slate-400 hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        {item.isUpsell ? (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md">
                            ✨ AI Smart Upsell
                          </span>
                        ) : item.addedViaAi ? (
                          <span className="text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
                            🤖 AI Assisted
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 text-slate-500 hover:bg-slate-200 transition-colors"
                          title="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800 bg-white min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 text-slate-500 hover:bg-slate-200 transition-colors"
                          title="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-bold text-slate-900">
                        {formatINR(item.subtotal)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {cart.items.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50/90 space-y-3">
              {/* Promo Code Input */}
              <div className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      value={promoCodeInput}
                      onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="w-full pl-8 pr-2 py-1.5 text-xs uppercase font-mono tracking-wider border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <button
                    onClick={() => handleApplyPromo()}
                    disabled={promoLoading || !promoCodeInput}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {cart.discount === 0 && (
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Have code?</span>
                    <button
                      onClick={() => handleApplyPromo('SHOPMATE10')}
                      className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>Apply SHOPMATE10 (10% OFF)</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-slate-800">{formatINR(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Delivery:</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-indigo-600 font-bold bg-indigo-50/80 px-2 py-1 rounded-lg">
                    <span>Discount (SHOPMATE10):</span>
                    <span>-{formatINR(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-indigo-600 text-base">{formatINR(cart.total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 active:scale-98"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isProcessing ? 'Creating Secure Order...' : `Pay ${formatINR(cart.total)} via Razorpay`}</span>
                </button>

                <button
                  onClick={handleAskAIToCheckout}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Review & Checkout with AI Copilot</span>
                </button>
              </div>

              {/* Security Banner */}
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted Razorpay Sandbox Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
