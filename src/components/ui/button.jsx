import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const buttonVariants = {
  variant: {
    default:
      'bg-[#A31C18] text-white hover:bg-[#C4271F] active:bg-[#8A1713] shadow-button-glow glow-button focus-visible:ring-[#A31C18]',
    secondary:
      'bg-white text-[#171717] border border-[#E2E8E4] hover:bg-[#F5F7F6] dark:bg-[#171717] dark:text-[#F4F6F5] dark:border-[#2A322D] dark:hover:bg-[#2A322D]/60',
    outline:
      'border border-[#E2E8E4] dark:border-[#2A322D] bg-transparent hover:bg-[#F5F7F6] dark:hover:bg-[#171717] text-[#171717] dark:text-[#F4F6F5]',
    ghost:
      'bg-transparent hover:bg-[#F5F7F6] dark:hover:bg-[#171717]/80 text-[#5E6A64] hover:text-[#171717] dark:text-[#9AA6A0] dark:hover:text-[#F4F6F5]',
    destructive:
      'bg-[#DC2626] text-white hover:bg-[#B91C1C] dark:bg-[#A31C18] dark:hover:bg-[#C4271F] focus-visible:ring-[#DC2626] shadow-sm',
    forest:
      'bg-[#15803D] dark:bg-[#22C55E] text-white dark:text-[#06110C] font-semibold hover:opacity-90 shadow-sm dark:shadow-card-glow focus-visible:ring-[#1FD88A]',
    accent:
      'bg-[#0E7A4F] dark:bg-[#1FD88A] text-white dark:text-[#06110C] font-semibold hover:opacity-90 shadow-sm dark:shadow-card-glow focus-visible:ring-[#1FD88A]',
  },
  size: {
    default: 'min-h-[44px] h-11 px-4 py-2 text-sm',
    sm: 'min-h-[36px] h-9 px-3 text-xs',
    lg: 'min-h-[44px] h-12 px-6 text-base',
    icon: 'min-h-[44px] min-w-[44px] h-11 w-11 p-0 flex items-center justify-center',
  },
};

export const Button = React.forwardRef(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      isLoading = false,
      disabled = false,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const variantClass = buttonVariants.variant[variant] || buttonVariants.variant.default;
    const sizeClass = buttonVariants.size[size] || buttonVariants.size.default;

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all select-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#06110C]',
          'disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed',
          variantClass,
          sizeClass,
          className,
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
