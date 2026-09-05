'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/store';
import { ProductCard } from './ProductCard';
import { Search, Sparkles, Filter, SlidersHorizontal, ArrowUpDown, Check, X, Tag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const CATEGORIES = [
  { id: 'all', label: 'All Gear', icon: '⚡', color: 'from-indigo-600 to-purple-600' },
  { id: 'gaming', label: 'Gaming Headsets', icon: '🎧', color: 'from-purple-600 to-indigo-600' },
  { id: 'keyboards', label: 'Keyboards', icon: '⌨️', color: 'from-blue-600 to-cyan-600' },
  { id: 'peripherals', label: 'Mice & Mats', icon: '🖱️', color: 'from-emerald-600 to-teal-600' },
  { id: 'monitors', label: 'Monitors', icon: '🖥️', color: 'from-cyan-600 to-blue-600' },
  { id: 'streaming', label: 'Streaming & Audio', icon: '🎙️', color: 'from-pink-600 to-rose-600' },
  { id: 'controllers', label: 'Controllers', icon: '🎮', color: 'from-violet-600 to-purple-600' },
  { id: 'accessories', label: 'Stands & Cables', icon: '🔌', color: 'from-amber-500 to-orange-600' },
  { id: 'audio', label: 'Audiophile & Wireless', icon: '🎵', color: 'from-rose-500 to-pink-600' },
];

const BRANDS = [
  'All Brands',
  'Razer',
  'Sennheiser',
  'Logitech',
  'SteelSeries',
  'Samsung',
  'Elgato',
  'Sony',
  'Redragon',
  'Cosmic Byte',
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: 'under3k', label: 'Under ₹3,000' },
  { id: '3k-15k', label: '₹3,000 – ₹15,000' },
  { id: 'over15k', label: 'Over ₹15,000' },
];

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeBrand, setActiveBrand] = useState('All Brands');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'reviews'>('featured');
  const [priceRange, setPriceRange] = useState('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const { setChatInitialPrompt, setIsChatOpen } = useStore();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `/api/products?`;
      if (activeCategory !== 'all') url += `category=${activeCategory}&`;
      if (activeBrand !== 'All Brands') url += `brand=${encodeURIComponent(activeBrand)}&`;
      if (searchQuery) url += `query=${encodeURIComponent(searchQuery)}&`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, activeBrand, searchQuery]);

  // Client-side filtering & sorting
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products];

    // Price range filter
    if (priceRange === 'under3k') {
      list = list.filter(p => p.price <= 3000);
    } else if (priceRange === '3k-15k') {
      list = list.filter(p => p.price > 3000 && p.price <= 15000);
    } else if (priceRange === 'over15k') {
      list = list.filter(p => p.price > 15000);
    }

    // In stock filter
    if (inStockOnly) {
      list = list.filter(p => p.inStock && p.inventoryCount > 0);
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        list.sort((a, b) => b.reviewsCount - a.reviewsCount);
        break;
      default:
        break;
    }

    return list;
  }, [products, priceRange, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveBrand('All Brands');
    setSearchQuery('');
    setPriceRange('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="space-y-6">
      {/* Category Pills with Colorful Icons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                isActive
                  ? `bg-gradient-to-r ${cat.color} text-white shadow-md shadow-indigo-500/20 scale-102`
                  : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-slate-800 shadow-sm'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Brand Selector Bar (Apple/BMW Manufacturer Style) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1 pr-2 flex items-center gap-1">
          <Tag className="w-3 h-3" /> Brands:
        </span>
        {BRANDS.map(brand => (
          <button
            key={brand}
            onClick={() => setActiveBrand(brand)}
            className={`whitespace-nowrap px-3 py-1 rounded-xl text-[11px] font-semibold transition-all ${
              activeBrand === brand
                ? 'bg-slate-900 dark:bg-indigo-600 text-white font-bold shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {brand}
          </button>
        ))}
      </div>

      {/* Filter and Search Controls Toolbar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input with Clear icon */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search specs, switches, DPI, 4K monitors, or brands..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Price Range Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {PRICE_RANGES.map(pr => (
              <button
                key={pr.id}
                onClick={() => setPriceRange(pr.id)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                  priceRange === pr.id
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {pr.label}
              </button>
            ))}
          </div>

          {/* In Stock Toggle */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/60 dark:hover:bg-slate-700/60 rounded-xl cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>In Stock</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Featured</option>
              <option value="price-asc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Price: Low to High</option>
              <option value="price-desc" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Price: High to Low</option>
              <option value="rating" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Highest Rated</option>
              <option value="reviews" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Most Popular</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>
          Showing <strong className="text-slate-900 dark:text-white">{filteredAndSortedProducts.length}</strong> products
          {activeCategory !== 'all' && (
            <span> in <strong className="text-indigo-600 dark:text-indigo-400">{activeCategory}</strong></span>
          )}
          {activeBrand !== 'All Brands' && (
            <span> by <strong className="text-purple-600 dark:text-purple-400">{activeBrand}</strong></span>
          )}
        </span>

        {(activeCategory !== 'all' || activeBrand !== 'All Brands' || searchQuery || priceRange !== 'all' || inStockOnly) && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>Reset filters</span>
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-200/60 dark:bg-slate-800/60 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : filteredAndSortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <SlidersHorizontal className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-slate-800 dark:text-white text-base">No gear found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            We couldn't find any products matching your filters. Try clearing your filters or ask our AI assistant.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all"
            >
              Reset Filters
            </button>
            <button
              onClick={() => {
                setChatInitialPrompt('What are your top recommended products?');
                setIsChatOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Ask ShopMate AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
