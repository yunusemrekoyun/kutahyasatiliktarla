'use client';

import { useState } from 'react';
import { useStore } from '@/store';
import { Hero } from './hero';
import { CategoryTiles } from './category-tiles';
import { FeaturedListings } from './featured-listings';
import { HowItWorks } from './how-it-works';
import { SellCta } from './sell-cta';
import type { HomeFilters } from './search-bar';

const EMPTY: HomeFilters = { district: '', type: '' };

export function Home() {
  const { content } = useStore();
  const [filters, setFilters] = useState<HomeFilters>(EMPTY);
  const districtNames = content.districts.map((d) => d.name);

  function pickDistrict(district: string) {
    setFilters({ district, type: '' });
    document.getElementById('ilanlar')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      <Hero districts={districtNames} onApply={setFilters} />
      <CategoryTiles districts={content.districts} onPick={pickDistrict} />
      <FeaturedListings filters={filters} onClear={() => setFilters(EMPTY)} />
      <HowItWorks />
      <SellCta />
    </>
  );
}
