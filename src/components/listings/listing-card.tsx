'use client';

import { MapPin, Maximize, MessageCircle, Phone } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useStore, telLink, waLink } from '@/store';
import type { Listing } from '@/content';

const PURPOSE_LABEL: Record<string, string> = {
  Tarla: 'Tarla',
  Arsa: 'Arsa',
  'Bağ / Bahçe': 'Bağ / Bahçe',
  'Köy İçi': 'Köy İçi',
};

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
        'group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onOpen?.(listing)}
        className="relative block h-52 w-full overflow-hidden bg-muted text-left"
        aria-label={`${listing.title} detaylarını aç`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-primary/10 text-primary">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        <span className="absolute left-3 top-3">
          <Badge className="bg-harvest text-harvest-foreground hover:bg-harvest">
            {listing.badge}
          </Badge>
        </span>
        <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-3 py-1.5 shadow-sm">
          <span className="font-heading text-lg font-bold leading-none text-primary">
            {listing.price}
          </span>
        </span>
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          {listing.location}
        </div>
        <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-foreground">
          {listing.title}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
            <Maximize className="h-3.5 w-3.5" />
            {listing.area}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 font-medium text-secondary-foreground">
            {PURPOSE_LABEL[listing.type] ?? listing.type}
          </span>
          {listing.pricePerM2 ? (
            <span className="text-muted-foreground">{listing.pricePerM2}</span>
          ) : null}
        </div>

        <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
          <Button className="flex-1" onClick={() => onOpen?.(listing)}>
            Detayları Gör
          </Button>
          <Button asChild variant="outline" size="icon" aria-label="WhatsApp'tan yaz">
            <a href={wa} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
              <MessageCircle className="h-5 w-5 text-[#1f7a3d]" />
            </a>
          </Button>
          <Button asChild variant="outline" size="icon" aria-label="Ara">
            <a href={telLink(content.contact.phone)} onClick={(e) => e.stopPropagation()}>
              <Phone className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
