import { NextRequest, NextResponse } from 'next/server';
import { getWalletStandings } from '@/lib/aggregate';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { wallet: string } }
) {
  try {
    const { wallet } = params;

    const balanceRows = await sql`
      SELECT weight FROM wallet_balances WHERE wallet = ${wallet} LIMIT 1
    `;
    const liveWeight = balanceRows[0]?.weight?.toString() || '0';

    const standings = await getWalletStandings(wallet);

    if (standings.length === 0) {
      return NextResponse.json({
        wallet,
        live_weight: liveWeight,
        picks_in_xi: 0,
        picks: [],
      });
    }

    const playerIds = standings.map(s => s.player_id);
    const playerRows = await sql`
      SELECT id, name, nationality_code, photo_url FROM players WHERE id = ANY(${playerIds}::uuid[])
    `;

    const playerMap = new Map(
      (playerRows || []).map((p: Record<string, unknown>) => [p.id, p])
    );

    const picksInXI = standings.filter(s => s.is_slot_winner).length;

    const picks = standings.map(s => {
      const player = playerMap.get(s.player_id);
      return {
        slot: s.slot,
        player: {
          id: s.player_id,
          name: player?.name || s.player_name,
          nationality_code: player?.nationality_code || '',
          photo_url: player?.photo_url || null,
        },
        slot_total_weight: s.gap_to_first === '0'
          ? (BigInt(liveWeight) > BigInt(0) ? s.gap_to_next : '0')
          : '0',
        rank: s.rank,
        is_slot_winner: s.is_slot_winner,
        gap_to_first: s.gap_to_first,
        gap_to_next: s.gap_to_next,
      };
    });

    return NextResponse.json({
      wallet,
      live_weight: liveWeight,
      picks_in_xi: picksInXI,
      picks,
    });
  } catch (error) {
    console.error('Error fetching wallet standings:', error);
    return NextResponse.json({ error: 'Failed to fetch standings' }, { status: 500 });
  }
}
