import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  hover?: boolean;
  children: React.ReactNode;
}

export function Card({ className, hover = false, children }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-ivory-dark bg-white shadow-sm',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-md',
        className
      )}
    >
      {children}
    </div>
  );
}
