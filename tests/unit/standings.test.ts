import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---- DB mock ----------------------------------------------------------------
const mockSql = vi.fn();

vi.mock('@/lib/db', () => ({
  sql: (...args: unknown[]) => mockSql(...args),
}));

import { getWalletStandings } from '@/lib/aggregate';

// ---- Helpers ---------------------------------------------------------------

function makeWalletVoteRow(slot: string, player_id: string, playerName: string) {
  return { slot, player_id, player_name: playerName };
}

function makeSlotVoteRow(
  player_id: string,
  wallet: string,
  voted_at: string,
  playerName: string,
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

// ---- Tests -----------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getWalletStandings', () => {
  it('returns correct standings for the leading wallet', async () => {
    const targetWallet = 'wallet-leader';

    mockSql.mockImplementation((strings: TemplateStringsArray, ...values: unknown[]) => {
      const query = strings.join('');

      if (query.includes('v.slot, v.player_id')) {
        const wallet = values[0];
        if (wallet === targetWallet) {
          return Promise.resolve([makeWalletVoteRow('ST', 'messi', 'Messi')]);
        }
        return Promise.resolve([]);
      }

      if (query.includes('FROM votes') && query.includes('INNER JOIN')) {
        return Promise.resolve([
          makeSlotVoteRow('messi', 'wallet-leader', '2025-01-01T00:00:00Z', 'Messi'),
          makeSlotVoteRow('ronaldo', 'wallet-other', '2025-01-01T00:01:00Z', 'Ronaldo'),
        ]);
      }

      if (query.includes('FROM wallet_balances')) {
        return Promise.resolve([
          { wallet: 'wallet-leader', weight: '10000' },
          { wallet: 'wallet-other', weight: '4000' },
        ]);
      }

      return Promise.resolve([]);
    });

    const standings = await getWalletStandings(targetWallet);

    expect(standings.length).toBe(1);
    const st = standings[0];
    expect(st.slot).toBe('ST');
    expect(st.player_id).toBe('messi');
    expect(st.player_name).toBe('Messi');
    expect(st.rank).toBe(1);
    expect(st.is_slot_winner).toBe(true);
    expect(st.gap_to_first).toBe('0');
    expect(st.gap_to_next).toBe('0');
  });

  it('returns correct gaps for a non-leading wallet', async () => {
    const targetWallet = 'wallet-third';

    mockSql.mockImplementation((strings: TemplateStringsArray, ...values: unknown[]) => {
      const query = strings.join('');

      if (query.includes('v.slot, v.player_id')) {
        const wallet = values[0];
        if (wallet === targetWallet) {
          return Promise.resolve([makeWalletVoteRow('GK', 'neuer', 'Neuer')]);
        }
        return Promise.resolve([]);
      }

      if (query.includes('FROM votes') && query.includes('INNER JOIN')) {
        return Promise.resolve([
          makeSlotVoteRow('donnarumma', 'wallet-first', '2025-01-01T00:00:00Z', 'Donnarumma'),
          makeSlotVoteRow('courtois', 'wallet-second', '2025-01-01T00:01:00Z', 'Courtois'),
          makeSlotVoteRow('neuer', 'wallet-third', '2025-01-01T00:02:00Z', 'Neuer'),
        ]);
      }

      if (query.includes('FROM wallet_balances')) {
        return Promise.resolve([
          { wallet: 'wallet-first', weight: '10000' },
          { wallet: 'wallet-second', weight: '7000' },
          { wallet: 'wallet-third', weight: '3000' },
        ]);
      }

      return Promise.resolve([]);
    });

    const standings = await getWalletStandings(targetWallet);

    expect(standings.length).toBe(1);
    const gk = standings[0];
    expect(gk.rank).toBe(3);
    expect(gk.is_slot_winner).toBe(false);
    expect(gk.gap_to_first).toBe('7000');
    expect(gk.gap_to_next).toBe('4000');
  });

  it('returns rank 0 when wallet has zero weight', async () => {
    const targetWallet = 'wallet-broke';

    mockSql.mockImplementation((strings: TemplateStringsArray, ...values: unknown[]) => {
      const query = strings.join('');

      if (query.includes('v.slot, v.player_id')) {
        const wallet = values[0];
        if (wallet === targetWallet) {
          return Promise.resolve([makeWalletVoteRow('RW', 'salah', 'Salah')]);
        }
        return Promise.resolve([]);
      }

      if (query.includes('FROM votes') && query.includes('INNER JOIN')) {
        return Promise.resolve([
          makeSlotVoteRow('salah', 'wallet-broke', '2025-01-01T00:00:00Z', 'Salah'),
        ]);
      }

      if (query.includes('FROM wallet_balances')) {
        return Promise.resolve([]);
      }

      return Promise.resolve([]);
    });

    const standings = await getWalletStandings(targetWallet);

    expect(standings.length).toBe(1);
    const rw = standings[0];
    expect(rw.rank).toBe(0);
    expect(rw.is_slot_winner).toBe(false);
    expect(rw.gap_to_first).toBe('0');
    expect(rw.gap_to_next).toBe('0');
  });

  it('returns empty array for a wallet with no votes', async () => {
    mockSql.mockImplementation(() => Promise.resolve([]));

    const standings = await getWalletStandings('wallet-no-votes');
    expect(standings).toEqual([]);
  });

  it('includes picks_in_xi count via multiple slot standings', async () => {
    const targetWallet = 'wallet-multi';

    mockSql.mockImplementation((strings: TemplateStringsArray, ...values: unknown[]) => {
      const query = strings.join('');

      if (query.includes('v.slot, v.player_id')) {
        const wallet = values[0];
        if (wallet === targetWallet) {
          return Promise.resolve([
            makeWalletVoteRow('GK', 'alisson', 'Alisson'),
            makeWalletVoteRow('ST', 'haaland', 'Haaland'),
          ]);
        }
        return Promise.resolve([]);
      }

      if (query.includes('FROM votes') && query.includes('INNER JOIN')) {
        const slot = values[0];
        if (slot === 'GK') {
          return Promise.resolve([
            makeSlotVoteRow('alisson', 'wallet-multi', '2025-01-01T00:00:00Z', 'Alisson'),
          ]);
        }
        if (slot === 'ST') {
          return Promise.resolve([
            makeSlotVoteRow('haaland', 'wallet-multi', '2025-01-01T00:00:00Z', 'Haaland'),
            makeSlotVoteRow('mbappe', 'wallet-rival', '2025-01-01T00:01:00Z', 'Mbappe'),
          ]);
        }
        return Promise.resolve([]);
      }

      if (query.includes('FROM wallet_balances')) {
        return Promise.resolve([
          { wallet: 'wallet-multi', weight: '8000' },
          { wallet: 'wallet-rival', weight: '5000' },
        ]);
      }

      return Promise.resolve([]);
    });

    const standings = await getWalletStandings(targetWallet);

    expect(standings.length).toBe(2);
    const picksInXi = standings.filter((s) => s.is_slot_winner).length;
    expect(picksInXi).toBe(2);
  });
});
