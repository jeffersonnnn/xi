import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - $XI',
};

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="font-display text-5xl font-bold text-gold uppercase">Terms of Service</h1>
      <p className="text-chalk-dim text-xs">Last updated: May 2025</p>

      <div className="bg-panel border border-line rounded-lg p-6 space-y-6 text-chalk-dim text-sm leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">Overview</h2>
          <p>
            $XI (&quot;The People&apos;s Starting XI&quot;) is a community-driven voting platform where $XI token holders
            select their preferred 2026 FIFA World Cup Starting XI. By using this platform, you agree to the
            following terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">Not Financial Advice</h2>
          <p>
            $XI is a governance and entertainment token. Nothing on this platform constitutes financial advice,
            investment advice, or a recommendation to buy, sell, or hold any cryptocurrency or digital asset.
            The $XI token carries no guarantee of value, return, or utility beyond participation in the
            voting mechanism described on this site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">Eligibility</h2>
          <p>
            You must hold $XI tokens in a Solana-compatible wallet to participate in voting. You are responsible
            for the security of your wallet and private keys. We cannot recover lost tokens or reverse transactions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">Voting Mechanism</h2>
          <p>
            Vote weight is determined by your current on-chain $XI token balance, refreshed periodically.
            Vote weight is not &quot;locked&quot; — if you transfer or sell your tokens, your vote weight decreases
            accordingly. The platform makes a good-faith effort to reflect accurate balances but does not
            guarantee real-time precision.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">No Affiliation</h2>
          <p>
            $XI is not affiliated with, endorsed by, or sponsored by FIFA, any national football federation,
            any club, or any player featured on the platform. Player data is used for informational and
            entertainment purposes only.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">Limitation of Liability</h2>
          <p>
            The platform is provided &quot;as is&quot; without warranties of any kind. We are not liable for any losses
            arising from the use of this platform, including but not limited to: token value fluctuations,
            smart contract vulnerabilities, wallet security breaches, or platform downtime.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">Changes</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the platform after
            changes are posted constitutes acceptance of the updated terms.
          </p>
        </section>
      </div>
    </div>
  );
}
