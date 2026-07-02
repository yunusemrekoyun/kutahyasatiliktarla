import { cn } from '@/lib/utils';

/**
 * Çini şerit: turkuaz zemin üzerinde tekrar eden altın çini yıldızları.
 * Bölümler arası tile-kenar imzası — markanın tekrarlayan görsel izi.
 */
export function BrandStrip({ className }: { className?: string }) {
  return (
    <div className={cn('h-3 w-full bg-primary', className)} aria-hidden="true">
      <svg className="h-full w-full" preserveAspectRatio="xMinYMid slice">
        <defs>
          <pattern
            id="cini-strip"
            width="22"
            height="12"
            patternUnits="userSpaceOnUse"
          >
            <path d="M11 1.5 L15 6 L11 10.5 L7 6 Z" fill="hsl(40 88% 50%)" />
            <rect x="9.4" y="4.4" width="3.2" height="3.2" fill="hsl(212 56% 20%)" />
            <circle cx="0" cy="6" r="1.2" fill="hsl(178 55% 52%)" />
            <circle cx="22" cy="6" r="1.2" fill="hsl(178 55% 52%)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cini-strip)" />
      </svg>
    </div>
  );
}
