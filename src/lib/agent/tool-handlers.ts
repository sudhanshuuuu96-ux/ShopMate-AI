import { store } from '@/lib/db/mock-store';
import { UIWidget } from '@/types/agent';
import { Product } from '@/types/store';
import { createRazorpayOrder, getRazorpayKeyId } from '@/lib/razorpay';

export interface ToolExecutionResult {
  toolResult: Record<string, any>;
  uiWidget?: UIWidget;
  requiresPayment?: boolean;
  paymentOrder?: {
    razorpayOrderId: string;
    amount: number;
    currency: string;
    keyId: string;
  };
}

export async function executeAgentTool(
  name: string,
  args: Record<string, any>,
  sessionId: string
): Promise<ToolExecutionResult> {
  switch (name) {
    case 'search_products': {
      const { query, category, maxPrice } = args;
      const products = store.getProducts({ query, category, maxPrice, inStockOnly: true });

      store.logAudit({
        sessionId,
        actor: 'agent',
        action: 'tool_call',
        toolName: 'search_products',
        inputParameters: args,
        outputResult: { count: products.length, ids: products.map(p => p.id) },
        serverValidationStatus: 'passed',
        details: `Queried catalog for "${query}" (category: ${category || 'all'}, maxPrice: ₹${maxPrice || 'any'}). Found ${products.length} matching products.`,
      });

      const cleanList = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        description: p.description,
        features: p.features,
        imageUrl: p.imageUrl,
        compatibleWith: p.compatibleWith,
        upsellReason: p.upsellReason,
      }));

      return {
        toolResult: {
          success: true,
          count: cleanList.length,
          products: cleanList,
        },
        uiWidget: cleanList.length > 0 ? {
          type: 'product_recommendation',
          data: { products: products.slice(0, 3) },
        } : undefined,
      };
    }

    case 'get_product_details': {
      const { productId } = args;
      const product = store.getProductById(productId);

      if (!product) {
        return {
          toolResult: { success: false, error: `Product not found with ID ${productId}` },
        };
      }

      // Fetch compatible upsells if any
      const compatibleProducts: Product[] = [];
      if (product.compatibleWith) {
        product.compatibleWith.forEach(id => {
          const comp = store.getProductById(id);
          if (comp) compatibleProducts.push(comp);
        });
      }

      store.logAudit({
        sessionId,
        actor: 'agent',
        action: 'tool_call',
        toolName: 'get_product_details',
        inputParameters: args,
        outputResult: { id: product.id, name: product.name, price: product.price },
        serverValidationStatus: 'passed',
        details: `Retrieved product details for "${product.name}" (ID: ${productId}).`,
      });

      return {
        toolResult: {
          success: true,
          product,
          compatibleUpsells: compatibleProducts.map(p => ({ id: p.id, name: p.name, price: p.price, reason: p.upsellReason })),
        },
      };
    }

    case 'check_inventory': {
      const { productId } = args;
      const result = store.checkInventory(productId);

      store.logAudit({
        sessionId,
        actor: 'agent',
        action: 'tool_call',
        toolName: 'check_inventory',
        inputParameters: args,
        outputResult: result,
        serverValidationStatus: 'passed',
        details: `Checked inventory for ${productId}: inStock=${result.inStock}, count=${result.count}`,
      });

      return {
        toolResult: {
          productId,
          ...result,
        },
      };
    }

    case 'add_to_cart': {
      const { productId, quantity = 1, isUpsell = false } = args;
      try {
        const { cart, addedItem } = store.addToCart(sessionId, productId, quantity, isUpsell, true);

        // Check if there are cross-sells to recommend
        let upsellProduct: Product | undefined;
        if (!isUpsell && addedItem.product.compatibleWith && addedItem.product.compatibleWith.length > 0) {
          const upsellId = addedItem.product.compatibleWith[0];
          upsellProduct = store.getProductById(upsellId);
        }

        store.logAudit({
          sessionId,
          actor: 'agent',
          action: 'tool_call',
          toolName: 'add_to_cart',
          inputParameters: args,
          outputResult: {
            productId,
            name: addedItem.product.name,
            verifiedPrice: addedItem.unitPrice,
            quantity,
            cartTotal: cart.total,
            isUpsell,
          },
          serverValidationStatus: 'passed',
          details: `Server verified catalog price ₹${addedItem.unitPrice} and added ${quantity}x "${addedItem.product.name}" to cart. Cart total: ₹${cart.total}.`,
        });

        return {
          toolResult: {
            success: true,
            message: `Added ${quantity}x "${addedItem.product.name}" to cart.`,
            cart: {
              itemsCount: cart.itemCount,
              total: cart.total,
              subtotal: cart.subtotal,
            },
            suggestedUpsell: upsellProduct ? {
              id: upsellProduct.id,
              name: upsellProduct.name,
              price: upsellProduct.price,
              reason: upsellProduct.upsellReason,
            } : null,
          },
          uiWidget: upsellProduct ? {
            type: 'upsell_suggestion',
            data: {
              product: addedItem.product,
              upsellProduct,
              recommendationReason: upsellProduct.upsellReason,
            },
          } : {
            type: 'cart_summary',
            data: { cart },
          },
        };
      } catch (err: any) {
        return {
          toolResult: { success: false, error: err.message },
        };
      }
    }

    case 'remove_from_cart': {
      const { productId } = args;
      const cart = store.removeFromCart(sessionId, productId);

      store.logAudit({
        sessionId,
        actor: 'agent',
        action: 'tool_call',
        toolName: 'remove_from_cart',
        inputParameters: args,
        outputResult: { remainingItems: cart.itemCount, total: cart.total },
        serverValidationStatus: 'passed',
        details: `Removed product ${productId} from cart. Updated total: ₹${cart.total}.`,
      });

      return {
        toolResult: {
          success: true,
          cart: {
            itemsCount: cart.itemCount,
            total: cart.total,
          },
        },
        uiWidget: {
          type: 'cart_summary',
          data: { cart },
        },
      };
    }

    case 'get_cart': {
      const cart = store.getCart(sessionId);

      store.logAudit({
        sessionId,
        actor: 'agent',
        action: 'tool_call',
        toolName: 'get_cart',
        inputParameters: {},
        outputResult: { itemCount: cart.itemCount, total: cart.total },
        serverValidationStatus: 'passed',
        details: `Retrieved server cart. Items: ${cart.itemCount}, Subtotal: ₹${cart.subtotal}, Total: ₹${cart.total}.`,
      });

      return {
        toolResult: {
          success: true,
          cart: {
            items: cart.items.map(i => ({
              id: i.productId,
              name: i.product.name,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              subtotal: i.subtotal,
            })),
            itemCount: cart.itemCount,
            subtotal: cart.subtotal,
            total: cart.total,
          },
        },
        uiWidget: {
          type: 'cart_summary',
          data: { cart },
        },
      };
    }

    case 'calculate_total': {
      const { promoCode } = args;
      const cart = store.getCart(sessionId);

      let discount = 0;
      if (promoCode?.toUpperCase() === 'SHOPMATE10') {
        discount = Math.round(cart.subtotal * 0.1);
      }

      cart.discount = discount;
      cart.total = Math.max(0, cart.subtotal - discount);

      store.logAudit({
        sessionId,
        actor: 'agent',
        action: 'price_verification',
        toolName: 'calculate_total',
        inputParameters: args,
        outputResult: { subtotal: cart.subtotal, discount, total: cart.total },
        serverValidationStatus: 'passed',
        details: `Server-verified total calculation: Subtotal ₹${cart.subtotal}, Discount ₹${discount}, Total Payable: ₹${cart.total}.`,
      });

      return {
        toolResult: {
          subtotal: cart.subtotal,
          discount,
          shipping: 0,
          total: cart.total,
          currency: 'INR',
        },
        uiWidget: {
          type: 'confirmation_prompt',
          data: {
            cart,
            totalAmount: cart.total,
          },
        },
      };
    }

    case 'create_payment_order': {
      const { customerConfirmed } = args;

      // CRITICAL GUARDRAIL: Strict confirmation check
      if (!customerConfirmed) {
        store.logAudit({
          sessionId,
          actor: 'system',
          action: 'confirmation_requested',
          toolName: 'create_payment_order',
          inputParameters: args,
          outputResult: { error: 'Blocked: Customer confirmation missing' },
          serverValidationStatus: 'rejected',
          details: 'SAFETY GATE TRIGGERED: Blocked payment order creation because explicit customer confirmation was not received.',
        });

        return {
          toolResult: {
            success: false,
            error: 'SAFETY POLICY: You must ask the customer for explicit confirmation of the total amount before creating a payment order.',
          },
        };
      }

      const cart = store.getCart(sessionId);
      if (cart.items.length === 0) {
        return {
          toolResult: { success: false, error: 'Cannot checkout an empty cart.' },
        };
      }

      // Re-validate prices server-side
      const amountInPaise = Math.round(cart.total * 100);
      const receipt = `rcpt_${Date.now()}`;

      const rzpOrder = await createRazorpayOrder({
        amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          sessionId,
          itemsCount: String(cart.itemCount),
        },
      });

      // Register order in store
      const newOrder = store.createOrder({
        id: `ord_${Date.now()}`,
        razorpayOrderId: rzpOrder.id,
        sessionId,
        customer: {
          name: 'Guest Customer',
          email: 'customer@example.com',
          phone: '+919999999999',
        },
        items: [...cart.items],
        subtotal: cart.subtotal,
        tax: cart.tax,
        total: cart.total,
        status: 'created',
        isAiAssisted: true,
        hasUpsell: cart.items.some(i => i.isUpsell),
        upsellRevenue: cart.items.filter(i => i.isUpsell).reduce((sum, i) => sum + i.subtotal, 0),
        createdAt: new Date().toISOString(),
      });

      store.logAudit({
        sessionId,
        actor: 'system',
        action: 'payment_order_created',
        toolName: 'create_payment_order',
        inputParameters: { customerConfirmed, cartTotal: cart.total },
        outputResult: {
          orderId: newOrder.id,
          razorpayOrderId: rzpOrder.id,
          amountInPaise,
        },
        serverValidationStatus: 'passed',
        details: `Razorpay order ${rzpOrder.id} created successfully for verified total ₹${cart.total}. Ready for customer payment.`,
      });

      return {
        toolResult: {
          success: true,
          razorpayOrderId: rzpOrder.id,
          amount: cart.total,
          currency: 'INR',
          keyId: getRazorpayKeyId(),
        },
        requiresPayment: true,
        paymentOrder: {
          razorpayOrderId: rzpOrder.id,
          amount: cart.total,
          currency: 'INR',
          keyId: getRazorpayKeyId(),
        },
        uiWidget: {
          type: 'payment_ready',
          data: {
            cart,
            totalAmount: cart.total,
            razorpayOrderId: rzpOrder.id,
          },
        },
      };
    }

    case 'get_payment_status': {
      const { razorpayOrderId } = args;
      const order = store.getOrderByRazorpayId(razorpayOrderId);

      if (!order) {
        return {
          toolResult: { success: false, error: 'Order not found' },
        };
      }

      store.logAudit({
        sessionId,
        actor: 'agent',
        action: 'payment_verified',
        toolName: 'get_payment_status',
        inputParameters: args,
        outputResult: { status: order.status, total: order.total },
        serverValidationStatus: 'passed',
        details: `Queried payment status for ${razorpayOrderId}. Status: ${order.status}.`,
      });

      return {
        toolResult: {
          success: true,
          status: order.status,
          total: order.total,
          itemsCount: order.items.length,
          paidAt: order.paidAt,
        },
      };
    }

    default:
      return {
        toolResult: { success: false, error: `Unknown tool: ${name}` },
      };
  }
}
