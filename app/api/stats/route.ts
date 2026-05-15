import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const voterCountRows = await sql`SELECT COUNT(*) AS count FROM wallet_balances WHERE weight != '0' AND weight != ''`;
    const weightRows = await sql`SELECT weight FROM wallet_balances WHERE weight != '0' AND weight != ''`;
    const totalVoterRows = await sql`SELECT COUNT(DISTINCT wallet) AS count FROM votes`;
    const leaderboardData = await sql`SELECT wallet, weight FROM wallet_balances WHERE weight != '0' AND weight != '' ORDER BY length(weight) DESC, weight DESC LIMIT 50`;

    const voterCount = parseInt(voterCountRows[0]?.count || '0');

    const totalWeight = (weightRows || [])
      .reduce((sum: bigint, row: Record<string, string>) => sum + BigInt(row.weight || 0), BigInt(0))
      .toString();

    const totalVoters = parseInt(totalVoterRows[0]?.count || '0');

    const leaderboard = (leaderboardData || []).map((row: Record<string, string>) => ({
      wallet: row.wallet,
      weight: row.weight,
    }));

    return NextResponse.json({
      voters: voterCount,
      total_weight: totalWeight,
      total_voters: totalVoters,
      leaderboard,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
