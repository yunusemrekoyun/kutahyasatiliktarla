import { Camera, ShieldCheck, Sprout, Users } from 'lucide-react';
import { SearchBar, type HomeFilters } from './search-bar';

export function Hero({
  districts,
  onApply,
}: {
  districts: string[];
  onApply: (f: HomeFilters) => void;
}) {
  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#14311f]/85 via-[#14311f]/55 to-[#14311f]/90" />
      </div>

      <div className="container flex min-h-[580px] flex-col justify-center py-16 sm:min-h-[660px]">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-medium text-white backdrop-blur">
          <Sprout className="h-4 w-4 text-harvest" />
          Kütahya’nın yerel arazi platformu
        </span>

        <h1 className="mt-5 max-w-3xl font-heading text-4xl font-bold leading-[1.08] text-white sm:text-5xl md:text-6xl">
          Kütahya’da tarla, arsa ve arazi
          <span className="text-harvest"> güvenle</span> alınır, satılır
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
          Gerçek fotoğraflar, net tapu ve künye bilgisi, yerel ekip. Aradığınız
          araziyi kolayca bulun ya da kendi arazinizi ücretsiz ilana verin.
        </p>

        <div className="mt-8 max-w-3xl rounded-2xl border border-white/25 bg-white/95 p-4 shadow-2xl sm:p-5">
          <SearchBar districts={districts} onApply={onApply} />
        </div>

        <div className="mt-6 flex flex-wrap gap-x-7 gap-y-2 text-[15px] text-white/90">
          <span className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-harvest" /> Gerçek drone &amp; fotoğraf
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-harvest" /> Net tapu &amp; künye
          </span>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4 text-harvest" /> Yerel ekip
          </span>
        </div>
      </div>
    </section>
  );
}
