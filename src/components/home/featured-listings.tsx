'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ListingCard } from '@/components/listings/listing-card';
import { ShowcaseListing } from '@/components/listings/showcase-listing';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/motion/reveal';
import { useStore } from '@/store';

/**
 * Ana sayfa vitrini: ilk ilan büyük parsel, ardından üç kart ve tüm
 * ilanlara açılan kapı. Filtreleme/gezinme işi /ilanlar sayfasında.
 */
export function FeaturedListings() {
  const { content } = useStore();
  const [showcase, ...rest] = content.listings;
  const cards = rest.slice(0, 3);

  if (!showcase) return null;

  return (
    <section id="ilanlar" className="bg-background py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          index="02"
          eyebrow="Vitrin"
          title={content.sections.listingsTitle}
          subtitle={content.sections.listingsSubtitle}
        />

        <Reveal className="mt-12">
          <ShowcaseListing listing={showcase} />
        </Reveal>

        {cards.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
