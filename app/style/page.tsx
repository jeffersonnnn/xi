'use client';

import { PlayerCard } from '@/components/PlayerCard';
import { StandingsBadge } from '@/components/StandingsBadge';
import { UpdateClock } from '@/components/UpdateClock';
import { KickoffCountdown } from '@/components/KickoffCountdown';
import { VoteResultsCard } from '@/components/VoteResultsCard';

/* ─── design tokens (mirrored from tailwind config for swatches) ─── */
const COLORS = {
  neutrals: [
    { name: 'pitch-night', hex: '#0A0F0C' },
    { name: 'panel', hex: '#141A15' },
    { name: 'panel-raised', hex: '#1C241D' },
    { name: 'line', hex: '#2A332B' },
    { name: 'chalk', hex: '#F2F5EF' },
    { name: 'chalk-dim', hex: '#9AA89C' },
  ],
  pitch: [
    { name: 'turf', hex: '#1A7D42' },
    { name: 'turf-stripe', hex: '#156B38' },
    { name: 'turf-shadow', hex: '#0C3D20' },
  ],
  accents: [
    { name: 'gold', hex: '#F5C518' },
    { name: 'gold-deep', hex: '#C99A06' },
    { name: 'live', hex: '#34E08A' },
    { name: 'behind', hex: '#FF5247' },
    { name: 'close', hex: '#FFB020' },
  ],
};

/* ─── mock data ─── */
const MOCK_PLAYER = {
  name: 'Kylian Mbappe',
  nationalityCode: 'FRA',
  club: 'Real Madrid',
  position: 'FWD',
  weight: '2340000',
};

const MOCK_PICKS = [
  { slot: 'GK', player: { id: '1', name: 'Alisson Becker', nationality_code: 'BRA' }, rank: 1, is_slot_winner: true, gap_to_first: '0', slot_total_weight: '1800000' },
  { slot: 'CB_L', player: { id: '2', name: 'Virgil van Dijk', nationality_code: 'NED' }, rank: 1, is_slot_winner: true, gap_to_first: '0', slot_total_weight: '2100000' },
  { slot: 'CB_R', player: { id: '3', name: 'Ruben Dias', nationality_code: 'POR' }, rank: 2, is_slot_winner: false, gap_to_first: '320000', slot_total_weight: '1900000' },
  { slot: 'LB', player: { id: '4', name: 'Alphonso Davies', nationality_code: 'CAN' }, rank: 1, is_slot_winner: true, gap_to_first: '0', slot_total_weight: '1500000' },
  { slot: 'RB', player: { id: '5', name: 'Trent Alexander-Arnold', nationality_code: 'ENG' }, rank: 3, is_slot_winner: false, gap_to_first: '780000', slot_total_weight: '2000000' },
  { slot: 'CM_L', player: { id: '6', name: 'Jude Bellingham', nationality_code: 'ENG' }, rank: 1, is_slot_winner: true, gap_to_first: '0', slot_total_weight: '2500000' },
  { slot: 'CM_C', player: { id: '7', name: 'Kevin De Bruyne', nationality_code: 'BEL' }, rank: 2, is_slot_winner: false, gap_to_first: '150000', slot_total_weight: '2200000' },
  { slot: 'CM_R', player: { id: '8', name: 'Pedri', nationality_code: 'ESP' }, rank: 1, is_slot_winner: true, gap_to_first: '0', slot_total_weight: '1700000' },
  { slot: 'LW', player: { id: '9', name: 'Vinicius Jr', nationality_code: 'BRA' }, rank: 1, is_slot_winner: true, gap_to_first: '0', slot_total_weight: '3100000' },
  { slot: 'ST', player: { id: '10', name: 'Kylian Mbappe', nationality_code: 'FRA' }, rank: 1, is_slot_winner: true, gap_to_first: '0', slot_total_weight: '2340000' },
  { slot: 'RW', player: { id: '11', name: 'Bukayo Saka', nationality_code: 'ENG' }, rank: 4, is_slot_winner: false, gap_to_first: '920000', slot_total_weight: '1600000' },
];

