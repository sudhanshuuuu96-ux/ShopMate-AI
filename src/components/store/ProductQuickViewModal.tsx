'use client';

import React, { useState } from 'react';
import { Product } from '@/types/store';
import { formatINR } from '@/lib/utils';
import {
  X,
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RefreshCw,
  Check,
  Sparkles,
  Zap,
  Columns3,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface ProductQuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export function ProductQuickViewModal({ product, onClose }: ProductQuickViewModalProps) {
  const { addToCart, buyNow, setIsChatOpen, setChatInitialPrompt, addToCompare, compareList } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0]?.name || ''
  );

  if (!product) return null;

  const isCompared = compareList.some(p => p.id === product.id);

  const handleAddToCart = async () => {
    await addToCart(product.id, quantity, false);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const handleBuyNow = async () => {
    onClose();
    await buyNow(product.id);
  };

  const handleAskAI = () => {
    onClose();
    setChatInitialPrompt(`Tell me all key features of ${product.name} and why I should buy it.`);
    setIsChatOpen(true);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image & Color Variants */}
          <div className="relative bg-gradient-to-br from-slate-100 to-indigo-50/40 dark:from-slate-800 dark:to-slate-950 p-6 flex flex-col items-center justify-between min-h-[350px]">
            {/* Top Badges */}
            <div className="w-full flex items-center justify-between">
              {discountPercent && (
                <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  Save {discountPercent}%
                </span>
              )}
              {product.brand && (
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur px-3 py-1 rounded-full border border-slate-200/60 dark:border-slate-700">
                  {product.brand}
                </span>
              )}
            </div>

            {/* Product Center Image */}
            <div className="my-auto py-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="max-h-72 w-full object-contain rounded-2xl drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Interactive Color Variant Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="w-full bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-3 rounded-2xl border border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Select Finish:
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map(col => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      style={{ backgroundColor: col.hex }}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        selectedColor === col.name
                          ? 'ring-2 ring-indigo-500 ring-offset-2 border-white dark:border-slate-900 scale-110'
                          : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                      title={col.name}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-1">
                    {selectedColor}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Details, Specifications, & Actions */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Ratings */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-lg">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400">({product.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {product.name}
              </h2>

              {/* Price & In-stock Indicator */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded">
                  In Stock ({product.inventoryCount} units)
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Key Features Bullets */}
              <div className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Engineered Features
                </span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* German/Apple Style Technical Specification Table */}
              {product.specs && (
                <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Technical Specifications
                  </span>
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 text-xs overflow-hidden">
                    {Object.entries(product.specs).map(([label, value]) => (
                      <div key={label} className="flex justify-between p-2 bg-slate-50/50 dark:bg-slate-800/40">
                        <span className="text-slate-500 dark:text-slate-400">{label}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions Pane */}
            <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              {/* Quantity Stepper */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Select Quantity
                </span>
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventoryCount, quantity + 1))}
                    className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Direct Shopping Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={handleBuyNow}
                  disabled={!product.inStock}
                  className="py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4" />
                  <span>Instant Buy Now</span>
                </button>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-indigo-900/40'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </>
                  )}
                </button>
              </div>

              {/* Secondary Actions: Compare & Ask AI */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addToCompare(product)}
                  className="py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <Columns3 className="w-3.5 h-3.5 text-purple-500" />
                  <span>{isCompared ? 'Compared' : 'Compare Specs'}</span>
                </button>

                <button
                  onClick={handleAskAI}
                  className="py-2 px-3 rounded-xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Ask AI Rationale</span>
                </button>
              </div>

              {/* Trust Micro-Badges */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-slate-500 dark:text-slate-400 text-center">
                <div className="flex items-center justify-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  <span>24h Dispatch</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{product.warranty ? 'Brand Warranty' : '100% Genuine'}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>7-Day Return</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
