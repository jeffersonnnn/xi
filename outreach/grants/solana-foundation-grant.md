# Solana Foundation Grant Application

Submit at: https://solana.org/grants

---

## Project Name

$XI — The People's Starting XI

## Category

Consumer / Governance / Sports & Entertainment

## One-Line Summary

A token-weighted voting platform where Solana holders pick the 2026 FIFA World Cup Starting XI.

---

## Project Description

$XI lets $XI token holders on Solana vote for their ideal 2026 FIFA World Cup Starting XI. Each holder connects their wallet, signs an Ed25519 message selecting one player per position in a 4-3-3 formation, and the aggregated community consensus is displayed on a live football pitch visualization.

The core mechanic: vote weight equals your current on-chain $XI token balance, refreshed every 10 minutes. This creates a dynamic, real-time governance system where the Starting XI shifts as tokens change hands. No gas fees, no staking, no lock-ups — just a signature.

**Why this matters for Solana**: The 2026 World Cup will be the largest sporting event in history, hosted across the US, Canada, and Mexico. $XI brings Solana to mainstream sports fans through an engagement model that's impossible on Web2 — live, stake-weighted governance with real-time results. Every voter becomes a Solana wallet holder.

---

## Technical Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, framer-motion
- **Auth**: Privy (@privy-io/react-auth) — Solana wallet-only login
- **Blockchain**: Solana (read-only via Helius RPC)
  - Ed25519 signature verification via tweetnacl
  - SPL token balance reading via Associated Token Account derivation
  - Batch balance refresh via getMultipleAccountsInfo
- **Database**: Neon PostgreSQL (serverless)
- **Worker**: node-cron for 10-minute balance refresh + daily snapshots
- **Mobile**: Capacitor (iOS + Android) wrapping the web app

No on-chain program deployed — all voting logic is server-side with cryptographic verification.

---

## Roadmap

**Completed:**
- Full voting platform live (web)
- Ed25519 signature verification
- 10-minute weight refresh
- Player database (100+ FIFA-eligible players)
- Live pitch visualization with substitution animations
- Capacitor mobile app (iOS + Android)
- Privacy policy, terms of service
- Security hardening (rate limiting, headers, input validation)

**Next 30 days:**
- App Store + Google Play submission
- Security audit (scoping with firms now)
- CoinGecko + CoinMarketCap listings
- Delaware C-Corp formation
- Trademark filing

**Next 90 days:**
- Push notifications for Starting XI changes
- Historical XI tracker (how the lineup evolved over time)
- "My picks vs. the People's XI" comparison view
- Shareable XI cards for social media
- Partnership with football content creators
- Federation outreach (Concacaf, US Soccer)

**World Cup 2026 (June-July):**
- Real-time XI updates during the tournament
- Match-by-match prediction voting
- Integration with live match data feeds

---

## Team

- **[YOUR_NAME]** — Founder & Developer. [Brief bio]
- [Additional team members if any]

---

## Funding Request

**Amount**: $[X] USD (paid in SOL or USDC)

**Use of funds:**
- Security audit: $3,000-5,000
- Infrastructure (Helius RPC, Neon DB, VPS): $2,000/year
- Mobile app developer accounts: $125/year
- Marketing and community growth: $[X]
- Legal (trademark, entity formation): $1,500

---

## Metrics / KPIs

- Unique wallets connected
- Total votes cast
- Daily active voters
- Total vote weight (proxy for token engagement)
- App Store downloads
- Social media impressions per XI update

---

## Links

- **Live App**: [YOUR_URL]
- **GitHub**: [YOUR_GITHUB]
- **Twitter**: [YOUR_TWITTER]
- **Contact**: [YOUR_EMAIL]
