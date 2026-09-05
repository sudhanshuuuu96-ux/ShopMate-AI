import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/context/StoreContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'ShopMate AI — Agentic Commerce for Razorpay',
  description: 'AI-Powered Conversational Shopping Assistant with Server Price Validation & Razorpay Test Checkout',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
