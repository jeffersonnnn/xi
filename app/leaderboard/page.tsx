'use client';
import { useState, useEffect } from 'react';

type LeaderboardEntry = {
  wallet: string;
  weight: string;
};

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/stats')
      .then(r => r.json())
      .then(data => {
        setEntries(data.leaderboard || []);
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-chalk uppercase">Top Voters</h1>
        <p className="text-chalk-dim text-sm mt-1">Top 50 wallets by current $XI weight</p>
      </div>

      <div className="bg-panel border border-line rounded-lg overflow-hidden max-w-2xl mx-auto">
        <div className="grid grid-cols-12 gap-2 px-4 py-2 border-b border-line font-display text-[10px] uppercase tracking-widest text-chalk-dim font-semibold">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Wallet</div>
          <div className="col-span-3 text-right">Weight</div>
          <div className="col-span-3"></div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-chalk-dim text-sm">Loading...</div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8 text-chalk-dim text-sm">No voters yet</div>
        ) : (() => {
          const maxWeight = entries.length > 0 ? Number(entries[0].weight) : 0;
          return entries.map((entry, i) => (
            <div key={entry.wallet} className={`grid grid-cols-12 gap-2 px-4 py-2.5 items-center border-b border-line/30 ${
              i % 2 === 0 ? 'bg-pitch-night' : 'bg-panel'
            } ${i < 3 ? 'border-l-2 border-gold' : ''}`}>
              <div className="col-span-1 text-sm font-mono font-bold text-chalk-dim">{i + 1}</div>
              <div className="col-span-5 font-mono text-xs text-chalk truncate">
                {entry.wallet.slice(0, 4)}...{entry.wallet.slice(-4)}
              </div>
              <div className="col-span-3 text-right font-mono text-sm font-bold text-chalk">
                {formatWeight(entry.weight)}
              </div>
              {/* Relative weight bar */}
              <div className="col-span-3">
                <div className="h-1.5 rounded-full bg-line overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gold"
                    style={{
                      width: `${maxWeight > 0 ? (Number(entry.weight) / maxWeight) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ));
        })()
        }
      </div>
    </div>
  );
}

function formatWeight(weight: string): string {
  const n = Number(weight);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return weight;
}
