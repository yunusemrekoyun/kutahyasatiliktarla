import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Inter, Outfit } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kütahya Satılık Tarla — Arazi, Tarla ve Arsa İlanları',
  description:
    'Kütahya ve ilçelerinde satılık & kiralık tarla, arsa ve arazi ilanları. Gerçek fotoğraflar, net tapu bilgisi ve kolay iletişim.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KS Tarla',
  },
};

export const viewport: Viewport = {
  themeColor: '#15803D',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
