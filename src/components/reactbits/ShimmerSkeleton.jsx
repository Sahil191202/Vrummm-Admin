import React from 'react';
import { cn } from '../ui/button';

/**
 * React Bits - ShimmerSkeleton
 * Linear gradient shimmer sweep loader for tables, cards, and input placeholders.
 * /unslop: High contrast, GPU-accelerated translateX, zero layout shift.
 */
export function ShimmerSkeleton({ className, ...props }) {
  return (
    <div
      aria-live="polite"
      aria-busy="true"
      className={cn(
        'relative overflow-hidden rounded-xl',
        'bg-[#E2E8E4]/70 dark:bg-[#0C1B14] border border-[#E2E8E4]/80 dark:border-[#1C2721]',
        className
      )}
      {...props}
    >
      <div
        className="absolute inset-0 -translate-x-full animate-[shimmer-sweep_1.8s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-[#1FD88A]/10 to-transparent"
        style={{
          transform: 'skewX(-20deg)',
        }}
      />
    </div>
  );
}
