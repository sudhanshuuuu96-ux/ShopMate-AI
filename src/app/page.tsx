'use client';

import React, { useState } from 'react';
import { StoreHeader } from '@/components/store/StoreHeader';
import { ProductGrid } from '@/components/store/ProductGrid';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { ChatDrawer } from '@/components/chat/ChatDrawer';
import { Hero3DScene } from '@/components/3d/Hero3DScene';
import {
  ShieldCheck,
  Bot,
  Zap,
  ArrowUpRight,
  Truck,
  RefreshCw,
  Lock,
  Star,
  Sparkles,
  Send,
  CheckCircle2,
  Cpu,
  Layers,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/context/StoreContext';
import { formatINR } from '@/lib/utils';

export default function StorefrontPage() {
  const { setChatInitialPrompt, setIsChatOpen, showToast, addToCart, buyNow } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'warning');
      return;
    }
    setNewsletterSubmitted(true);
    showToast('Subscribed! Welcome to ShopMate VIP Deals 🎉', 'success');
    setNewsletterEmail('');
  };

  const handlePromptClick = (prompt: string) => {
    setChatInitialPrompt(prompt);
    setIsChatOpen(true);
  };

  const handleAddBundle = async (itemIds: string[], bundleName: string) => {
    for (const id of itemIds) {
      await addToCart(id, 1, false);
    }
    showToast(`Added ${bundleName} to your cart!`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Header with Dark Mode Switcher & Compare Dock */}
      <StoreHeader />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* 3D Interactive Hero Section */}
        <section className="relative">
          <Hero3DScene />
        </section>

        {/* European / German Engineering Precision Strip (Apple / BMW Style) */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">1ms Ultra-Low Latency</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Esports competition verified</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Razorpay 256-Bit SSL</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">HMAC SHA256 payment gate</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Aerospace Alloys</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Precision CNC chassis</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center gap-3 shadow-xs">
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Agentic Commerce</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Zero autonomous overcharge</p>
            </div>
          </div>
        </section>

        {/* Quick Conversational Prompt Chips Bar */}
        <section className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-ping" />
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Popular AI Prompts:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handlePromptClick('I need gaming headphones under ₹3000.')}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/80 dark:border-indigo-800 transition-all flex items-center gap-1.5 hover:scale-103"
            >
              <span>🎮</span> "Headphones under ₹3000"
            </button>
            <button
              onClick={() => handlePromptClick('Compare the Razer BlackShark V2 X with the Sennheiser HD 560S.')}
              className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200/80 dark:border-purple-800 transition-all flex items-center gap-1.5 hover:scale-103"
            >
              <span>⚖️</span> "Compare Razer vs Sennheiser"
            </button>
            <button
              onClick={() => handlePromptClick('Show me 4K monitors and high-end streaming gear.')}
              className="px-3 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-700 dark:text-cyan-300 text-xs font-semibold border border-cyan-200/80 dark:border-cyan-800 transition-all flex items-center gap-1.5 hover:scale-103"
            >
              <span>🖥️</span> "4K Monitors & Streaming"
            </button>
            <button
              onClick={() => handlePromptClick('Can I get a discount?')}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200/80 dark:border-emerald-800 transition-all flex items-center gap-1.5 hover:scale-103"
            >
              <span>🏷️</span> "Apply SHOPMATE10"
            </button>
          </div>
        </section>

        {/* Product Catalog Grid with 3D Tilt Cards */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Curated Luxury Gaming & Audio Gear
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Tap any product card to automatically open its full engineering specification sheet.
              </p>
            </div>
          </div>

          <ProductGrid />
        </section>

        {/* Curated Battlestation Bundles Section (Apple / BMW Package Deals) */}
        <section className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-500/20 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Curated Battlestation Packages</span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                Complete Pro Bundles • 1-Click Instant Setup
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Engineered components perfectly matched with automatic companion discounts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bundle 1: Esports Champion Suite */}
            <div className="p-6 rounded-2xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/15 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Esports Starter Bundle
                  </span>
                  <span className="text-xs bg-rose-500 text-white font-extrabold px-2.5 py-0.5 rounded-full">
                    Save ₹400
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  Razer BlackShark V2 X + Aura RGB Stand + Splitter
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Competition headset paired with weighted dual-USB aluminum stand and gold-plated splitter cable.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div>
                  <span className="text-xl font-extrabold text-white">₹3,598</span>
                  <span className="text-xs text-slate-400 line-through ml-2">₹3,997</span>
                </div>
                <button
                  onClick={() =>
                    handleAddBundle(
                      ['hp-razer-v2x', 'acc-rgb-stand', 'acc-audio-splitter'],
                      'Esports Starter Bundle'
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Bundle to Cart</span>
                </button>
              </div>
            </div>

            {/* Bundle 2: Audiophile Creator Suite */}
            <div className="p-6 rounded-2xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-md border border-white/15 dark:border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Studio Creator Apex Suite
                  </span>
                  <span className="text-xs bg-rose-500 text-white font-extrabold px-2.5 py-0.5 rounded-full">
                    Save ₹1,500
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-1">
                  Sennheiser HD 560S + Elgato Stream Deck MK.2
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  German open-back acoustic reference headphones with tactile 15-key studio console for audio mixing.
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10">
                <div>
                  <span className="text-xl font-extrabold text-white">₹26,989</span>
                  <span className="text-xs text-slate-400 line-through ml-2">₹28,489</span>
                </div>
                <button
                  onClick={() =>
                    handleAddBundle(
                      ['audio-sennheiser-hd560s', 'stream-elgato-deck'],
                      'Studio Creator Apex Suite'
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Bundle to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Reviews & Social Proof */}
        <section className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>4.9 / 5 Verified by 3,800+ Enthusiasts</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Crafted for Demanding Gamers & Audio Pros
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real testimonials from shoppers who upgraded their setup with ShopMate AI.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "The Sennheiser HD 560S has unbelievable spatial staging. Used the compare tool to check it against gaming headsets and bought instantly."
              </p>
              <div className="text-[11px] text-slate-400 pt-1 font-semibold">
                — Siddharth P. (Mumbai) • <span className="text-emerald-500">Verified Buyer</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "The 1-click Buy Now button made checkout painless. Razorpay Test modal opened right away and payment was confirmed in seconds."
              </p>
              <div className="text-[11px] text-slate-400 pt-1 font-semibold">
                — Ananya K. (Bengaluru) • <span className="text-emerald-500">Verified Buyer</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center gap-1 text-amber-500 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                "Logitech Superlight 2 is feathers light. Dark mode looks gorgeous and coupon code SHOPMATE10 gave me 10% off right in the drawer."
              </p>
              <div className="text-[11px] text-slate-400 pt-1 font-semibold">
                — Vikram R. (Delhi) • <span className="text-emerald-500">Verified Buyer</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Drawers */}
      <CartDrawer />
      <ChatDrawer />

      {/* Rich Genuine E-Commerce Footer */}
      <footer className="mt-16 bg-slate-950 text-slate-400 border-t border-slate-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Brand & Bio */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">ShopMate AI</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous conversational e-commerce engine bridging customer discovery, AI upsells, and safe Razorpay checkout.
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Razorpay AI Buildathon 2026</span>
              </div>
            </div>

            {/* Column 2: Quick Shop Links */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Shop Categories</h4>
              <ul className="space-y-1.5">
                <li><Link href="/" className="hover:text-white transition-colors">Gaming Headsets</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Mechanical Keyboards</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Audiophile Headphones</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">4K Gaming Displays</Link></li>
                <li><Link href="/" className="hover:text-white transition-colors">Streaming Consoles</Link></li>
              </ul>
            </div>

            {/* Column 3: Trust & Policies */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Customer & Trust</h4>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Free Express Delivery (24-48h)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Razorpay 256-Bit SSL Checkout</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>7-Day Replacement Guarantee</span>
                </li>
                <li>
                  <Link href="/merchant" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 mt-2">
                    <span>Merchant Analytics Portal</span> <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
                <li>
                  <Link href="/merchant/audit-logs" className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                    <span>AI Tool Safety Audit Ledger</span> <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: VIP Newsletter Form */}
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">VIP Insider Deals</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Subscribe for early access to AI drops and get code <strong className="text-amber-300">SHOPMATE10</strong> for 10% off.
              </p>
              <form onSubmit={handleNewsletter} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={e => setNewsletterEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                {newsletterSubmitted && (
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Subscribed successfully!
                  </p>
                )}
              </form>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 ShopMate AI — Track 1: AI Growth & Agentic Commerce (Razorpay Buildathon)</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span>PCI-DSS Compliant</span>
              <span>•</span>
              <span>SHA-256 HMAC Signatures</span>
              <span>•</span>
              <span>Zero Client Tampering</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
