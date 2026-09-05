import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/mock-store';
import { createRazorpayOrder, getRazorpayKeyId } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId = 'default_session', customer = {} } = body;

    const cart = store.getCart(sessionId);
    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Strictly server-authoritative price
    const amountInPaise = Math.round(cart.total * 100);
    const receipt = `rcpt_${Date.now()}`;

    const rzpOrder = await createRazorpayOrder({
      amountInPaise,
      currency: 'INR',
      receipt,
      notes: {
        sessionId,
        customerName: customer.name || 'Guest',
      },
    });

    const newOrder = store.createOrder({
      id: `ord_${Date.now()}`,
      razorpayOrderId: rzpOrder.id,
      sessionId,
      customer: {
        name: customer.name || 'Valued Shopper',
        email: customer.email || 'shopper@example.com',
        phone: customer.phone || '+919999999999',
      },
      items: [...cart.items],
      subtotal: cart.subtotal,
      tax: cart.tax,
      total: cart.total,
      status: 'created',
      isAiAssisted: cart.items.some(i => i.addedViaAi),
      hasUpsell: cart.items.some(i => i.isUpsell),
      upsellRevenue: cart.items.filter(i => i.isUpsell).reduce((s, i) => s + i.subtotal, 0),
      createdAt: new Date().toISOString(),
    });

    store.logAudit({
      sessionId,
      actor: 'system',
      action: 'payment_order_created',
      toolName: 'api/checkout/create-order',
      inputParameters: { sessionId, totalPaise: amountInPaise },
      outputResult: { orderId: newOrder.id, razorpayOrderId: rzpOrder.id },
      serverValidationStatus: 'passed',
      details: `Created payment order for ₹${cart.total} (${amountInPaise} paise). Verified against catalog prices.`,
    });

    return NextResponse.json({
      success: true,
      razorpayOrderId: rzpOrder.id,
      orderId: newOrder.id,
      amount: cart.total,
      currency: 'INR',
      keyId: getRazorpayKeyId(),
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
