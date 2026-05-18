import type { Metadata, Viewport } from 'next';
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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: '$XI',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: '$XI - The People\'s Starting XI',
    description: 'Token-weighted voting for the 2026 World Cup Starting XI on Solana',
    siteName: '$XI',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '$XI - The People\'s Starting XI',
    description: 'Token-weighted voting for the 2026 World Cup Starting XI on Solana',
    images: ['/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#F5C518',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
