'use client';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlotCode, SLOT_LABELS } from '@/lib/constants';

type Player = {
  id: string;
  name: string;
  short_name: string | null;
  nationality_code: string;
  nationality_name: string;
  club: string | null;
  primary_position: string;
  photo_url: string | null;
};

type SlotStandings = {
  player_id: string;
  total_weight: string;
  rank: number;
}[];

type PlayerPickerProps = {
  open: boolean;
  onClose: () => void;
  slot: SlotCode;
  onSelect: (player: Player) => void;
  selectedPlayerIds: string[];
  standings?: SlotStandings;
};

export function PlayerPicker({ open, onClose, slot, onSelect, selectedPlayerIds, standings }: PlayerPickerProps) {
  const [search, setSearch] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setSearch('');
    fetch(`/api/players?slot=${slot}`)
      .then(r => r.json())
      .then(data => setPlayers(data.players || []))
      .catch(() => setPlayers([]))
      .finally(() => setLoading(false));
  }, [open, slot]);

  const standingsMap = new Map((standings || []).map(s => [s.player_id, s]));

  // Find the current slot leader among eligible players
  const leaderId = standings && standings.length > 0
    ? standings.reduce((best, s) => s.rank < best.rank ? s : best, standings[0]).player_id
    : null;

  const filtered = players.filter(p => {
    if (selectedPlayerIds.includes(p.id)) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) ||
      p.nationality_name.toLowerCase().includes(q) ||
      (p.club || '').toLowerCase().includes(q);
  });

  // Pin the slot leader to the top
  const sorted = [...filtered].sort((a, b) => {
    if (a.id === leaderId) return -1;
    if (b.id === leaderId) return 1;
    return 0;
  });

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-lg bg-panel-raised border border-line text-chalk">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl uppercase tracking-wide text-gold">
            Pick {SLOT_LABELS[slot]}
          </DialogTitle>
        </DialogHeader>

        {/* Search field */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chalk-dim"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            placeholder="Search by name, nation, or club..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-transparent border-b border-line text-chalk placeholder:text-chalk-dim/50 pl-10 pr-3 py-2.5 text-sm outline-none focus:border-gold transition-colors"
          />
        </div>

        <ScrollArea className="h-80">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-chalk-dim text-sm">Loading players...</div>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-8 text-chalk-dim text-sm">No eligible players found</div>
          ) : (
            <div className="space-y-0.5 pr-2">
              {sorted.map(player => {
                const standing = standingsMap.get(player.id);
                const isLeader = player.id === leaderId;

                return (
                  <button
                    key={player.id}
                    onClick={() => { onSelect(player); onClose(); }}
                    className={`
                      w-full flex items-center gap-3 p-2.5 rounded-md
                      hover:bg-panel transition-all duration-150 text-left
                      ${isLeader ? 'border-l-2 border-l-gold bg-panel/50' : 'border-l-2 border-l-transparent'}
                    `}
                  >
                    {/* Circular flag placeholder with nationality initials */}
                    <div className="w-9 h-9 rounded-full bg-line flex items-center justify-center text-[11px] font-semibold text-chalk-dim uppercase shrink-0 tracking-tight">
                      {player.nationality_code.slice(0, 3)}
                    </div>

                    {/* Name and club */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-chalk truncate">{player.name}</div>
                      <div className="text-xs text-chalk-dim">
                        {player.club || player.nationality_name}
                      </div>
                    </div>

                    {/* Weight and rank */}
                    {standing && (
                      <div className="text-right shrink-0 font-mono">
                        <div className={`text-xs font-medium ${standing.rank === 1 ? 'text-gold' : 'text-chalk-dim'}`}>
                          #{standing.rank}
                        </div>
                        <div className="text-[10px] text-chalk-dim/60">
                          {formatWeight(standing.total_weight)}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function formatWeight(weight: string): string {
  const n = Number(weight);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return weight;
}
