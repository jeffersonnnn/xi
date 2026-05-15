'use client';

type StandingsBadgeProps = {
  rank: number;
  totalWeight: string;
  gapToFirst: string;
  isWinner: boolean;
  userBalance?: string;
  projectedRank?: number;
};

/**
 * Broadcast-style lower-third standings badge.
 * Parallelogram skew on outer container, counter-skew on content.
 */
export function StandingsBadge({
  rank,
  totalWeight,
  gapToFirst,
  isWinner,
  userBalance,
  projectedRank,
}: StandingsBadgeProps) {
  // Determine status: winning, close (within 10%), or behind
  const gap = Number(gapToFirst);
  const total = Number(totalWeight);
  const isClose = !isWinner && gap > 0 && total / gap > 0.9;
  const statusColor = isWinner ? 'bg-live' : isClose ? 'bg-close' : 'bg-behind';

  // Status mark
  const statusMark = isWinner
    ? { symbol: '▲', className: 'text-live' }
    : isClose
      ? { symbol: '●', className: 'text-close' }
      : { symbol: '▼', className: 'text-behind' };

  // Gap text
  const gapDisplay = isWinner
    ? `+${formatWeight(totalWeight)} ahead`
    : `-${formatWeight(gapToFirst)} behind`;

  // Projection line
  const showProjection =
    userBalance && projectedRank && projectedRank < rank;

  return (
    <div
      className="inline-flex items-stretch bg-panel rounded-sm overflow-hidden"
      style={{ transform: 'skewX(-5deg)' }}
    >
      {/* Left status edge */}
      <div className={`w-1 ${statusColor} shrink-0`} />

      {/* Content, counter-skewed to keep text straight */}
      <div
        className="flex items-center gap-2 px-3 py-1"
        style={{ transform: 'skewX(5deg)' }}
      >
        {/* Rank chip */}
        <span
          className={`font-mono text-xs font-medium ${
            rank === 1 ? 'text-live' : 'text-chalk-dim'
          }`}
        >
          #{rank}
        </span>

        {/* Status mark */}
        <span className={`text-[10px] leading-none ${statusMark.className}`}>
          {statusMark.symbol}
        </span>

        {/* Gap */}
        <span className="font-mono text-[11px] text-chalk-dim">
          {gapDisplay}
        </span>

        {/* Projection line on vote pick-time */}
        {showProjection && (
          <span className="font-mono text-[10px] text-gold ml-0.5">
            with your {formatWeight(userBalance!)} -&gt; moves to #{projectedRank}
          </span>
        )}
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
