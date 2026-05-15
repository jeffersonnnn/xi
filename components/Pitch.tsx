'use client';
import { PITCH_POSITIONS, SlotCode } from '@/lib/constants';

type PitchProps = {
  slots?: Partial<Record<SlotCode, React.ReactNode>>;
};

export function Pitch({ slots }: PitchProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto" style={{ aspectRatio: '400/560' }}>
      {/* Crowd/stadium atmosphere background */}
      <div
        className="absolute inset-0 rounded-xl overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #0C3D20 0%, #0A0F0C 70%)',
        }}
      />

      <svg
        viewBox="0 0 400 560"
        className="relative w-full h-full"
        role="img"
        aria-label="Football pitch with 4-3-3 formation layout"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Mow stripe pattern - horizontal stripes, 8 stripes across the pitch */}
          <pattern id="mow-stripes" width="400" height="125" patternUnits="userSpaceOnUse">
            <rect width="400" height="62.5" fill="#1A7D42" />
            <rect y="62.5" width="400" height="62.5" fill="#156B38" />
          </pattern>

          {/* Floodlight glow from top center */}
          <radialGradient id="floodlight" cx="50%" cy="10%" r="70%" fx="50%" fy="10%">
            <stop offset="0%" stopColor="#2AAF5A" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Corner vignette - darkens edges and corners */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="transparent" stopOpacity="0" />
            <stop offset="85%" stopColor="#0C3D20" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0C3D20" stopOpacity="0.7" />
          </radialGradient>

          {/* LED ribbon glow filter */}
          <filter id="led-glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* LED animated dot pattern */}
          <pattern id="led-dots" width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="0.8" fill="#F5C518" opacity="0.5" />
          </pattern>
        </defs>

        {/* ── Layer 0: Stadium surround (dark background) ── */}
        <rect width="400" height="560" fill="#0A0F0C" rx="12" />

        {/* ── Layer 1: Faint crowd bokeh dots ── */}
        <g opacity="0.06">
          {Array.from({ length: 80 }).map((_, i) => {
            // Golden-ratio-based scatter for even distribution
            const x = (i * 137.508) % 400;
            const y = (i * 73.337) % 560;
            const r = 0.8 + (i % 4) * 0.6;
            // Skip dots that would land on the pitch surface
            const inPitch = x > 28 && x < 372 && y > 28 && y < 532;
            if (inPitch) return null;
            return (
              <circle
                key={`bokeh-${i}`}
                cx={x}
                cy={y}
                r={r}
                fill={i % 3 === 0 ? '#F5C518' : i % 3 === 1 ? '#FFFFFF' : '#5BD890'}
                opacity={0.2 + (i % 6) * 0.08}
              />
            );
          })}
        </g>

        {/* Subtle crowd gradient haze at the very edges */}
        <rect
          x="0" y="0" width="400" height="28"
          fill="url(#vignette)" opacity="0.15"
        />
        <rect
          x="0" y="532" width="400" height="28"
          fill="url(#vignette)" opacity="0.15"
        />

        {/* ── Layer 2: LED ribbon strip (outside the pitch boundary) ── */}
        {/* Outer glow layer */}
        <rect
          x="24" y="24" width="352" height="512"
          rx="4" ry="4"
          fill="none"
          stroke="#F5C518"
          strokeWidth="2.5"
          opacity="0.12"
          filter="url(#led-glow)"
        />
        {/* Core LED strip */}
        <rect
          x="24" y="24" width="352" height="512"
          rx="4" ry="4"
          fill="none"
          stroke="#F5C518"
          strokeWidth="1.2"
          opacity="0.3"
          filter="url(#led-glow)"
        />
        {/* LED dot overlay on the ribbon path */}
        <rect
          x="22" y="22" width="356" height="516"
          rx="5" ry="5"
          fill="none"
          stroke="url(#led-dots)"
          strokeWidth="4"
          opacity="0.25"
        />

        {/* ── Layer 3: Pitch surface with horizontal mow stripes ── */}
        <rect x="30" y="30" width="340" height="500" fill="url(#mow-stripes)" rx="2" />

        {/* ── Layer 4: Floodlight overlay ── */}
        <rect x="30" y="30" width="340" height="500" fill="url(#floodlight)" rx="2" />

        {/* ── Layer 5: Vignette overlay ── */}
        <rect x="30" y="30" width="340" height="500" fill="url(#vignette)" rx="2" />

        {/* ── Layer 6: Pitch markings (turf-line white @ 88% opacity) ── */}
        <g stroke="rgba(255,255,255,0.88)" strokeWidth="1.5" fill="none">
          {/* Outer boundary */}
          <rect x="40" y="40" width="320" height="480" />

          {/* Halfway line */}
          <line x1="40" y1="280" x2="360" y2="280" />

          {/* Centre circle */}
          <circle cx="200" cy="280" r="50" />
          {/* Centre spot */}
          <circle cx="200" cy="280" r="2.5" fill="rgba(255,255,255,0.88)" />

          {/* ── Top end (attacking end, goal at top) ── */}

          {/* Top penalty box */}
          <rect x="100" y="40" width="200" height="90" />
          {/* Top six-yard box */}
          <rect x="145" y="40" width="110" height="35" />
          {/* Top penalty arc (outside the box) */}
          <path d="M 140 130 Q 200 155 260 130" />
          {/* Top penalty spot */}
          <circle cx="200" cy="100" r="2" fill="rgba(255,255,255,0.88)" />
          {/* Top goal */}
          <rect
            x="165" y="28" width="70" height="12"
            strokeDasharray="3,2" opacity="0.6"
          />

          {/* ── Bottom end (GK / defensive end) ── */}

          {/* Bottom penalty box */}
          <rect x="100" y="390" width="200" height="130" />
          {/* Bottom six-yard box */}
          <rect x="145" y="485" width="110" height="35" />
          {/* Bottom penalty arc (outside the box) */}
          <path d="M 140 390 Q 200 365 260 390" />
          {/* Bottom penalty spot */}
          <circle cx="200" cy="460" r="2" fill="rgba(255,255,255,0.88)" />
          {/* Bottom goal */}
          <rect
            x="165" y="520" width="70" height="12"
            strokeDasharray="3,2" opacity="0.6"
          />

          {/* ── Corner arcs ── */}
          {/* Top-left */}
          <path d="M 40 50 A 10 10 0 0 1 50 40" />
          {/* Top-right */}
          <path d="M 350 40 A 10 10 0 0 1 360 50" />
          {/* Bottom-left */}
          <path d="M 40 510 A 10 10 0 0 0 50 520" />
          {/* Bottom-right */}
          <path d="M 350 520 A 10 10 0 0 0 360 510" />
        </g>
      </svg>

      {/* Floodlight vignette on top of everything (CSS overlay) */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{ boxShadow: 'inset 0 0 120px rgba(10,15,12,0.5)' }}
      />

      {/* ── Player slot anchors positioned over the pitch ── */}
      {slots &&
        Object.entries(slots).map(([slot, node]) => {
          const pos = PITCH_POSITIONS[slot as SlotCode];
          if (!pos) return null;
          return (
            <div
              key={slot}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {node}
            </div>
          );
        })}
    </div>
  );
}
