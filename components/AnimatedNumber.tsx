'use client';
import { useState, useEffect, useRef } from 'react';

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  format?: (n: number) => string;
  className?: string;
};

export function AnimatedNumber({ value, duration = 500, format, className }: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || prevValue.current === value) {
      setDisplay(value);
      prevValue.current = value;
      return;
    }

    const from = prevValue.current;
    const to = value;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(from + (to - from) * eased);
      setDisplay(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    prevValue.current = value;

    return () => cancelAnimationFrame(rafRef.current);
  }, [value, duration]);

  const formatted = format ? format(display) : display.toString();

  return <span className={className}>{formatted}</span>;
}

export function formatWeight(weight: string): string {
  const n = Number(weight);
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return weight;
}
