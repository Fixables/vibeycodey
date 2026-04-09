import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  overline?: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  overline,
  align = 'center',
  theme = 'light',
  className,
}: SectionHeaderProps) {
  const isDark = theme === 'dark';

  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      {overline && (
        <div
          className={cn(
            'mb-5 flex items-center gap-3',
            align === 'center' ? 'justify-center' : 'justify-start'
          )}
        >
          <div className={cn('h-px w-8', isDark ? 'bg-silver-mid/50' : 'bg-silver-mid')} />
          <span
            className={cn(
              'text-xs font-medium tracking-[0.15em] uppercase',
              isDark ? 'text-silver-mid' : 'text-silver-dark'
            )}
          >
            {overline}
          </span>
          <div className={cn('h-px w-8', isDark ? 'bg-silver-mid/50' : 'bg-silver-mid')} />
        </div>
      )}

      <h2
        className={cn(
          'font-heading text-3xl font-light sm:text-4xl',
          isDark ? 'text-warm-white' : 'text-charcoal'
        )}
      >
        {title}
      </h2>

      {/* Ornamental rule */}
      <div
        className={cn(
          'mt-4 flex items-center gap-2',
          align === 'center' ? 'justify-center' : 'justify-start'
        )}
      >
        <div className={cn('h-px w-10', isDark ? 'bg-silver-mid/50' : 'bg-silver-mid/60')} />
        <div className={cn('h-1 w-1 rounded-full', isDark ? 'bg-silver-mid' : 'bg-silver-dark')} />
        <div className={cn('h-px w-10', isDark ? 'bg-silver-mid/50' : 'bg-silver-mid/60')} />
      </div>

      {subtitle && (
        <p
          className={cn(
            'mt-5 max-w-2xl text-base leading-relaxed sm:text-lg',
            align === 'center' ? 'mx-auto' : '',
            isDark ? 'text-warm-white/65' : 'text-text-muted'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
