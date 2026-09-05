'use client';

import React from 'react';
import { Product } from '@/types/store';
import { formatINR } from '@/lib/utils';
import { Star, ShoppingCart, Sparkles, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface ProductCardWidgetProps {
  products: Product[];
}

export function ProductCardWidget({ products }: ProductCardWidgetProps) {
  const { addToCart } = useStore();
  const [addedIds, setAddedIds] = React.useState<Record<string, boolean>>({});

  const handleAdd = async (product: Product) => {
    await addToCart(product.id, 1, false);
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <div className="my-3 space-y-2.5">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg w-fit border border-indigo-100">
        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
        <span>ShopMate AI Recommendations</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {products.map(product => (
          <div
            key={product.id}
            className="flex items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-all"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-16 h-16 rounded-lg object-cover bg-slate-100 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-amber-500 text-[11px] font-medium">
                <Star className="w-3 h-3 fill-current" />
                <span>{product.rating}</span>
                <span className="text-slate-400">({product.reviewsCount})</span>
              </div>
              <h4 className="text-xs font-semibold text-slate-900 truncate">
                {product.name}
              </h4>
              <p className="text-[11px] text-slate-500 line-clamp-1">
                {product.features?.[0] || product.description}
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xs font-bold text-slate-900">
                  {formatINR(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-[10px] text-slate-400 line-through">
                    {formatINR(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => handleAdd(product)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                addedIds[product.id]
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
              }`}
            >
              {addedIds[product.id] ? (
                <>
                  <Check className="w-3.5 h-3.5" /> Added
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" /> Add
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
