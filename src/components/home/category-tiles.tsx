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
      <div className="container">
        <Reveal>
          <div className="max-w-xl">
            <h2 className="font-heading text-3xl font-semibold leading-[1.12] text-foreground sm:text-[2.6rem]">
              {content.sections.districtsTitle}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              {content.sections.districtsSubtitle}
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {districts.map((d, i) => (
            <Reveal key={d.name} delay={(i % 3) * 60}>
              <button
                type="button"
                onClick={() => onPick(d.name)}
                className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-border bg-card px-6 py-6 text-left shadow-soft-sm transition-[transform,box-shadow,border-color] duration-300 ease-out-quart hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-soft"
              >
                <span className="min-w-0">
                  <span className="block font-heading text-[1.45rem] font-semibold leading-tight text-foreground">
                    {d.name}
                  </span>
                  <span className="mt-1.5 block truncate text-[15px] text-muted-foreground">
                    {d.count} · {d.text}
                  </span>
                </span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-[background-color,border-color,color,transform] duration-300 ease-out-quart group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight className="h-5 w-5 transition-transform duration-300 ease-out-quart group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
