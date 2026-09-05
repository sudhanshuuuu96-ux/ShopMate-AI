import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/mock-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId') || 'default_session';

    const cart = store.getCart(sessionId);
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId = 'default_session', productId, quantity = 1, isUpsell = false } = body;

    if (action === 'add') {
      const { cart } = store.addToCart(sessionId, productId, quantity, isUpsell, false);
      return NextResponse.json({ success: true, cart });
    }

    if (action === 'remove') {
      const cart = store.removeFromCart(sessionId, productId);
      return NextResponse.json({ success: true, cart });
    }

    if (action === 'update_quantity') {
      const cart = store.updateQuantity(sessionId, productId, Number(quantity));
      return NextResponse.json({ success: true, cart });
    }

    if (action === 'apply_promo') {
      const result = store.applyPromoCode(sessionId, body.code || '');
      return NextResponse.json({ success: true, ...result });
    }

    if (action === 'clear') {
      store.clearCart(sessionId);
      const cart = store.getCart(sessionId);
      return NextResponse.json({ success: true, cart });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
