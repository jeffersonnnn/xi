'use client';
import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets, useSignMessage } from '@privy-io/react-auth/solana';
import { Pitch } from '@/components/Pitch';
import { PlayerCard } from '@/components/PlayerCard';
import { PlayerPicker } from '@/components/PlayerPicker';
import { VoteResultsCard } from '@/components/VoteResultsCard';
import { MyXI } from '@/components/MyXI';
import { WalletButton } from '@/components/WalletButton';
import { SLOTS, SLOT_LABELS, SlotCode } from '@/lib/constants';
import { buildCanonicalMessage, SLOT_ORDER } from '@/lib/verify';
import bs58 from 'bs58';

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

export default function VotePage() {
  const { ready, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { signMessage: privySignMessage } = useSignMessage();
  const wallet = wallets[0];
  const walletAddress = wallet?.address;
  const [picks, setPicks] = useState<Partial<Record<SlotCode, Player>>>({});
  const [pickerSlot, setPickerSlot] = useState<SlotCode | null>(null);
  const [hasExistingVote, setHasExistingVote] = useState<boolean | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [voteResult, setVoteResult] = useState<any | null>(null);
  const [balance, setBalance] = useState<string>('0');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [xiData, setXiData] = useState<Record<string, any> | null>(null);

  // Check for existing votes
  useEffect(() => {
    if (!walletAddress) {
      setHasExistingVote(null);
      return;
    }
    fetch(`/api/votes/${walletAddress}`)
      .then(r => r.json())
      .then(data => {
        setHasExistingVote(data.picks && data.picks.length > 0);
        setBalance(data.live_weight || '0');
      })
      .catch(() => setHasExistingVote(false));
  }, [walletAddress]);

  // Fetch balance
  useEffect(() => {
    if (!walletAddress) return;
    fetch(`/api/balance/${walletAddress}`)
      .then(r => r.json())
      .then(data => setBalance(data.balance || '0'))
      .catch(() => {});
  }, [walletAddress]);

  // Fetch XI data for standings
  useEffect(() => {
    fetch('/api/xi')
      .then(r => r.json())
      .then(data => setXiData(data))
      .catch(() => {});
  }, []);

  const handlePickPlayer = (slot: SlotCode, player: Player) => {
    setPicks(prev => ({ ...prev, [slot]: player }));
  };

  const selectedPlayerIds = Object.values(picks).filter(Boolean).map(p => p!.id);
  const allPicked = SLOTS.every(slot => picks[slot]);

  const handleSubmit = async () => {
    if (!wallet || !walletAddress || !allPicked) return;
    setSubmitting(true);

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const picksRecord: Record<string, string> = {};
      for (const slot of SLOT_ORDER) {
        picksRecord[slot] = picks[slot as SlotCode]!.id;
      }

      const message = buildCanonicalMessage(walletAddress, timestamp, picksRecord);
      const messageBytes = new TextEncoder().encode(message);
      const { signature: signatureBytes } = await privySignMessage({ message: messageBytes, wallet });
      const signature = bs58.encode(signatureBytes);

      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet: walletAddress,
          picks: picksRecord,
          signature,
          message,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Vote failed: ${err.error}`);
        return;
      }

      // Fetch updated standings
      const standingsRes = await fetch(`/api/votes/${walletAddress}`);
      const standings = await standingsRes.json();
      setVoteResult(standings);
      setHasExistingVote(true);
      setIsEditing(false);
    } catch (e: unknown) {
      console.error('Vote error:', e);
      const msg = e instanceof Error ? e.message : 'Unknown error';
      alert(`Vote failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Not connected
  if (!ready || !authenticated || !walletAddress) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-6">
        <h1 className="font-display text-4xl font-bold text-chalk uppercase">Vote Your XI</h1>
        <p className="text-chalk-dim text-center max-w-md">
          Connect your Solana wallet to vote for your 2026 World Cup Starting XI.
          Your $XI token balance determines your vote weight.
        </p>
        <WalletButton />
      </div>
    );
  }

  // Just submitted
  if (voteResult && !isEditing) {
    return (
      <div className="py-8 space-y-6">
        <VoteResultsCard
          picks={voteResult.picks}
          picksInXI={voteResult.picks_in_xi}
          wallet={walletAddress}
        />
      </div>
    );
  }

  // Has existing vote and not editing
  if (hasExistingVote && !isEditing) {
    return (
      <div className="py-4">
        <MyXI onEditLineup={() => setIsEditing(true)} />
      </div>
    );
  }

  // Voting ballot
  const pitchSlots: Partial<Record<SlotCode, React.ReactNode>> = {};
  for (const slot of SLOTS) {
    const player = picks[slot];
    const currentLeader = xiData?.[slot]?.winner;

    pitchSlots[slot] = (
      <button
        onClick={() => setPickerSlot(slot)}
        className="flex flex-col items-center gap-0.5 cursor-pointer group"
      >
        {player ? (
          <PlayerCard
            name={player.name}
            nationalityCode={player.nationality_code}
            club={player.club}
            compact
            onClick={() => setPickerSlot(slot)}
          />
        ) : (
          <div className="w-12 h-14 sm:w-16 sm:h-20 rounded-md border-2 border-dashed border-line group-hover:border-gold/50 flex flex-col items-center justify-center transition-colors">
            <span className="text-[7px] sm:text-[8px] font-display text-chalk-dim uppercase font-semibold">{SLOT_LABELS[slot]}</span>
            <span className="text-[10px] text-gold/50">+</span>
          </div>
        )}
        {!player && currentLeader && (
          <span className="text-[7px] text-chalk-dim truncate max-w-16">
            {currentLeader.name}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-chalk uppercase">
          {isEditing ? 'Edit Your XI' : 'Pick Your XI'}
        </h1>
        <p className="text-chalk-dim text-sm">
          Select one player per position. Your vote weight: <span className="text-gold font-mono font-bold">{formatWeight(balance)}</span> $XI
        </p>
        <p className="text-chalk-dim text-xs">
          {Object.keys(picks).length} of 11 picks made
        </p>
      </div>

      <Pitch slots={pitchSlots} />

      {/* Docked submit bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-panel/95 backdrop-blur border-t border-line">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg text-chalk font-bold">{Object.keys(picks).length}</span>
            <span className="text-chalk-dim text-sm">/ 11 selected</span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!allPicked || submitting}
            className="bg-gold hover:bg-gold-deep disabled:opacity-30 disabled:cursor-not-allowed text-pitch-night font-display text-sm uppercase tracking-wider py-3 px-8 rounded-btn transition-colors"
          >
            {submitting ? 'Signing...' : 'Sign & Submit'}
          </button>
        </div>
      </div>

      <PlayerPicker
        open={pickerSlot !== null}
        onClose={() => setPickerSlot(null)}
        slot={pickerSlot || 'GK'}
        onSelect={(player) => {
          if (pickerSlot) handlePickPlayer(pickerSlot, player);
        }}
        selectedPlayerIds={selectedPlayerIds}
        standings={pickerSlot && xiData?.[pickerSlot] ? [
          ...(xiData[pickerSlot].winner ? [xiData[pickerSlot].winner] : []),
          ...(xiData[pickerSlot].runners_up || []),
        ] : undefined}
      />
    </div>
  );
}

function formatWeight(weight: string): string {
  const n = Number(weight);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return weight;
}
