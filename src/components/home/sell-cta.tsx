'use client';

import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { ParcelFrame } from '@/components/site/parcel-frame';
import { useStore, telLink, waLink } from '@/store';

export function SellCta() {
  const { content } = useStore();
  return (
    <section id="ilan-ver" className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <div className="texture-grain relative isolate overflow-hidden rounded-[1.75rem] bg-brand-deep px-6 py-16 shadow-soft-lg sm:px-14 sm:py-20">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_100%_at_12%_0%,hsl(38_76%_44%/0.20),transparent_58%)]" />
            <ParcelFrame frameClass="border-white/10" tickClass="text-harvest/60" />
            <div className="relative grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-center">
              <div>
                <h2 className="font-heading text-3xl font-semibold leading-[1.1] text-white sm:text-[2.6rem]">
                  Arazinizi satmak mı istiyorsunuz?
                </h2>
                <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/75">
                  Ücretsiz ilan verin; ekibimiz fotoğraf ve drone çekimini yapıp
                  arazinizi doğru alıcıyla buluştursun. Siz sadece görüşmeleri yapın.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Button
                  asChild
                  size="lg"
                  className="h-12 gap-2 bg-harvest text-base text-harvest-foreground hover:bg-harvest/90"
                >
                  <a
                    href={waLink(content.contact.whatsapp, 'Merhaba, arazimi ilana vermek istiyorum.')}
                    target="_blank"
                    rel="noreferrer"
                  >
                    İlanımı Ücretsiz Ver
                    <ArrowRight className="h-5 w-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 gap-2 border-white/25 bg-transparent text-base text-white hover:bg-white/10 hover:text-white"
                >
                  <a href={telLink(content.contact.phone)}>
                    <Phone className="h-5 w-5" />
                    {content.contact.phone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
