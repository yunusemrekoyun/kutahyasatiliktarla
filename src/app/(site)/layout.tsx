import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { FloatingWhatsApp } from '@/components/site/floating-whatsapp';
import { MobileActionBar } from '@/components/site/mobile-action-bar';

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {/* Mobil alt aksiyon çubuğunun içeriği örtmemesi için alt boşluk */}
      <div className="pb-[76px] lg:pb-0">
        <main>{children}</main>
        <SiteFooter />
      </div>
      <FloatingWhatsApp />
      <MobileActionBar />
    </>
  );
}
