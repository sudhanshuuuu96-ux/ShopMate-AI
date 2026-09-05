import { Product, Cart, CartItem, Order, AuditLog, MerchantMetrics } from '@/types/store';
import { INITIAL_PRODUCTS } from './seed-data';

// Singleton in-memory reactive store
class MockStore {
  private products: Map<string, Product> = new Map();
  private carts: Map<string, Cart> = new Map();
  private orders: Map<string, Order> = new Map();
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.seedProducts();
    this.seedInitialOrders();
    this.seedInitialAuditLogs();
  }

  private seedProducts() {
    INITIAL_PRODUCTS.forEach(product => {
      this.products.set(product.id, { ...product });
    });
  }

  private seedInitialOrders() {
    const sampleOrders: Order[] = [
      {
        id: 'ord_demo_01',
        razorpayOrderId: 'order_RZP_DEMO_01',
        razorpayPaymentId: 'pay_DEMO_001',
        razorpaySignature: 'sig_verified_demo_001',
        sessionId: 'session_demo_prev1',
        customer: {
          name: 'Aarav Sharma',
          email: 'aarav@example.com',
          phone: '+919876543210',
        },
        items: [
          {
            productId: 'hp-razer-v2x',
            product: this.products.get('hp-razer-v2x')!,
            quantity: 1,
            unitPrice: 2999,
            subtotal: 2999,
            addedViaAi: true,
            isUpsell: false,
          },
          {
            productId: 'acc-rgb-stand',
            product: this.products.get('acc-rgb-stand')!,
            quantity: 1,
            unitPrice: 699,
            subtotal: 699,
            addedViaAi: true,
            isUpsell: true,
          }
        ],
        subtotal: 3698,
        tax: 0,
        total: 3698,
        status: 'paid',
        isAiAssisted: true,
        hasUpsell: true,
        upsellRevenue: 699,
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        paidAt: new Date(Date.now() - 3600000 * 4 + 120000).toISOString(),
      },
      {
        id: 'ord_demo_02',
        razorpayOrderId: 'order_RZP_DEMO_02',
        razorpayPaymentId: 'pay_DEMO_002',
        razorpaySignature: 'sig_verified_demo_002',
        sessionId: 'session_demo_prev2',
        customer: {
          name: 'Pooja Verma',
          email: 'pooja@example.com',
          phone: '+919812345678',
        },
        items: [
          {
            productId: 'kb-redragon-k552',
            product: this.products.get('kb-redragon-k552')!,
            quantity: 1,
            unitPrice: 2799,
            subtotal: 2799,
            addedViaAi: true,
            isUpsell: false,
          },
          {
            productId: 'pad-speed-xl',
            product: this.products.get('pad-speed-xl')!,
            quantity: 1,
            unitPrice: 499,
            subtotal: 499,
            addedViaAi: true,
            isUpsell: true,
          }
        ],
        subtotal: 3298,
        tax: 0,
        total: 3298,
        status: 'paid',
        isAiAssisted: true,
        hasUpsell: true,
        upsellRevenue: 499,
        createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        paidAt: new Date(Date.now() - 3600000 * 8 + 60000).toISOString(),
      },
      {
        id: 'ord_demo_03',
        razorpayOrderId: 'order_RZP_DEMO_03',
        razorpayPaymentId: 'pay_DEMO_003',
        sessionId: 'session_demo_prev3',
        customer: {
          name: 'Rohan Mehta',
          email: 'rohan@example.com',
          phone: '+919988776655',
        },
        items: [
          {
            productId: 'hp-cosmic-kronos',
            product: this.products.get('hp-cosmic-kronos')!,
            quantity: 1,
            unitPrice: 2899,
            subtotal: 2899,
            addedViaAi: false,
            isUpsell: false,
          }
        ],
        subtotal: 2899,
        tax: 0,
        total: 2899,
        status: 'paid',
        isAiAssisted: false,
        hasUpsell: false,
        upsellRevenue: 0,
        createdAt: new Date(Date.now() - 3600000 * 16).toISOString(),
        paidAt: new Date(Date.now() - 3600000 * 16 + 80000).toISOString(),
      }
    ];

    sampleOrders.forEach(o => this.orders.set(o.id, o));
  }

  private seedInitialAuditLogs() {
    this.auditLogs = [
      {
        id: 'log_seed_1',
        timestamp: new Date(Date.now() - 3600000 * 4 - 300000).toISOString(),
        sessionId: 'session_demo_prev1',
        actor: 'agent',
        action: 'tool_call',
        toolName: 'search_products',
        inputParameters: { query: 'gaming headphones', maxPrice: 3000 },
        outputResult: { count: 3, topResult: 'Razer BlackShark V2 X' },
        serverValidationStatus: 'passed',
        details: 'Agent queried product catalog for competitive gaming headsets < ₹3000',
      },
      {
        id: 'log_seed_2',
        timestamp: new Date(Date.now() - 3600000 * 4 - 240000).toISOString(),
        sessionId: 'session_demo_prev1',
        actor: 'agent',
        action: 'tool_call',
        toolName: 'add_to_cart',
        inputParameters: { productId: 'hp-razer-v2x', quantity: 1 },
        outputResult: { success: true, item: 'Razer BlackShark V2 X', price: 2999 },
        serverValidationStatus: 'passed',
        details: 'Server verified price ₹2999 from product catalog before cart mutation',
      },
      {
        id: 'log_seed_3',
        timestamp: new Date(Date.now() - 3600000 * 4 - 180000).toISOString(),
        sessionId: 'session_demo_prev1',
        actor: 'agent',
        action: 'tool_call',
        toolName: 'add_to_cart',
        inputParameters: { productId: 'acc-rgb-stand', quantity: 1, isUpsell: true },
        outputResult: { success: true, item: 'Aura RGB Stand', price: 699, isUpsell: true },
        serverValidationStatus: 'passed',
        details: 'AI upsell conversion: Headphone stand added to cart',
      },
      {
        id: 'log_seed_4',
        timestamp: new Date(Date.now() - 3600000 * 4 - 120000).toISOString(),
        sessionId: 'session_demo_prev1',
        actor: 'system',
        action: 'payment_order_created',
        toolName: 'create_payment_order',
        inputParameters: { sessionId: 'session_demo_prev1' },
        outputResult: { razorpayOrderId: 'order_RZP_DEMO_01', amountInPaise: 369800 },
        serverValidationStatus: 'passed',
        details: 'Server recalculated cart total ₹3698 and created verified Razorpay Order',
      }
    ];
  }

  // --- PRODUCTS ---
  public getProducts(filter?: { query?: string; category?: string; brand?: string; maxPrice?: number; inStockOnly?: boolean }): Product[] {
    let list = Array.from(this.products.values());

    if (filter?.category && filter.category !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
    }

    if (filter?.brand && filter.brand !== 'all') {
      list = list.filter(p => (p.brand || '').toLowerCase() === filter.brand!.toLowerCase());
    }

    if (filter?.maxPrice) {
      list = list.filter(p => p.price <= filter.maxPrice!);
    }

    if (filter?.inStockOnly) {
      list = list.filter(p => p.inStock && p.inventoryCount > 0);
    }

    if (filter?.query) {
      const q = filter.query.toLowerCase().trim();
      const terms = q.split(/\s+/).filter(t => t.length > 2);

      const isAccessoryQuery = q.includes('accessor') || q.includes('stand') || q.includes('cable') || q.includes('splitter');
      const isWirelessQuery = q.includes('wireless') || q.includes('bluetooth');
      const isKeyboardQuery = q.includes('keyboard') || q.includes('mechanical');
      const isAudioQuery = (q.includes('headphone') || q.includes('headset')) && !isAccessoryQuery;

      const scored = list.map(p => {
        let score = 0;
        const nameLower = p.name.toLowerCase();
        const descLower = p.description.toLowerCase();
        const catLower = p.category.toLowerCase();
        const tagsJoined = p.tags.join(' ').toLowerCase();
        const fullText = `${nameLower} ${descLower} ${catLower} ${tagsJoined}`;

        if (nameLower.includes(q)) score += 100;
        if (fullText.includes(q)) score += 50;

        terms.forEach(t => {
          if (nameLower.includes(t)) score += 30;
          if (catLower.includes(t)) score += 25;
          if (tagsJoined.includes(t)) score += 20;
          if (descLower.includes(t)) score += 10;
        });

        // Decisive intent modifiers
        if (isAccessoryQuery) {
          if (p.category === 'accessories' || p.category === 'peripherals') {
            score += 300;
          } else {
            score -= 150;
          }
        }

        if (isWirelessQuery) {
          if (tagsJoined.includes('wireless') || tagsJoined.includes('bluetooth') || nameLower.includes('wireless')) {
            score += 200;
          } else {
            score -= 100;
          }
        }

        if (isKeyboardQuery) {
          if (p.category === 'keyboards') {
            score += 300;
          } else {
            score -= 150;
          }
        }

        if (isAudioQuery && (p.category === 'gaming' || p.category === 'audio')) {
          score += 100;
        }

        return { product: p, score };
      });

      list = scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.product);
    }

    return list;
  }

  public getProductById(id: string): Product | undefined {
    return this.products.get(id);
  }

  public checkInventory(productId: string): { inStock: boolean; count: number } {
    const p = this.products.get(productId);
    if (!p) return { inStock: false, count: 0 };
    return { inStock: p.inStock && p.inventoryCount > 0, count: p.inventoryCount };
  }

  // --- CART OPERATIONS (Strictly Server-Side Price Authority) ---
  public getCart(sessionId: string): Cart {
    let cart = this.carts.get(sessionId);
    if (!cart) {
      cart = {
        id: `cart_${sessionId}`,
        sessionId,
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
      };
      this.carts.set(sessionId, cart);
    }
    return cart;
  }

  public addToCart(
    sessionId: string,
    productId: string,
    quantity = 1,
    isUpsell = false,
    addedViaAi = true
  ): { cart: Cart; addedItem: CartItem } {
    const product = this.products.get(productId);
    if (!product) {
      throw new Error(`Product not found: ${productId}`);
    }

    if (product.inventoryCount < quantity) {
      throw new Error(`Insufficient inventory for ${product.name}. Available: ${product.inventoryCount}`);
    }

    const cart = this.getCart(sessionId);
    const existingIndex = cart.items.findIndex(item => item.productId === productId);

    // Strictly server-catalog price
    const unitPrice = product.price;

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
      cart.items[existingIndex].subtotal = cart.items[existingIndex].quantity * unitPrice;
    } else {
      cart.items.push({
        productId,
        product,
        quantity,
        unitPrice,
        subtotal: unitPrice * quantity,
        addedViaAi,
        isUpsell,
      });
    }

    this.recalculateCartTotals(cart);
    return {
      cart,
      addedItem: cart.items.find(i => i.productId === productId)!
    };
  }

  public removeFromCart(sessionId: string, productId: string): Cart {
    const cart = this.getCart(sessionId);
    cart.items = cart.items.filter(item => item.productId !== productId);
    this.recalculateCartTotals(cart);
    return cart;
  }

  public updateQuantity(sessionId: string, productId: string, quantity: number): Cart {
    const cart = this.getCart(sessionId);
    if (quantity <= 0) {
      return this.removeFromCart(sessionId, productId);
    }

    const item = cart.items.find(i => i.productId === productId);
    if (item) {
      const product = this.products.get(productId);
      if (product && product.inventoryCount < quantity) {
        throw new Error(`Only ${product.inventoryCount} units available for ${product.name}`);
      }
      item.quantity = quantity;
      item.subtotal = item.unitPrice * quantity;
      this.recalculateCartTotals(cart);
    }
    return cart;
  }

  public applyPromoCode(sessionId: string, code: string): { cart: Cart; discountAmount: number; message: string } {
    const cart = this.getCart(sessionId);
    const normalized = (code || '').trim().toUpperCase();

    if (normalized === 'SHOPMATE10') {
      const discountAmount = Math.round(cart.subtotal * 0.1);
      cart.discount = discountAmount;
      cart.total = Math.max(0, cart.subtotal - discountAmount + cart.tax);
      cart.updatedAt = new Date().toISOString();
      return {
        cart,
        discountAmount,
        message: 'Promo code SHOPMATE10 applied! 10% instant discount applied to your order.',
      };
    }

    throw new Error('Invalid promo code. Try SHOPMATE10 for 10% off.');
  }

  public clearCart(sessionId: string): void {
    const cart = this.getCart(sessionId);
    cart.items = [];
    this.recalculateCartTotals(cart);
  }

  public setConfirmationStatus(sessionId: string, confirmed: boolean): Cart {
    const cart = this.getCart(sessionId);
    cart.confirmedByUser = confirmed;
    cart.requiresConfirmation = !confirmed;
    return cart;
  }

  private recalculateCartTotals(cart: Cart) {
    let subtotal = 0;
    let itemCount = 0;

    cart.items.forEach(item => {
      // Re-verify against live catalog in case prices changed
      const liveProduct = this.products.get(item.productId);
      if (liveProduct) {
        item.unitPrice = liveProduct.price;
        item.subtotal = item.quantity * liveProduct.price;
      }
      subtotal += item.subtotal;
      itemCount += item.quantity;
    });

    cart.subtotal = subtotal;
    cart.tax = 0; // standard inclusive tax
    cart.discount = 0;
    cart.total = Math.max(0, subtotal - cart.discount + cart.tax);
    cart.itemCount = itemCount;
    cart.updatedAt = new Date().toISOString();
  }

  // --- ORDERS ---
  public createOrder(order: Order): Order {
    this.orders.set(order.id, order);
    return order;
  }

  public getOrder(orderId: string): Order | undefined {
    return this.orders.get(orderId);
  }

  public getOrderByRazorpayId(rzpOrderId: string): Order | undefined {
    return Array.from(this.orders.values()).find(o => o.razorpayOrderId === rzpOrderId);
  }

  public markOrderPaid(
    orderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Order {
    const order = this.orders.get(orderId);
    if (!order) throw new Error(`Order ${orderId} not found`);

    order.status = 'paid';
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paidAt = new Date().toISOString();

    // Deduct inventory
    order.items.forEach(item => {
      const p = this.products.get(item.productId);
      if (p) {
        p.inventoryCount = Math.max(0, p.inventoryCount - item.quantity);
        if (p.inventoryCount === 0) p.inStock = false;
      }
    });

    return order;
  }

  public getAllOrders(): Order[] {
    return Array.from(this.orders.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  // --- AUDIT LOGS ---
  public logAudit(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const fullLog: AuditLog = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    this.auditLogs.unshift(fullLog);
    return fullLog;
  }

  public getAuditLogs(limit = 50, sessionId?: string): AuditLog[] {
    let logs = this.auditLogs;
    if (sessionId) {
      logs = logs.filter(l => l.sessionId === sessionId);
    }
    return logs.slice(0, limit);
  }

  // --- MERCHANT METRICS ---
  public getMerchantMetrics(): MerchantMetrics {
    const orders = Array.from(this.orders.values()).filter(o => o.status === 'paid');
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const aiOrders = orders.filter(o => o.isAiAssisted);
    const aiAssistedRevenue = aiOrders.reduce((sum, o) => sum + o.total, 0);
    const upsellRevenue = orders.reduce((sum, o) => sum + (o.upsellRevenue || 0), 0);
    const totalOrders = orders.length;
    const aiOrdersCount = aiOrders.length;

    // Estimate sessions from active carts and orders
    const totalSessions = Math.max(this.carts.size + 12, totalOrders + 15);
    const conversionRate = totalSessions > 0 ? (totalOrders / totalSessions) * 100 : 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const aiRevenuePercentage = totalRevenue > 0 ? (aiAssistedRevenue / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      aiAssistedRevenue,
      aiRevenuePercentage: Math.round(aiRevenuePercentage * 10) / 10,
      totalOrders,
      aiOrdersCount,
      conversionRate: Math.round(conversionRate * 10) / 10,
      averageOrderValue: Math.round(averageOrderValue),
      upsellRevenue,
      totalAiInteractions: this.auditLogs.length + 28,
    };
  }
}

// Global singleton instance across Next.js dev hot-reloads
const globalForStore = globalThis as unknown as { mockStoreInstance?: MockStore };

export const store = globalForStore.mockStoreInstance ?? new MockStore();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.mockStoreInstance = store;
}
