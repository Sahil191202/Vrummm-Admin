import React from 'react';
import { cn } from '../ui/button';

/**
 * React Bits - BorderBeam
 * Animated perimeter light beam tracing the card or dialog edges.
 * /unslop: Uses SVG path with strokeDashoffset animation, subtle and crisp.
 */
export function BorderBeam({
  size = 200,
  duration = 8,
  anchor = 90,
  borderWidth = 1.5,
  colorFrom = '#1FD88A',
  colorTo = '#A31C18',
  delay = 0,
  className,
}) {
  return (
    <div
      style={{
        '--size': `${size}px`,
        '--duration': `${duration}s`,
        '--anchor': `${anchor}%`,
        '--border-width': `${borderWidth}px`,
        '--color-from': colorFrom,
        '--color-to': colorTo,
        '--delay': `-${delay}s`,
      }}
      className={cn(
        'pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width))_solid_transparent]',
        // Mask styles for border only
        '![mask-clip:padding-box,border-box] ![mask-composite:intersect] [mask:linear-gradient(transparent,transparent),linear-gradient(white,white)]',
        // Pseudo beam
        'after:absolute after:aspect-square after:w-[calc(var(--size))] after:animate-[border-beam_var(--duration)_infinite_linear] after:[animation-delay:var(--delay)] after:[background:linear-gradient(to_left,var(--color-from),var(--color-to),transparent)] after:[offset-anchor:calc(var(--anchor))_50%] after:[offset-path:rect(0_auto_auto_0_round_calc(var(--size)))]',
        className
      )}
      aria-hidden="true"
    />
  );
}
