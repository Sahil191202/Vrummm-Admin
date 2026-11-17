import React, { useRef, useState, useCallback } from 'react';
import { cn } from '../ui/button';

/**
 * React Bits - SpotlightCard
 * Subtle cursor-tracking illumination on card boundaries and surface.
 * /unslop: Lightweight mouse coordinate tracking, pure CSS radial-gradient, hardware accelerated.
 */
export const SpotlightCard = React.forwardRef(
  (
    {
      children,
      className,
      spotlightColor,
      spotlightSize = 340,
      glow = false,
      variant = 'emerald', // 'emerald' | 'crimson' | 'neutral'
      onClick,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = useRef(null);
    const cardRef = forwardedRef || internalRef;
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const defaultColor =
      variant === 'crimson'
        ? 'rgba(163, 28, 24, 0.16)'
        : variant === 'neutral'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(31, 216, 138, 0.14)';

    const effectiveSpotlight = spotlightColor || defaultColor;

    const handleMouseMove = useCallback((e) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setOpacity(1);
    }, [cardRef]);

    const handleMouseEnter = useCallback(() => {
      setOpacity(1);
    }, []);

    const handleMouseLeave = useCallback(() => {
      setOpacity(0);
    }, []);

    return (
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={cn(
          'relative overflow-hidden rounded-2xl border transition-all duration-200',
          'bg-white border-[#E2E8E4] text-[#171717] shadow-sm',
          'dark:bg-[#171717] dark:border-[#2A322D] dark:text-[#F4F6F5] dark:shadow-dark-card',
          glow && 'shadow-card-glow border-[#15803D]/40 dark:border-[#1FD88A]/50',
          onClick && 'cursor-pointer hover:border-[#15803D]/40 dark:hover:border-[#1FD88A]/40 hover:-translate-y-0.5',
          className
        )}
        {...props}
      >
        {/* Spotlight Overlay */}
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 ease-out z-10"
          style={{
            opacity,
            background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${effectiveSpotlight}, transparent 70%)`,
          }}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-20 h-full">{children}</div>
      </div>
    );
  }
);

SpotlightCard.displayName = 'SpotlightCard';
