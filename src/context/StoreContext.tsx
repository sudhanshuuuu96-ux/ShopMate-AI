'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cart, Product, CartItem } from '@/types/store';
import { RazorpayModal } from '@/components/checkout/RazorpayModal';
import { ToastNotification, ToastData } from '@/components/common/ToastNotification';
import { ProductQuickViewModal } from '@/components/store/ProductQuickViewModal';
import { ProductCompareModal } from '@/components/store/ProductCompareModal';

interface StoreContextType {
  sessionId: string;
  cart: Cart;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  chatInitialPrompt: string;
  setChatInitialPrompt: (prompt: string) => void;
  addToCart: (productId: string, quantity?: number, isUpsell?: boolean) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  applyPromo: (code: string) => Promise<{ success: boolean; message: string }>;
  refreshCart: () => Promise<void>;
  triggerRazorpayCheckout: (orderData: { razorpayOrderId: string; amount: number; currency?: string }) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', actionLabel?: string, onAction?: () => void) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isCompareOpen: boolean;
  setIsCompareOpen: (open: boolean) => void;
  buyNow: (productId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState<string>('');
  const [cart, setCart] = useState<Cart>({
    id: 'cart_init',
    sessionId: '',
    items: [],
    itemCount: 0,
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    currency: 'INR',
    requiresConfirmation: false,
    confirmedByUser: false,
    updatedAt: new Date().toISOString(),
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatInitialPrompt, setChatInitialPrompt] = useState('');
  const [toast, setToast] = useState<ToastData | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Dark Mode Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Compare Tool State
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Embedded Razorpay Modal State
  const [checkoutModal, setCheckoutModal] = useState<{
    isOpen: boolean;
    orderId: string;
    amount: number;
    currency: string;
  } | null>(null);

  // Initialize and persist theme
  useEffect(() => {
    const saved = localStorage.getItem('shopmate_theme') as 'light' | 'dark' | null;
    const initial = saved || 'dark';
    setTheme(initial);
    if (initial === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('shopmate_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize and persist session ID
  useEffect(() => {
    let sid = localStorage.getItem('shopmate_session_id');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 9);
      localStorage.setItem('shopmate_session_id', sid);
    }
    setSessionId(sid);
  }, []);

  const refreshCart = async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(`/api/cart?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.cart) {
        setCart(data.cart);
      }
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  };

  useEffect(() => {
    if (sessionId) {
      refreshCart();
    }
  }, [sessionId]);

  const showToast = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info',
    actionLabel?: string,
    onAction?: () => void
  ) => {
    setToast({
      id: 'toast_' + Date.now(),
      message,
      type,
      actionLabel,
      onAction,
    });
  };

  const addToCart = async (productId: string, quantity = 1, isUpsell = false) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', sessionId, productId, quantity, isUpsell }),
      });
      const data = await res.json();
      if (data.cart) {
        setCart(data.cart);
        const item = data.cart.items.find((i: any) => i.productId === productId);
        const productName = item?.product?.name || 'Item';
        showToast(`Added ${productName} to your cart!`, 'success', 'View Cart', () => setIsCartOpen(true));
      }
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      showToast(err.message || 'Failed to add item to cart', 'error');
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_quantity', sessionId, productId, quantity }),
      });
      const data = await res.json();
      if (data.cart) {
        setCart(data.cart);
      }
    } catch (err: any) {
      console.error('Failed to update quantity:', err);
      showToast(err.message || 'Failed to update quantity', 'error');
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'remove', sessionId, productId }),
      });
      const data = await res.json();
      if (data.cart) {
        setCart(data.cart);
        showToast('Item removed from cart', 'info');
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  const applyPromo = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'apply_promo', sessionId, code }),
      });
      const data = await res.json();
      if (data.success && data.cart) {
        setCart(data.cart);
        showToast(data.message || '10% discount applied!', 'success');
        return { success: true, message: data.message };
      } else {
        showToast(data.error || 'Invalid promo code', 'warning');
        return { success: false, message: data.error || 'Invalid promo code' };
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to apply coupon', 'error');
      return { success: false, message: err.message };
    }
  };

  const triggerRazorpayCheckout = (orderData: { razorpayOrderId: string; amount: number; currency?: string }) => {
    const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const isLiveConfigured = key && key.startsWith('rzp_test_') && key !== 'rzp_test_your_key_id' && key !== 'rzp_test_shopmate_demo';

    // If active merchant credentials are provided, invoke official Razorpay Checkout SDK
    if (isLiveConfigured && typeof window !== 'undefined' && (window as any).Razorpay) {
      try {
        const options = {
          key,
          amount: orderData.amount * 100,
          currency: orderData.currency || 'INR',
          name: 'ShopMate AI Store',
          description: 'Agentic Commerce Order Checkout',
          order_id: orderData.razorpayOrderId.startsWith('order_') ? orderData.razorpayOrderId : undefined,
          prefill: {
            name: 'Valued Shopper',
            email: 'shopper@example.com',
            contact: '+919876543210',
          },
          theme: {
            color: '#4f46e5',
          },
          handler: async function (response: any) {
            try {
              const verifyRes = await fetch('/api/checkout/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id || orderData.razorpayOrderId,
                  razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                  razorpaySignature: response.razorpay_signature || `sig_test_${Date.now()}`,
                  sessionId,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                window.location.href = `/order-success?orderId=${verifyData.order.id}&rzpId=${response.razorpay_payment_id || 'test_pay'}`;
              }
            } catch (err) {
              console.error('Verification failed:', err);
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        return;
      } catch (e) {
        console.warn('Real Razorpay modal failed, using embedded test checkout modal:', e);
      }
    }

    // Open embedded high-fidelity Razorpay Test Modal
    setCheckoutModal({
      isOpen: true,
      orderId: orderData.razorpayOrderId,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
    });
  };

  const addToCompare = (product: Product) => {
    if (compareList.some(p => p.id === product.id)) {
      showToast(`${product.name} is already in comparison`, 'info');
      setIsCompareOpen(true);
      return;
    }
    if (compareList.length >= 3) {
      showToast('You can compare up to 3 products at a time', 'warning');
      setIsCompareOpen(true);
      return;
    }
    setCompareList(prev => [...prev, product]);
    showToast(`Added ${product.name} to comparison`, 'success', 'Compare Specs', () => setIsCompareOpen(true));
  };

  const removeFromCompare = (productId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
    setIsCompareOpen(false);
  };

  const buyNow = async (productId: string) => {
    await addToCart(productId, 1, false);
    setIsCartOpen(false);
    try {
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          customer: {
            name: 'Fast-Track Shopper',
            email: 'shopper@example.com',
            phone: '+919876543210',
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        triggerRazorpayCheckout({
          razorpayOrderId: data.razorpayOrderId,
          amount: data.amount,
          currency: 'INR',
        });
      }
    } catch (e) {
      console.error('Buy Now error:', e);
      showToast('Failed to start instant checkout', 'error');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        sessionId,
        cart,
        isCartOpen,
        setIsCartOpen,
        isChatOpen,
        setIsChatOpen,
        chatInitialPrompt,
        setChatInitialPrompt,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyPromo,
        refreshCart,
        triggerRazorpayCheckout,
        showToast,
        quickViewProduct,
        setQuickViewProduct,
        theme,
        toggleTheme,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isCompareOpen,
        setIsCompareOpen,
        buyNow,
      }}
    >
      {children}
      {checkoutModal && (
        <RazorpayModal
          isOpen={checkoutModal.isOpen}
          onClose={() => setCheckoutModal(null)}
          orderId={checkoutModal.orderId}
          amount={checkoutModal.amount}
          currency={checkoutModal.currency}
          sessionId={sessionId}
        />
      )}
      <ToastNotification toast={toast} onClose={() => setToast(null)} />
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
      <ProductCompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
}
