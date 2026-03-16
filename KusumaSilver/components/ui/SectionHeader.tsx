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
          'font-heading text-3xl font-semibold sm:text-4xl',
          isDark ? 'text-white' : 'text-espresso'
        )}
      >
        {title}
      </h2>
      <div className={cn('mt-3 h-0.5 w-12 bg-gold', align === 'center' ? 'mx-auto' : '')} />
      {subtitle && (
        <p
          className={cn(
            'mt-4 max-w-2xl text-base sm:text-lg leading-relaxed',
            align === 'center' ? 'mx-auto' : '',
            isDark ? 'text-white/70' : 'text-text-light'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
