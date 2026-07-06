'use client';

import type { Listing } from '@/content';
import { useStore } from '@/store';
import { OpeningSequence } from './opening-sequence';
import { SearchBand } from './search-band';
import { CategoryTiles } from './category-tiles';
import { FeaturedListings } from './featured-listings';
import { HowItWorks } from './how-it-works';
import { LeadMatch } from './lead-match';
import { SellCta } from './sell-cta';

export function Home({ listings }: { listings: Listing[] }) {
  const { content } = useStore();

  // İlçe kartlarındaki sayılar elle yazılmaz; gerçek ilan sayısından türetilir.
  const districtsWithCounts = content.districts.map((d) => ({
    ...d,
    count: `${listings.filter((l) => l.district === d.name).length} ilan`,
  }));

  return (
    <>
      {/* Açılış sekansı: hero → öne çıkan ilan morph + slider */}
      <OpeningSequence listings={listings} />
      <SearchBand districts={content.districts.map((d) => d.name)} />
      <FeaturedListings listings={listings} />
      <CategoryTiles districts={districtsWithCounts} />
      <HowItWorks />
      <LeadMatch />
      <SellCta />
    </>
  );
}
