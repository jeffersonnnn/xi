# Email to Halborn

**To**: sales@halborn.com
**Subject**: Security Audit Inquiry — $XI (Solana Token Voting Platform)

---

Hi Halborn team,

I'm reaching out about a security review for $XI, a Solana-based voting platform where token holders pick the 2026 FIFA World Cup Starting XI.

We're interested in Halborn specifically because of your deep Solana ecosystem experience. Our engagement would be scoped to server-side vote integrity — we don't have an on-chain program, but the signature verification, balance reading, and vote aggregation logic are security-critical.

**Key security surfaces:**
- Ed25519 signature verification via tweetnacl
- SPL token balance reading (ATA derivation + raw account parsing)
- Vote submission validation (timestamp windows, canonical message matching)
- 10-minute balance refresh worker (timing attack surface)
- Rate limiting and input sanitization on API routes

**Stack**: Next.js 14, TypeScript, Neon PostgreSQL, Helius RPC, Privy wallet auth

I've prepared a full technical brief (attached) covering architecture, code paths, and our current threat model. GitHub access available upon request.

Would you have availability for a scoping call this week?

Best,
[YOUR_NAME]
$XI — The People's Starting XI

**Attachments**: audit-brief.md
