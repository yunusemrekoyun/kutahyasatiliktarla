'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';
import { ListingDetailDialog } from '@/components/listings/listing-detail-dialog';
import { useStore } from '@/store';
import type { Listing } from '@/content';
import type { HomeFilters } from './search-bar';

export function FeaturedListings({
  filters,
  onClear,
}: {
  filters: HomeFilters;
  onClear: () => void;
}) {
  const { content } = useStore();
  const [selected, setSelected] = useState<Listing | null>(null);
  const active = !!filters.district || !!filters.type;

  const visible = useMemo(
    () =>
      content.listings.filter((l) => {
        if (filters.district && l.district !== filters.district) return false;
        if (filters.type && l.type !== filters.type) return false;
        return true;
      }),
    [content.listings, filters],
  );

  return (
    <section id="ilanlar" className="border-t border-border bg-secondary/30 py-16 sm:py-20">
      <div className="container">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Öne çıkan ilanlar
            </h2>
            <p className="mt-2 text-muted-foreground">
              Her ilan gerçek fotoğraf, konum ve net künye bilgisiyle hazırlanır.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              <b className="text-foreground">{visible.length}</b> ilan
            </span>
            {active && (
              <Button variant="outline" size="sm" onClick={onClear}>
                <X className="mr-1 h-4 w-4" />
                Filtreyi temizle
              </Button>
            )}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-border bg-card py-14 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
              Bu kriterlere uygun ilan bulunamadı
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
              Filtreleri değiştirin ya da bizimle iletişime geçin; size özel arazi bulalım.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" onClick={onClear}>
                <X className="mr-1 h-4 w-4" />
                Filtreyi temizle
              </Button>
              <Button asChild>
                <a href="#ilan-ver">Bize ulaşın</a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((l) => (
              <ListingCard key={l.id} listing={l} onOpen={setSelected} />
            ))}
          </div>
        )}
      </div>

      <ListingDetailDialog
        listing={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </section>
  );
}
