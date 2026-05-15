'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useWallets } from '@privy-io/react-auth/solana';
import { toast } from 'sonner';
import { Pitch } from './Pitch';
import { PlayerCard } from './PlayerCard';
import { UpdateClock } from './UpdateClock';
import { StandingsBadge } from './StandingsBadge';
import { buildShareUrl } from '@/lib/share';
import { SlotCode } from '@/lib/constants';

type PickStanding = {
  slot: string;
  player: { id: string; name: string; nationality_code: string; photo_url: string | null; };
  slot_total_weight: string;
  rank: number;
  is_slot_winner: boolean;
  gap_to_first: string;
  gap_to_next: string;
};

type WalletStandings = {
  wallet: string;
  live_weight: string;
  picks_in_xi: number;
  picks: PickStanding[];
};

type MyXIProps = {
  onEditLineup: () => void;
};

function getPickStatus(pick: PickStanding): 'live' | 'close' | 'behind' {
  if (pick.is_slot_winner) return 'live';
  const total = Number(pick.slot_total_weight);
  const gap = Number(pick.gap_to_first);
  if (total > 0 && gap / total < 0.1) return 'close';
  return 'behind';
}

const statusMark: Record<'live' | 'close' | 'behind', string> = {
  live: '▲',
  close: '●',
  behind: '▼',
};

const statusTextClass: Record<'live' | 'close' | 'behind', string> = {
  live: 'text-live',
  close: 'text-close',
  behind: 'text-behind',
};

const barBgClass: Record<'live' | 'close' | 'behind', string> = {
  live: 'bg-live',
  close: 'bg-close',
  behind: 'bg-behind',
};

