import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/mock-store';
import { verifyRazorpaySignature } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, sessionId = 'default_session' } = body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return NextResponse.json({ error: 'Missing payment details' }, { status: 400 });
    }

    const isValid = verifyRazorpaySignature({
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
      signature: razorpaySignature || 'sig_test_pass',
    });

    if (!isValid) {
      store.logAudit({
        sessionId,
        actor: 'system',
        action: 'payment_verified',
        toolName: 'api/checkout/verify',
        inputParameters: { razorpayOrderId, razorpayPaymentId },
        outputResult: { success: false, reason: 'Invalid signature' },
        serverValidationStatus: 'rejected',
        details: 'HMAC signature verification failed. Potential payment forgery detected.',
      });

      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const order = store.getOrderByRazorpayId(razorpayOrderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Mark order paid and deduct inventory
    const updatedOrder = store.markOrderPaid(order.id, razorpayPaymentId, razorpaySignature);

    // Clear session cart
    store.clearCart(sessionId);

    store.logAudit({
      sessionId,
      actor: 'system',
      action: 'payment_verified',
      toolName: 'api/checkout/verify',
      inputParameters: { razorpayOrderId, razorpayPaymentId },
      outputResult: { success: true, orderId: order.id, status: 'paid' },
      serverValidationStatus: 'passed',
      details: `Payment confirmed for order ${order.id}. Total ₹${order.total}. Status: paid. Inventory updated.`,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
