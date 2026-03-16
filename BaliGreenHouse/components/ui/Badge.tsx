import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'gold' | 'earth' | 'gray';
  className?: string;
}

const variantClasses = {
  green: 'bg-[#A8C5A0]/30 text-[#2C5F2E]',
  gold: 'bg-[#C8952A]/20 text-[#7B5E3A]',
  earth: 'bg-[#7B5E3A]/20 text-[#7B5E3A]',
  gray: 'bg-gray-100 text-gray-600',
};

export function Badge({ children, variant = 'green', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
