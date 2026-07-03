'use client';

import { useEffect, useState } from 'react';
import { useStore } from '@/store';
import { scrollToId } from '@/lib/scroll';
import { Hero } from './hero';
import { SearchBand, type HomeFilters } from './search-band';
import { CategoryTiles } from './category-tiles';
import { FeaturedListings } from './featured-listings';
import { HowItWorks } from './how-it-works';
import { SellCta } from './sell-cta';

const EMPTY: HomeFilters = { district: '', type: '', q: '' };

export function Home() {
  const { content, districtRequest, requestDistrict, searchRequest, requestSearch } =
    useStore();
  const [filters, setFilters] = useState<HomeFilters>(EMPTY);
  const districtNames = content.districts.map((d) => d.name);

  // İlçe kartlarındaki sayılar elle yazılmaz; gerçek ilan sayısından türetilir.
  const districtsWithCounts = content.districts.map((d) => ({
    ...d,
    count: `${content.listings.filter((l) => l.district === d.name).length} ilan`,
  }));

  // Footer'dan gelen ilçe istekleri
  useEffect(() => {
    if (!districtRequest) return;
    setFilters({ district: districtRequest, type: '', q: '' });
    scrollToId('ilanlar');
    requestDistrict(null);
  }, [districtRequest, requestDistrict]);

  // Header aramasından gelen serbest metin istekleri
  useEffect(() => {
    if (!searchRequest) return;
    setFilters({ district: '', type: '', q: searchRequest });
    scrollToId('ilanlar');
    requestSearch(null);
  }, [searchRequest, requestSearch]);

  function pickDistrict(district: string) {
    setFilters({ district, type: '', q: '' });
    scrollToId('ilanlar');
  }

  return (
    <>
      <Hero />
      <SearchBand districts={districtNames} filters={filters} onApply={setFilters} />
      <FeaturedListings filters={filters} onClear={() => setFilters(EMPTY)} />
      <CategoryTiles districts={districtsWithCounts} onPick={pickDistrict} />
      <HowItWorks />
      <SellCta />
    </>
  );
}
