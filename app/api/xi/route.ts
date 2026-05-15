import { NextResponse } from 'next/server';
import { getFullXI } from '@/lib/aggregate';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const xi = await getFullXI();
    return NextResponse.json(xi);
  } catch (error) {
    console.error('Error fetching XI:', error);
    return NextResponse.json({ error: 'Failed to fetch XI' }, { status: 500 });
  }
}
