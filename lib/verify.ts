import nacl from 'tweetnacl';
import bs58 from 'bs58';

export const SLOT_ORDER = [
  'GK','LB','CB_L','CB_R','RB',
  'CM_L','CM_C','CM_R',
  'LW','ST','RW',
] as const;

/**
 * Build the canonical message that the wallet signs when submitting a vote.
 * The message must be reproduced byte-for-byte on both client and server
 * so the signature can be verified.
 *
 * NOTE: The first line contains a literal em dash because the canonical
 * format requires it for byte-exact matching. This is the one exception.
 */
export function buildCanonicalMessage(
  wallet: string,
  timestamp: number,
  picks: Record<string, string>,
): string {
  const pickLines = SLOT_ORDER.map(
    (slot) => `  ${slot}: ${picks[slot]}`,
  ).join('\n');

  return [
    '$XI — sign to submit your People\'s XI vote',
    '',
    `Wallet: ${wallet}`,
    `Timestamp: ${timestamp}`,
    'Picks:',
    pickLines,
  ].join('\n');
}

/**
 * Verify a detached Ed25519 signature produced by a Solana wallet.
 * - wallet: base58-encoded public key
 * - signature: base58-encoded 64-byte detached signature
 * - message: the exact UTF-8 string that was signed
 */
export function verifySignature(
  wallet: string,
  signature: string,
  message: string,
): boolean {
  try {
    const publicKey = bs58.decode(wallet);
    const sig = bs58.decode(signature);
    const messageBytes = new TextEncoder().encode(message);

    return nacl.sign.detached.verify(messageBytes, sig, publicKey);
  } catch {
    return false;
  }
}
