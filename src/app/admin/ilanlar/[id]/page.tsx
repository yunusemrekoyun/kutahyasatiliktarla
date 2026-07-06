import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { TYPE_LABELS, STATUS_LABELS } from '@/lib/mappers';
import { parsePrice } from '@/lib/format';
import { Card, StatusPill } from '@/components/admin/ui';
import {
  ListingForm,
  DeleteListingButton,
  type ListingFormDefaults,
} from '@/components/admin/listing-form';
import {
  linesToStr,
  specsToStr,
  tagsToStr,
  type Spec,
} from '@/components/admin/listing-form-helpers';
import { saveListing } from '../actions';

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      media: { orderBy: { position: 'asc' } },
      owner: { select: { name: true, email: true } },
      priceRequests: {
        where: { status: 'bekliyor' },
        select: { requestedPrice: true, note: true },
      },
    },
  });
  if (!listing) notFound();

  const urlOf = (m: (typeof listing.media)[number]) =>
    ((m.variants as { url?: string }[] | null)?.[0]?.url ?? '').trim();
  const images = listing.media.filter((m) => m.type === 'image').map(urlOf).filter(Boolean);
  const video = listing.media.find((m) => m.type === 'video');

  const defaults: ListingFormDefaults = {
    title: listing.title,
    district: listing.district,
    location: listing.location,
    type: TYPE_LABELS[listing.type],
    purpose: listing.purpose,
    status: listing.status,
    badge: listing.badge ?? '',
    areaM2: String(Math.round(parsePrice(listing.area))),
    priceTRY: String(parsePrice(listing.price)),
    lat: listing.lat != null ? String(listing.lat) : '',
    lng: listing.lng != null ? String(listing.lng) : '',
    droneVideo: video ? urlOf(video) : '',
    images: linesToStr(images),
    description: listing.description,
    tags: tagsToStr(listing.tags),
    highlights: linesToStr(listing.highlights),
    specs: specsToStr((listing.specs as Spec[]) ?? []),
    droneRequested: listing.droneRequested,
  };

  const s = STATUS_LABELS[listing.status];

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <StatusPill label={s.label} tone={s.tone} />
          <span className="text-[#4b5b47]">
            Sahibi: <span className="text-[#1f2a1d]">{listing.owner.name}</span> (
            {listing.owner.email}) · {listing.viewCount} görüntülenme
          </span>
          {listing.status === 'aktif' ? (
            <Link
              href={`/ilan/${listing.slug}`}
              target="_blank"
              className="ml-auto inline-flex items-center gap-1.5 text-[#3d5638] hover:underline"
            >
              <ExternalLink size={14} />
              Sitede görüntüle
            </Link>
          ) : null}
        </div>
        {listing.rejectReason ? (
          <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
            Red nedeni: {listing.rejectReason}
          </p>
        ) : null}
        {listing.priceRequests.length > 0 ? (
          <p className="mt-3 rounded-xl border border-[#8A6A43]/40 bg-[#8A6A43]/10 px-3 py-2 text-sm text-[#8A6A43]">
            Bekleyen fiyat talebi: {listing.priceRequests[0].requestedPrice}
            {listing.priceRequests[0].note ? ` — ${listing.priceRequests[0].note}` : ''} (panel ana
            sayfasından sonuçlandırın)
          </p>
        ) : null}
      </Card>

      <Card title={listing.title}>
        <ListingForm action={saveListing.bind(null, listing.id)} defaults={defaults} />
        <div className="mt-6 border-t border-[#D9E3D5] pt-4">
          <DeleteListingButton listingId={listing.id} />
        </div>
      </Card>
    </div>
  );
}
