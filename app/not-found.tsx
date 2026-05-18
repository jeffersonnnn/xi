import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-6 text-center">
      <div className="font-display text-8xl font-bold text-gold">404</div>
      <h1 className="font-display text-3xl font-bold text-chalk uppercase">Offside</h1>
      <p className="text-chalk-dim text-sm max-w-md">
        This page doesn&apos;t exist. The ref has blown the whistle.
      </p>
      <Link
        href="/"
        className="bg-gold hover:bg-gold-deep text-pitch-night font-display font-black text-sm uppercase tracking-wider py-3 px-8 rounded-btn transition-colors"
      >
        Back to the Pitch
      </Link>
    </div>
  );
}
