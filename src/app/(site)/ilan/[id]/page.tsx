import type { Metadata } from 'next';
import { defaultContent } from '@/content';
import { ListingDetail } from '@/components/listings/listing-detail';

/** Tohum ilanlar build'de statik üretilir; admin'in sonradan eklediği
 * ilanlar istek anında render edilip istemcide store'dan okunur. */
export function generateStaticParams() {
  return defaultContent.listings.map((l) => ({ id: l.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = defaultContent.listings.find((l) => l.id === id);
  if (!listing) {
    return { title: `İlan — ${defaultContent.brand}` };
  }
  return {
    title: `${listing.title} — ${defaultContent.brand}`,
    description: `${listing.location} · ${listing.area} · ${listing.price}. ${listing.description ?? ''}`.slice(0, 160),
  };
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ListingDetail id={id} />;
}
