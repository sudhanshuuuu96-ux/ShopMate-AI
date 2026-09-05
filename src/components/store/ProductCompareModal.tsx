'use client';

import React from 'react';
import { Product } from '@/types/store';
import { formatINR } from '@/lib/utils';
import { X, Trash2, ShoppingCart, Zap, Star, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface ProductCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCompareModal({ isOpen, onClose }: ProductCompareModalProps) {
  const { compareList, removeFromCompare, clearCompare, addToCart, buyNow, showToast } = useStore();

  if (!isOpen || compareList.length === 0) return null;

  // Extract all unique spec keys across all compared products
  const allSpecKeys = Array.from(
    new Set(compareList.flatMap(p => Object.keys(p.specs || {})))
  );

  const handleAddToCart = async (product: Product) => {
    await addToCart(product.id, 1, false);
  };

  const handleBuyNow = (product: Product) => {
    onClose();
    buyNow(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Engineering Specification Matrix
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Side-by-side performance comparison ({compareList.length} of 3 items selected)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCompare}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="p-6 overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-w-[650px]">
            {compareList.map(product => (
              <div
                key={product.id}
                className="flex flex-col rounded-2xl p-4 bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 relative group"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeFromCompare(product.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500 shadow-sm transition-colors"
                  title="Remove from comparison"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Image */}
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white dark:bg-slate-900 mb-3 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="max-h-full object-contain hover:scale-105 transition-transform"
                  />
                </div>

                {/* Brand & Badge */}
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    {product.brand || product.category}
                  </span>
                  {product.badge && (
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold leading-snug line-clamp-2 mb-2">
                  {product.name}
                </h3>

                {/* Price & Rating */}
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                      {formatINR(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-slate-400 line-through ml-2">
                        {formatINR(product.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-6">
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white text-xs font-bold shadow-md shadow-emerald-900/20 flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-900/20 flex items-center justify-center gap-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>

                {/* Technical Spec Rows */}
                <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-700 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Key Specifications
                  </span>
                  {allSpecKeys.map(specKey => {
                    const val = product.specs?.[specKey] || '—';
                    return (
                      <div key={specKey} className="text-xs py-1 border-b border-slate-100 dark:border-slate-700/40">
                        <span className="text-[10px] text-slate-400 block">{specKey}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{val}</span>
                      </div>
                    );
                  })}
                  {product.warranty && (
                    <div className="text-xs py-1.5 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-[11px] font-semibold">{product.warranty}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
