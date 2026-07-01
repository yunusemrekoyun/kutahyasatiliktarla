'use client';

import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore, telLink, waLink } from '@/store';

export function SellCta() {
  const { content } = useStore();
  return (
    <section id="ilan-ver" className="py-16 sm:py-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-14 text-center shadow-lg sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(60% 90% at 15% 0%, rgba(202,138,4,0.35) 0%, transparent 55%), radial-gradient(50% 80% at 100% 100%, rgba(255,255,255,0.12) 0%, transparent 60%)',
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-heading text-3xl font-bold text-primary-foreground sm:text-4xl">
              Arazinizi satmak mı istiyorsunuz?
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-primary-foreground/85">
              Ücretsiz ilan verin; ekibimiz fotoğraf ve drone çekimini yapıp
              arazinizi doğru alıcıyla buluştursun.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" variant="secondary" className="h-12 gap-2 px-8 text-base">
                <a
                  href={waLink(content.contact.whatsapp, 'Merhaba, arazimi ilana vermek istiyorum.')}
                  target="_blank"
                  rel="noreferrer"
                >
                  İlanımı Ver
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 gap-2 border-white/40 bg-transparent px-8 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <a href={telLink(content.contact.phone)}>
                  <Phone className="h-5 w-5" />
                  {content.contact.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
