'use client';
import { usePrivy } from '@privy-io/react-auth';
import { useWallets } from '@privy-io/react-auth/solana';

export function WalletButton() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { wallets } = useWallets();

  if (!ready) return null;

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="bg-gold hover:bg-gold-deep text-pitch-night font-display text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-btn transition-colors"
      >
        Connect
      </button>
    );
  }

  const address = wallets[0]?.address;
  const truncated = address
    ? `${address.slice(0, 4)}...${address.slice(-4)}`
    : 'Wallet';

  return (
    <button
      onClick={logout}
      className="bg-gold hover:bg-gold-deep text-pitch-night font-display text-xs uppercase tracking-wider font-semibold py-2 px-4 rounded-btn transition-colors"
    >
      {truncated}
    </button>
  );
}
