'use client';

import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParcelFrame } from '@/components/site/parcel-frame';
import { cn } from '@/lib/utils';
import { useStore, telLink, waLink } from '@/store';
import type { Listing } from '@/content';

export function ListingCard({
  listing,
  onOpen,
  className,
  featured = false,
}: {
  listing: Listing;
  onOpen?: (l: Listing) => void;
  className?: string;
  featured?: boolean;
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
        featured && 'sm:grid sm:grid-cols-[1.15fr_1fr]',
        className,
      )}
    >
      <button
        type="button"
        onClick={() => onOpen?.(listing)}
        className={cn(
          'relative block w-full overflow-hidden bg-muted text-left',
          featured ? 'aspect-[4/3] sm:aspect-auto sm:h-full sm:min-h-[400px]' : 'aspect-[4/3]',
        )}
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
        {featured && <ParcelFrame frameClass="border-white/45" tickClass="text-white/90" />}
        <span
          className={cn(
            'absolute rounded-full bg-white/95 px-3 py-1 text-[13px] font-semibold text-foreground shadow-soft-sm',
            featured ? 'left-7 top-7' : 'left-4 top-4',
          )}
        >
          {listing.badge}
        </span>
        <span
          className={cn(
            'absolute font-heading font-semibold leading-none text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.4)]',
            featured ? 'bottom-7 left-7 text-[2rem]' : 'bottom-4 left-4 text-[1.6rem]',
          )}
        >
          {listing.price}
        </span>
      </button>

      <div className={cn('flex flex-1 flex-col p-6', featured && 'sm:p-8 lg:p-9')}>
        <div className="flex-1 pb-5">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            {listing.location}
          </div>
          <h3
            className={cn(
              'mt-2 font-heading font-semibold leading-snug text-foreground',
              featured ? 'text-2xl lg:text-[1.75rem]' : 'text-[1.3rem]',
            )}
          >
            {listing.title}
          </h3>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {listing.area} · {listing.type}
            {listing.pricePerM2 ? ` · ${listing.pricePerM2}` : ''}
          </p>
          {featured && listing.description && (
            <p className="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">
              {listing.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-border pt-5">
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
