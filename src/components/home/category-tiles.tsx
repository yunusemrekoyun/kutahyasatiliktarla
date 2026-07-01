import { ChevronRight, MapPin } from 'lucide-react';
import type { District } from '@/content';

export function CategoryTiles({
  districts,
  onPick,
}: {
  districts: District[];
  onPick: (district: string) => void;
}) {
  return (
    <section id="bolgeler" className="border-t border-border bg-background py-16 sm:py-20">
      <div className="container">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Bölgeye göre keşfedin
          </h2>
          <p className="mt-2 text-muted-foreground">
            Kütahya merkez ve ilçelerindeki tarla, arsa ve arazi fırsatlarını inceleyin.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {districts.map((d) => (
            <button
              key={d.name}
              type="button"
              onClick={() => onPick(d.name)}
              className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
            >
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" />
              </span>
              <span className="font-heading text-base font-semibold text-foreground">
                {d.name}
              </span>
              <span className="text-sm text-muted-foreground">{d.count}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                İncele
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
