import { NextRequest, NextResponse } from 'next/server';
import { getTokenBalance } from '@/lib/solana';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    const mint = process.env.NEXT_PUBLIC_XI_TOKEN_MINT;
    if (!mint) {
      return NextResponse.json({ error: 'Token mint not configured' }, { status: 500 });
    }

    if (process.env.ALLOW_TEST_VOTES === 'true' && process.env.NODE_ENV !== 'production') {
      const { sql } = await import('@/lib/db');
      const rows = await sql`SELECT weight FROM wallet_balances WHERE wallet = ${params.wallet} LIMIT 1`;
      if (rows[0]) {
        return NextResponse.json({ balance: rows[0].weight.toString() });
      }
      return NextResponse.json({ balance: '1000' });
    }

    const balance = await getTokenBalance(params.wallet, mint);
    return NextResponse.json({ balance });
  } catch (error) {
    console.error('Balance fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch balance' }, { status: 500 });
  }
}
