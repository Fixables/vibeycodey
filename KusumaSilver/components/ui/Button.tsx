import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = BaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };

type ButtonAsAnchor = BaseProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-charcoal text-warm-white hover:bg-charcoal-mid active:scale-[0.98] shadow-sm',
  secondary:
    'bg-terracotta text-white hover:bg-terracotta-mid active:scale-[0.98] shadow-sm',
  outline:
    'border-2 border-charcoal text-charcoal hover:bg-charcoal hover:text-warm-white active:scale-[0.98]',
  ghost:
    'text-charcoal hover:bg-warm-white-dark active:scale-[0.98]',
  whatsapp:
    'bg-[#25D366] text-white hover:bg-[#20b958] active:scale-[0.98] shadow-sm',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 cursor-pointer',
    variants[variant],
    sizes[size],
    className
  );

  if ((props as ButtonAsAnchor).as === 'a') {
    const { as: _as, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { as: _as, ...buttonProps } = props as ButtonAsButton;
  return (
    <button className={classes} {...(buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
