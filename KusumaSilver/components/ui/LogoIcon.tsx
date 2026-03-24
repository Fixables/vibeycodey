import { Gem } from 'lucide-react';

interface LogoIconProps {
  size?: number;
  className?: string;
  bare?: boolean;
}

export function LogoIcon({ size = 36, className = '', bare = false }: LogoIconProps) {
  const iconSize = Math.round(size * 0.55);

  if (bare) {
    return <Gem size={iconSize} className={`text-white ${className}`} />;
  }

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-charcoal ${className}`}
      style={{ width: size, height: size }}
    >
      <Gem size={iconSize} className="text-white" />
    </div>
  );
}
