'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';
import { ListingDetailDialog } from '@/components/listings/listing-detail-dialog';
import { useStore, waLink } from '@/store';
import type { Listing } from '@/content';
import type { HomeFilters } from './search-band';

const norm = (s: string) => s.toLocaleLowerCase('tr-TR');

export function FeaturedListings({
  filters,
  onClear,
}: {
  filters: HomeFilters;
  onClear: () => void;
}) {
  const { content } = useStore();
  const [selected, setSelected] = useState<Listing | null>(null);
  const active = !!filters.district || !!filters.type || !!filters.q;

  const visible = useMemo(
    () =>
      content.listings.filter((l) => {
        if (filters.district && l.district !== filters.district) return false;
        if (filters.type && l.type !== filters.type) return false;
        if (filters.q) {
          const hay = norm(`${l.title} ${l.location} ${l.district} ${l.type}`);
          if (!hay.includes(norm(filters.q))) return false;
        }
        return true;
      }),
    [content.listings, filters],
  );

  return (
    <section id="ilanlar" className="bg-background py-16 sm:py-24">
      <div className="container">
        <h2 className="title-rule title-rule-center text-center font-heading text-3xl font-light text-foreground sm:text-4xl">
          {content.sections.listingsTitle}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-[17px] text-muted-foreground">
          {content.sections.listingsSubtitle}
        </p>

        <div className="mt-10 flex items-center justify-between gap-4">
          <span className="text-[15px] text-muted-foreground">
            <b className="font-semibold text-foreground">{visible.length}</b> ilan
            listeleniyor
            {filters.q ? (
              <>
                {' '}
                · arama: <b className="font-semibold text-foreground">“{filters.q}”</b>
              </>
            ) : null}
          </span>
          {active && (
            <Button variant="outline" size="sm" onClick={onClear}>
              <X className="mr-1 h-4 w-4" />
              Filtreyi temizle
            </Button>
          )}
        </div>

        {visible.length === 0 ? (
          <div className="mt-6 border border-dashed border-input bg-muted/50 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center border border-border bg-background text-ink-soft">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-heading text-xl font-medium text-foreground">
              Bu kriterlere uygun ilan bulunamadı
            </h3>
            <p className="mx-auto mt-2 max-w-sm leading-relaxed text-muted-foreground">
              Filtreleri değiştirin ya da bize ulaşın; size uygun araziyi birlikte
              bulalım.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" onClick={onClear}>
                <X className="mr-1 h-4 w-4" />
                Filtreyi temizle
              </Button>
              <Button asChild>
                <a
                  href={waLink(
                    content.contact.whatsapp,
                    'Merhaba, aradığım kriterlerde ilan bulamadım. Bana uygun bir arazi var mı?',
                  )}
                  target="_blank"
                  rel="noreferrer"
                >
                  Bize Ulaşın
                </a>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((l) => (
              <ListingCard key={l.id} listing={l} onOpen={setSelected} className="h-full" />
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
