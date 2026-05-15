'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { WalletButton } from './WalletButton';

const NAV_LINKS = [
  { href: '/', label: 'Pitch' },
  { href: '/vote', label: 'Vote' },
  { href: '/players', label: 'Roster' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-pitch-night/90 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display text-2xl font-bold tracking-tight">
            <span className="text-gold">$</span><span className="text-chalk">XI</span>
          </Link>
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_LINKS.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-display uppercase tracking-wider text-sm px-3 py-1 transition-colors border-b-2 ${
                    isActive
                      ? 'border-gold text-chalk'
                      : 'border-transparent text-chalk-dim hover:text-chalk'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <WalletButton />
          {/* Mobile menu button */}
          <button
            className="sm:hidden text-chalk-dim hover:text-chalk p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="sm:hidden border-t border-line bg-pitch-night px-4 py-3 space-y-1">
          {NAV_LINKS.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block font-display uppercase tracking-wider text-sm py-2 px-3 rounded-badge transition-colors ${
                  isActive
                    ? 'text-gold bg-panel-raised'
                    : 'text-chalk-dim hover:text-chalk'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
