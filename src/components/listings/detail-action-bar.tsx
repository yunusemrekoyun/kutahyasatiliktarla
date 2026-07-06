'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { telLink } from '@/store';
import type { Listing } from '@/content';

/** İlan detayında mobil sabit alt bar: fiyat her an görünür, CTA'lar başparmak
 * erişiminde. Genel Ara+WhatsApp barının ilana özel karşılığı (sahibinden
 * kalıbı); ileride "Mesaj Gönder" butonu da buraya gelecek. */
export function DetailActionBar({
  listing,
  phone,
  wa,
}: {
  listing: Listing;
  phone: string;
  wa: string;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="nums truncate font-heading text-[19px] font-bold leading-tight text-foreground">
            {listing.price}
          </div>
          <div className="nums truncate text-[12px] text-muted-foreground">
            {listing.pricePerM2}
          </div>
        </div>
        <Button asChild className="h-12 shrink-0 gap-2 px-4 text-[15px]">
          <a href={telLink(phone)} aria-label={`Telefonla arayın: ${phone}`}>
            <Phone className="size-5" />
            Ara
          </a>
        </Button>
        <Button
          asChild
          className="h-12 shrink-0 gap-2 bg-whatsapp px-4 text-[15px] text-white hover:bg-whatsapp/90"
        >
          <a href={wa} target="_blank" rel="noreferrer">
            <MessageCircle className="size-5" />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
