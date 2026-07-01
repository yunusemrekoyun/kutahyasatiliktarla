import { Sprout } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({
  brand = 'Kütahya Satılık Tarla',
  className,
}: {
  brand?: string;
  className?: string;
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
        <Sprout className="h-5 w-5" />
      </span>
      <span className="font-heading text-[17px] font-bold leading-tight tracking-tight text-foreground">
        {brand}
      </span>
    </span>
  );
}
