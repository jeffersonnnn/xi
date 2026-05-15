'use client';
import { motion } from 'framer-motion';
import { buildShareUrl } from '@/lib/share';

type Pick = {
  slot: string;
  player: { id: string; name: string; nationality_code: string; };
  rank: number;
  is_slot_winner: boolean;
  gap_to_first: string;
  slot_total_weight: string;
};

type VoteResultsCardProps = {
  picks: Pick[];
  picksInXI: number;
  wallet: string;
};

function getPickStatus(pick: Pick): 'live' | 'close' | 'behind' {
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

const statusColor: Record<'live' | 'close' | 'behind', string> = {
  live: 'text-live',
  close: 'text-close',
  behind: 'text-behind',
};

const barColor: Record<'live' | 'close' | 'behind', string> = {
  live: 'bg-live',
  close: 'bg-close',
  behind: 'bg-behind',
};

export function VoteResultsCard({ picks, picksInXI }: VoteResultsCardProps) {
  const shareUrl = buildShareUrl(picksInXI, 11);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative bg-panel border border-line rounded-card p-5 sm:p-6 max-w-md mx-auto overflow-hidden"
    >
      {/* Ink-stamp overlay: "LINEUP CONFIRMED" */}
      <motion.div
        initial={{ scale: 2.5, rotate: -12, opacity: 0 }}
        animate={{ scale: 1, rotate: -3, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-4 right-4 z-10 pointer-events-none select-none"
      >
        <div className="border-[3px] border-gold rounded-sm px-4 py-1.5">
          <span className="font-display text-gold uppercase tracking-[0.2em] text-sm font-bold whitespace-nowrap">
            Lineup Confirmed
          </span>
        </div>
      </motion.div>

      {/* Headline */}
      <div className="mb-5 mt-1">
        <h2 className="font-display text-3xl sm:text-4xl uppercase leading-none tracking-tight text-chalk">
          <span className="font-mono text-gold text-4xl sm:text-5xl font-medium">{picksInXI}</span>
          <span className="text-chalk-dim text-2xl sm:text-3xl"> / 11</span>
        </h2>
        <p className="font-display text-lg uppercase tracking-wide text-chalk-dim mt-0.5">
          Picks in the People&apos;s XI
        </p>
      </div>

      {/* All 11 picks as compact rows */}
      <div className="space-y-1">
        {picks.map(pick => {
          const status = getPickStatus(pick);

          return (
            <div
              key={pick.slot}
              className="flex items-center gap-2.5 py-1.5 px-3 rounded-md bg-panel-raised relative overflow-hidden"
            >
              {/* Left edge bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${barColor[status]}`} />

              {/* Position chip */}
              <span className="text-[10px] font-mono text-chalk-dim uppercase w-10 shrink-0 pl-1">
                {pick.slot}
              </span>

              {/* Flag placeholder */}
              <div className="w-5 h-5 rounded-full bg-line flex items-center justify-center text-[8px] font-semibold text-chalk-dim uppercase shrink-0">
                {pick.player.nationality_code.slice(0, 2)}
              </div>

              {/* Player name */}
              <span className="text-sm font-semibold text-chalk flex-1 min-w-0 truncate">
                {pick.player.name}
              </span>

              {/* Status mark and gap */}
              <div className={`text-xs font-mono shrink-0 ${statusColor[status]}`}>
                <span className="mr-1">{statusMark[status]}</span>
                {pick.is_slot_winner ? (
                  <span className="font-semibold">IN XI</span>
                ) : (
                  <span className="text-chalk-dim">
                    #{pick.rank} (-{formatWeight(pick.gap_to_first)})
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 mt-5">
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gold hover:bg-gold-deep text-pitch-night text-sm font-bold py-2.5 px-4 rounded-btn text-center transition-colors"
        >
          Share on X
        </a>
        <a
          href="/"
          className="text-sm font-semibold text-chalk-dim hover:text-chalk transition-colors underline underline-offset-4 decoration-line hover:decoration-gold"
        >
          View on the pitch
        </a>
      </div>
    </motion.div>
  );
}

function formatWeight(weight: string): string {
  const n = Number(weight);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return weight;
}
