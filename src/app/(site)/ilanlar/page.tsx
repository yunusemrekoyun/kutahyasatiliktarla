import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getPublishedListings } from '@/lib/data';
import { Browse } from '@/components/listings/browse';

export const metadata: Metadata = {
  title: 'Satılık Tarla, Arsa ve Arazi İlanları',
  description:
    'Kütahya merkez ve ilçelerindeki satılık tarla, arsa, bağ-bahçe ve köy içi arazi ilanlarını ilçeye ve türe göre filtreleyin.',
  alternates: { canonical: '/ilanlar' },
};

export default async function Page() {
  const listings = await getPublishedListings();
  return (
    <Suspense fallback={null}>
      <Browse listings={listings} />
    </Suspense>
  );
}
