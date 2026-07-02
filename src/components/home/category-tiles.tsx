'use client';

import { ArrowRight } from 'lucide-react';
import { useStore } from '@/store';
import { SectionHeading } from '@/components/site/section-heading';
import { Reveal } from '@/components/motion/reveal';
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
    <section id="bolgeler" className="bg-muted py-20 sm:py-28">
      <div className="container">
        <SectionHeading
          eyebrow="Bölgeler"
          title={content.sections.districtsTitle}
          subtitle={content.sections.districtsSubtitle}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d, i) => (
            <Reveal key={d.name} delay={(i % 3) * 90} className="h-full">
              <button
                type="button"
                onClick={() => onPick(d.name)}
                className="group flex h-full w-full flex-col rounded-lg border border-border bg-card p-6 text-left transition-[transform,box-shadow,border-color] duration-300 ease-out-quart hover:-translate-y-1 hover:border-primary/25 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <span className="font-heading text-[1.35rem] font-semibold tracking-[-0.01em] text-foreground">
                  {d.name}
                </span>
                <span className="mt-3 h-0.5 w-10 bg-brass" aria-hidden="true" />
                <span className="mt-4 flex-1 text-[15px] leading-relaxed text-muted-foreground">
                  {d.text}
                </span>
                <span className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="text-[14px] font-semibold text-brass-strong">{d.count}</span>
                  <span className="flex items-center gap-1.5 text-[15px] font-semibold text-primary">
                    İlanları Gör
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
