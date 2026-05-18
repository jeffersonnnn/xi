import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { getTokenBalance } from '@/lib/solana';
import { verifySignature, buildCanonicalMessage } from '@/lib/verify';
import { SLOTS } from '@/lib/constants';

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const MAX_REQUESTS = 5;

function isRateLimited(wallet: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(wallet);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(wallet, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, picks, signature, message } = body;

    if (!wallet || !picks || !signature || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (isRateLimited(wallet)) {
      return NextResponse.json({ error: 'Too many requests. Try again in a minute.' }, { status: 429 });
    }

    const isValid = verifySignature(wallet, signature, message);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const timestampMatch = message.match(/Timestamp: (\d+)/);
    if (!timestampMatch) {
      return NextResponse.json({ error: 'Invalid message format' }, { status: 400 });
    }
    const timestamp = parseInt(timestampMatch[1]);
    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > 300) {
      return NextResponse.json({ error: 'Signature expired' }, { status: 400 });
    }

    const mint = process.env.NEXT_PUBLIC_XI_TOKEN_MINT!;
    let balance: string;

    if (process.env.ALLOW_TEST_VOTES === 'true' && process.env.NODE_ENV !== 'production') {
      balance = '1000';
    } else {
      balance = await getTokenBalance(wallet, mint);
      const minBalance = process.env.MIN_VOTE_BALANCE || '1';
      if (BigInt(balance) < BigInt(minBalance)) {
        return NextResponse.json({
          error: `Insufficient $XI balance. Need at least ${minBalance}, have ${balance}`
        }, { status: 422 });
      }
    }

    const slotEntries = Object.entries(picks) as [string, string][];
    if (slotEntries.length !== 11) {
      return NextResponse.json({ error: 'Must pick exactly 11 players' }, { status: 400 });
    }

    for (const [slot] of slotEntries) {
      if (!(SLOTS as readonly string[]).includes(slot)) {
        return NextResponse.json({ error: `Invalid slot: ${slot}` }, { status: 400 });
      }
    }

    const playerIds = Object.values(picks);
    if (new Set(playerIds).size !== 11) {
      return NextResponse.json({ error: 'Each player can only be picked for one slot' }, { status: 400 });
    }

    const players = await sql`
      SELECT id, eligible_slots, active FROM players WHERE id = ANY(${playerIds as string[]}::uuid[])
    `;

    if (!players || players.length !== 11) {
      return NextResponse.json({ error: 'One or more invalid player IDs' }, { status: 400 });
    }

    const playerMap = new Map(players.map((p) => [p.id as string, p]));
    for (const [slot, playerId] of slotEntries) {
      const player = playerMap.get(playerId);
      if (!player || !player.active) {
        return NextResponse.json({ error: `Player ${playerId} not found or inactive` }, { status: 400 });
      }
      if (!(player.eligible_slots as string[]).includes(slot)) {
        return NextResponse.json({ error: `Player ${playerId} not eligible for slot ${slot}` }, { status: 422 });
      }
    }

    const expectedMessage = buildCanonicalMessage(wallet, timestamp, picks);
    if (message !== expectedMessage) {
      return NextResponse.json({ error: 'Message does not match canonical format' }, { status: 400 });
    }

    for (const [slot, playerId] of slotEntries) {
      await sql`
        INSERT INTO votes (wallet, slot, player_id, weight_at_vote, signature, message, voted_at)
        VALUES (${wallet}, ${slot}, ${playerId}, ${balance}, ${signature}, ${message}, ${new Date().toISOString()})
        ON CONFLICT (wallet, slot)
        DO UPDATE SET player_id = EXCLUDED.player_id, weight_at_vote = EXCLUDED.weight_at_vote,
                      signature = EXCLUDED.signature, message = EXCLUDED.message, voted_at = EXCLUDED.voted_at
      `;
    }

    await sql`
      INSERT INTO wallet_balances (wallet, weight, updated_at)
      VALUES (${wallet}, ${balance}, ${new Date().toISOString()})
      ON CONFLICT (wallet)
      DO UPDATE SET weight = EXCLUDED.weight, updated_at = EXCLUDED.updated_at
    `;

    return NextResponse.json({ success: true, balance });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
