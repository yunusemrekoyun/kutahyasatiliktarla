'use client';

import { useStore } from '@/store';

export function Hero() {
  const { content } = useStore();

  return (
    <section aria-label="Tanıtım" className="relative">
      <div className="relative h-[56vh] min-h-[400px] w-full overflow-hidden lg:h-[64vh] lg:max-h-[680px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=80"
          alt="Kütahya kırsalında gün batımında tarlalar"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-2xl bg-white/80 p-7 sm:p-10">
              <h1 className="font-heading text-[1.9rem] font-light uppercase leading-[1.15] tracking-wide text-foreground sm:text-4xl lg:text-5xl">
                {content.hero.titleLine1} {content.hero.titleAccent}
              </h1>
            </div>
          </div>
        </div>
      </div>
      {/* İnce sarı marka şeridi */}
      <div className="h-2 w-full bg-primary" aria-hidden="true" />
    </section>
  );
}
