import { Product, Cart } from './store';

export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface UIWidget {
  type: 'product_recommendation' | 'upsell_suggestion' | 'cart_summary' | 'confirmation_prompt' | 'payment_ready';
  data: {
    products?: Product[];
    product?: Product;
    upsellProduct?: Product;
    cart?: Cart;
    recommendationReason?: string;
    totalAmount?: number;
    razorpayOrderId?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  toolCalls?: Array<{
    name: string;
    args: Record<string, any>;
    result?: Record<string, any>;
  }>;
  widgets?: UIWidget[];
}

export interface AgentChatResponse {
  message: string;
  messages: ChatMessage[];
  widgets?: UIWidget[];
  cart?: Cart;
  requiresPayment?: boolean;
  paymentOrder?: {
    razorpayOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
  };
}
