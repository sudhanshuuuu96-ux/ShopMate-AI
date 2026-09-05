'use client';

import React, { useState } from 'react';
import { Product } from '@/types/store';
import { formatINR } from '@/lib/utils';
import { Star, ShoppingCart, Sparkles, Check, Eye, Zap, Columns3 } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Card3DTilt } from '@/components/3d/Card3DTilt';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    addToCart,
    buyNow,
    setIsChatOpen,
    setChatInitialPrompt,
    setQuickViewProduct,
    compareList,
    addToCompare,
    removeFromCompare,
  } = useStore();

  const [added, setAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0]?.name || ''
  );

  const isCompared = compareList.some(p => p.id === product.id);

  const handleCardClick = () => {
    // Automatically open rich specifications sheet when tapping the card
    setQuickViewProduct(product);
  };

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await addToCart(product.id, 1, false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await buyNow(product.id);
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleAskAI = (e: React.MouseEvent) => {
    e.stopPropagation();
    setChatInitialPrompt(`Tell me all technical details of ${product.name} and why I should buy it.`);
    setIsChatOpen(true);
  };

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Card3DTilt
      maxTilt={7}
      glowColor="rgba(99, 102, 241, 0.25)"
      className="group h-full flex flex-col bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-indigo-400/60 dark:hover:border-indigo-500/60 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div onClick={handleCardClick} className="flex-1 flex flex-col justify-between">
        {/* Product Image Area */}
        <div className="relative aspect-[4/3] bg-gradient-to-tr from-slate-100 to-indigo-50/30 dark:from-slate-800 dark:to-slate-900 overflow-hidden rounded-t-2xl">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
          />

          {/* Top Left Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {discountPercent && (
              <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-md">
                Save {discountPercent}%
              </span>
            )}
            {product.badge && (
              <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                {product.badge}
              </span>
            )}
          </div>

          {/* Top Right Action Overlay Buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {/* Compare Button */}
            <button
              onClick={handleCompareToggle}
              className={`p-2 rounded-xl backdrop-blur shadow-sm transition-all hover:scale-110 ${
                isCompared
                  ? 'bg-purple-600 text-white font-bold'
                  : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-purple-600'
              }`}
              title={isCompared ? 'Remove from Comparison' : 'Add to Side-by-Side Compare'}
            >
              <Columns3 className="w-3.5 h-3.5" />
            </button>

            {/* Ask AI Chip */}
            <button
              onClick={handleAskAI}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900/85 dark:bg-slate-800/90 backdrop-blur text-indigo-300 hover:text-white hover:bg-indigo-600 shadow-md transition-all flex items-center gap-1 text-[11px] font-bold hover:scale-105"
              title="Ask ShopMate AI about this product"
            >
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Ask AI</span>
            </button>
          </div>

          {/* Bottom Stock Indicator Ribbon */}
          <div className="absolute bottom-2 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur text-[10px] font-medium text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              In Stock ({product.inventoryCount} units)
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            {/* Brand, Category & Rating */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                {product.brand && (
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                    {product.brand}
                  </span>
                )}
                <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                  {product.category}
                </span>
              </div>

              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
              </div>
            </div>

            {/* Product Title */}
            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {product.description}
            </p>

            {/* Interactive Color Variant Swatches (Apple Style) */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Color:</span>
                <div className="flex items-center gap-1">
                  {product.colors.map(col => (
                    <button
                      key={col.name}
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedColor(col.name);
                      }}
                      style={{ backgroundColor: col.hex }}
                      className={`w-4 h-4 rounded-full border transition-all ${
                        selectedColor === col.name
                          ? 'ring-2 ring-indigo-500 ring-offset-1 border-white dark:border-slate-900 scale-110'
                          : 'border-slate-300 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                      title={col.name}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                  {selectedColor}
                </span>
              </div>
            )}
          </div>

          {/* Pricing & Direct Shopping Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                {formatINR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {formatINR(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Dual Action Buttons: 1-Click Buy Now & Add to Cart */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleBuyNow}
                disabled={!product.inStock}
                className="py-2.5 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                title="Direct 1-Click Razorpay Checkout"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Buy Now</span>
              </button>

              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-indigo-900/30'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Card3DTilt>
  );
}