/* ─── section wrapper ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-line rounded-card bg-panel p-6 sm:p-8">
      <h2 className="font-display text-[36px] font-semibold uppercase tracking-tight text-gold mb-6 leading-none">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ─── swatch component ─── */
function Swatch({ name, hex }: { name: string; hex: string }) {
  const isLight = ['#F2F5EF', '#F5C518', '#FFB020', '#34E08A', '#9AA89C'].includes(hex);
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-badge border border-line"
        style={{ background: hex }}
      />
      <span
        className="font-display text-xs uppercase tracking-wider leading-tight text-center"
        style={{ color: isLight ? hex : '#9AA89C' }}
      >
        {name}
      </span>
      <span className="font-mono text-[11px] text-chalk-dim">{hex}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   STYLE GUIDE PAGE
   Dev-only visual QA surface for every component state
   ═══════════════════════════════════════════════════════════════ */
export default function StyleGuidePage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Page title */}
      <div className="border-b border-line pb-6">
        <h1 className="font-display text-[56px] sm:text-[80px] font-bold uppercase tracking-tight text-chalk leading-none">
          <span className="text-gold">$</span>XI Style Guide
        </h1>
        <p className="font-sans text-base text-chalk-dim mt-3 max-w-xl">
          Visual QA surface. Every component rendered in every state.
          Design tokens, typography scale, and interactive elements.
        </p>
      </div>

      {/* ─── 1. Typography Scale ─── */}
      <Section title="1. Typography Scale">
        <div className="space-y-8">
          {/* Hero display */}
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim">
              Hero Display - 80px Teko 700, caps
            </span>
            <p
              className="font-display uppercase leading-none"
              style={{ fontSize: '80px', fontWeight: 700 }}
            >
              THE PEOPLE&apos;S XI
            </p>
          </div>

          {/* Section header */}
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim">
              Section Header - 36px Teko 600, caps
            </span>
            <p
              className="font-display uppercase leading-none"
              style={{ fontSize: '36px', fontWeight: 600 }}
            >
              VOTE YOUR STARTING ELEVEN
            </p>
          </div>

          {/* Sub-header */}
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim">
              Sub-header - 22px Teko 600, caps
            </span>
            <p
              className="font-display uppercase leading-none"
              style={{ fontSize: '22px', fontWeight: 600 }}
            >
              YOUR BAG PICKS THE SQUAD
            </p>
          </div>

          {/* Card player name */}
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim">
              Card Player Name - 17px Teko 600, caps
            </span>
            <p
              className="font-display uppercase leading-none"
              style={{ fontSize: '17px', fontWeight: 600 }}
            >
              KYLIAN MBAPPE
            </p>
          </div>

          {/* Body */}
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim">
              Body - 16px Inter 400
            </span>
            <p className="font-sans text-base font-normal">
              Your $XI tokens decide who starts in the People&apos;s Starting XI for the 2026 FIFA World Cup.
              Each token cast adds weight to your pick. The heaviest bag wins the slot.
            </p>
          </div>

          {/* Label / meta */}
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim">
              Label / Meta - 12px Inter 600, caps, tracking
            </span>
            <p
              className="font-sans uppercase leading-none"
              style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.12em' }}
            >
              NEXT UPDATE IN 08:42
            </p>
          </div>

          {/* Big counter */}
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim">
              Big Counter - 56px JetBrains Mono 500
            </span>
            <p
              className="font-mono leading-none tabular-nums"
              style={{ fontSize: '56px', fontWeight: 500 }}
            >
              2,340,000
            </p>
          </div>

          {/* Inline stat */}
          <div className="space-y-1">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim">
              Inline Stat - 15px Inter 600, tabular-nums
            </span>
            <p
              className="font-sans tabular-nums leading-none"
              style={{ fontSize: '15px', fontWeight: 600 }}
            >
              2.3M tokens - #1 in slot - +340K lead
            </p>
          </div>
        </div>
      </Section>

      {/* ─── 2. Color Palette ─── */}
      <Section title="2. Color Palette">
        <div className="space-y-8">
          {/* Neutrals */}
          <div className="space-y-3">
            <h3 className="font-display text-[22px] font-semibold uppercase text-chalk-dim leading-none">
              Neutrals
            </h3>
            <div className="flex flex-wrap gap-4">
              {COLORS.neutrals.map((c) => (
                <Swatch key={c.name} name={c.name} hex={c.hex} />
              ))}
            </div>
          </div>

          {/* Pitch */}
          <div className="space-y-3">
            <h3 className="font-display text-[22px] font-semibold uppercase text-chalk-dim leading-none">
              Pitch
            </h3>
            <div className="flex flex-wrap gap-4">
              {COLORS.pitch.map((c) => (
                <Swatch key={c.name} name={c.name} hex={c.hex} />
              ))}
            </div>
          </div>

          {/* Accents */}
          <div className="space-y-3">
            <h3 className="font-display text-[22px] font-semibold uppercase text-chalk-dim leading-none">
              Accents
            </h3>
            <div className="flex flex-wrap gap-4">
              {COLORS.accents.map((c) => (
                <Swatch key={c.name} name={c.name} hex={c.hex} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 3. PlayerCard States ─── */}
      <Section title="3. PlayerCard States">
        <div className="space-y-8">
          {/* Full-size cards */}
          <div className="space-y-3">
            <h3 className="font-display text-[22px] font-semibold uppercase text-chalk-dim leading-none">
              Full Cards
            </h3>
            <div className="flex flex-wrap gap-6 items-start">
              {/* Default */}
              <div className="space-y-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
                  Default
                </span>
                <PlayerCard
                  name={MOCK_PLAYER.name}
                  nationalityCode={MOCK_PLAYER.nationalityCode}
                  club={MOCK_PLAYER.club}
                  position={MOCK_PLAYER.position}
                  weight={MOCK_PLAYER.weight}
                  rank={3}
                />
              </div>

              {/* Winning */}
              <div className="space-y-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-gold block">
                  Winning (gold border)
                </span>
                <PlayerCard
                  name={MOCK_PLAYER.name}
                  nationalityCode={MOCK_PLAYER.nationalityCode}
                  club={MOCK_PLAYER.club}
                  position={MOCK_PLAYER.position}
                  weight={MOCK_PLAYER.weight}
                  rank={1}
                  isWinner
                />
              </div>

              {/* Behind */}
              <div className="space-y-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-behind block">
                  Behind (dimmed)
                </span>
                <PlayerCard
                  name={MOCK_PLAYER.name}
                  nationalityCode={MOCK_PLAYER.nationalityCode}
                  club={MOCK_PLAYER.club}
                  position={MOCK_PLAYER.position}
                  weight={MOCK_PLAYER.weight}
                  rank={5}
                  isBehind
                />
              </div>

              {/* Empty slot placeholder */}
              <div className="space-y-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
                  Empty Slot
                </span>
                <div
                  className="w-[152px] sm:w-[176px] h-[220px] rounded-card border-2 border-dashed border-line flex flex-col items-center justify-center gap-3"
                  style={{ background: '#141A1566' }}
                >
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-line flex items-center justify-center">
                    <span className="text-chalk-dim text-2xl leading-none">+</span>
                  </div>
                  <span className="font-display text-sm uppercase tracking-wider text-chalk-dim">
                    Empty Slot
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Compact cards */}
          <div className="space-y-3">
            <h3 className="font-display text-[22px] font-semibold uppercase text-chalk-dim leading-none">
              Compact Cards (pitch overlay)
            </h3>
            <div className="flex flex-wrap gap-6 items-start">
              {/* Compact default */}
              <div className="space-y-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
                  Compact Default
                </span>
                <PlayerCard
                  name={MOCK_PLAYER.name}
                  nationalityCode={MOCK_PLAYER.nationalityCode}
                  position={MOCK_PLAYER.position}
                  weight={MOCK_PLAYER.weight}
                  compact
                />
              </div>

              {/* Compact winner */}
              <div className="space-y-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-gold block">
                  Compact Winner
                </span>
                <PlayerCard
                  name={MOCK_PLAYER.name}
                  nationalityCode={MOCK_PLAYER.nationalityCode}
                  position={MOCK_PLAYER.position}
                  weight={MOCK_PLAYER.weight}
                  compact
                  isWinner
                />
              </div>

              {/* Compact behind */}
              <div className="space-y-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-behind block">
                  Compact Behind
                </span>
                <PlayerCard
                  name={MOCK_PLAYER.name}
                  nationalityCode={MOCK_PLAYER.nationalityCode}
                  position={MOCK_PLAYER.position}
                  weight={MOCK_PLAYER.weight}
                  compact
                  isBehind
                />
              </div>

              {/* Compact selected */}
              <div className="space-y-2">
                <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-gold block">
                  Compact Selected
                </span>
                <PlayerCard
                  name={MOCK_PLAYER.name}
                  nationalityCode={MOCK_PLAYER.nationalityCode}
                  position={MOCK_PLAYER.position}
                  weight={MOCK_PLAYER.weight}
                  compact
                  selected
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 4. StandingsBadge States ─── */}
      <Section title="4. StandingsBadge States">
        <div className="flex flex-wrap gap-6 items-start">
          {/* Winning */}
          <div className="space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-live block">
              Winning (#1)
            </span>
            <StandingsBadge
              rank={1}
              totalWeight="2340000"
              gapToFirst="0"
              isWinner
            />
          </div>

          {/* Close */}
          <div className="space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-close block">
              Close (#2, amber)
            </span>
            <StandingsBadge
              rank={2}
              totalWeight="2100000"
              gapToFirst="240000"
              isWinner={false}
            />
          </div>

          {/* Behind */}
          <div className="space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-behind block">
              Behind (#5)
            </span>
            <StandingsBadge
              rank={5}
              totalWeight="890000"
              gapToFirst="1450000"
              isWinner={false}
            />
          </div>
        </div>
      </Section>

      {/* ─── 5. UpdateClock ─── */}
      <Section title="5. UpdateClock">
        <div className="space-y-2">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
            Live countdown to next weight tally
          </span>
          <UpdateClock intervalMinutes={10} />
        </div>
      </Section>

      {/* ─── 6. KickoffCountdown ─── */}
      <Section title="6. KickoffCountdown">
        <div className="space-y-2">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
            Countdown to 2026 World Cup kickoff
          </span>
          <KickoffCountdown />
        </div>
      </Section>

      {/* ─── 7. Buttons ─── */}
      <Section title="7. Buttons">
        <div className="space-y-6">
          {/* Primary */}
          <div className="space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
              Primary
            </span>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="bg-gold text-pitch-night font-display uppercase text-sm font-semibold tracking-wider rounded-btn px-6 py-2.5 hover:brightness-110 transition-all active:scale-[0.97]">
                Cast Vote
              </button>
              <button className="bg-gold text-pitch-night font-display uppercase text-sm font-semibold tracking-wider rounded-btn px-6 py-2.5 opacity-50 cursor-not-allowed">
                Cast Vote (disabled)
              </button>
            </div>
          </div>

          {/* Secondary */}
          <div className="space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
              Secondary
            </span>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="bg-transparent border border-line text-chalk font-display uppercase text-sm font-semibold tracking-wider rounded-btn px-6 py-2.5 hover:border-gold hover:text-gold transition-all active:scale-[0.97]">
                View Roster
              </button>
              <button className="bg-transparent border border-line text-chalk font-display uppercase text-sm font-semibold tracking-wider rounded-btn px-6 py-2.5 opacity-50 cursor-not-allowed">
                View Roster (disabled)
              </button>
            </div>
          </div>

          {/* Ghost / text link */}
          <div className="space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
              Ghost / Text Link
            </span>
            <div className="flex flex-wrap gap-3 items-center">
              <button className="bg-transparent text-chalk-dim font-display uppercase text-sm font-semibold tracking-wider px-4 py-2 hover:text-gold transition-colors underline underline-offset-4 decoration-line hover:decoration-gold">
                Learn More
              </button>
            </div>
          </div>

          {/* Wallet adapter (note: requires wallet context, shown as styled mock) */}
          <div className="space-y-2">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
              Wallet Button (styled mock)
            </span>
            <div className="flex flex-wrap gap-3 items-center">
              <div className="inline-flex items-center gap-2 bg-panel-raised border border-line rounded-btn px-5 py-2.5 hover:border-gold transition-colors cursor-pointer">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <rect x="1" y="3" width="14" height="10" rx="2" stroke="#9AA89C" strokeWidth="1.5" />
                  <rect x="10" y="6" width="3" height="4" rx="1" fill="#9AA89C" />
                </svg>
                <span className="font-display uppercase text-sm font-semibold tracking-wider text-chalk">
                  Connect Wallet
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 8. Broadcast Lower-Third ─── */}
      <Section title="8. Broadcast Lower-Third">
        <div className="space-y-2">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
            Parallelogram-skewed stat bar treatment
          </span>

          {/* Lower-third container */}
          <div className="relative max-w-lg overflow-hidden">
            {/* Background bar with skew */}
            <div
              className="relative flex items-stretch"
              style={{ minHeight: '56px' }}
            >
              {/* Gold accent stripe */}
              <div
                className="w-1.5 shrink-0"
                style={{
                  background: 'linear-gradient(180deg, #F5C518, #C99A06)',
                  transform: 'skewX(-12deg)',
                  marginRight: '-2px',
                }}
              />

              {/* Main bar */}
              <div
                className="flex-1 flex items-center justify-between px-5 py-3"
                style={{
                  background: 'linear-gradient(135deg, #1C241D, #141A15)',
                  transform: 'skewX(-12deg)',
                  borderRight: '3px solid #2A332B',
                }}
              >
                <div style={{ transform: 'skewX(12deg)' }} className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="font-display text-[11px] uppercase tracking-[0.2em] text-chalk-dim leading-tight">
                      Striker Slot
                    </span>
                    <span className="font-display text-[22px] uppercase font-bold text-chalk leading-none tracking-tight">
                      Kylian Mbappe
                    </span>
                  </div>
                </div>

                <div style={{ transform: 'skewX(12deg)' }} className="flex items-center gap-5">
                  <div className="flex flex-col items-end">
                    <span className="font-display text-[10px] uppercase tracking-[0.2em] text-chalk-dim leading-tight">
                      Weight
                    </span>
                    <span className="font-mono text-lg font-medium text-gold tabular-nums leading-none">
                      2.3M
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-display text-[10px] uppercase tracking-[0.2em] text-chalk-dim leading-tight">
                      Lead
                    </span>
                    <span className="font-mono text-lg font-medium text-live tabular-nums leading-none">
                      +340K
                    </span>
                  </div>
                </div>
              </div>

              {/* Right cap */}
              <div
                className="w-3 shrink-0"
                style={{
                  background: '#2A332B',
                  transform: 'skewX(-12deg)',
                  marginLeft: '-2px',
                }}
              />
            </div>

            {/* Pulsing live dot below */}
            <div className="flex items-center gap-2 mt-2 pl-4">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
              </span>
              <span className="font-display uppercase text-[10px] tracking-[0.2em] text-live">
                Live
              </span>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── 9. VoteResultsCard ─── */}
      <Section title="9. VoteResultsCard">
        <div className="space-y-2">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-chalk-dim block">
            &ldquo;LINEUP CONFIRMED&rdquo; state with mock picks
          </span>
          <VoteResultsCard
            picks={MOCK_PICKS}
            picksInXI={7}
            wallet="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
          />
        </div>
      </Section>
    </div>
  );
}
