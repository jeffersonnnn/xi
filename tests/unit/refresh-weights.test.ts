import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Keypair, PublicKey } from '@solana/web3.js';

// ---- Mocks -----------------------------------------------------------------

const fakeMint = Keypair.generate().publicKey.toBase58();

vi.stubEnv('DATABASE_URL', 'postgresql://fake:fake@fake.neon.tech/fake');
vi.stubEnv('NEXT_PUBLIC_SOLANA_NETWORK', 'mainnet-beta');
vi.stubEnv('HELIUS_API_KEY', 'fake-helius');
vi.stubEnv('NEXT_PUBLIC_XI_TOKEN_MINT', fakeMint);

const mockSql = vi.fn();

vi.mock('@neondatabase/serverless', () => ({
  neon: () => (...args: unknown[]) => mockSql(...args),
}));

const mockGetMultipleAccountsInfo = vi.fn();

vi.mock('@solana/web3.js', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@solana/web3.js')>();
  return {
    ...actual,
    Connection: vi.fn().mockImplementation(() => ({
      getMultipleAccountsInfo: mockGetMultipleAccountsInfo,
    })),
  };
});

import { refreshWeights } from '@/worker/refresh-weights';

// ---- Helpers ---------------------------------------------------------------

function validWallet(): string {
  return Keypair.generate().publicKey.toBase58();
}

function makeTokenAccountData(balance: bigint): Buffer {
  const buf = Buffer.alloc(165);
  buf.writeBigUInt64LE(balance, 64);
  return buf;
}

// ---- Tests -----------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

describe('refreshWeights', () => {
  it('upserts correct weights for voting wallets', async () => {
    const walletA = validWallet();
    const walletB = validWallet();
    const upsertCalls: any[] = [];

    mockSql.mockImplementation((strings: TemplateStringsArray, ...values: unknown[]) => {
      const query = strings.join('');
      if (query.includes('FROM votes')) {
        return Promise.resolve([{ wallet: walletA }, { wallet: walletB }]);
      }
      if (query.includes('INSERT INTO wallet_balances')) {
        upsertCalls.push({ wallet: values[0], weight: values[1] });
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    });

    mockGetMultipleAccountsInfo.mockResolvedValue([
      { data: makeTokenAccountData(BigInt(5000)) },
      { data: makeTokenAccountData(BigInt(1000)) },
    ]);

    await refreshWeights();

    const rowA = upsertCalls.find((r) => r.wallet === walletA);
    const rowB = upsertCalls.find((r) => r.wallet === walletB);
    expect(rowA).toBeDefined();
    expect(rowA!.weight).toBe('5000');
    expect(rowB).toBeDefined();
    expect(rowB!.weight).toBe('1000');
  });

  it('resolves missing/empty ATA to weight 0', async () => {
    const walletC = validWallet();
    const upsertCalls: any[] = [];

    mockSql.mockImplementation((strings: TemplateStringsArray, ...values: unknown[]) => {
      const query = strings.join('');
      if (query.includes('FROM votes')) {
        return Promise.resolve([{ wallet: walletC }]);
      }
      if (query.includes('INSERT INTO wallet_balances')) {
        upsertCalls.push({ wallet: values[0], weight: values[1] });
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    });

    mockGetMultipleAccountsInfo.mockResolvedValue([null]);

    await refreshWeights();

    expect(upsertCalls.length).toBe(1);
    expect(upsertCalls[0].weight).toBe('0');
  });

  it('batches RPC calls into groups of 100 or fewer', async () => {
    const wallets = Array.from({ length: 250 }, () => validWallet());

    mockSql.mockImplementation((strings: TemplateStringsArray) => {
      const query = strings.join('');
      if (query.includes('FROM votes')) {
        return Promise.resolve(wallets.map((w) => ({ wallet: w })));
      }
      if (query.includes('INSERT INTO wallet_balances')) {
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    });

    mockGetMultipleAccountsInfo.mockImplementation((keys: PublicKey[]) =>
      Promise.resolve(
        keys.map(() => ({ data: makeTokenAccountData(BigInt(100)) })),
      ),
    );

    await refreshWeights();

    expect(mockGetMultipleAccountsInfo).toHaveBeenCalledTimes(3);

    const firstBatch = mockGetMultipleAccountsInfo.mock.calls[0][0] as PublicKey[];
    const secondBatch = mockGetMultipleAccountsInfo.mock.calls[1][0] as PublicKey[];
    const thirdBatch = mockGetMultipleAccountsInfo.mock.calls[2][0] as PublicKey[];
    expect(firstBatch.length).toBe(100);
    expect(secondBatch.length).toBe(100);
    expect(thirdBatch.length).toBe(50);
  });

  it('is idempotent across runs', async () => {
    const walletD = validWallet();
    const upsertCalls: any[] = [];

    mockSql.mockImplementation((strings: TemplateStringsArray, ...values: unknown[]) => {
      const query = strings.join('');
      if (query.includes('FROM votes')) {
        return Promise.resolve([{ wallet: walletD }]);
      }
      if (query.includes('INSERT INTO wallet_balances')) {
        upsertCalls.push({ wallet: values[0], weight: values[1] });
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    });

    mockGetMultipleAccountsInfo.mockResolvedValue([
      { data: makeTokenAccountData(BigInt(7777)) },
    ]);

    await refreshWeights();
    await refreshWeights();

    expect(upsertCalls.length).toBe(2);
    expect(upsertCalls[0].wallet).toBe(upsertCalls[1].wallet);
    expect(upsertCalls[0].weight).toBe(upsertCalls[1].weight);
    expect(upsertCalls[0].weight).toBe('7777');
  });

  it('does nothing when there are no voting wallets', async () => {
    mockSql.mockImplementation((strings: TemplateStringsArray) => {
      const query = strings.join('');
      if (query.includes('FROM votes')) {
        return Promise.resolve([]);
      }
      return Promise.resolve([]);
    });

    await refreshWeights();

    expect(mockGetMultipleAccountsInfo).not.toHaveBeenCalled();
  });
});
