'use client';
import { useState, useEffect, useRef } from 'react';

type UpdateClockProps = {
  intervalMinutes?: number;
};

export function UpdateClock({ intervalMinutes = 10 }: UpdateClockProps) {
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [colonVisible, setColonVisible] = useState(true);
  const [flash, setFlash] = useState(false);
  const prevSecondsRef = useRef(0);

  useEffect(() => {
    function calcSecondsLeft() {
      const now = Date.now();
      const intervalMs = intervalMinutes * 60 * 1000;
      const elapsed = now % intervalMs;
      return Math.floor((intervalMs - elapsed) / 1000);
    }

    setSecondsLeft(calcSecondsLeft());
    prevSecondsRef.current = calcSecondsLeft();

    const timer = setInterval(() => {
      const next = calcSecondsLeft();

      // Detect rollover: previous was 0 or 1 and now jumped back up
      if (prevSecondsRef.current <= 1 && next > prevSecondsRef.current) {
        setFlash(true);
        setTimeout(() => setFlash(false), 600);
      }
      prevSecondsRef.current = next;

      setSecondsLeft(next);
      setColonVisible((v) => !v);
    }, 1000);

    return () => clearInterval(timer);
  }, [intervalMinutes]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div
      className="inline-flex items-center gap-2.5 bg-panel-raised border border-line rounded-md px-3.5 py-2 transition-all duration-200"
      style={
        flash
          ? {
              boxShadow: '0 0 16px rgba(52, 224, 138, 0.3)',
              borderColor: '#34E08A',
            }
          : undefined
      }
    >
      {/* Live pulsing green dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full rounded-full bg-live opacity-75 animate-ping" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
      </span>

      {/* NEXT UPDATE label */}
      <span className="font-display uppercase text-[11px] tracking-[0.15em] text-chalk-dim leading-none select-none">
        Next Update
      </span>

      {/* mm:ss digits */}
      <span className="font-mono text-xl font-medium text-live tabular-nums leading-none tracking-tight">
        {String(mins).padStart(2, '0')}
        <span
          className="inline-block w-[0.45em] text-center transition-opacity duration-300"
          style={{ opacity: colonVisible ? 1 : 0.15 }}
        >
          :
        </span>
        {String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}
