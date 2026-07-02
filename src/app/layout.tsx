import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Bricolage_Grotesque, Hanken_Grotesk } from 'next/font/google';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import { Providers } from './providers';

const display = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Hanken_Grotesk({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kütahya Satılık Tarla — Arazi, Tarla ve Arsa İlanları',
  description:
    'Kütahya ve ilçelerinde satılık tarla, arsa ve arazi ilanları. Gerçek fotoğraflar, net tapu bilgisi ve kolay iletişim.',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KS Tarla',
  },
};

export const viewport: Viewport = {
  themeColor: '#163a2c' /* derin çam yeşili — marka rengi */,
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/* JS kapalıysa scroll-reveal içerikleri gizli kalmasın */}
        <noscript>
          <style>{`.reveal{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
