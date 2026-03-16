import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn(align === 'center' ? 'text-center' : 'text-left', className)}>
      <h2 className="text-3xl md:text-4xl font-bold text-[#2C5F2E] mb-3">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div
        className={cn(
          'mt-4 h-1 w-16 bg-[#C8952A] rounded-full',
          align === 'center' ? 'mx-auto' : ''
        )}
      />
    </div>
  );
}
