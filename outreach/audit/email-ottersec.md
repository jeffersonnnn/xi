# Email to OtterSec

**To**: audits@osec.io
**Subject**: Security Review Request — $XI (Solana Voting dApp)

---

Hi OtterSec team,

I'm building $XI, a token-weighted voting platform on Solana where holders pick the 2026 FIFA World Cup Starting XI. I'd like to engage your team for a security review of our server-side vote integrity logic.

**Quick context:**
- Solana SPL token holders connect via Privy, sign an Ed25519 message selecting 11 players, and the aggregated "People's XI" updates live
- Vote weight = current on-chain $XI balance, refreshed every 10 minutes
- There is NO on-chain program — all Solana interaction is read-only (token balance lookups via Helius RPC)
- The security surface is the server-side code: signature verification (tweetnacl), canonical message validation, timestamp windows, vote upsert logic, and the balance refresh worker

**What we'd like reviewed:**
1. Vote signature verification implementation
2. On-chain balance reading and ATA derivation
3. Weight refresh timing attack surface
4. API input validation and rate limiting
5. Overall vote integrity

**Tech stack**: Next.js 14, TypeScript, Neon PostgreSQL, Helius RPC, Privy auth

I've attached a detailed technical brief covering the architecture, security-relevant code paths, and threat model. The codebase is available on GitHub.

Could we schedule a scoping call this week? Happy to work within your standard engagement process.

Best,
[YOUR_NAME]
[YOUR_TITLE]
$XI — The People's Starting XI

**Attachments**: audit-brief.md
