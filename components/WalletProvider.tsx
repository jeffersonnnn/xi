'use client';
import { PrivyProvider } from '@privy-io/react-auth';
import { toSolanaWalletConnectors } from '@privy-io/react-auth/solana';

const solanaConnectors = toSolanaWalletConnectors({
  shouldAutoConnect: true,
});

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || '';
  if (!appId && typeof window !== 'undefined') {
    console.error('NEXT_PUBLIC_PRIVY_APP_ID is not set');
  }
  if (!appId) return <>{children}</>;

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          showWalletLoginFirst: true,
          walletChainType: 'solana-only',
          theme: 'dark',
          accentColor: '#F5C518',
        },
        loginMethods: ['wallet'],
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
