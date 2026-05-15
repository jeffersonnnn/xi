import { sql } from './db';
import { SLOTS, type SlotCode } from './constants';

export { SLOTS };

export type SlotRanking = {
  player_id: string;
  name: string;
  nationality_code: string;
  photo_url: string | null;
  club: string | null;
  total_weight: string;
  voter_count: number;
  rank: number;
};

export async function getSlotRankings(
  slot: string,
  limit = 5,
): Promise<SlotRanking[]> {
  const votes = await sql`
    SELECT v.player_id, v.wallet, v.voted_at,
           p.name, p.nationality_code, p.photo_url, p.club
    FROM votes v
    INNER JOIN players p ON p.id = v.player_id
    WHERE v.slot = ${slot}
  `;

  if (!votes || votes.length === 0) return [];

  const balances = await sql`
    SELECT wallet, weight FROM wallet_balances WHERE weight != '0' AND weight != ''
  `;

  if (!balances) return [];

  const balanceMap = new Map<string, string>(
    balances.map((b) => [b.wallet, b.weight]),
  );

  const playerAgg = new Map<
    string,
    {
      name: string;
      nationality_code: string;
      photo_url: string | null;
      club: string | null;
      total_weight: bigint;
      voter_count: number;
      earliest_vote: string;
    }
  >();

  for (const vote of votes) {
    const weight = balanceMap.get(vote.wallet);
    if (!weight || BigInt(weight) <= BigInt(0)) continue;

    const existing = playerAgg.get(vote.player_id);
    if (existing) {
      existing.total_weight += BigInt(weight);
      existing.voter_count += 1;
      if (vote.voted_at < existing.earliest_vote) {
        existing.earliest_vote = vote.voted_at;
      }
    } else {
      playerAgg.set(vote.player_id, {
        name: vote.name,
        nationality_code: vote.nationality_code,
        photo_url: vote.photo_url,
        club: vote.club,
        total_weight: BigInt(weight),
        voter_count: 1,
        earliest_vote: vote.voted_at,
      });
    }
  }

  const sorted = Array.from(playerAgg.entries()).sort((a, b) => {
    const weightDiff = b[1].total_weight - a[1].total_weight;
    if (weightDiff !== BigInt(0)) return weightDiff > BigInt(0) ? 1 : -1;
    return a[1].earliest_vote.localeCompare(b[1].earliest_vote);
  });

  return sorted.slice(0, limit).map(([player_id, agg], index) => ({
    player_id,
    name: agg.name,
    nationality_code: agg.nationality_code,
    photo_url: agg.photo_url,
    club: agg.club,
    total_weight: agg.total_weight.toString(),
    voter_count: agg.voter_count,
    rank: index + 1,
  }));
}

export async function getFullXI(): Promise<
  Record<string, { winner: SlotRanking | null; runners_up: SlotRanking[] }>
> {
  const results: Record<
    string,
    { winner: SlotRanking | null; runners_up: SlotRanking[] }
  > = {};

  const rankings = await Promise.all(
    SLOTS.map((slot) => getSlotRankings(slot)),
  );

  for (let i = 0; i < SLOTS.length; i++) {
    const slot = SLOTS[i];
    const ranked = rankings[i];
    results[slot] = {
      winner: ranked.length > 0 ? ranked[0] : null,
      runners_up: ranked.slice(1),
    };
  }

  return results;
}

export type WalletStanding = {
  slot: SlotCode;
  player_id: string;
  player_name: string;
  rank: number;
  is_slot_winner: boolean;
  gap_to_first: string;
  gap_to_next: string;
};

export async function getWalletStandings(
  wallet: string,
): Promise<WalletStanding[]> {
  const walletVotes = await sql`
    SELECT v.slot, v.player_id, p.name AS player_name
    FROM votes v
    INNER JOIN players p ON p.id = v.player_id
    WHERE v.wallet = ${wallet}
  `;

  if (!walletVotes || walletVotes.length === 0) return [];

  const standings: WalletStanding[] = [];

  for (const vote of walletVotes) {
    const slot = vote.slot as SlotCode;
    const rankings = await getSlotRankings(slot, 50);

    const playerRank = rankings.find((r) => r.player_id === vote.player_id);

    if (!playerRank) {
      standings.push({
        slot,
        player_id: vote.player_id,
        player_name: vote.player_name,
        rank: 0,
        is_slot_winner: false,
        gap_to_first: '0',
        gap_to_next: '0',
      });
      continue;
    }

    const first = rankings[0];
    const gapToFirst =
      playerRank.rank === 1
        ? '0'
        : (BigInt(first.total_weight) - BigInt(playerRank.total_weight)).toString();

    let gapToNext = '0';
    if (playerRank.rank > 1) {
      const above = rankings[playerRank.rank - 2];
      gapToNext = (
        BigInt(above.total_weight) - BigInt(playerRank.total_weight)
      ).toString();
    }

    standings.push({
      slot,
      player_id: vote.player_id,
      player_name: vote.player_name,
      rank: playerRank.rank,
      is_slot_winner: playerRank.rank === 1,
      gap_to_first: gapToFirst,
      gap_to_next: gapToNext,
    });
  }

  return standings;
}
