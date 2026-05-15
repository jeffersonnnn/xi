import { describe, it, expect } from 'vitest';
import { buildCanonicalMessage, SLOT_ORDER } from '@/lib/verify';

describe('buildCanonicalMessage byte-identity', () => {
  it('produces byte-identical output across multiple invocations', () => {
    const wallet = '7YttLkHDoN2BpeAGRxMicppbZRywm2RHjH3JNmvZfE4t';
    const timestamp = 1717200000;
    const picks: Record<string, string> = {};
    for (const slot of SLOT_ORDER) {
      picks[slot] = `pid-${slot}-abc123`;
    }

    const runs = 100;
    const first = new TextEncoder().encode(
      buildCanonicalMessage(wallet, timestamp, picks),
    );

    for (let i = 1; i < runs; i++) {
      const current = new TextEncoder().encode(
        buildCanonicalMessage(wallet, timestamp, picks),
      );
      expect(current.length).toBe(first.length);
      expect(Buffer.from(current).equals(Buffer.from(first))).toBe(true);
    }
  });

  it('different inputs produce different bytes', () => {
    const picks: Record<string, string> = {};
    for (const slot of SLOT_ORDER) {
      picks[slot] = `player-${slot}`;
    }

    const msgA = new TextEncoder().encode(
      buildCanonicalMessage('WalletA', 1000, picks),
    );
    const msgB = new TextEncoder().encode(
      buildCanonicalMessage('WalletB', 1000, picks),
    );
    const msgC = new TextEncoder().encode(
      buildCanonicalMessage('WalletA', 1001, picks),
    );

    expect(Buffer.from(msgA).equals(Buffer.from(msgB))).toBe(false);
    expect(Buffer.from(msgA).equals(Buffer.from(msgC))).toBe(false);
  });

  it('slot order is deterministic and matches SLOT_ORDER constant', () => {
    const picks: Record<string, string> = {};
    for (const slot of SLOT_ORDER) {
      picks[slot] = slot; // use slot name as player id for easy parsing
    }

    const msg = buildCanonicalMessage('TestWallet', 0, picks);
    const lines = msg.split('\n');

    // The picks start after "Picks:" line
    const picksIndex = lines.indexOf('Picks:');
    expect(picksIndex).toBeGreaterThan(0);

    const pickLines = lines.slice(picksIndex + 1).filter((l) => l.trim());
    expect(pickLines.length).toBe(SLOT_ORDER.length);

    for (let i = 0; i < SLOT_ORDER.length; i++) {
      expect(pickLines[i].trim()).toBe(`${SLOT_ORDER[i]}: ${SLOT_ORDER[i]}`);
    }
  });
});
