'use client';

import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { Logo } from './logo';
import { useStore, telLink, waLink } from '@/store';

export function SiteFooter() {
  const { content, requestDistrict } = useStore();
  const { phone, whatsapp, email } = content.contact;

  return (
    <footer
      id="iletisim"
      className="texture-grain relative isolate overflow-hidden bg-brand-deep text-white/70"
    >
      <div className="container grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
        <div>
          <Logo brand={content.brand} tone="light" />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/55">
            Kütahya ve ilçelerinde tarla, arsa ve arazi alıp satmak isteyenleri
            buluşturan yerel platform. Gerçek fotoğraf, net bilgi, kolay iletişim.
          </p>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">
            Keşfet
          </h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {[
              { href: '#ilanlar', label: 'İlanlar' },
              { href: '#bolgeler', label: 'Bölgeler' },
              { href: '#nasil-calisir', label: 'Nasıl Çalışır' },
              { href: '#ilan-ver', label: 'İlan Ver' },
            ].map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-white/65 transition-colors hover:text-white">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">
            Bölgeler
          </h3>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {content.districts.slice(0, 6).map((d) => (
              <li key={d.name}>
                <button
                  type="button"
                  onClick={() => requestDistrict(d.name)}
                  className="flex items-center gap-1.5 text-white/65 transition-colors hover:text-white"
                >
                  <MapPin className="h-3.5 w-3.5 text-harvest/80" />
                  {d.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/50">
            İletişim
          </h3>
          <a
            href={telLink(phone)}
            className="mt-4 flex items-baseline gap-2 font-heading text-2xl font-semibold text-white transition-colors hover:text-harvest"
          >
            {phone}
          </a>
          <div className="mt-4 flex flex-col gap-2.5 text-[15px]">
            <a
              href={waLink(whatsapp, 'Merhaba, bilgi almak istiyorum.')}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 text-white/65 transition-colors hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-harvest/80" />
              WhatsApp’tan yazın
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2.5 text-white/65 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 text-harvest/80" />
              {email}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex items-center justify-center py-6 text-sm text-white/60">
          <p>© 2026 {content.brand}. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
}
