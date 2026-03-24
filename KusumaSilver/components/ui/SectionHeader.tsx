import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  theme = 'light',
  className,
}: SectionHeaderProps) {
  const isDark = theme === 'dark';

  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      <h2
        className={cn(
          'font-heading text-3xl font-light sm:text-4xl',
          isDark ? 'text-warm-white' : 'text-charcoal'
        )}
      >
        {title}
      </h2>

      {/* Ornamental silver line with centre dot */}
      <div
        className={cn(
          'mt-4 flex items-center gap-2',
          align === 'center' ? 'justify-center' : 'justify-start'
        )}
      >
        <div
          className={cn(
            'h-px w-10',
            isDark ? 'bg-silver-mid/50' : 'bg-silver-mid/60'
          )}
        />
        <div
          className={cn(
            'h-1 w-1 rounded-full',
            isDark ? 'bg-silver-mid' : 'bg-silver-dark'
          )}
        />
        <div
          className={cn(
            'h-px w-10',
            isDark ? 'bg-silver-mid/50' : 'bg-silver-mid/60'
          )}
        />
      </div>

      {subtitle && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-base sm:text-lg leading-relaxed',
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
