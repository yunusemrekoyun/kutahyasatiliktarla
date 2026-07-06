import type { Metadata } from 'next';
import { getPublishedListings } from '@/lib/data';
import { Home } from '@/components/home/home';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default async function Page() {
  const listings = await getPublishedListings();
  return <Home listings={listings} />;
}
