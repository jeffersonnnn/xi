'use client';

export function FootballSpinner({ size = 32 }: { size?: number }) {
  return (
    <div
      className="inline-block animate-spin"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    >
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="#2A332B" strokeWidth="3" fill="#141A15" />
        <circle cx="50" cy="50" r="45" stroke="#9AA89C" strokeWidth="1.5" fill="none" />
        {/* Pentagon pattern */}
        <polygon
          points="50,20 65,35 58,55 42,55 35,35"
          fill="#2A332B"
          stroke="#9AA89C"
          strokeWidth="1"
        />
        <polygon
          points="30,15 50,20 35,35 20,28"
          fill="#2A332B"
          stroke="#9AA89C"
          strokeWidth="1"
        />
        <polygon
          points="70,15 80,28 65,35 50,20"
          fill="#2A332B"
          stroke="#9AA89C"
          strokeWidth="1"
        />
        <polygon
          points="20,28 35,35 42,55 28,62 15,45"
          fill="none"
          stroke="#9AA89C"
          strokeWidth="1"
        />
        <polygon
          points="80,28 85,45 72,62 58,55 65,35"
          fill="none"
          stroke="#9AA89C"
          strokeWidth="1"
        />
        <polygon
          points="42,55 58,55 65,72 50,82 35,72"
          fill="#2A332B"
          stroke="#9AA89C"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
