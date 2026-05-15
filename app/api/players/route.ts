import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const slot = request.nextUrl.searchParams.get('slot');

  let players;
  if (slot) {
    players = await sql`
      SELECT * FROM players WHERE active = true AND ${slot} = ANY(eligible_slots) ORDER BY name
    `;
  } else {
    players = await sql`SELECT * FROM players WHERE active = true ORDER BY name`;
  }

  return NextResponse.json({ players });
}
