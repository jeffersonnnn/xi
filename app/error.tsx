'use client';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
      <div className="font-display text-6xl font-bold text-red-500">VAR</div>
      <h1 className="font-display text-3xl font-bold text-chalk uppercase">Something Went Wrong</h1>
      <p className="text-chalk-dim text-sm max-w-md">
        The Video Assistant Referee is reviewing the situation. Try again.
      </p>
      <button
        onClick={reset}
        className="bg-gold hover:bg-gold-deep text-pitch-night font-display font-black text-sm uppercase tracking-wider py-3 px-8 rounded-btn transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
