'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';
import { ListingDetailDialog } from '@/components/listings/listing-detail-dialog';
import { ShowcaseListing } from '@/components/listings/showcase-listing';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/motion/reveal';
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

  // Filtre yokken ilk ilan büyük "vitrin parseli" olarak öne çıkarılır;
  // arama/filtre sonuçları eş boyutlu grid'de kalır.
  const showcase = !active && visible.length > 1 ? visible[0] : null;
  const gridItems = showcase ? visible.slice(1) : visible;

  return (
    <section id="ilanlar" className="bg-background py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow="Vitrin"
          title={content.sections.listingsTitle}
          subtitle={content.sections.listingsSubtitle}
        />

        <div className="mt-12 flex items-center justify-between gap-4 border-b border-border pb-5">
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
          <div className="mt-6 rounded-lg border border-dashed border-input bg-muted/50 py-16 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-border bg-background text-brass">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="mt-5 font-heading text-xl font-semibold text-foreground">
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
          <>
            {showcase ? (
              <Reveal className="mt-10">
                <ShowcaseListing listing={showcase} onOpen={setSelected} />
              </Reveal>
            ) : null}
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridItems.map((l, i) => (
                <Reveal key={l.id} delay={(i % 3) * 90} className="h-full">
                  <ListingCard listing={l} onOpen={setSelected} className="h-full" />
                </Reveal>
              ))}
              {/* Grid'in son hücresi boş kalmasın: kesikli terminal karo */}
              {showcase && gridItems.length % 3 !== 0 ? (
                <Reveal delay={(gridItems.length % 3) * 90} className="h-full">
                  <div className="flex h-full min-h-[16rem] flex-col justify-between rounded-lg border border-dashed border-primary/30 p-6">
                    <div>
                      <h3 className="font-heading text-xl font-semibold text-foreground">
                        Aradığınızı bulamadınız mı?
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                        Kriterlerinizi bize yazın; ilçe ilçe tarayıp size uygun
                        parseli birlikte bulalım.
                      </p>
                    </div>
                    <Button asChild variant="outline" className="mt-6 self-start">
                      <a
                        href={waLink(
                          content.contact.whatsapp,
                          'Merhaba, aradığım kriterlere uygun bir arazi arıyorum.',
                        )}
                        target="_blank"
                        rel="noreferrer"
                      >
                        WhatsApp’tan yazın
                      </a>
                    </Button>
                  </div>
                </Reveal>
              ) : null}
            </div>
          </>
        )}
      </div>

      <ListingDetailDialog
        listing={selected}
        onOpenChange={(open) => !open && setSelected(null)}
      />
    </section>
  );
}
