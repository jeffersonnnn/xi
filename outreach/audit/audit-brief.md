# $XI — Security Review Brief

## Project Overview

$XI is a token-weighted governance platform where Solana token holders vote for the 2026 FIFA World Cup Starting XI. Vote weight equals on-chain $XI token balance, refreshed every 10 minutes.

**Live site**: [YOUR_URL_HERE]
**GitHub**: [YOUR_REPO_URL_HERE]
**Network**: Solana (mainnet-beta / devnet)

---

## Architecture

```
Client (Next.js 14)
  ├── Privy wallet auth (Solana-only)
  ├── Ed25519 message signing (vote submission)
  └── Reads from API routes

Server (Next.js API Routes)
  ├── POST /api/vote — signature verification + vote storage
  ├── GET /api/xi — aggregated Starting XI
  ├── GET /api/players — player roster
  ├── GET /api/stats — voter count + total weight
  ├── GET /api/balance/[wallet] — live on-chain balance lookup
  └── GET /api/votes/[wallet] — wallet's existing votes + standings

Database (Neon PostgreSQL)
  ├── players — 100+ FIFA-eligible players
  ├── votes — (wallet, slot) → player_id + weight + signature
  ├── wallet_balances — cached on-chain balances
  └── daily_snapshots — daily XI + movers

Worker (node-cron, PM2)
  ├── refresh-weights (every 10 min) — re-reads on-chain $XI balances for all voters
  └── daily-snapshot (daily at 12:00 UTC) — snapshots current XI

Blockchain (Read-Only)
  └── Helius RPC — getAccountInfo / getMultipleAccountsInfo for SPL token balances
```

**Important**: There is NO on-chain program (smart contract) to audit. All Solana interaction is read-only (token balance lookups). The security surface is the server-side vote integrity logic.

---

## Security-Relevant Code Paths

### 1. Signature Verification (`lib/verify.ts`)

- Ed25519 detached signature via `tweetnacl`
- Canonical message format includes wallet, timestamp, and all 11 picks
- Server reconstructs the canonical message independently and compares byte-for-byte
- Base58 encoding/decoding via `bs58`

**Review focus**: Can the canonical message format be manipulated? Is the signature verification correctly implemented? Any edge cases in base58 decoding?

### 2. Vote Submission (`app/api/vote/route.ts`)

- Validates: signature authenticity, 5-minute timestamp window, 11 unique players, slot eligibility, player existence + active status
- Canonical message reconstructed server-side and compared to client-provided message
- On-chain balance checked at vote time (or test weight in dev mode)
- Upsert via `ON CONFLICT (wallet, slot)` — one vote per wallet per position
- Rate limited: 5 requests per wallet per minute

**Review focus**: Can an attacker replay signatures? Can the timestamp window be exploited? Is the test-vote escape hatch (`ALLOW_TEST_VOTES`) safe in production?

### 3. Token Balance Reading (`lib/solana.ts`)

- Derives Associated Token Address (ATA) for wallet + mint pair
- Reads raw account data via `getAccountInfo`
- Parses u64 at byte offset 64 (SPL Token account layout)
- Batch reads via `getMultipleAccountsInfo` for the refresh job

**Review focus**: Is the ATA derivation correct? Is the byte offset parsing safe? What happens if the account layout changes?

### 4. Weight Refresh Worker (`worker/refresh-weights.ts`)

- Runs every 10 minutes
- Fetches all wallets from `wallet_balances` table
- Batch-reads current on-chain balances
- Updates the database with new weights

**Review focus**: Can the refresh window be exploited (vote with weight, sell tokens, weight persists until next refresh)?

---

## Threat Model

| Threat | Current Mitigation | Status |
|--------|-------------------|--------|
| Signature replay | 5-minute timestamp window, canonical message format | Implemented |
| Vote weight manipulation | On-chain balance verified at vote time + 10-min refresh | Implemented |
| Timestamp manipulation | Server validates `abs(now - timestamp) < 300` | Implemented |
| Test votes in production | `ALLOW_TEST_VOTES` gated by `NODE_ENV !== 'production'` | Implemented |
| Rate limiting | 5 votes per wallet per minute (in-memory) | Implemented |
| SQL injection | Parameterized queries via `@neondatabase/serverless` tagged template | Implemented |
| Slot/player validation | Server-side validation of all 11 slots + player eligibility | Implemented |

---

## Scope Recommendation

We suggest the following scope for a security review:

1. **Vote integrity** — Can the voting mechanism be manipulated to produce incorrect results?
2. **Signature verification** — Is the Ed25519 verification correctly implemented?
3. **On-chain data reading** — Are token balances read correctly and securely?
4. **API security** — Rate limiting, input validation, error handling
5. **Weight refresh timing** — Can the 10-minute refresh window be exploited?

**Out of scope**: Frontend UI, CSS, animation code, player seed data, deployment infrastructure.

---

## Contact

**Email**: [YOUR_EMAIL]
**Twitter/X**: [YOUR_TWITTER]
**Telegram**: [YOUR_TELEGRAM]
