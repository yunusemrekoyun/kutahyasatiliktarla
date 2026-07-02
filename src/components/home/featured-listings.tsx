'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';
import { ListingCard } from '@/components/listings/listing-card';
import { ListingDetailDialog } from '@/components/listings/listing-detail-dialog';
import { useStore, waLink } from '@/store';
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
    <section id="ilanlar" className="py-20 sm:py-28">
      <div className="container">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-xl">
              <h2 className="font-heading text-3xl font-semibold leading-[1.12] text-foreground sm:text-[2.6rem]">
                {content.sections.listingsTitle}
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                {content.sections.listingsSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-3 pb-1">
              <span className="text-[15px] text-muted-foreground">
                <b className="font-semibold text-foreground">{visible.length}</b> ilan
              </span>
              {active && (
                <Button variant="outline" size="sm" onClick={onClear}>
                  <X className="mr-1 h-4 w-4" />
                  Filtreyi temizle
                </Button>
              )}
            </div>
          </div>
        </Reveal>

        {visible.length === 0 ? (
          <Reveal>
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-card py-16 text-center shadow-soft-sm">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
                <Search className="h-7 w-7" />
              </div>
              <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
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
                    Bize ulaşın
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((l, i) => (
              <Reveal
                key={l.id}
                delay={(i % 3) * 70}
                className={cn('h-full', i === 0 && 'sm:col-span-2')}
              >
                <ListingCard
                  listing={l}
                  onOpen={setSelected}
                  featured={i === 0}
                  className="h-full"
                />
              </Reveal>
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
