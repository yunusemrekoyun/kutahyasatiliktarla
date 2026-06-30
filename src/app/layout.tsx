import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Kütahya Satılık Tarla — Arazi ve Tarla İlanları',
  description:
    'Kütahya’nın seçkin tarla, arsa ve arazi portföyü. Drone destekli ilanlar, doğrulanmış tapu ve kurumsal yatırım danışmanlığı.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'KS Tarla',
  },
};

export const viewport: Viewport = {
  themeColor: '#1f2a1d',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
