'use client';

import { MessageCircle } from 'lucide-react';
import { useStore, waLink } from '@/store';

export function FloatingWhatsApp() {
  const { content } = useStore();
  return (
    <a
      href={waLink(content.contact.whatsapp, 'Merhaba, Kütahya’da arazi arıyorum, bilgi alabilir miyim?')}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp'tan yazın"
      className="fixed bottom-5 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#1f7a3d]/40 transition-transform hover:scale-105 active:scale-95 lg:right-6"
    >
      <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
      <MessageCircle className="relative h-7 w-7" />
    </a>
  );
}
