import React from 'react';

/**
 * React Bits - ShinyText
 * Metallic light-sweep sheen traversing across text labels and status pills.
 * /unslop: Pure CSS gradient background-clip, zero JS interval overhead.
 */
export function ShinyText({
  children,
  className = '',
  shimmerColor = 'rgba(255, 255, 255, 0.85)',
  speed = '4s',
  disabled = false,
}) {
  if (disabled) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(120deg, currentColor 0%, currentColor 38%, ${shimmerColor} 50%, currentColor 62%, currentColor 100%)`,
        backgroundSize: '220% 100%',
        animation: `shiny-shimmer ${speed} linear infinite`,
      }}
    >
      {children}
    </span>
  );
}
