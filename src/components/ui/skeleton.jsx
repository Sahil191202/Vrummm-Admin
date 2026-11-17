import React from 'react';
import { cn } from './button';

/**
 * Enhanced Skeleton with React Bits Shimmer Sweep
 * Replaces plain opacity pulse with crisp, directional linear sheen.
 */
export function Skeleton({ className, shimmer = true, ...props }) {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'relative overflow-hidden rounded-md',
        'bg-[#E2E8E4]/70 border border-[#E2E8E4]/80',
        'dark:bg-[#0C1B14] dark:border-[#1C2721]',
        !shimmer && 'animate-pulse',
        className,
      )}
      {...props}
    >
      {shimmer && (
        <div
          className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer-sweep_2s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-[#1FD88A]/12 to-transparent"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
