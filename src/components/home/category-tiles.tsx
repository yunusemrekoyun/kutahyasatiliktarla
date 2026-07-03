'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useStore } from '@/store';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/motion/reveal';
import type { District } from '@/content';

/**
 * İlçe dizini: eş kart grid'i yerine numaralı editorial liste.
 * Her satır bir pafta kaydı gibi okunur; büyük Bricolage ilçe adı,
 * hairline ayraçlar, sağda ilan sayısı ve ok.
 */
export function CategoryTiles({ districts }: { districts: District[] }) {
  const { content } = useStore();
  return (
    <section id="bolgeler" className="bg-muted py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          index="03"
          eyebrow="Bölgeler"
          title={content.sections.districtsTitle}
          subtitle={content.sections.districtsSubtitle}
        />

        <ol className="mt-12 border-t border-border">
          {districts.map((d, i) => (
            <li key={d.name} className="border-b border-border">
              <Reveal delay={i * 60}>
                <Link
                  href={`/ilanlar?ilce=${encodeURIComponent(d.name)}`}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 py-6 text-left transition-colors duration-200 hover:bg-card sm:grid-cols-[3.5rem_1fr_auto_auto] sm:gap-x-6 sm:px-4 sm:py-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                >
                  <span
                    className="nums font-heading text-sm font-bold text-brass-strong"
                    aria-hidden="true"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading text-2xl font-bold tracking-[-0.01em] text-foreground transition-transform duration-300 ease-out-quart group-hover:translate-x-1 sm:text-3xl">
                      {d.name}
                    </span>
                    <span className="mt-1 block text-[15px] leading-relaxed text-muted-foreground">
                      {d.text}
                      <span className="nums sm:hidden"> · {d.count}</span>
                    </span>
                  </span>
                  <span className="nums hidden text-[14px] font-semibold text-muted-foreground sm:block">
                    {d.count}
                  </span>
                  <ArrowRight className="h-5 w-5 justify-self-end text-brass-strong transition-transform duration-300 ease-out-quart group-hover:translate-x-1.5" />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
