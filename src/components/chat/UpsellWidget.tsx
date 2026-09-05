'use client';

import React from 'react';
import { Product } from '@/types/store';
import { formatINR } from '@/lib/utils';
import { TrendingUp, Plus, Check } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface UpsellWidgetProps {
  product?: Product;
  upsellProduct?: Product;
  recommendationReason?: string;
}

export function UpsellWidget({ product, upsellProduct, recommendationReason }: UpsellWidgetProps) {
  const { addToCart } = useStore();
  const [added, setAdded] = React.useState(false);

  if (!upsellProduct) return null;

  const handleAddUpsell = async () => {
    await addToCart(upsellProduct.id, 1, true);
    setAdded(true);
  };

  return (
    <div className="my-3 p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-300/60 shadow-sm">
      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1.5">
        <TrendingUp className="w-4 h-4 text-amber-600" />
        <span>Smart Upsell Recommendation</span>
      </div>

      <p className="text-xs text-slate-700 mb-3 leading-relaxed">
        {recommendationReason || upsellProduct.upsellReason || `Pair with ${upsellProduct.name} for the optimal experience.`}
      </p>

      <div className="flex items-center justify-between gap-3 p-2.5 bg-white/95 rounded-xl border border-amber-200/80">
        <img
          src={upsellProduct.imageUrl}
          alt={upsellProduct.name}
          className="w-12 h-12 rounded-lg object-cover bg-slate-100 flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-semibold text-slate-900 truncate">
            {upsellProduct.name}
          </h5>
          <span className="text-xs font-bold text-amber-700">
            {formatINR(upsellProduct.price)}
          </span>
        </div>

        <button
          onClick={handleAddUpsell}
          disabled={added}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
            added
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added (+{formatINR(upsellProduct.price)})
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" /> Add to Order
            </>
          )}
        </button>
      </div>
    </div>
  );
}
