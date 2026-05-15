import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

const HELIUS_API_KEY = process.env.HELIUS_API_KEY!;
const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta';

export function getHeliusConnection(): Connection {
  const base =
    network === 'devnet'
      ? 'https://devnet.helius-rpc.com'
      : 'https://mainnet.helius-rpc.com';

  return new Connection(`${base}/?api-key=${HELIUS_API_KEY}`, 'confirmed');
}

/**
 * Derive the Associated Token Address for a wallet + mint pair,
 * fetch the account, and parse the raw token amount from the data buffer.
 * Returns the raw amount as a string, or "0" if the account does not exist.
 */
export async function getTokenBalance(
  wallet: string,
  mint: string,
): Promise<string> {
  const connection = getHeliusConnection();
  const ata = getAssociatedTokenAddressSync(
    new PublicKey(mint),
    new PublicKey(wallet),
  );

  const accountInfo = await connection.getAccountInfo(ata);
  if (!accountInfo || !accountInfo.data) return '0';

  // SPL Token account layout: amount is a u64 at byte offset 64
  const amount = Buffer.from(accountInfo.data).readBigUInt64LE(64);
  return amount.toString();
}

/**
 * Fetch token balances for many wallets in batches of 100 using
 * getMultipleAccountsInfo for efficiency.
 * Returns a Map from wallet address to raw balance string.
 */
export async function getBatchedBalances(
  wallets: string[],
  mint: string,
): Promise<Map<string, string>> {
  const connection = getHeliusConnection();
  const mintPubkey = new PublicKey(mint);

  // Derive ATAs and keep the wallet-to-ATA mapping
  const entries: { wallet: string; ata: PublicKey }[] = wallets.map((w) => ({
    wallet: w,
    ata: getAssociatedTokenAddressSync(mintPubkey, new PublicKey(w)),
  }));

  const result = new Map<string, string>();
  const BATCH_SIZE = 100;

  for (let i = 0; i < entries.length; i += BATCH_SIZE) {
    const batch = entries.slice(i, i + BATCH_SIZE);
    const ataKeys = batch.map((e) => e.ata);

    const accounts = await connection.getMultipleAccountsInfo(ataKeys);

    for (let j = 0; j < batch.length; j++) {
      const accountInfo = accounts[j];
      if (!accountInfo || !accountInfo.data) {
        result.set(batch[j].wallet, '0');
      } else {
        const amount = Buffer.from(accountInfo.data).readBigUInt64LE(64);
        result.set(batch[j].wallet, amount.toString());
      }
    }
  }

  return result;
}
