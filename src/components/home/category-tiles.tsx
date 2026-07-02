'use client';

import { ArrowRight } from 'lucide-react';
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
    <section id="bolgeler" className="bg-stone py-16 sm:py-24">
      <div className="container">
        <h2 className="title-rule title-rule-center text-center font-heading text-3xl font-light text-foreground sm:text-4xl">
          {content.sections.districtsTitle}
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-[17px] text-muted-foreground">
          {content.sections.districtsSubtitle}
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d) => (
            <button
              key={d.name}
              type="button"
              onClick={() => onPick(d.name)}
              className="group flex h-full flex-col border border-border bg-card p-6 text-left transition-colors duration-200 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="title-rule title-rule-sm font-heading text-[1.35rem] font-medium text-foreground">
                {d.name}
              </span>
              <span className="mt-4 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                {d.text}
              </span>
              <span className="mt-5 flex items-center justify-between border-t border-border pt-4">
                <span className="text-[14px] font-medium text-muted-foreground">{d.count}</span>
                <span className="flex items-center gap-1.5 text-[15px] font-semibold text-foreground">
                  İlanları Gör
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
