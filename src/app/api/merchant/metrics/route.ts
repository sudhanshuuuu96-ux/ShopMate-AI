import { NextResponse } from 'next/server';
import { store } from '@/lib/db/mock-store';

export async function GET() {
  try {
    const metrics = store.getMerchantMetrics();
    const recentOrders = store.getAllOrders().slice(0, 10);

    return NextResponse.json({
      success: true,
      metrics,
      recentOrders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
