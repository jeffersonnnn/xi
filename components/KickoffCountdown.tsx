'use client';
import { useState, useEffect } from 'react';
import { KICKOFF_DATE } from '@/lib/constants';

const SEGMENTS = [
  { key: 'days', label: 'DAYS' },
  { key: 'hours', label: 'HRS' },
  { key: 'mins', label: 'MIN' },
  { key: 'secs', label: 'SEC' },
] as const;

export function KickoffCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    function calc() {
      const diff = Math.max(0, KICKOFF_DATE.getTime() - Date.now());
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        mins: Math.floor((diff % 3600000) / 60000),
        secs: Math.floor((diff % 60000) / 1000),
      };
    }
    setTimeLeft(calc());
    const timer = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center space-y-3">
      <div className="font-display uppercase text-xs tracking-[0.25em] text-chalk-dim">
        Kickoff In
      </div>

      <div className="flex items-start justify-center gap-2 sm:gap-3">
        {SEGMENTS.map((seg, i) => {
          const value = timeLeft[seg.key];
          return (
            <div key={seg.key} className="flex items-start">
              {/* Separator colon between groups */}
              {i > 0 && (
                <span className="text-chalk-dim font-mono text-2xl sm:text-4xl font-medium mx-1 sm:mx-2 mt-2 sm:mt-3 select-none opacity-50">
                  :
                </span>
              )}

              {/* Digit segment housing */}
              <div className="flex flex-col items-center">
                <div
                  className="bg-panel-raised border border-line rounded-md px-3 py-2 sm:px-4 sm:py-3"
                  style={{
                    textShadow: '0 0 12px rgba(52, 224, 138, 0.35), 0 0 4px rgba(52, 224, 138, 0.15)',
                  }}
                >
                  <span className="font-mono text-3xl sm:text-5xl font-medium text-chalk tabular-nums leading-none tracking-tight">
                    {String(value).padStart(2, '0')}
                  </span>
                </div>

                {/* Label under segment */}
                <span className="font-display uppercase text-[10px] sm:text-xs tracking-[0.2em] text-chalk-dim mt-1.5 select-none">
                  {seg.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
