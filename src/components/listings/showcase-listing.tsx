'use client';

import { ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CornerMark } from '@/components/site/topo';
import { useStore, waLink } from '@/store';
import type { Listing } from '@/content';

/**
 * Vitrin parseli: ilk ilan, kesikli parsel sınırı ve pafta köşe
 * işaretleriyle çerçevelenmiş büyük yatay kart olarak sunulur.
 * Sağ sütun tapu künyesi gibi satır satır okunur.
 */
export function ShowcaseListing({
  listing,
  onOpen,
}: {
  listing: Listing;
  onOpen?: (l: Listing) => void;
}) {
  const { content } = useStore();
  const cover = listing.images?.[0];
  const wa = waLink(
    content.contact.whatsapp,
    `Merhaba, "${listing.title}" (${listing.price}) ilanı hakkında bilgi almak istiyorum.`,
  );

  // Künye: konum satırıyla tekrara düşmeyen kayıtlar (ilk spec = tapu durumu)
  const specs: Array<[string, string]> = [
    ['Alan', listing.area],
    ['Tür', listing.type],
    ['Birim', listing.pricePerM2],
    ...(listing.specs?.[0]
      ? [[listing.specs[0].label, listing.specs[0].value] as [string, string]]
      : []),
  ];

  return (
    <div className="relative">
      {/* Kesikli parsel sınırı + köşe işaretleri */}
      <div
        className="pointer-events-none absolute -inset-2.5 rounded-lg border border-dashed border-primary/30"
        aria-hidden="true"
      >
        <CornerMark className="-left-px -top-px" />
        <CornerMark className="-right-px -top-px rotate-90" />
        <CornerMark className="-bottom-px -right-px rotate-180" />
        <CornerMark className="-bottom-px -left-px -rotate-90" />
      </div>

      <article className="group grid overflow-hidden rounded-lg border border-border bg-card lg:grid-cols-[1.55fr_1fr]">
        <button
          type="button"
          onClick={() => onOpen?.(listing)}
          className="relative block aspect-[16/10] w-full overflow-hidden bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset lg:aspect-auto lg:min-h-[26rem]"
          aria-label={`${listing.badge ? `${listing.badge}: ` : ''}${listing.title} detaylarını açın`}
        >
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={listing.title}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.05]"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-muted-foreground">
              <MapPin className="h-10 w-10" />
            </div>
          )}
          {listing.badge ? (
            <span className="absolute left-5 top-5 rounded-sm bg-background/90 px-3 py-1.5 text-[12px] font-semibold text-foreground backdrop-blur-sm">
              {listing.badge}
            </span>
          ) : null}
        </button>

        <div className="flex flex-col p-6 sm:p-8 lg:border-l lg:border-dashed lg:border-border">
          <p className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-brass-strong">
            <span className="h-0.5 w-6 bg-brass" aria-hidden="true" />
            Öne çıkan parsel
          </p>
          <h3 className="mt-3 font-heading text-2xl font-bold leading-tight tracking-[-0.01em] text-foreground sm:text-[1.75rem]">
            {listing.title}
          </h3>
          <p className="mt-2 flex items-center gap-1.5 text-[15px] text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-brass-strong" />
            {listing.location}
          </p>

          <dl className="mt-6 divide-y divide-border border-y border-border">
            {specs.map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {label}
                </dt>
                <dd className="nums text-right text-[15px] font-semibold text-foreground">
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto pt-6">
            <div className="nums font-heading text-3xl font-bold leading-none text-foreground">
              <span className="sr-only">Fiyat: </span>
              {listing.price}
            </div>
            <div className="mt-5 flex items-center gap-3">
              <Button size="lg" className="h-12 flex-1" onClick={() => onOpen?.(listing)}>
                Detayları Gör
                <ArrowRight className="size-5" />
              </Button>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp’tan yazın"
                className="grid h-12 w-12 shrink-0 place-items-center rounded-sm border border-border text-whatsapp transition-colors hover:border-whatsapp/40 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
