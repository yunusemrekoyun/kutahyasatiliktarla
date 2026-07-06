import type { ReactNode } from 'react';
import { SiteHeader } from '@/components/site/site-header';
import { SiteFooter } from '@/components/site/site-footer';
import { FloatingWhatsApp } from '@/components/site/floating-whatsapp';
import { MobileActionBar } from '@/components/site/mobile-action-bar';

// Bilerek senkron/statik bırakıldı: getServerSession() (headers() okur) buraya
// eklenirse layout'un altındaki TÜM sayfalar (ana sayfa, /ilanlar, /ilan/[id])
// statik üretimden dinamiğe düşer — binlerce ilan hedefiyle uyuşmayan bir maliyet.
// Oturum durumu SiteHeader içinde yalnızca client-side (authClient.useSession())
// okunuyor; kısa bir hydration flicker'ı, site-genelinde SSG kaybına tercih edildi.
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {/* Yüzen header sabit konumlu: içerik üstten onun payını alır; ana
          sayfadaki hero bu payı negatif marjla geri alıp tam ekran başlar.
          Mobil alt aksiyon çubuğu için alt boşluk: bar yüksekliği + iPhone
          home-indicator safe-area'sı (yoksa footer'ın altı bar altında kalır). */}
      <div
        id="top"
        className="pb-[calc(var(--action-bar-h)+env(safe-area-inset-bottom))] pt-20 lg:pb-0 lg:pt-24"
      >
        <main>{children}</main>
        <SiteFooter />
      </div>
      <FloatingWhatsApp />
      <MobileActionBar />
    </>
  );
}
