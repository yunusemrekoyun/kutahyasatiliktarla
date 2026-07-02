'use client';

import { Mail, MessageCircle, Phone } from 'lucide-react';
import { Logo } from './logo';
import { BrandStrip } from './brand-strip';
import { useStore, telLink, waLink } from '@/store';

export function SiteFooter() {
  const { content, requestDistrict } = useStore();
  const { phone, whatsapp, email } = content.contact;

  return (
    <footer id="iletisim">
      <BrandStrip />
      <div className="bg-cini text-white/70">
        <div className="container grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Logo brand={content.brand} tone="light" />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/60">
              Kütahya ve ilçelerinde tarla, arsa ve arazi alıp satmak isteyenleri
              buluşturan yerel platform. Gerçek fotoğraf, net bilgi, kolay iletişim.
            </p>
          </div>

          <div>
            <h3 className="title-rule title-rule-sm font-heading text-[16px] font-semibold text-white">
              Kurumsal
            </h3>
            <ul className="mt-5 space-y-2.5 text-[15px]">
              {[
                { href: '#ilanlar', label: 'İlanlar' },
                { href: '#nasil-calisir', label: 'Nasıl Çalışır' },
                { href: '#ilan-ver', label: 'İlan Ver' },
                { href: '#top', label: 'Ana Sayfa' },
              ].map((l) => (
                <li key={l.href + l.label}>
                  <a href={l.href} className="text-white/65 transition-colors hover:text-white">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="title-rule title-rule-sm font-heading text-[16px] font-semibold text-white">
              Bölgeler
            </h3>
            <ul className="mt-5 space-y-2.5 text-[15px]">
              {content.districts.slice(0, 6).map((d) => (
                <li key={d.name}>
                  <button
                    type="button"
                    onClick={() => requestDistrict(d.name)}
                    className="text-white/65 transition-colors hover:text-white"
                  >
                    {d.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="title-rule title-rule-sm font-heading text-[16px] font-semibold text-white">
              İletişim
            </h3>
            <a
              href={telLink(phone)}
              className="mt-5 inline-flex items-center gap-2.5 font-heading text-[26px] font-bold leading-none text-white transition-colors hover:text-gold"
            >
              {phone}
            </a>
            <div className="mt-5 flex flex-col gap-2.5 text-[15px]">
              <a
                href={waLink(whatsapp, 'Merhaba, bilgi almak istiyorum.')}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-white/65 transition-colors hover:text-white"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp’tan yazın
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2.5 text-white/65 transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4" />
                {email}
              </a>
              <span className="mt-2 flex items-center gap-2.5 text-white/60">
                <Phone className="h-4 w-4" />
                Hafta içi ve hafta sonu 09.00–19.00
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container flex items-center justify-center py-6 text-sm text-white/55">
            <p>© 2026 {content.brand}. Kütahya çini geleneğinden ilham alır.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
