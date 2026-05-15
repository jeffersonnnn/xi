import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---- DB mock ----------------------------------------------------------------
const mockSql = vi.fn();

vi.mock('@/lib/db', () => ({
  sql: (...args: unknown[]) => mockSql(...args),
}));

import { getSlotRankings, getFullXI } from '@/lib/aggregate';

// ---- Helpers ---------------------------------------------------------------

function makeVoteRow(
  player_id: string,
  wallet: string,
  voted_at: string,
  playerName = 'Test Player',
) {
  return {
    player_id,
    wallet,
    voted_at,
    name: playerName,
    nationality_code: 'XX',
    photo_url: null,
    club: null,
  };
}

function setupMocks(
  votes: ReturnType<typeof makeVoteRow>[],
  balances: { wallet: string; weight: string }[],
) {
  mockSql.mockImplementation((strings: TemplateStringsArray) => {
    const query = strings.join('');
    if (query.includes('FROM votes')) {
      return Promise.resolve(votes);
    }
    if (query.includes('FROM wallet_balances')) {
      return Promise.resolve(balances);
    }
    return Promise.resolve([]);
  });
}

// ---- Tests -----------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getSlotRankings', () => {
  it('picks the player with the highest total weight as rank 1', async () => {
    const votes = [
      makeVoteRow('player-a', 'wallet-1', '2025-01-01T00:00:00Z', 'Alice'),
      makeVoteRow('player-b', 'wallet-2', '2025-01-01T00:01:00Z', 'Bob'),
    ];
    const balances = [
      { wallet: 'wallet-1', weight: '5000' },
      { wallet: 'wallet-2', weight: '3000' },
    ];
    setupMocks(votes, balances);

    const rankings = await getSlotRankings('ST');
    expect(rankings.length).toBe(2);
    expect(rankings[0].player_id).toBe('player-a');
    expect(rankings[0].total_weight).toBe('5000');
    expect(rankings[0].rank).toBe(1);
    expect(rankings[1].player_id).toBe('player-b');
    expect(rankings[1].rank).toBe(2);
  });

  it('excludes wallets with weight 0', async () => {
    const votes = [
      makeVoteRow('player-a', 'wallet-1', '2025-01-01T00:00:00Z', 'Alice'),
      makeVoteRow('player-b', 'wallet-2', '2025-01-01T00:01:00Z', 'Bob'),
    ];
    const balances = [
      { wallet: 'wallet-1', weight: '5000' },
      { wallet: 'wallet-2', weight: '0' },
    ];
    setupMocks(votes, balances);

    const rankings = await getSlotRankings('GK');
    expect(rankings.length).toBe(1);
    expect(rankings[0].player_id).toBe('player-a');
  });

  it('breaks ties by earliest voted_at', async () => {
    const votes = [
      makeVoteRow('player-a', 'wallet-1', '2025-01-01T00:05:00Z', 'Late Alice'),
      makeVoteRow('player-b', 'wallet-2', '2025-01-01T00:00:00Z', 'Early Bob'),
    ];
    const balances = [
      { wallet: 'wallet-1', weight: '1000' },
      { wallet: 'wallet-2', weight: '1000' },
    ];
    setupMocks(votes, balances);

    const rankings = await getSlotRankings('LW');
    expect(rankings.length).toBe(2);
    expect(rankings[0].player_id).toBe('player-b');
    expect(rankings[1].player_id).toBe('player-a');
  });

  it('returns empty array when there are no votes', async () => {
    setupMocks([], []);

    const rankings = await getSlotRankings('RW');
    expect(rankings).toEqual([]);
  });

  it('returns empty when slot has votes but all wallets have zero weight', async () => {
    const votes = [
      makeVoteRow('player-a', 'wallet-1', '2025-01-01T00:00:00Z', 'Alice'),
    ];
    const balances = [
      { wallet: 'wallet-1', weight: '0' },
    ];
    setupMocks(votes, balances);

    const rankings = await getSlotRankings('CB_L');
    expect(rankings).toEqual([]);
  });

  it('aggregates multiple voters for the same player', async () => {
    const votes = [
      makeVoteRow('player-a', 'wallet-1', '2025-01-01T00:00:00Z', 'Alice'),
      makeVoteRow('player-a', 'wallet-2', '2025-01-01T00:01:00Z', 'Alice'),
      makeVoteRow('player-b', 'wallet-3', '2025-01-01T00:02:00Z', 'Bob'),
    ];
    const balances = [
      { wallet: 'wallet-1', weight: '3000' },
      { wallet: 'wallet-2', weight: '2000' },
      { wallet: 'wallet-3', weight: '4000' },
    ];
    setupMocks(votes, balances);

    const rankings = await getSlotRankings('CM_C');
    expect(rankings[0].player_id).toBe('player-a');
    expect(rankings[0].total_weight).toBe('5000');
    expect(rankings[0].voter_count).toBe(2);
    expect(rankings[1].player_id).toBe('player-b');
    expect(rankings[1].total_weight).toBe('4000');
    expect(rankings[1].voter_count).toBe(1);
  });

  it('player with large weight_at_vote but current balance 0 does NOT win', async () => {
    const votes = [
      makeVoteRow('player-rich', 'whale-wallet', '2025-01-01T00:00:00Z', 'Rich'),
      makeVoteRow('player-small', 'small-wallet', '2025-01-01T00:01:00Z', 'Small'),
    ];
    const balances = [
      { wallet: 'whale-wallet', weight: '0' },
      { wallet: 'small-wallet', weight: '100' },
    ];
    setupMocks(votes, balances);

    const rankings = await getSlotRankings('ST');
    expect(rankings.length).toBe(1);
    expect(rankings[0].player_id).toBe('player-small');
  });
});

describe('getFullXI', () => {
  it('returns a result for each of the 11 slots', async () => {
    mockSql.mockImplementation((strings: TemplateStringsArray, ...values: unknown[]) => {
      const query = strings.join('');
      if (query.includes('FROM votes')) {
        const slot = values[0] as string;
        return Promise.resolve([
          makeVoteRow(`player-${slot}`, 'wallet-1', '2025-01-01T00:00:00Z', `Player ${slot}`),
        ]);
      }
      if (query.includes('FROM wallet_balances')) {
        return Promise.resolve([{ wallet: 'wallet-1', weight: '1000' }]);
      }
      return Promise.resolve([]);
    });

    const xi = await getFullXI();
    const slotCodes = ['GK','LB','CB_L','CB_R','RB','CM_L','CM_C','CM_R','LW','ST','RW'];
    for (const slot of slotCodes) {
      expect(xi[slot]).toBeDefined();
      expect(xi[slot].winner).not.toBeNull();
      expect(xi[slot].winner!.rank).toBe(1);
    }
  });

  it('returns null winner for a slot with no votes', async () => {
    mockSql.mockImplementation((strings: TemplateStringsArray) => {
      return Promise.resolve([]);
    });

    const xi = await getFullXI();
    for (const slot of Object.keys(xi)) {
      expect(xi[slot].winner).toBeNull();
      expect(xi[slot].runners_up).toEqual([]);
    }
  });
});
