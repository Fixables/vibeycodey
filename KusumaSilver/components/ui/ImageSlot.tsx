import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageSlotProps {
  src?: string | null;
  alt: string;
  label?: string;
  className?: string;
  imgClassName?: string;
}

export function ImageSlot({ src, alt, label, className, imgClassName }: ImageSlotProps) {
  const base = cn('relative overflow-hidden', className);

  if (src) {
    return (
      <div className={base}>
        {/* draggable=false so dragging an image doesn't start a native image
            drag — which would hijack the catalogue strip's drag-to-scroll. */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          className={cn('h-full w-full select-none object-cover', imgClassName)}
        />
      </div>
    );
  }

  return (
    <div className={base} role="img" aria-label={alt}>
      <div className="flex h-full w-full flex-col items-center justify-center bg-ink/5">
        <ImageIcon size={22} strokeWidth={1.5} className="text-ink/30" aria-hidden="true" />
        {label && <span className="mt-2 text-[12px] text-ink/45">{label}</span>}
      </div>
    </div>
  );
}
