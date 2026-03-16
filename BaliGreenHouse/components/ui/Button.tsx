import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type ButtonAsButton = ButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button'; href?: undefined };

type ButtonAsAnchor = ButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a'; href: string };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2C5F2E] text-white hover:bg-[#4A8C4F] focus:ring-2 focus:ring-[#2C5F2E] focus:ring-offset-2',
  secondary:
    'bg-[#C8952A] text-white hover:bg-[#b07e22] focus:ring-2 focus:ring-[#C8952A] focus:ring-offset-2',
  outline:
    'border-2 border-[#2C5F2E] text-[#2C5F2E] bg-transparent hover:bg-[#2C5F2E] hover:text-white focus:ring-2 focus:ring-[#2C5F2E] focus:ring-offset-2',
  ghost:
    'text-[#2C5F2E] bg-transparent hover:bg-[#A8C5A0]/20 focus:ring-2 focus:ring-[#2C5F2E] focus:ring-offset-2',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button(props: ButtonProps) {
  const {
    variant = 'primary',
    size = 'md',
    className,
    children,
    ...rest
  } = props;

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors duration-200 cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (props.as === 'a') {
    const { as: _as, ...anchorRest } = rest as ButtonAsAnchor;
    return (
      <a className={baseClasses} {...anchorRest}>
        {children}
      </a>
    );
  }

  const { as: _as, ...buttonRest } = rest as ButtonAsButton;
  return (
    <button className={baseClasses} {...buttonRest}>
      {children}
    </button>
  );
}
