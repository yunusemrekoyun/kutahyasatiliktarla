import { cn } from '@/lib/utils';

/** Köşe nirengi işareti — kadastro/krokilerdeki köşe tescil çizgisi. */
function CornerMark({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={cn('absolute', className)}
    >
      <path
        d="M1 19V6Q1 1 6 1H19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Kadastro/parsel motifi: kesikli sınır çizgisi + köşe nirengi işaretleri.
 * Fotoğrafların ve koyu panellerin üzerine bindirilen dekoratif imza öğesi.
 */
export function ParcelFrame({
  label,
  className,
  frameClass = 'border-white/60',
  tickClass = 'text-white',
}: {
  label?: string;
  className?: string;
  frameClass?: string;
  tickClass?: string;
}) {
  return (
    <div className={cn('pointer-events-none absolute inset-0', className)} aria-hidden="true">
      <div className={cn('absolute inset-4 rounded-[1.25rem] border-2 border-dashed', frameClass)} />
      <CornerMark className={cn('left-4 top-4', tickClass)} />
      <CornerMark className={cn('right-4 top-4 rotate-90', tickClass)} />
      <CornerMark className={cn('bottom-4 right-4 rotate-180', tickClass)} />
      <CornerMark className={cn('bottom-4 left-4 -rotate-90', tickClass)} />
      {label && (
        <span className="absolute bottom-8 left-8 rounded-md bg-white/95 px-3 py-1.5 text-[13px] font-semibold text-foreground shadow-soft-sm">
          {label}
        </span>
      )}
    </div>
  );
}
