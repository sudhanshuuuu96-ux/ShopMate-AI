import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/mock-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const sessionId = searchParams.get('sessionId') || undefined;

    const logs = store.getAuditLogs(limit, sessionId);

    return NextResponse.json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
