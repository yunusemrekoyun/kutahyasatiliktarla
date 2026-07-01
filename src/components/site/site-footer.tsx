'use client';

import { Mail, MapPin, MessageCircle, Phone, Sprout } from 'lucide-react';
import { useStore, telLink, waLink } from '@/store';

export function SiteFooter() {
  const { content } = useStore();
  const { phone, whatsapp, email } = content.contact;

  return (
    <footer id="iletisim" className="border-t border-border bg-[#14311f] text-white/85">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="font-heading text-lg font-bold">{content.brand}</span>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-white/70">
            Kütahya ve ilçelerinde tarla, arsa ve arazi alıp satmak isteyenleri
            buluşturan yerel platform. Gerçek fotoğraf, net bilgi, kolay iletişim.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Hızlı Bağlantılar
          </h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {[
              { href: '#ilanlar', label: 'İlanlar' },
              { href: '#bolgeler', label: 'Bölgeler' },
              { href: '#nasil-calisir', label: 'Nasıl Çalışır' },
              { href: '#ilan-ver', label: 'İlan Ver' },
            ].map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-white/70 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            Bölgeler
          </h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {content.districts.slice(0, 6).map((d) => (
              <li key={d.name}>
                <a href="#bolgeler" className="flex items-center gap-1.5 text-white/70 transition-colors hover:text-white">
                  <MapPin className="h-3.5 w-3.5" />
                  {d.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-white">
            İletişim
          </h3>
          <ul className="mt-4 space-y-3 text-[15px]">
            <li>
              <a href={telLink(phone)} className="flex items-center gap-2.5 font-semibold text-white transition-colors hover:text-harvest">
                <Phone className="h-4 w-4" />
                {phone}
              </a>
            </li>
            <li>
              <a href={waLink(whatsapp, 'Merhaba, bilgi almak istiyorum.')} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-white/80 transition-colors hover:text-white">
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${email}`} className="flex items-center gap-2.5 text-white/80 transition-colors hover:text-white">
                <Mail className="h-4 w-4" />
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col items-center justify-between gap-2 py-6 text-sm text-white/55 sm:flex-row">
          <p>© 2026 {content.brand}. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-white/80">Gizlilik</a>
            <a href="#" className="transition-colors hover:text-white/80">KVKK</a>
            <a href="#" className="transition-colors hover:text-white/80">Kullanım Koşulları</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
