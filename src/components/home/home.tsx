'use client';

import { useStore } from '@/store';
import { Hero } from './hero';
import { SearchBand } from './search-band';
import { CategoryTiles } from './category-tiles';
import { FeaturedListings } from './featured-listings';
import { HowItWorks } from './how-it-works';
import { SellCta } from './sell-cta';

export function Home() {
  const { content } = useStore();

  // İlçe kartlarındaki sayılar elle yazılmaz; gerçek ilan sayısından türetilir.
  const districtsWithCounts = content.districts.map((d) => ({
    ...d,
    count: `${content.listings.filter((l) => l.district === d.name).length} ilan`,
  }));

  return (
    <>
      <Hero />
      <SearchBand districts={content.districts.map((d) => d.name)} />
      <FeaturedListings />
      <CategoryTiles districts={districtsWithCounts} />
      <HowItWorks />
      <SellCta />
    </>
  );
}
