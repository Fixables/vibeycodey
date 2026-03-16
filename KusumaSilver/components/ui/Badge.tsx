import { cn } from '@/lib/utils';

type BadgeVariant = 'espresso' | 'gold' | 'stone' | 'gray' | 'silver';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variants: Record<BadgeVariant, string> = {
  espresso: 'bg-espresso text-white',
  gold:     'bg-gold text-white',
  stone:    'bg-stone text-white',
  silver:   'bg-silver text-espresso',
  gray:     'bg-gray-100 text-gray-700',
};

export function Badge({ variant = 'espresso', className, children }: BadgeProps) {
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
