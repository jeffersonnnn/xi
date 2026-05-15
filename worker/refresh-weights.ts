import { neon } from '@neondatabase/serverless';
import { Connection, PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddressSync } from '@solana/spl-token';

const sql = neon(process.env.DATABASE_URL!);

function getConnection() {
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta';
  const apiKey = process.env.HELIUS_API_KEY!;
  const url = network === 'devnet'
    ? `https://devnet.helius-rpc.com/?api-key=${apiKey}`
    : `https://mainnet.helius-rpc.com/?api-key=${apiKey}`;
  return new Connection(url);
}

export async function refreshWeights() {
  const startTime = Date.now();
  console.log('[refresh-weights] Starting...');

  const mint = new PublicKey(process.env.NEXT_PUBLIC_XI_TOKEN_MINT!);
  const connection = getConnection();

  const walletRows = await sql`SELECT DISTINCT wallet FROM votes ORDER BY wallet`;

  if (!walletRows || walletRows.length === 0) {
    console.log('[refresh-weights] No wallets to process');
    return;
  }

  const wallets = walletRows.map((r: any) => r.wallet);
  console.log(`[refresh-weights] Processing ${wallets.length} wallets`);

  const ataMap = new Map<string, { wallet: string; ata: PublicKey }>();
  const ataKeys: PublicKey[] = [];

  for (const wallet of wallets) {
    try {
      const walletPubkey = new PublicKey(wallet);
      const ata = getAssociatedTokenAddressSync(mint, walletPubkey);
      ataMap.set(ata.toBase58(), { wallet, ata });
      ataKeys.push(ata);
    } catch (e) {
      console.error(`[refresh-weights] Invalid wallet address: ${wallet}`);
    }
  }

  let rpcCalls = 0;
  const balances = new Map<string, string>();

  for (let i = 0; i < ataKeys.length; i += 100) {
    const batch = ataKeys.slice(i, i + 100);
    rpcCalls++;

    try {
      const accounts = await connection.getMultipleAccountsInfo(batch);

      for (let j = 0; j < batch.length; j++) {
        const ataBase58 = batch[j].toBase58();
        const entry = ataMap.get(ataBase58)!;
        const account = accounts[j];

        let balance = '0';
        if (account && account.data) {
          try {
            const data = Buffer.from(account.data);
            balance = data.readBigUInt64LE(64).toString();
          } catch {
            balance = '0';
          }
        }

        balances.set(entry.wallet, balance);
      }
    } catch (e) {
      console.error(`[refresh-weights] RPC batch ${i} failed:`, e);
      for (const key of batch) {
        const entry = ataMap.get(key.toBase58());
        if (entry && !balances.has(entry.wallet)) {
          balances.set(entry.wallet, '0');
        }
      }
    }
  }

  const upsertRows = Array.from(balances.entries()).map(([wallet, weight]) => ({
    wallet,
    weight,
    updated_at: new Date().toISOString(),
  }));

  for (let i = 0; i < upsertRows.length; i += 100) {
    const batch = upsertRows.slice(i, i + 100);
    for (const row of batch) {
      await sql`
        INSERT INTO wallet_balances (wallet, weight, updated_at)
        VALUES (${row.wallet}, ${row.weight}, ${row.updated_at})
        ON CONFLICT (wallet)
        DO UPDATE SET weight = EXCLUDED.weight, updated_at = EXCLUDED.updated_at
      `;
    }
  }

  const elapsed = Date.now() - startTime;
  console.log(`[refresh-weights] Done. ${wallets.length} wallets, ${rpcCalls} RPC calls, ${elapsed}ms`);
}
