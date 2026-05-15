'use client';
import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

/* ─── design tokens ─── */
const C = {
  pitchNight:  '#0A0F0C',
  panel:       '#141A15',
  panelRaised: '#1C241D',
  line:        '#2A332B',
  chalk:       '#F2F5EF',
  chalkDim:    '#9AA89C',
  gold:        '#F5C518',
  goldDeep:    '#C99A06',
  live:        '#34E08A',
  behind:      '#FF5247',
} as const;

/* ─── helpers ─── */
export function formatWeight(weight: string): string {
  const n = Number(weight);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return weight;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* simple nationality-to-color map for monogram backgrounds */
function flagAccent(code: string): string {
  const map: Record<string, string> = {
    BRA: '#009c3b', ARG: '#74acdf', FRA: '#002395', GER: '#dd0000',
    ENG: '#cf081f', ESP: '#c60b1e', POR: '#006600', NED: '#ff6c00',
    ITA: '#008c45', URU: '#001489', BEL: '#ed2939', CRO: '#ff0000',
    NGA: '#008751', SEN: '#00853f', MAR: '#c1272d', JPN: '#bc002d',
    KOR: '#003478', MEX: '#006847', USA: '#3c3b6e', CAN: '#ff0000',
    COL: '#fcd116', CHI: '#d52b1e', ECU: '#034ea2', PER: '#d91023',
  };
  return map[code?.toUpperCase()] || '#3A4A3D';
}

/* ─── types ─── */
type PlayerCardProps = {
  name: string;
  shortName?: string;
  nationalityCode: string;
  club?: string | null;
  photoUrl?: string | null;
  position?: string;
  weight?: string;
  rank?: number;
  isWinner?: boolean;
  isBehind?: boolean;
  compact?: boolean;
  selected?: boolean;
  onClick?: () => void;
};

/* ─── the card ─── */
export function PlayerCard({
  name,
  shortName,
  nationalityCode,
  club,
  photoUrl,
  position,
  weight,
  rank,
  isWinner,
  isBehind,
  compact,
  selected,
  onClick,
}: PlayerCardProps) {
  const displayName = shortName || name.split(' ').pop() || name;

  if (compact) {
    return (
      <CompactCard
        name={name}
        displayName={displayName}
        nationalityCode={nationalityCode}
        photoUrl={photoUrl}
        weight={weight}
        position={position}
        isWinner={isWinner}
        isBehind={isBehind}
        selected={selected}
        onClick={onClick}
      />
    );
  }

  return (
    <FullCard
      name={name}
      displayName={displayName}
      nationalityCode={nationalityCode}
      club={club}
      photoUrl={photoUrl}
      position={position}
      weight={weight}
      rank={rank}
      isWinner={isWinner}
      isBehind={isBehind}
      selected={selected}
      onClick={onClick}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   COMPACT CARD - pitch overlay mode
   Small FUT silhouette: metallic border, weight number, name
   ═══════════════════════════════════════════════════════════════ */
function CompactCard({
  name,
  displayName,
  nationalityCode,
  photoUrl,
  weight,
  position,
  isWinner,
  isBehind,
  selected,
  onClick,
}: {
  name: string;
  displayName: string;
  nationalityCode: string;
  photoUrl?: string | null;
  weight?: string;
  position?: string;
  isWinner?: boolean;
  isBehind?: boolean;
  selected?: boolean;
  onClick?: () => void;
}) {
  const borderColor = isWinner
    ? `linear-gradient(135deg, ${C.gold}, ${C.goldDeep}, ${C.gold})`
    : `linear-gradient(135deg, ${C.line}, ${C.line})`;

  const dimmed = isBehind && !isWinner;

  return (
    <motion.div
      whileHover={{ scale: 1.08, y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={onClick}
      className={`relative flex flex-col items-center ${onClick ? 'cursor-pointer' : ''}`}
      style={{ filter: dimmed ? 'saturate(0.35) brightness(0.7)' : undefined }}
    >
      {/* Card body */}
      <div
        className="relative w-[52px] h-[66px] sm:w-[68px] sm:h-[86px] flex flex-col items-center overflow-hidden"
        style={{
          borderRadius: '8px',
          padding: '1.5px',
          background: selected
            ? `linear-gradient(135deg, ${C.gold}, ${C.goldDeep}, ${C.gold})`
            : borderColor,
        }}
      >
        {/* Inner panel */}
        <div
          className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden"
          style={{
            borderRadius: '6.5px',
            background: `linear-gradient(180deg, ${C.panel} 0%, ${C.pitchNight} 100%)`,
          }}
        >
          {/* Winner glow */}
          {isWinner && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow: `inset 0 0 12px ${C.gold}33`,
                borderRadius: '6.5px',
              }}
            />
          )}

          {/* Weight number - the loudest element */}
          {weight && (
            <div className="w-full flex items-center justify-between px-1 pt-0.5 sm:px-1.5 sm:pt-1">
              <span
                className="font-mono text-[10px] sm:text-xs font-bold leading-none"
                style={{ color: isWinner ? C.gold : C.chalk }}
              >
                {formatWeight(weight)}
              </span>
              {position && (
                <span
                  className="text-[6px] sm:text-[7px] font-bold uppercase tracking-wider leading-none"
                  style={{ color: C.chalkDim }}
                >
                  {position}
                </span>
              )}
            </div>
          )}

          {/* Photo or monogram */}
          <div className="flex-1 flex items-end justify-center w-full pb-0 overflow-hidden">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={name}
                className="h-[32px] sm:h-[44px] object-contain object-bottom"
                loading="lazy"
              />
            ) : (
              <div
                className="w-[28px] h-[28px] sm:w-[36px] sm:h-[36px] rounded-full flex items-center justify-center mb-0.5"
                style={{ background: flagAccent(nationalityCode) + '44' }}
              >
                <span
                  className="text-[9px] sm:text-[11px] font-bold leading-none"
                  style={{ color: C.chalk }}
                >
                  {getInitials(name)}
                </span>
              </div>
            )}
          </div>

          {/* Name plate */}
          <div
            className="w-full text-center px-0.5 py-[2px] sm:py-[3px]"
            style={{ background: C.panelRaised }}
          >
            <span
              className="font-display text-[7px] sm:text-[9px] font-bold uppercase tracking-tight leading-none block truncate"
              style={{ color: C.chalk }}
            >
              {displayName}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FULL CARD - roster / detail mode
   Complete FUT anatomy with 3D tilt hover + sheen
   ═══════════════════════════════════════════════════════════════ */
function FullCard({
  name,
  displayName,
  nationalityCode,
  club,
  photoUrl,
  position,
  weight,
  rank,
  isWinner,
  isBehind,
  selected,
  onClick,
}: {
  name: string;
  displayName: string;
  nationalityCode: string;
  club?: string | null;
  photoUrl?: string | null;
  position?: string;
  weight?: string;
  rank?: number;
  isWinner?: boolean;
  isBehind?: boolean;
  selected?: boolean;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  /* ── motion values for 3D tilt ── */
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rawRotateX = useTransform(mouseY, [0, 1], [5, -5]);
  const rawRotateY = useTransform(mouseX, [0, 1], [-5, 5]);
  const rotateX = useSpring(rawRotateX, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(rawRotateY, { stiffness: 300, damping: 25 });

  /* sheen position follows cursor X */
  const sheenX = useTransform(mouseX, [0, 1], [-100, 200]);
  const sheenGradient = useTransform(
    sheenX,
    (x) =>
      `linear-gradient(105deg, transparent ${x - 40}%, rgba(255,255,255,0.5) ${x}%, transparent ${x + 40}%)`,
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY],
  );

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  }, [mouseX, mouseY]);

  const dimmed = isBehind && !isWinner;

  /* border style based on tier */
  const borderGradient = isWinner
    ? `linear-gradient(135deg, ${C.gold}, ${C.goldDeep} 40%, ${C.gold} 70%, ${C.goldDeep})`
    : selected
      ? `linear-gradient(135deg, ${C.gold}, ${C.goldDeep}, ${C.gold})`
      : `linear-gradient(135deg, ${C.line}, ${C.line})`;

  /* nationality flag URL (uses flagcdn.com for free circular flags) */
  const flagUrl = nationalityCode
    ? `https://flagcdn.com/w40/${nationalityCode.toLowerCase()}.png`
    : null;

  return (
    <div style={{ perspective: '800px' }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: 'preserve-3d',
          filter: dimmed ? 'saturate(0.35) brightness(0.65)' : undefined,
        }}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className={`
          relative w-[152px] sm:w-[176px]
          ${onClick ? 'cursor-pointer' : ''}
        `}
      >
        {/* Outer border frame */}
        <div
          className="relative overflow-hidden"
          style={{
            borderRadius: '14px',
            padding: '1.5px',
            background: borderGradient,
          }}
        >
          {/* Inner card surface */}
          <div
            className="relative overflow-hidden"
            style={{
              borderRadius: '12.5px',
              background: `linear-gradient(180deg, ${C.panel} 0%, ${C.pitchNight} 80%)`,
            }}
          >
            {/* Winner inner glow */}
            {isWinner && (
              <div
                className="absolute inset-0 pointer-events-none z-10"
                style={{
                  boxShadow: `inset 0 0 24px ${C.gold}22, inset 0 0 48px ${C.gold}11`,
                  borderRadius: '12.5px',
                }}
              />
            )}

            {/* Sheen sweep overlay (CSS + motion) */}
            <motion.div
              className="absolute inset-0 pointer-events-none z-30"
              style={{
                borderRadius: '12.5px',
                opacity: isHovered ? 0.12 : 0,
                background: sheenGradient,
                transition: 'opacity 0.15s ease',
              }}
            />

            {/* ── Top section: weight, position, flag, club ── */}
            <div className="relative z-20 flex items-start justify-between px-3 pt-3 pb-1">
              {/* Left column: weight + position */}
              <div className="flex flex-col items-start gap-0">
                {weight && (
                  <span
                    className="font-mono text-[22px] sm:text-[26px] font-bold leading-none tracking-tight"
                    style={{ color: isWinner ? C.gold : C.chalk }}
                  >
                    {formatWeight(weight)}
                  </span>
                )}
                {position && (
                  <span
                    className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.12em] leading-tight mt-0.5"
                    style={{ color: isWinner ? C.goldDeep : C.chalkDim }}
                  >
                    {position}
                  </span>
                )}
              </div>

              {/* Right column: flag + club crest */}
              <div className="flex flex-col items-center gap-1.5 pt-0.5">
                {flagUrl && (
                  <div
                    className="w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] rounded-full overflow-hidden border"
                    style={{ borderColor: C.line }}
                  >
                    <img
                      src={flagUrl}
                      alt={nationalityCode}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}
                {club && (
                  <span
                    className="text-[7px] sm:text-[8px] font-semibold uppercase tracking-wider leading-none text-center max-w-[40px] truncate"
                    style={{ color: C.chalkDim }}
                  >
                    {club}
                  </span>
                )}
              </div>
            </div>

            {/* ── Photo area ── */}
            <div className="relative z-20 flex justify-center items-end h-[100px] sm:h-[120px] px-2 -mt-1">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={name}
                  className="h-full object-contain object-bottom drop-shadow-lg"
                  style={{
                    /* allow slight bleed past top frame */
                    marginTop: '-8px',
                  }}
                  loading="lazy"
                />
              ) : (
                /* Monogram tile fallback */
                <div
                  className="w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${flagAccent(nationalityCode)}55, ${flagAccent(nationalityCode)}22)`,
                  }}
                >
                  <span
                    className="font-display text-[28px] sm:text-[34px] font-bold uppercase leading-none"
                    style={{ color: C.chalk }}
                  >
                    {getInitials(name)}
                  </span>
                </div>
              )}
            </div>

            {/* ── Bottom separator line ── */}
            <div
              className="mx-3 h-px"
              style={{
                background: isWinner
                  ? `linear-gradient(90deg, transparent, ${C.gold}66, transparent)`
                  : `linear-gradient(90deg, transparent, ${C.line}, transparent)`,
              }}
            />

            {/* ── Name plate ── */}
            <div
              className="relative z-20 px-3 py-2"
              style={{ background: C.panelRaised }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-display text-[16px] sm:text-[18px] font-bold uppercase tracking-tight leading-none truncate flex-1 mr-2"
                  style={{ color: C.chalk }}
                >
                  {displayName}
                </span>
                {rank && (
                  <span
                    className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded leading-none shrink-0"
                    style={{
                      background: rank === 1 ? C.gold : C.line,
                      color: rank === 1 ? C.pitchNight : C.chalkDim,
                    }}
                  >
                    #{rank}
                  </span>
                )}
              </div>

              {/* Nationality + club subline */}
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider"
                  style={{ color: C.chalkDim }}
                >
                  {nationalityCode}
                </span>
                {club && (
                  <>
                    <span
                      className="text-[8px]"
                      style={{ color: C.line }}
                    >
                      |
                    </span>
                    <span
                      className="text-[9px] sm:text-[10px] truncate"
                      style={{ color: `${C.chalkDim}99` }}
                    >
                      {club}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Bottom rounded edge */}
            <div
              className="h-1"
              style={{
                borderRadius: '0 0 12.5px 12.5px',
                background: isWinner
                  ? `linear-gradient(90deg, ${C.goldDeep}, ${C.gold}, ${C.goldDeep})`
                  : C.panelRaised,
              }}
            />
          </div>
        </div>

        {/* Winner outer glow shadow */}
        {isWinner && (
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            style={{
              borderRadius: '14px',
              boxShadow: `0 0 20px ${C.gold}33, 0 4px 24px ${C.gold}22`,
            }}
          />
        )}

        {/* Selected ring */}
        {selected && !isWinner && (
          <div
            className="absolute -inset-[3px] -z-10 pointer-events-none"
            style={{
              borderRadius: '17px',
              border: `2px solid ${C.gold}`,
              boxShadow: `0 0 12px ${C.gold}44`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
