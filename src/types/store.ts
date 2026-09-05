export type ProductCategory = 'audio' | 'gaming' | 'keyboards' | 'accessories' | 'peripherals' | 'monitors' | 'streaming' | 'controllers';

export interface ProductColor {
  name: string;
  hex: string;
  imageUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  brand?: string;
  badge?: string;
  price: number;              // In INR (e.g., 2499)
  originalPrice?: number;     // e.g., 3999
  rating: number;             // e.g., 4.6
  reviewsCount: number;
  inStock: boolean;
  inventoryCount: number;
  tags: string[];             // e.g. ['gaming', 'headphones', 'under-3000', 'rgb']
  description: string;
  features: string[];
  imageUrl: string;
  colors?: ProductColor[];
  specs?: Record<string, string>;
  warranty?: string;
  compatibleWith?: string[];  // Product IDs for upsell/cross-sell
  upsellReason?: string;      // AI pitch when recommending as upsell
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  addedViaAi: boolean;
  isUpsell: boolean;
}

export interface Cart {
  id: string;
  sessionId: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  currency: 'INR';
  requiresConfirmation: boolean;
  confirmedByUser: boolean;
  updatedAt: string;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  id: string;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  sessionId: string;
  customer: OrderCustomer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: 'created' | 'paid' | 'failed';
  isAiAssisted: boolean;
  hasUpsell: boolean;
  upsellRevenue: number;
  createdAt: string;
  paidAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  sessionId: string;
  actor: 'agent' | 'system' | 'customer';
  action: 'tool_call' | 'price_verification' | 'confirmation_requested' | 'payment_order_created' | 'payment_verified';
  toolName?: string;
  inputParameters?: Record<string, any>;
  outputResult?: Record<string, any>;
  serverValidationStatus: 'passed' | 'warning' | 'rejected';
  details: string;
}

export interface MerchantMetrics {
  totalRevenue: number;
  aiAssistedRevenue: number;
  aiRevenuePercentage: number;
  totalOrders: number;
  aiOrdersCount: number;
  conversionRate: number;
  averageOrderValue: number;
  upsellRevenue: number;
  totalAiInteractions: number;
}
