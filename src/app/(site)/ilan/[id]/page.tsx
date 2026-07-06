import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getListing, getPublishedListings } from '@/lib/data';
import { ListingDetail } from '@/components/listings/listing-detail';
import { ListingJsonLd } from '@/components/seo/listing-jsonld';
import { TrackView } from '@/components/listings/track-view';

/** Yayındaki ilanlar build'de statik üretilir (DB yoksa seed fallback'i);
 * sonradan eklenen ilanlar ilk istekte üretilip cache'lenir. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const listings = await getPublishedListings();
  return listings.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) {
    return { title: 'İlan — Kütahya Satılık Tarla' };
  }
  return {
    title: listing.title,
    description: `${listing.location} · ${listing.area} · ${listing.price}. ${listing.description ?? ''}`.slice(0, 160),
    alternates: { canonical: `/ilan/${listing.id}` },
    openGraph: listing.images[0] ? { images: [listing.images[0]] } : undefined,
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  return (
    <>
      <ListingJsonLd listing={listing} />
      <ListingDetail listing={listing} />
      <TrackView slug={listing.id} />
    </>
  );
}
