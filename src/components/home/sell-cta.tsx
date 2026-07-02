'use client';

import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore, telLink, waLink } from '@/store';

export function SellCta() {
  const { content } = useStore();
  return (
    <section id="ilan-ver" aria-label="İlan verin" className="bg-primary">
      <div className="container flex flex-col items-start justify-between gap-8 py-14 sm:py-16 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <span className="mb-4 block h-1.5 w-14 bg-gold" aria-hidden="true" />
          <h2 className="font-heading text-3xl font-semibold leading-[1.15] text-white sm:text-4xl">
            Arazinizi mi satmak istiyorsunuz?
          </h2>
          <p className="mt-3 text-[17px] leading-relaxed text-white/90">
            İlanınızı ücretsiz verin. Ekibimiz fotoğraf ve drone çekimini yapar,
            arazinizi doğru alıcıyla buluşturur; siz yalnızca görüşmeleri yaparsınız.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-[52px] px-8 text-[15px] uppercase tracking-wide">
            <a
              href={waLink(content.contact.whatsapp, 'Merhaba, arazimi ilana vermek istiyorum.')}
              target="_blank"
              rel="noreferrer"
            >
              İlanımı Ücretsiz Ver
              <ArrowRight className="size-5" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-[52px] border-2 border-white/50 bg-transparent px-8 text-[15px] font-bold text-white hover:bg-white/10 hover:text-white"
          >
            <a href={telLink(content.contact.phone)}>
              <Phone className="size-5" />
              {content.contact.phone}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
