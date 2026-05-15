import { describe, it, expect } from 'vitest';
import { Keypair } from '@solana/web3.js';
import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { buildCanonicalMessage, verifySignature, SLOT_ORDER } from '@/lib/verify';

describe('buildCanonicalMessage', () => {
  it('produces identical output for identical inputs', () => {
    const wallet = 'TestWalletAddress123';
    const timestamp = 1700000000;
    const picks: Record<string, string> = {};
    for (const slot of SLOT_ORDER) {
      picks[slot] = `player-${slot}`;
    }
    const msg1 = buildCanonicalMessage(wallet, timestamp, picks);
    const msg2 = buildCanonicalMessage(wallet, timestamp, picks);
    expect(msg1).toBe(msg2);
    // Check byte-level identity
    const bytes1 = new TextEncoder().encode(msg1);
    const bytes2 = new TextEncoder().encode(msg2);
    expect(Buffer.from(bytes1).equals(Buffer.from(bytes2))).toBe(true);
  });

  it('contains all expected fields', () => {
    const wallet = 'ABC123';
    const timestamp = 1700000000;
    const picks: Record<string, string> = {};
    for (const slot of SLOT_ORDER) {
      picks[slot] = `id-${slot}`;
    }
    const msg = buildCanonicalMessage(wallet, timestamp, picks);
    expect(msg).toContain('Wallet: ABC123');
    expect(msg).toContain('Timestamp: 1700000000');
    for (const slot of SLOT_ORDER) {
      expect(msg).toContain(`${slot}: id-${slot}`);
    }
  });
});

describe('verifySignature', () => {
  it('returns true for a valid signature', () => {
    const keypair = Keypair.generate();
    const wallet = keypair.publicKey.toBase58();
    const timestamp = Math.floor(Date.now() / 1000);
    const picks: Record<string, string> = {};
    for (const slot of SLOT_ORDER) {
      picks[slot] = `player-${slot}`;
    }
    const message = buildCanonicalMessage(wallet, timestamp, picks);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
    const signature = bs58.encode(signatureBytes);

    expect(verifySignature(wallet, signature, message)).toBe(true);
  });

  it('returns false for tampered message', () => {
    const keypair = Keypair.generate();
    const wallet = keypair.publicKey.toBase58();
    const timestamp = Math.floor(Date.now() / 1000);
    const picks: Record<string, string> = {};
    for (const slot of SLOT_ORDER) {
      picks[slot] = `player-${slot}`;
    }
    const message = buildCanonicalMessage(wallet, timestamp, picks);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
    const signature = bs58.encode(signatureBytes);

    const tampered = message.replace('player-GK', 'hacked-GK');
    expect(verifySignature(wallet, signature, tampered)).toBe(false);
  });

  it('returns false for wrong public key', () => {
    const keypair = Keypair.generate();
    const wrongKeypair = Keypair.generate();
    const wallet = keypair.publicKey.toBase58();
    const timestamp = Math.floor(Date.now() / 1000);
    const picks: Record<string, string> = {};
    for (const slot of SLOT_ORDER) {
      picks[slot] = `player-${slot}`;
    }
    const message = buildCanonicalMessage(wallet, timestamp, picks);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
    const signature = bs58.encode(signatureBytes);

    expect(verifySignature(wrongKeypair.publicKey.toBase58(), signature, message)).toBe(false);
  });

  it('returns false for malformed signature string', () => {
    const keypair = Keypair.generate();
    const wallet = keypair.publicKey.toBase58();
    const timestamp = Math.floor(Date.now() / 1000);
    const picks: Record<string, string> = {};
    for (const slot of SLOT_ORDER) {
      picks[slot] = `player-${slot}`;
    }
    const message = buildCanonicalMessage(wallet, timestamp, picks);

    // Completely invalid base58 should be caught by the try/catch
    expect(verifySignature(wallet, '!!!invalid!!!', message)).toBe(false);
  });

  it('stale timestamp note: verifySignature does not check timestamp', () => {
    // verifySignature itself has no timestamp logic; that guard lives in the
    // API route. This test documents the boundary: a signature with a stale
    // timestamp still verifies cryptographically.
    const keypair = Keypair.generate();
    const wallet = keypair.publicKey.toBase58();
    const staleTimestamp = Math.floor(Date.now() / 1000) - 600; // 10 min ago
    const picks: Record<string, string> = {};
    for (const slot of SLOT_ORDER) {
      picks[slot] = `player-${slot}`;
    }
    const message = buildCanonicalMessage(wallet, staleTimestamp, picks);
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = nacl.sign.detached(messageBytes, keypair.secretKey);
    const signature = bs58.encode(signatureBytes);

    // Signature is still valid at the crypto level
    expect(verifySignature(wallet, signature, message)).toBe(true);
  });
});
