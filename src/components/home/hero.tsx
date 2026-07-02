'use client';

import { Reveal } from '@/components/motion/reveal';
import { useStore } from '@/store';
import { SearchBar, type HomeFilters } from './search-bar';

export function Hero({
  districts,
  onApply,
}: {
  districts: string[];
  onApply: (f: HomeFilters) => void;
}) {
  const { content } = useStore();

  return (
    <section
      id="top"
      className="texture-grain relative isolate overflow-hidden bg-brand-deep text-white"
    >
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/75 via-brand-deep/70 to-brand-deep/95" />
        <div className="absolute inset-0 bg-[radial-gradient(125%_85%_at_50%_-10%,transparent_10%,hsl(158_44%_10%/0.65)_85%)]" />
      </div>

      <div className="container flex min-h-[86dvh] flex-col justify-center py-24 sm:py-28">
        <div className="max-w-3xl">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-[13px] font-medium text-white/85 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-harvest" />
              {content.hero.badge}
            </span>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="mt-6 font-heading text-[2.7rem] font-semibold leading-[1.03] tracking-[-0.02em] text-white sm:text-6xl md:text-[4.5rem]">
              {content.hero.titleLine1}
              <br className="hidden sm:block" />{' '}
              <span className="italic font-medium text-harvest">
                {content.hero.titleAccent}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80 sm:text-xl">
              {content.hero.subtitle}
            </p>
          </Reveal>
        </div>

        <Reveal delay={210} className="mt-10 w-full max-w-3xl">
          <div className="rounded-2xl bg-background p-2.5 text-foreground shadow-soft-lg ring-1 ring-black/5">
            <SearchBar districts={districts} onApply={onApply} />
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span>Gerçek drone ve fotoğraf</span>
            <span className="h-1 w-1 rounded-full bg-white/35" />
            <span>Net tapu ve künye bilgisi</span>
            <span className="h-1 w-1 rounded-full bg-white/35" />
            <span>Yerel ekip, kolay iletişim</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
