import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/mock-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || undefined;
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const maxPriceStr = searchParams.get('maxPrice');
    const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : undefined;

    const products = store.getProducts({ query, category, brand, maxPrice, inStockOnly: false });

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
