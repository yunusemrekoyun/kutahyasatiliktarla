import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { FloatingWhatsApp } from '@/components/site/floating-whatsapp';
import { MobileActionBar } from '@/components/site/mobile-action-bar';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {/* Yüzen header sabit konumlu: içerik üstten onun payını alır; ana
          sayfadaki hero bu payı negatif marjla geri alıp tam ekran başlar.
          Mobil alt aksiyon çubuğu için de alt boşluk bırakılır. */}
      <div id="top" className="pb-[76px] pt-20 lg:pb-0 lg:pt-24">
        <main>{children}</main>
        <SiteFooter />
      </div>
      <FloatingWhatsApp />
      <MobileActionBar />
    </>
  );
}
