import { cn } from '@/lib/utils';

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
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-primary text-primary-foreground shadow-soft-sm">
        <svg
          viewBox="0 0 24 24"
          className="h-[22px] w-[22px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
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
          'font-heading text-[18px] font-semibold leading-none tracking-[-0.01em]',
          tone === 'light' ? 'text-white' : 'text-foreground',
        )}
      >
        {brand}
      </span>
    </span>
  );
}
