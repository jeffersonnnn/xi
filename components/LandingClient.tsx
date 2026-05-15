'use client';
import { useState, useEffect, useRef } from 'react';
import { Pitch } from './Pitch';
import { PlayerCard } from './PlayerCard';
import { SubstitutionAnimation, SubstitutionBanner } from './SubstitutionAnimation';
import { UpdateClock } from './UpdateClock';
import { KickoffCountdown } from './KickoffCountdown';
import { SLOTS, SLOT_LABELS, SlotCode } from '@/lib/constants';
import { buildXIShareUrl } from '@/lib/share';
import { PROVISIONAL_XI } from '@/lib/provisional-xi';
import { HowItWorks } from './HowItWorks';
import Link from 'next/link';

type RunnerUp = {
  rank: number;
  name: string;
  total_weight: string;
};

type SlotData = {
  winner: {
    player_id: string;
    name: string;
    nationality_code: string;
    photo_url: string | null;
    club: string | null;
    total_weight: string;
    voter_count: number;
    rank: number;
  } | null;
  runners_up: RunnerUp[];
};

export function LandingClient() {
  const [xi, setXI] = useState<Record<string, SlotData>>({});
  const [stats, setStats] = useState({ voters: 0, total_weight: '0' });
  const [subBanner, setSubBanner] = useState<{ show: boolean; outPlayer?: string; inPlayer?: string; slot?: string }>({ show: false });
  const prevXI = useRef<Record<string, SlotData>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        const [xiRes, statsRes] = await Promise.all([
          fetch('/api/xi'),
          fetch('/api/stats'),
        ]);
        const xiData = await xiRes.json();
        const statsData = await statsRes.json();

        // Check for substitutions
        if (Object.keys(prevXI.current).length > 0) {
          for (const slot of SLOTS) {
            const prev = prevXI.current[slot]?.winner;
            const curr = xiData[slot]?.winner;
            if (prev && curr && prev.player_id !== curr.player_id) {
              setSubBanner({
                show: true,
                outPlayer: prev.name,
                inPlayer: curr.name,
                slot: SLOT_LABELS[slot],
              });
              setTimeout(() => setSubBanner({ show: false }), 3000);
              break; // Show one at a time
            }
          }
        }

        prevXI.current = xiData;
        setXI(xiData);
        setStats(statsData);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const pitchSlots: Partial<Record<SlotCode, React.ReactNode>> = {};
  for (const slot of SLOTS) {
    const data = xi[slot];
    const winner = data?.winner;
    const provisional = !winner ? PROVISIONAL_XI[slot] : null;

    pitchSlots[slot] = (
      <SubstitutionAnimation slotKey={slot} playerId={winner?.player_id || `provisional-${slot}`}>
        {winner ? (
          <PlayerCard
            name={winner.name}
            nationalityCode={winner.nationality_code}
            photoUrl={winner.photo_url}
            club={winner.club}
            weight={winner.total_weight}
            isWinner
            compact
          />
        ) : provisional ? (
          <div className="relative">
            <div className="opacity-50">
              <PlayerCard
                name={provisional.name}
                shortName={provisional.shortName}
                nationalityCode={provisional.nationalityCode}
                photoUrl={provisional.photoUrl}
                club={provisional.club}
                compact
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-30">
              <span className="bg-panel-raised border border-line text-chalk-dim text-[6px] sm:text-[7px] font-display uppercase tracking-widest px-1.5 py-0.5 rounded-sm whitespace-nowrap">
                Editor&apos;s Pick
              </span>
            </div>
          </div>
        ) : null}
      </SubstitutionAnimation>
    );
  }

  const xiForShare: Record<string, { name: string }> = {};
  for (const [slot, data] of Object.entries(xi)) {
    if (data?.winner) xiForShare[slot] = { name: data.winner.name };
  }
  const shareUrl = Object.keys(xiForShare).length > 0 ? buildXIShareUrl(xiForShare) : '#';

  return (
    <div className="space-y-8">
      <SubstitutionBanner {...subBanner} />

      {/* Header section */}
      <div className="text-center space-y-2">
        <h1 className="font-display text-6xl sm:text-8xl font-bold text-chalk uppercase tracking-tight leading-none">
          THE PEOPLE&apos;S STARTING <span className="text-gold">XI</span>
        </h1>
        <p className="text-chalk-dim text-sm sm:text-base mt-2">
          your bag votes the lineup.
        </p>
        <div className="inline-block font-display text-lg text-chalk-dim uppercase tracking-widest bg-panel-raised border border-line px-3 py-0.5 rotate-[-1deg] rounded-badge">4-3-3</div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 flex-wrap">
        <UpdateClock />
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center bg-panel px-4 py-2 -skew-x-6">
            <div className="skew-x-6">
              <div className="text-lg font-black text-chalk font-mono">{stats.voters}</div>
              <div className="text-[10px] font-display uppercase tracking-widest text-chalk-dim">Voters</div>
            </div>
          </div>
          <div className="text-center bg-panel px-4 py-2 -skew-x-6">
            <div className="skew-x-6">
              <div className="text-lg font-black text-chalk font-mono">{formatWeight(stats.total_weight)}</div>
              <div className="text-[10px] font-display uppercase tracking-widest text-chalk-dim">Total Weight</div>
            </div>
          </div>
        </div>
        <KickoffCountdown />
      </div>

      {/* Editor's XI banner when no real votes */}
      {Object.keys(xi).length > 0 && SLOTS.every(slot => !xi[slot]?.winner) && (
        <div className="text-center">
          <span className="font-display text-sm uppercase tracking-[0.2em] text-chalk-dim bg-panel border border-line px-4 py-1 rounded-badge">
            Editor&apos;s XI - Vote to replace these picks
          </span>
        </div>
      )}

      {/* The pitch */}
      <Pitch slots={pitchSlots} />

      {/* CTA */}
      <div className="flex items-center justify-center gap-4">
        <Link href="/vote"
          className="bg-gold hover:bg-gold-deep text-pitch-night font-display font-black text-sm uppercase tracking-wider py-3 px-8 rounded-btn transition-colors">
          Vote Your XI
        </Link>
        {shareUrl !== '#' && (
          <a href={shareUrl} target="_blank" rel="noopener noreferrer"
            className="bg-panel hover:bg-panel-raised border border-line text-chalk font-semibold text-sm py-3 px-6 rounded-btn transition-colors">
            Share on X
          </a>
        )}
      </div>

      {/* How it works */}
      <HowItWorks />

      {/* Runners up / slot details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {SLOTS.map(slot => {
          const data = xi[slot];
          return (
            <div key={slot} className="bg-panel border border-line rounded-lg p-3">
              <div className="text-[10px] font-display uppercase tracking-widest text-chalk-dim font-semibold mb-2">
                {SLOT_LABELS[slot]}
              </div>
              {data?.winner ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-display text-gold">{data.winner.name}</span>
                    <span className="text-xs text-chalk-dim font-mono">{formatWeight(data.winner.total_weight)}</span>
                  </div>
                  {data.runners_up.slice(0, 3).map((ru: RunnerUp, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-chalk-dim">
                      <span>#{ru.rank}</span>
                      <span className="text-chalk-dim">{ru.name}</span>
                      <span className="font-mono">{formatWeight(ru.total_weight)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-chalk-dim">No votes yet</div>
              )}
            </div>
          );
        })}
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
