import { cn } from '@/lib/utils';

/**
 * Marka amblemi: Kütahya çini geleneğinin 8 köşeli yıldız (mühr) motifi.
 * Turkuaz tile + altın çini yıldızı + kobalt göbek — yerel, sahiplenilebilir.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-hidden="true">
      <rect width="40" height="40" rx="7" fill="hsl(178 74% 26%)" />
      <g fill="hsl(40 88% 47%)">
        <rect x="11" y="11" width="18" height="18" rx="1.5" />
        <path d="M20 5.5 L34.5 20 L20 34.5 L5.5 20 Z" />
      </g>
      <circle cx="20" cy="20" r="5.6" fill="hsl(212 56% 20%)" />
      <circle cx="20" cy="20" r="2" fill="hsl(40 88% 47%)" />
    </svg>
  );
}

export function Logo({
  brand = 'Kütahya Satılık Tarla',
  className,
  tone = 'dark',
}: {
  brand?: string;
  className?: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <BrandMark className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-heading text-[19px] font-bold tracking-tight',
            tone === 'light' ? 'text-white' : 'text-foreground',
          )}
        >
          {brand}
        </span>
        <span
          className={cn(
            'mt-1 text-[10.5px] font-semibold uppercase tracking-[0.2em]',
            tone === 'light' ? 'text-white/90' : 'text-primary',
          )}
        >
          Kütahya · Arazi
        </span>
      </span>
    </span>
  );
}
