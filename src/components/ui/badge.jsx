import React from 'react';
import { cn } from './button';

export const badgeVariants = {
  variant: {
    default:
      'bg-[#A31C18] text-white border-transparent',
    secondary:
      'bg-white dark:bg-[#171717] text-[#171717] dark:text-[#F4F6F5] border-[#E2E8E4] dark:border-[#2A322D]',
    outline:
      'border-[#E2E8E4] text-[#5E6A64] dark:border-[#2A322D] dark:text-[#9AA6A0]',
    success:
      'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/30 dark:bg-[#22C55E]/15 dark:text-[#22C55E] dark:border-[#22C55E]/30',
    warning:
      'bg-[#B45309]/10 text-[#B45309] border-[#B45309]/30 dark:bg-[#F5B301]/15 dark:text-[#F5B301] dark:border-[#F5B301]/30',
    danger:
      'bg-[#FBE9E8] text-[#DC2626] border-[#DC2626]/30 dark:bg-[#2A0F0E] dark:text-[#FF5A52] dark:border-[#FF5A52]/30',
    accent:
      'bg-[#0E7A4F]/10 text-[#0E7A4F] border-[#0E7A4F]/30 dark:bg-[#1FD88A]/15 dark:text-[#1FD88A] dark:border-[#1FD88A]/30',
    forest:
      'bg-[#15803D]/10 text-[#15803D] border-[#15803D]/30 dark:bg-[#0B1A13] dark:text-[#1FD88A] dark:border-[#1FD88A]/30 font-semibold',
    role:
      'bg-white dark:bg-[#171717] text-[#171717] dark:text-[#F4F6F5] border-[#E2E8E4] dark:border-[#2A322D] font-mono',
  },
};

export function Badge({
  className,
  variant = 'default',
  dot = false,
  dotColor,
  children,
  ...props
}) {
  const variantClass = badgeVariants.variant[variant] || badgeVariants.variant.default;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variantClass,
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full',
            dotColor ||
              (variant === 'success' || variant === 'forest' || variant === 'accent'
                ? 'bg-[#15803D] dark:bg-[#1FD88A] animate-pulse'
                : 'bg-current'),
          )}
        />
      )}
      {children}
    </span>
  );
}
