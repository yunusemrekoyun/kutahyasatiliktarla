'use client';

import { BadgeCheck, Camera } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { ParcelFrame } from '@/components/site/parcel-frame';
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
    <section id="top" className="relative isolate overflow-hidden bg-background">
      {/* Çok hafif kadastro ızgarası — yukarıda belirgin, aşağıda eriyor */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,hsl(150_14%_88%/0.7)_1px,transparent_1px),linear-gradient(to_bottom,hsl(150_14%_88%/0.7)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(90%_65%_at_50%_0%,black,transparent)]"
      />

      <div className="container grid items-center gap-12 py-14 sm:py-20 lg:min-h-[calc(100dvh-68px)] lg:grid-cols-[1.05fr_0.9fr] lg:gap-16 lg:py-10">
        {/* Sol: dev tipografi + arama */}
        <div>
          <Reveal>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-1.5 text-[13px] font-semibold text-primary shadow-soft-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-harvest" />
              {content.hero.badge}
            </span>
          </Reveal>

          <Reveal delay={70}>
            <h1 className="mt-6 font-heading text-[2.8rem] font-semibold leading-[1.0] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-[4.6rem]">
              {content.hero.titleLine1}
              <br />
              <span className="relative inline-block">
                <em className="font-medium italic text-primary">
                  {content.hero.titleAccent}
                </em>
                <svg
                  aria-hidden="true"
                  className="absolute -bottom-2 left-0 w-full text-harvest sm:-bottom-3"
                  viewBox="0 0 240 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M3 9C45 3.5 118 2 237 6.5"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {content.hero.subtitle}
            </p>
          </Reveal>

          <Reveal delay={210} className="mt-9">
            <SearchBar districts={districts} onApply={onApply} />
          </Reveal>

          <Reveal delay={280}>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px] text-muted-foreground">
              <span>Gerçek drone ve fotoğraf</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>Net tapu ve künye bilgisi</span>
              <span className="h-1 w-1 rounded-full bg-border" />
              <span>Yerel ekip, kolay iletişim</span>
            </div>
          </Reveal>
        </div>

        {/* Sağ: parsel çerçeveli saha fotoğrafı */}
        <Reveal delay={120} className="relative hidden lg:block">
          <div
            aria-hidden="true"
            className="absolute -right-6 top-10 -z-10 h-full w-full rotate-2 rounded-[2.5rem] bg-primary/10"
          />
          <div className="relative overflow-hidden rounded-[2rem] shadow-soft-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&q=80"
              alt="Kütahya kırsalında gün batımında tarla"
              className="aspect-[4/5] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/45 via-transparent to-transparent" />
            <ParcelFrame label="12.500 m² · Tavşanlı" />
          </div>

          <div className="absolute -left-8 bottom-10 rounded-2xl border border-border bg-card p-4 shadow-soft-lg">
            <div className="flex items-center gap-2.5 text-[15px] font-semibold text-foreground">
              <BadgeCheck className="h-5 w-5 text-primary" />
              Tapu bilgisi doğrulandı
            </div>
            <div className="mt-2 flex items-center gap-2.5 text-[15px] text-muted-foreground">
              <Camera className="h-5 w-5 text-harvest" />
              Drone çekimi hazır
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
