'use client';
import { Wallet, Scale, RefreshCw } from 'lucide-react';

const BLOCKS = [
  {
    icon: Wallet,
    title: 'Connect & Vote',
    description: 'Connect your Solana wallet and pick one player per position in a 4-3-3. No gas fees - just sign a message.',
  },
  {
    icon: Scale,
    title: 'Your Bag = Your Weight',
    description: 'Your $XI token balance is your vote weight. More tokens, more influence on who starts.',
  },
  {
    icon: RefreshCw,
    title: 'Live Every 10 Min',
    description: 'Balances re-checked on-chain every 10 minutes. Sell your tokens, lose your weight. The lineup never stops moving.',
  },
] as const;

export function HowItWorks() {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-chalk uppercase tracking-tight text-center">
        How It Works
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {BLOCKS.map((block, i) => (
          <div key={i} className="bg-panel border border-line rounded-card p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-badge bg-panel-raised border border-line flex items-center justify-center shrink-0">
                <block.icon className="w-4 h-4 text-gold" />
              </div>
              <h3 className="font-display text-lg font-bold text-chalk uppercase tracking-tight leading-none">
                {block.title}
              </h3>
            </div>
            <p className="text-chalk-dim text-sm leading-relaxed">
              {block.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
