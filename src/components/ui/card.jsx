import React from 'react';
import { cn } from './button';

export const Card = React.forwardRef(({ className, glow = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border transition-all',
      'bg-white border-[#E2E8E4] text-[#171717] shadow-sm',
      'dark:bg-[#171717] dark:border-[#2A322D] dark:text-[#F4F6F5] dark:shadow-dark-card',
      glow && 'shadow-card-glow border-[#15803D]/30 dark:border-[#1FD88A]/40',
      className,
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-5 pb-3', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-base font-bold leading-none tracking-tight text-[#171717] dark:text-[#F4F6F5]',
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      'text-xs text-[#5E6A64] dark:text-[#9AA6A0]',
      className,
    )}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-5 pt-1', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center p-5 pt-3 border-t border-[#E2E8E4] dark:border-[#2A322D]/60',
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
