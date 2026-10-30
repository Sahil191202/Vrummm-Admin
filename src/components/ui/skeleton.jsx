import React from 'react';
import { cn } from './button';

export function Skeleton({ className, ...props }) {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'animate-pulse rounded-md bg-[#E2E8E4] border border-[#E2E8E4]/60 dark:bg-[#0C1B14] dark:border-[#1C2721]',
        className,
      )}
      {...props}
    />
  );
}
