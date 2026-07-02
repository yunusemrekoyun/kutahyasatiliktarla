'use client';

import { ArrowRight, MapPin, MessageCircle, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore, telLink, waLink } from '@/store';
import type { Listing } from '@/content';

export function ListingCard({
  listing,
  onOpen,
  className,
}: {
  listing: Listing;
  onOpen?: (l: Listing) => void;
  className?: string;
}) {
  const { content } = useStore();
  const cover = listing.images?.[0];
  const wa = waLink(
    content.contact.whatsapp,
    `Merhaba, "${listing.title}" (${listing.price}) ilanı hakkında bilgi almak istiyorum.`,
  );

  return (
    <article
      className={cn(
        'group flex h-full flex-col border border-border bg-card transition-colors duration-200 hover:border-ink/35',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onOpen?.(listing)}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label={`${listing.title} detaylarını açın`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-muted text-ink-soft">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        {/* Hover: kurumsal koyulaşma */}
        <div
          className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15"
          aria-hidden="true"
        />
        {/* Sarı fiyat etiketi — sola yaslı, keskin */}
        <span className="absolute left-0 top-5 bg-primary px-4 py-2 font-heading text-[17px] font-bold leading-none text-primary-foreground">
          {listing.price}
        </span>
        {/* Alt degrade + künye */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent pt-14">
          <div className="px-5 pb-4">
            <h3 className="font-heading text-xl font-medium leading-snug text-white">
              {listing.title}
            </h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-[14px] text-white/85">
              <MapPin className="h-4 w-4" />
              {listing.location}
              <span aria-hidden="true">·</span>
              {listing.area}
            </p>
          </div>
        </div>
      </button>

      <div className="flex items-center justify-between gap-3 px-5 py-3.5">
        <button
          type="button"
          onClick={() => onOpen?.(listing)}
          className="flex items-center gap-1.5 text-[15px] font-semibold text-foreground transition-colors hover:text-ink-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Detayları Gör
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </button>
        <div className="flex items-center gap-2">
          <a
            href={telLink(content.contact.phone)}
            aria-label="Telefonla arayın"
            className="grid h-11 w-11 place-items-center border border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Phone className="h-5 w-5" />
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp’tan yazın"
            className="grid h-11 w-11 place-items-center border border-border text-whatsapp transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
      </div>
    </article>
  );
}
