'use client';

import Link from 'next/link';
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useParallax } from '@/lib/parallax';
import { useStore, waLink } from '@/store';
import type { Listing } from '@/content';

export function ListingCard({
  listing,
  className,
}: {
  listing: Listing;
  className?: string;
}) {
  const { content } = useStore();
  const coverRef = useParallax<HTMLImageElement>(18);
  const cover = listing.images?.[0];
  const wa = waLink(
    content.contact.whatsapp,
    `Merhaba, "${listing.title}" (${listing.price}) ilanı hakkında bilgi almak istiyorum.`,
  );

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition-[transform,box-shadow,border-color] duration-300 ease-out-quart hover:-translate-y-1 hover:border-primary/25 hover:shadow-soft',
        className,
      )}
    >
      <Link
        href={`/ilan/${listing.id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
        aria-label={`${listing.title} detaylarını açın`}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={coverRef}
            src={cover}
            alt={listing.title}
            loading="lazy"
            className="parallax-cover absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-muted text-muted-foreground">
            <MapPin className="h-8 w-8" />
          </div>
        )}
        {/* Fiyat etiketi — marka yeşili: her fotoğrafta yüksek kontrast, sakin */}
        <span className="nums absolute left-4 top-4 rounded-sm bg-primary px-3.5 py-2 font-heading text-[16px] font-bold leading-none text-primary-foreground shadow-soft">
          {listing.price}
        </span>
        {/* Tür rozeti */}
        {listing.badge ? (
          <span className="absolute right-4 top-4 rounded-sm bg-background/90 px-3 py-1.5 text-[12px] font-semibold text-foreground backdrop-blur-sm">
            {listing.badge}
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-heading text-[19px] font-semibold leading-snug tracking-[-0.01em] text-foreground">
          {listing.title}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-[14px] text-muted-foreground">
          <MapPin className="h-4 w-4 shrink-0 text-brass" />
          {listing.location}
          <span aria-hidden="true" className="text-border">·</span>
          <span className="nums">{listing.area}</span>
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <Link
            href={`/ilan/${listing.id}`}
            className="group/link flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-primary transition-colors hover:text-[hsl(154_46%_11%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Detayları Gör
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </Link>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-whatsapp transition-colors hover:text-[hsl(173_77%_21%)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
