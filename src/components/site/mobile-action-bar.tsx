'use client';

import { MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore, telLink, waLink } from '@/store';

/** Mobilde her an elin altında: büyük Ara + WhatsApp butonları. */
export function MobileActionBar() {
  const { content } = useStore();
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur-md lg:hidden"
      style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="grid grid-cols-2 gap-3">
        <Button asChild className="h-12 gap-2 text-base">
          <a href={telLink(content.contact.phone)}>
            <Phone className="size-5" />
            Hemen Ara
          </a>
        </Button>
        <Button
          asChild
          className="h-12 gap-2 bg-whatsapp text-base text-white hover:bg-whatsapp/90"
        >
          <a
            href={waLink(content.contact.whatsapp, 'Merhaba, Kütahya’da arazi arıyorum, bilgi alabilir miyim?')}
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle className="size-5" />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
