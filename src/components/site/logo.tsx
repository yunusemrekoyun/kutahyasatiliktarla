import { cn } from '@/lib/utils';

/**
 * Marka işareti: yeşil yalnızca burada yaşar (kurumsal renk disiplini).
 * Filiz, keskin köşeli koyu yeşil karede; yazı markası tek satır, güçlü.
 */
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
      <span className="grid h-10 w-10 shrink-0 place-items-center bg-[#2F7A44]">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21v-8.5" />
          <path d="M12 12.5c0-3.3 2.2-5.5 5.5-5.5 0 3.3-2.2 5.5-5.5 5.5Z" />
          <path d="M12 14.5c0-2.6-2-4.2-4.7-4.2 0 2.6 2 4.2 4.7 4.2Z" />
          <path d="M4.5 21h15" />
        </svg>
      </span>
      <span
        className={cn(
          'font-heading text-[19px] font-semibold leading-none tracking-tight',
          tone === 'light' ? 'text-white' : 'text-foreground',
        )}
      >
        {brand}
      </span>
    </span>
  );
}
