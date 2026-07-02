'use client';

import { useStore } from '@/store';
import { BrandStrip } from '@/components/site/brand-strip';

export function Hero() {
  const { content } = useStore();

  return (
    <section aria-label="Tanıtım" className="relative">
      <div className="relative h-[54vh] min-h-[400px] w-full overflow-hidden lg:h-[62vh] lg:max-h-[660px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2200&q=80"
          alt="Kütahya kırsalında gün batımında tarlalar"
          className="h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-cobalt/55 via-cobalt/10 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-xl bg-white p-7 shadow-soft-lg sm:max-w-2xl sm:p-10">
              <span className="mb-4 block h-1.5 w-14 bg-gold" aria-hidden="true" />
              <span className="text-[13px] font-bold uppercase tracking-[0.18em] text-primary">
                {content.hero.badge}
              </span>
              <h1 className="mt-3 font-heading text-[1.9rem] font-bold leading-[1.12] text-foreground sm:text-4xl lg:text-[2.9rem]">
                {content.hero.titleLine1}{' '}
                <span className="text-primary">{content.hero.titleAccent}</span>
              </h1>
              <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-foreground/75">
                {content.hero.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
      <BrandStrip />
    </section>
  );
}
