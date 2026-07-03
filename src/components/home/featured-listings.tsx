'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';
import { ShowcaseScene } from '@/components/listings/showcase-scene';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { useStore } from '@/store';

/**
 * Ana sayfa vitrini: ilk ilan sinematik "çapa sahne" (ShowcaseScene) olarak
 * kaydırmayla açılır; ardından üç kart ve tüm ilanlara kapı. Filtreleme/
 * gezinme /ilanlar sayfasında.
 */
export function FeaturedListings() {
  const { content } = useStore();
  const [showcase, ...rest] = content.listings;
  const cards = rest.slice(0, 3);

  if (!showcase) return null;

  return (
    <section id="ilanlar" className="bg-background">
      <div className="container pt-20 sm:pt-28">
        <SectionHeading
          index="02"
          eyebrow="Vitrin"
          title={content.sections.listingsTitle}
          subtitle={content.sections.listingsSubtitle}
        />
      </div>

      {/* İkinci çapa sahne — kaydırmayla açı değişir, parsel çizilir */}
      <div className="mt-12">
        <ShowcaseScene listing={showcase} />
      </div>

      <div className="container pb-20 pt-12 sm:pb-28">
        {cards.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((l, i) => (
              <Reveal key={l.id} delay={(i % 3) * 90} className="h-full">
                <ListingCard listing={l} className="h-full" />
              </Reveal>
            ))}
          </div>
        ) : null}

        <Reveal delay={100} className="mt-12 flex justify-center">
          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-[15px]">
            <Link href="/ilanlar">
              Tüm ilanları görün
              <ArrowRight className="size-5" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
