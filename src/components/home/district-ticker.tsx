import type { District } from '@/content';

/**
 * Pazar yeri bandı: ilçeler ve canlı ilan sayıları yavaşça akar.
 * Üzerine gelince durur; reduced-motion'da global kural animasyonu kapatır.
 */
export function DistrictTicker({ items }: { items: District[] }) {
  const Track = ({ hidden }: { hidden?: boolean }) => (
    <div
      aria-hidden={hidden || undefined}
      className="ticker-track flex shrink-0 animate-marquee items-center"
    >
      {items.map((d) => (
        <span key={d.name} className="flex items-center">
          <span className="px-5 font-heading text-lg font-semibold text-white sm:text-xl">
            {d.name}
          </span>
          <span className="text-[15px] font-medium text-white/75">{d.count}</span>
          <span className="px-6 text-harvest" aria-hidden="true">
            ✳
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="ticker overflow-hidden border-y border-white/10 bg-brand-deep py-4">
      <div className="flex w-max">
        <Track />
        <Track hidden />
      </div>
    </div>
  );
}
