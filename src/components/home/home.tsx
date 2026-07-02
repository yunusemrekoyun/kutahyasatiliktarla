'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { scrollToId } from '@/lib/scroll';
import { Hero } from './hero';
import { CategoryTiles } from './category-tiles';
import { FeaturedListings } from './featured-listings';
import { HowItWorks } from './how-it-works';
import { SellCta } from './sell-cta';
import type { HomeFilters } from './search-bar';

const EMPTY: HomeFilters = { district: '', type: '' };

export function Home() {
  const { content, districtRequest, requestDistrict } = useStore();
  const [filters, setFilters] = useState<HomeFilters>(EMPTY);
  const districtNames = content.districts.map((d) => d.name);

  // İlçe kartlarındaki sayılar elle yazılmaz; gerçek ilan sayısından türetilir.
  const districtsWithCounts = content.districts.map((d) => ({
    ...d,
    count: `${content.listings.filter((l) => l.district === d.name).length} ilan`,
  }));

  // Footer gibi uzak bileşenlerden gelen ilçe filtre istekleri.
  useEffect(() => {
    if (!districtRequest) return;
    setFilters({ district: districtRequest, type: '' });
    scrollToId('ilanlar');
    requestDistrict(null);
  }, [districtRequest, requestDistrict]);

  function pickDistrict(district: string) {
    setFilters({ district, type: '' });
    scrollToId('ilanlar');
  }

  return (
    <>
      <Hero districts={districtNames} onApply={setFilters} />
      <FeaturedListings filters={filters} onClear={() => setFilters(EMPTY)} />
      <CategoryTiles districts={districtsWithCounts} onPick={pickDistrict} />
      <HowItWorks />
      <SellCta />
    </>
  );
}
