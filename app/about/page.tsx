export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="font-impact text-5xl font-bold text-gold uppercase">Match Day Programme</h1>
        <div className="font-display text-chalk-dim text-sm mt-2 uppercase tracking-[0.2em]">The People&apos;s XI</div>
      </div>

      <div className="bg-panel border border-line rounded-lg p-6 space-y-6">
        <section>
          <h2 className="font-display text-2xl font-bold text-chalk uppercase mb-2">What is $XI?</h2>
          <p className="text-chalk-dim text-sm leading-relaxed">
            $XI is the People&apos;s Starting XI for the 2026 FIFA World Cup. Token holders connect their Solana wallet,
            sign a message picking one player per position in a 4-3-3 formation, and the community&apos;s consensus XI
            is displayed live on a football pitch.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-chalk uppercase mb-2">How does voting work?</h2>
          <p className="text-chalk-dim text-sm leading-relaxed mb-2">
            Your vote weight equals your current $XI token balance. The more tokens you hold, the more your picks
            matter. There are no transactions, no gas fees. You simply sign a message with your wallet.
          </p>
          <p className="text-chalk-dim text-sm leading-relaxed">
            Every 10 minutes, a background process re-checks every voter&apos;s on-chain $XI balance. If you sell your
            tokens, your vote weight drops to zero. If you buy more, your influence grows. The lineup updates in
            real time, with player substitution animations whenever a position&apos;s leader changes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-chalk uppercase mb-2">The 10-Minute Refresh</h2>
          <p className="text-chalk-dim text-sm leading-relaxed">
            This is the defining mechanic. Vote weight is live, not sticky. The displayed XI moves in discrete
            10-minute steps as token holdings change hands. When a slot&apos;s winner changes, the outgoing player slides
            off and the incoming player slides on, just like a real matchday substitution.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-chalk uppercase mb-2">Formation</h2>
          <p className="text-chalk-dim text-sm leading-relaxed">
            The People&apos;s XI uses a classic 4-3-3 formation: 1 goalkeeper, 4 defenders (LB, CB, CB, RB),
            3 midfielders (LM, CM, RM), and 3 forwards (LW, ST, RW). Each position accepts players based
            on their natural role.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-bold text-chalk uppercase mb-2">Links</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-chalk-dim">Token:</span>
              <span className="font-mono text-gold text-xs break-all">
                {process.env.NEXT_PUBLIC_XI_TOKEN_MINT || 'TBA'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
