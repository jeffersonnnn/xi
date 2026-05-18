# Email to Sec3

**To**: Contact via sec3.dev
**Subject**: Security Review — $XI Solana Voting dApp

---

Hi Sec3 team,

I'm building $XI, a token-weighted governance app on Solana for the 2026 FIFA World Cup. Token holders sign a message to pick their Starting XI, weighted by their $XI balance.

Given Sec3's focus on Solana security tooling, I'd love to explore a security review engagement. Our scope is server-side vote integrity (no on-chain program to audit):

- Signature verification (Ed25519 via tweetnacl)
- On-chain balance reading (SPL token ATA + raw account data parsing via Helius)
- Vote validation flow (timestamp checks, canonical message matching, slot eligibility)
- Weight refresh timing (10-minute cron cycle)
- API hardening (rate limiting, parameterized queries)

Full technical brief attached. Happy to provide GitHub access and schedule a scoping call at your convenience.

Best,
[YOUR_NAME]
$XI — The People's Starting XI

**Attachments**: audit-brief.md
