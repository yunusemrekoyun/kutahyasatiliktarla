'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import {
  CircleCheck,
  ExternalLink,
  MapPin,
  Maximize,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useStore, telLink, waLink } from '@/store';
import type { Listing } from '@/content';
import type { MapMarker } from '@/LeafletMap';

const LeafletMap = dynamic(() => import('@/LeafletMap'), { ssr: false });

export function ListingDetailDialog({
  listing,
  onOpenChange,
}: {
  listing: Listing | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { content } = useStore();
  // Kapanış animasyonu sürerken içerik anında kaybolmasın diye son ilan tutulur.
  const lastListing = useRef<Listing | null>(listing);
  if (listing) lastListing.current = listing;
  const shown = listing ?? lastListing.current;

  return (
    <Dialog open={!!listing} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-3xl gap-0 overflow-y-auto p-0">
        {shown && (
          <>
            <DialogDescription className="sr-only">
              {shown.location} · {shown.area} · {shown.price}
            </DialogDescription>
            <DetailBody
              listing={shown}
              whatsapp={content.contact.whatsapp}
              phone={content.contact.phone}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailBody({
  listing,
  whatsapp,
  phone,
}: {
  listing: Listing;
  whatsapp: string;
  phone: string;
}) {
  const marker: MapMarker[] = [
    { lat: listing.lat, lng: listing.lng, title: listing.title, price: listing.price },
  ];
  const wa = waLink(
    whatsapp,
    `Merhaba, "${listing.title}" (${listing.price}) ilanı hakkında bilgi almak istiyorum.`,
  );
  const cover = listing.images?.[0];

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden bg-brand-deep">
        {listing.droneVideo ? (
          <video
            src={listing.droneVideo}
            controls
            playsInline
            preload="metadata"
            poster={cover}
            className="h-full w-full object-cover"
          />
        ) : cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={listing.title} className="h-full w-full object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-white/70">
            <MapPin className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[13px] font-semibold text-primary">
              {listing.badge}
            </span>
            <DialogTitle className="mt-3 font-heading text-2xl font-bold leading-tight text-foreground sm:text-3xl">
              {listing.title}
            </DialogTitle>
            <p className="mt-1.5 flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              {listing.location}
            </p>
          </div>
          <div className="text-right">
            <div className="font-heading text-2xl font-bold text-primary sm:text-3xl">
              {listing.price}
            </div>
            <div className="text-sm text-muted-foreground">{listing.pricePerM2}</div>
          </div>
        </div>

        {listing.description && (
          <p className="mt-5 leading-relaxed text-foreground/85">{listing.description}</p>
        )}

        {listing.highlights?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">Öne çıkanlar</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {listing.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-[15px] text-foreground/85">
                  <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {listing.specs?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-heading text-lg font-semibold text-foreground">Arazi künyesi</h3>
            <dl className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5">
                <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Maximize className="h-4 w-4 text-primary" />
                  Alan
                </dt>
                <dd className="text-sm font-semibold text-foreground">{listing.area}</dd>
              </div>
              {listing.specs.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2.5"
                >
                  <dt className="text-sm text-muted-foreground">{s.label}</dt>
                  <dd className="text-right text-sm font-semibold text-foreground">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-heading text-lg font-semibold text-foreground">Konum</h3>
            <a
              href={`https://www.google.com/maps?q=${listing.lat},${listing.lng}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Google Haritalar
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <LeafletMap
              markers={marker}
              center={[listing.lat, listing.lng]}
              zoom={13}
              fitBounds={false}
              className="h-64 w-full"
            />
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="h-12 flex-1 gap-2 text-base">
            <a href={wa} target="_blank" rel="noreferrer">
              <MessageCircle className="size-5" />
              WhatsApp’tan Bilgi Al
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-12 flex-1 gap-2 text-base">
            <a href={telLink(phone)}>
              <Phone className="size-5" />
              Ara: {phone}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
