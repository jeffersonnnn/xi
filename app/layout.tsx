import type { Metadata } from 'next';
import { Inter, Teko, JetBrains_Mono, Anton } from 'next/font/google';
import './globals.css';
import { WalletProvider } from '@/components/WalletProvider';
import { Header } from '@/components/Header';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const teko = Teko({ subsets: ['latin'], variable: '--font-teko', weight: ['400', '500', '600', '700'] });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', weight: ['400', '500'] });
const anton = Anton({ subsets: ['latin'], variable: '--font-anton', weight: '400' });

export const metadata: Metadata = {
  title: '$XI - The People\'s Starting XI',
  description: 'Vote the 2026 FIFA World Cup Starting XI with your $XI tokens. Your bag picks the squad.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${teko.variable} ${jetbrains.variable} ${anton.variable} dark`}>
      <body className="font-sans bg-pitch-night text-chalk min-h-screen antialiased">
        <WalletProvider>
          <Header />
          <main className="max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
          <Toaster theme="dark" position="top-right" richColors />
        </WalletProvider>
      </body>
    </html>
  );
}
