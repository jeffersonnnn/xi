'use client';

type LowerThirdProps = {
  label: string;
  value: string;
  accent?: 'gold' | 'live' | 'behind' | 'close' | 'chalk';
};

const accentColors = {
  gold: '#F5C518',
  live: '#34E08A',
  behind: '#FF5247',
  close: '#FFB020',
  chalk: '#F2F5EF',
};

export function LowerThird({ label, value, accent = 'chalk' }: LowerThirdProps) {
  const color = accentColors[accent];

  return (
    <div className="inline-flex items-stretch overflow-hidden" style={{ transform: 'skewX(-5deg)' }}>
      <div
        className="w-1 shrink-0"
        style={{ backgroundColor: color }}
      />
      <div
        className="flex items-center gap-3 px-4 py-2"
        style={{ backgroundColor: '#141A15', transform: 'skewX(5deg)' }}
      >
        <span className="font-display text-[11px] uppercase tracking-[0.15em]" style={{ color: '#9AA89C' }}>
          {label}
        </span>
        <span className="font-mono text-lg font-medium" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  );
}
