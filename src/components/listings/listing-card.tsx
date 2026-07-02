'use client';

import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        'group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft-sm transition-[transform,box-shadow,border-color] duration-300 ease-out-quart hover:-translate-y-1 hover:shadow-soft-lg',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onOpen?.(listing)}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted text-left"
        aria-label={`${listing.title} detaylarını açın`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 ease-out-quart group-hover:scale-[1.04]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-primary/10 text-primary">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-[13px] font-semibold text-foreground shadow-soft-sm">
          {listing.badge}
        </span>
        <span className="absolute bottom-4 left-4 font-heading text-[1.6rem] font-semibold leading-none text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.4)]">
          {listing.price}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          {listing.location}
        </div>
        <h3 className="mt-2 font-heading text-[1.3rem] font-semibold leading-snug text-foreground">
          {listing.title}
        </h3>
        <p className="mb-5 mt-2 text-[15px] text-muted-foreground">
          {listing.area} · {listing.type}
          {listing.pricePerM2 ? ` · ${listing.pricePerM2}` : ''}
        </p>

        <div className="mt-auto flex items-center gap-2 border-t border-border pt-5">
          <Button className="flex-1" onClick={() => onOpen?.(listing)}>
            Detayları Gör
          </Button>
          <Button asChild variant="outline" size="icon" aria-label="WhatsApp’tan yazın">
            <a href={wa} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
              <MessageCircle className="size-5 text-whatsapp" />
            </a>
          </Button>
          <Button asChild variant="outline" size="icon" aria-label="Telefonla arayın">
            <a href={telLink(content.contact.phone)} onClick={(e) => e.stopPropagation()}>
              <Phone className="size-5" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
