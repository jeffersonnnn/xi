'use client';
import { useState, useEffect } from 'react';
import { PlayerCard } from '@/components/PlayerCard';
import { Input } from '@/components/ui/input';

type Player = {
  id: string;
  name: string;
  short_name: string | null;
  nationality_code: string;
  nationality_name: string;
  club: string | null;
  primary_position: string;
  eligible_slots: string[];
  photo_url: string | null;
};

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [search, setSearch] = useState('');
  const [posFilter, setPosFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'nation' | 'position'>('name');

  useEffect(() => {
    fetch('/api/players')
      .then(r => r.json())
      .then(data => setPlayers(data.players || []))
      .catch(() => []);
  }, []);

  const filtered = players.filter(p => {
    if (posFilter !== 'ALL' && p.primary_position !== posFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) ||
      p.nationality_name.toLowerCase().includes(q) ||
      p.nationality_code.toLowerCase().includes(q) ||
      (p.club || '').toLowerCase().includes(q);
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'nation') return a.nationality_code.localeCompare(b.nationality_code);
    return a.primary_position.localeCompare(b.primary_position);
  });

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="font-display text-4xl font-bold text-chalk uppercase">Player Roster</h1>
        <p className="text-chalk-dim text-sm mt-1">{players.length} players available for selection</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search players..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs bg-panel border-line text-chalk placeholder:text-chalk-dim"
        />
        <div className="flex gap-1">
          {['ALL', 'GK', 'DEF', 'MID', 'FWD'].map(pos => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-3 py-1 text-xs font-bold uppercase rounded transition-colors ${
                posFilter === pos
                  ? 'bg-gold text-pitch-night'
                  : 'bg-panel text-chalk-dim hover:text-chalk'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
        <div className="flex gap-1 ml-auto">
          {(['name', 'nation', 'position'] as const).map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`px-2 py-1 text-[10px] uppercase tracking-wider rounded transition-colors ${
                sortBy === s ? 'bg-panel-raised text-chalk' : 'text-chalk-dim hover:text-chalk'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {filtered.map(player => (
          <PlayerCard
            key={player.id}
            name={player.name}
            shortName={player.short_name ?? undefined}
            nationalityCode={player.nationality_code}
            club={player.club}
            photoUrl={player.photo_url ?? undefined}
            position={player.primary_position}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-chalk-dim">No players found</div>
      )}
    </div>
  );
}