export function MyXI({ onEditLineup }: MyXIProps) {
  const { wallets } = useWallets();
  const walletAddress = wallets[0]?.address;
  const [standings, setStandings] = useState<WalletStandings | null>(null);
  const prevStandings = useRef<WalletStandings | null>(null);

  const fetchStandings = useCallback(async () => {
    if (!walletAddress) return;
    try {
      const res = await fetch(`/api/votes/${walletAddress}`);
      const data = await res.json();

      // Check for changes and fire styled toasts
      if (prevStandings.current && data.picks) {
        for (const pick of data.picks) {
          const prev = prevStandings.current.picks.find(p => p.slot === pick.slot);
          if (!prev) continue;

          if (!prev.is_slot_winner && pick.is_slot_winner) {
            toast.custom(() => (
              <div className="flex items-stretch bg-panel border border-line rounded-md overflow-hidden shadow-lg min-w-[280px]">
                <div className="w-1 bg-live shrink-0" />
                <div className="px-3 py-2.5">
                  <div className="text-xs font-display uppercase tracking-wider text-live mb-0.5">Subbed In</div>
                  <div className="text-sm font-semibold text-chalk">
                    {pick.player.name} <span className="text-chalk-dim">took over</span> {pick.slot}
                  </div>
                </div>
              </div>
            ), { position: 'top-right', duration: 4000 });
          } else if (prev.is_slot_winner && !pick.is_slot_winner) {
            toast.custom(() => (
              <div className="flex items-stretch bg-panel border border-line rounded-md overflow-hidden shadow-lg min-w-[280px]">
                <div className="w-1 bg-behind shrink-0" />
                <div className="px-3 py-2.5">
                  <div className="text-xs font-display uppercase tracking-wider text-behind mb-0.5">Subbed Out</div>
                  <div className="text-sm font-semibold text-chalk">
                    {pick.player.name} <span className="text-chalk-dim">lost</span> {pick.slot}
                  </div>
                </div>
              </div>
            ), { position: 'top-right', duration: 4000 });
          }
        }
      }

      prevStandings.current = data;
      setStandings(data);
    } catch (e) {
      console.error('Failed to fetch standings:', e);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchStandings();
    const interval = setInterval(fetchStandings, 30000);
    return () => clearInterval(interval);
  }, [fetchStandings]);

  if (!standings || standings.picks.length === 0) {
    return null;
  }

  const shareUrl = buildShareUrl(standings.picks_in_xi, 11);

  const pitchSlots: Partial<Record<SlotCode, React.ReactNode>> = {};
  for (const pick of standings.picks) {
    pitchSlots[pick.slot as SlotCode] = (
      <div className="flex flex-col items-center gap-0.5">
        <PlayerCard
          name={pick.player.name}
          nationalityCode={pick.player.nationality_code}
          photoUrl={pick.player.photo_url}
          weight={pick.slot_total_weight}
          rank={pick.rank}
          isWinner={pick.is_slot_winner}
          compact
        />
        <StandingsBadge
          rank={pick.rank}
          totalWeight={pick.slot_total_weight}
          gapToFirst={pick.gap_to_first}
          isWinner={pick.is_slot_winner}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Broadcast-style header strip */}
      <div className="bg-panel-raised border border-line rounded-md px-4 py-3 flex items-center justify-between flex-wrap gap-4">
        {/* Left: weight + picks count */}
        <div className="flex items-center gap-6">
          <div>
            <div className="text-[10px] font-display uppercase tracking-[0.15em] text-chalk-dim">Live Weight</div>
            <div className="font-mono text-2xl font-medium text-chalk leading-none mt-0.5">
              {formatWeight(standings.live_weight)} <span className="text-gold text-sm">$XI</span>
            </div>
          </div>
          <div className="w-px h-8 bg-line" />
          <div>
            <div className="text-[10px] font-display uppercase tracking-[0.15em] text-chalk-dim">In the XI</div>
            <div className="font-mono text-2xl font-medium text-gold leading-none mt-0.5">
              {standings.picks_in_xi}<span className="text-chalk-dim text-sm"> / 11</span>
            </div>
          </div>
        </div>

        {/* Right: clock, edit, share */}
        <div className="flex items-center gap-3">
          <UpdateClock />
          <button
            onClick={onEditLineup}
            className="border border-line text-chalk text-xs font-semibold py-2 px-4 rounded-btn bg-transparent hover:border-gold transition-colors"
          >
            Edit lineup
          </button>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-chalk-dim hover:text-chalk underline underline-offset-4 decoration-line hover:decoration-gold transition-colors"
          >
            Share on X
          </a>
        </div>
      </div>

      <Pitch slots={pitchSlots} />

      {/* Per-pick standings list, broadcast lower-third style */}
      <div className="bg-panel border border-line rounded-md overflow-hidden">
        <div className="px-4 py-2.5 border-b border-line">
          <h3 className="font-display uppercase text-sm tracking-[0.15em] text-chalk-dim">
            Pick-by-pick Standings
          </h3>
        </div>
        <div className="divide-y divide-line/50">
          {standings.picks.map(pick => {
            const status = getPickStatus(pick);

            return (
              <div
                key={pick.slot}
                className="flex items-center justify-between py-2.5 px-4 relative"
              >
                {/* Left edge bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${barBgClass[status]}`} />

                <div className="flex items-center gap-3 pl-2">
                  {/* Status mark */}
                  <span className={`text-xs font-mono ${statusTextClass[status]}`}>
                    {statusMark[status]}
                  </span>
                  <span className="text-[10px] text-chalk-dim uppercase font-mono w-10">{pick.slot}</span>
                  <span className="text-sm text-chalk font-semibold">{pick.player.name}</span>
                </div>

                <div className="text-xs text-right font-mono">
                  {pick.is_slot_winner ? (
                    <span className="text-live font-semibold">
                      WINNING by {formatWeight(pick.gap_to_next)}
                    </span>
                  ) : (
                    <span className="text-chalk-dim">
                      #{pick.rank} <span className="text-chalk-dim/60">|</span> {formatWeight(pick.gap_to_first)} behind
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
