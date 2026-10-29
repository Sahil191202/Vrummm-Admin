import React from 'react';
import { cn } from './button';

export function Skeleton({ className, ...props }) {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'animate-pulse rounded-md bg-[#0C1B14] border border-[#1C2721] light:bg-[#E5E7EB] light:border-transparent',
        className,
      )}
      {...props}
    />
  );
}
