# $XI - The People's Starting XI

A live, holder-voted "Best XI for the 2026 FIFA World Cup." Token holders connect a Solana wallet, sign a message ranking their picks for each of 11 slots (4-3-3 formation), and the aggregated XI updates. Vote weight equals current on-chain $XI holdings, refreshed every 10 minutes.

## Tech Stack

- **Framework**: Next.js 14, App Router, TypeScript
- **Database**: PostgreSQL via Supabase
- **Blockchain**: Solana (Helius RPC)
- **UI**: TailwindCSS + shadcn/ui + framer-motion
- **Worker**: node-cron (PM2 managed)
- **Wallet**: Privy (@privy-io/react-auth)

## Local Setup

```bash
# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env.local

# Run database migrations (via Supabase SQL Editor or psql)
# See supabase/migrations/

# Seed players
npm run seed

# Start development server
npm run dev
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_XI_TOKEN_MINT` | Solana mint address of $XI token |
| `NEXT_PUBLIC_SOLANA_NETWORK` | `mainnet-beta` or `devnet` |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID from dashboard.privy.io |
| `HELIUS_API_KEY` | Helius RPC API key (server-side only) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `MIN_VOTE_BALANCE` | Minimum $XI balance to vote (default: `1`) |
| `ALLOW_TEST_VOTES` | `true` for staging (grants test weight) |
| `PORT` | Port for `next start` (default: `3000`) |
| `WEIGHT_REFRESH_CRON` | Cron expression for weight refresh (default: `*/10 * * * *`) |
| `DAILY_SNAPSHOT_CRON` | Cron expression for daily snapshot (default: `0 12 * * *`) |

**Note**: Use a placeholder mint address until the real $XI token is launched. The app functions correctly with any valid Solana mint.

## Running Tests

```bash
# Unit tests
npm run test:unit

# E2E tests (requires dev server)
npm run test:e2e

# All tests
npm test
```

## Running Jobs Manually

```bash
# Refresh all voter wallet balances from chain
npm run job:refresh-weights

# Take a daily snapshot of the current XI
npm run job:daily-snapshot
```

## Worker Process

The worker runs as a separate PM2 process with two cron jobs:
- **refresh-weights** (every 10 min): re-reads on-chain $XI balances for all voters
- **daily-snapshot** (daily at 12:00 UTC): snapshots the current XI and computes movers

```bash
# Run worker directly
npm run worker
```

## Deployment

See `deploy/SETUP.md` for the complete VPS provisioning and deployment runbook.

Quick redeploy:
```bash
cd /app
git pull
npm ci
npm run build
pm2 reload deploy/ecosystem.config.js
```

## Project Structure

```
app/           - Next.js pages and API routes
components/    - React components (Pitch, PlayerCard, etc.)
lib/           - Core logic (aggregate, verify, solana, supabase)
worker/        - Cron worker (refresh-weights, daily-snapshot)
data/          - Player seed data
supabase/      - Database migrations
deploy/        - PM2, nginx, deployment configs
tests/         - Unit (Vitest) and E2E (Playwright) tests
```
