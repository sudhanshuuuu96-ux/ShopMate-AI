'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Bot,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Sun,
  Moon,
  Columns3,
  Video,
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/utils';

export function StoreHeader() {
  const pathname = usePathname();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    isChatOpen,
    setIsChatOpen,
    theme,
    toggleTheme,
    compareList,
    setIsCompareOpen,
  } = useStore();

  const isMerchant = pathname.startsWith('/merchant');

  return (
    <header className="sticky top-0 z-40 w-full transition-colors duration-200">
      {/* Top Promotional Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 border-b border-indigo-500/20 text-white text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Buildathon Track 1
            </span>
            <span className="text-slate-300">
              Agentic Commerce: Use code <strong className="text-amber-300 font-mono">SHOPMATE10</strong> for 10% instant off
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-emerald-400 font-semibold hidden sm:inline">⚡ Free Next-Day Delivery across India</span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1 text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Razorpay Test Mode (256-Bit SSL)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-900 dark:from-indigo-400 dark:via-purple-300 dark:to-white bg-clip-text text-transparent">
                  ShopMate AI
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Agentic Commerce
                  </span>
                  <span className="inline-block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                    Razorpay Track 1
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/90 dark:bg-slate-900/90 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !isMerchant
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Customer Storefront
            </Link>
            <Link
              href="/merchant"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isMerchant && !pathname.includes('audit-logs')
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Merchant Analytics</span>
            </Link>
            <Link
              href="/merchant/audit-logs"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname.includes('audit-logs')
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>AI Audit Ledger</span>
            </Link>
            <Link
              href="/presentation"
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname.startsWith('/presentation')
                  ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-sm'
                  : 'text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>7-Min Video Studio</span>
            </Link>
          </nav>

          {/* Action Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Dark / Light Mode Switcher */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-600" />
              )}
            </button>

            {/* Compare Tool Dock Button */}
            {compareList.length > 0 && (
              <button
                onClick={() => setIsCompareOpen(true)}
                className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/60 transition-all shadow-xs"
                title="Open Side-by-Side Comparison"
              >
                <Columns3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compare</span>
                <span className="inline-flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-extrabold bg-purple-600 text-white rounded-full">
                  {compareList.length}
                </span>
              </button>
            )}

            {/* AI Copilot Launcher */}
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isChatOpen
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800/80'
              }`}
              title="Toggle ShopMate AI Assistant"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white transition-all shadow-sm"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline font-semibold">{formatINR(cart.total)}</span>
              {cart.itemCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-extrabold bg-rose-500 text-white rounded-full shadow-sm">
                  {cart.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
