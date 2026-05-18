import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - $XI',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="font-display text-5xl font-bold text-gold uppercase">Privacy Policy</h1>
      <p className="text-chalk-dim text-xs">Last updated: May 2025</p>

      <div className="bg-panel border border-line rounded-lg p-6 space-y-6 text-chalk-dim text-sm leading-relaxed">
        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">What We Collect</h2>
          <p>
            $XI collects the minimum data necessary to operate the voting platform:
          </p>
          <ul className="list-disc ml-5 mt-2 space-y-1">
            <li><strong className="text-chalk">Wallet address</strong> — your Solana public key, used to identify your votes and look up your on-chain $XI token balance. This is already public on the Solana blockchain.</li>
            <li><strong className="text-chalk">Vote selections</strong> — the players you pick for each position in the Starting XI.</li>
            <li><strong className="text-chalk">Cryptographic signature</strong> — the Ed25519 signature you produce when submitting a vote, used to verify you authorized the submission.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">What We Do Not Collect</h2>
          <p>
            We do not collect your name, email address, phone number, IP address, device fingerprint, or any other personally identifiable information.
            We do not use cookies for tracking. We do not run analytics scripts.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">Third-Party Services</h2>
          <ul className="list-disc ml-5 space-y-1">
            <li><strong className="text-chalk">Privy</strong> — wallet connection and authentication. See <span className="text-gold">privy.io/privacy</span> for their privacy policy.</li>
            <li><strong className="text-chalk">Helius</strong> — Solana RPC provider used to read on-chain token balances. No personal data is sent to Helius beyond the public wallet address.</li>
            <li><strong className="text-chalk">Neon Database</strong> — serverless PostgreSQL used to store votes and aggregated results.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">Data Retention</h2>
          <p>
            Vote data is retained for the duration of the $XI project. Since wallet addresses are public blockchain data
            and votes are the core product, there is no mechanism to &quot;delete your account&quot; in the traditional sense.
            If you disconnect your wallet and sell your $XI tokens, your vote weight drops to zero and your picks
            no longer influence the Starting XI.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">Changes</h2>
          <p>
            We may update this policy as the project evolves. Material changes will be announced via our official channels.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-chalk uppercase mb-2">Contact</h2>
          <p>
            Questions about this policy? Reach out on X (Twitter) or through the project&apos;s official channels.
          </p>
        </section>
      </div>
    </div>
  );
}
