import { cn } from '@/lib/utils';

type BadgeVariant = 'charcoal' | 'terracotta' | 'silver' | 'gray';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  charcoal:   'bg-charcoal text-warm-white',
  terracotta: 'bg-terracotta text-white',
  silver:     'bg-silver-bright text-charcoal',
  gray:       'bg-gray-100 text-gray-700',
};

export function Badge({ variant = 'charcoal', className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
