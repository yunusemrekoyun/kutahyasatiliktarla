'use client';

import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { useStore } from '@/store';
import type { District } from '@/content';

export function CategoryTiles({
  districts,
  onPick,
}: {
  districts: District[];
  onPick: (district: string) => void;
}) {
  const { content } = useStore();
  return (
    <section id="bolgeler" className="bg-secondary/50 py-20 sm:py-28">
      <div className="container grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <h2 className="font-heading text-3xl font-semibold leading-[1.12] text-foreground sm:text-[2.6rem]">
              {content.sections.districtsTitle}
            </h2>
            <p className="mt-3 max-w-md text-lg leading-relaxed text-muted-foreground">
              {content.sections.districtsSubtitle}
            </p>
            <div className="mt-9 flex items-baseline gap-3">
              <span className="font-heading text-6xl font-semibold text-primary sm:text-7xl">
                {content.listings.length}
              </span>
              <span className="text-lg text-muted-foreground">aktif ilan</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <ul>
            {districts.map((d) => (
              <li key={d.name} className="border-b border-border first:border-t">
                <button
                  type="button"
                  onClick={() => onPick(d.name)}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
                    <span className="font-heading text-2xl font-semibold text-foreground transition-[transform,color] duration-300 ease-out-quart group-hover:translate-x-2 group-hover:text-primary sm:text-[1.9rem]">
                      {d.name}
                    </span>
                    <span className="hidden truncate text-[15px] text-muted-foreground sm:inline">
                      {d.text}
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-4">
                    <span className="text-[15px] font-medium text-muted-foreground">
                      {d.count}
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-full border border-border text-muted-foreground transition-[background-color,border-color,color] duration-300 ease-out-quart group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowUpRight className="h-5 w-5" />
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
