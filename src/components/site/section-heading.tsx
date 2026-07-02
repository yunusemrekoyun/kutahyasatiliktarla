import { Reveal } from '@/components/motion/reveal';
import { cn } from '@/lib/utils';

/** Tüm bölümlerde ortak başlık ritmi: pirinç eyebrow + Bricolage başlık + imza çizgisi. */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}) {
  const centered = align === 'center';
  return (
    <Reveal className={cn(centered && 'text-center', className)}>
      {eyebrow ? (
        <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-brass-strong">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cn(
          'mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl',
          'rule-brass',
          centered && 'rule-brass-center',
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            'mt-6 max-w-2xl text-[17px] leading-relaxed text-muted-foreground',
            centered && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  );
}
