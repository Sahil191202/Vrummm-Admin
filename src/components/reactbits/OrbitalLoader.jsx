import React from 'react';
import { cn } from '../ui/button';

/**
 * React Bits - OrbitalLoader
 * Multi-ring concentric orbital loader with dual counter-rotating arcs.
 * /unslop: Pure SVG with CSS rotations, zero canvas overhead.
 */
export function OrbitalLoader({
  size = 'md', // 'sm' | 'md' | 'lg'
  label,
  className,
  color = '#1FD88A',
}) {
  const sizeMap = {
    sm: { dimension: 24, stroke: 2 },
    md: { dimension: 44, stroke: 2.5 },
    lg: { dimension: 64, stroke: 3 },
  };

  const { dimension, stroke } = sizeMap[size] || sizeMap.md;
  const center = dimension / 2;
  const radiusOuter = center - stroke - 1;
  const radiusInner = radiusOuter * 0.65;

  return (
    <div
      role="status"
      aria-label={label || 'Loading operations data'}
      className={cn('inline-flex flex-col items-center justify-center gap-2.5', className)}
    >
      <div className="relative" style={{ width: dimension, height: dimension }}>
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          className="animate-spin"
          style={{ animationDuration: '2.5s' }}
        >
          {/* Outer Ring Background */}
          <circle
            cx={center}
            cy={center}
            r={radiusOuter}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-[#E2E8E4] dark:text-[#2A322D]"
          />
          {/* Outer Arc (Emerald Accent) */}
          <circle
            cx={center}
            cy={center}
            r={radiusOuter}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeDasharray={`${radiusOuter * 2.2} ${radiusOuter * 4}`}
            strokeLinecap="round"
          />
        </svg>

        {/* Inner Counter-Rotating Arc (Crimson Primary) */}
        <svg
          width={dimension}
          height={dimension}
          viewBox={`0 0 ${dimension} ${dimension}`}
          className="absolute inset-0"
          style={{
            animation: 'spin-reverse 1.8s linear infinite',
          }}
        >
          <circle
            cx={center}
            cy={center}
            r={radiusInner}
            fill="none"
            stroke="#A31C18"
            strokeWidth={stroke}
            strokeDasharray={`${radiusInner * 1.8} ${radiusInner * 3}`}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Pulsing Core */}
        <div
          className="absolute rounded-full bg-[#15803D] dark:bg-[#1FD88A] animate-ping opacity-60"
          style={{
            width: Math.max(4, dimension * 0.12),
            height: Math.max(4, dimension * 0.12),
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
        <div
          className="absolute rounded-full bg-[#15803D] dark:bg-[#1FD88A]"
          style={{
            width: Math.max(4, dimension * 0.12),
            height: Math.max(4, dimension * 0.12),
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {label && (
        <span className="text-[11px] font-semibold tracking-wider uppercase text-[#5E6A64] dark:text-[#9AA6A0] animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}
