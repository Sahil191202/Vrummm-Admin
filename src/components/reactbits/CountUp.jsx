import React, { useEffect, useRef, useState } from 'react';

/**
 * React Bits - CountUp
 * Smooth numerical easing counter using requestAnimationFrame.
 * /unslop: 60fps, zero layout shift, respects prefers-reduced-motion.
 */
export function CountUp({
  to = 0,
  from = 0,
  duration = 1.2,
  decimals = 0,
  prefix = '',
  suffix = '',
  separator = ',',
  className = '',
  onEnd,
}) {
  const [value, setValue] = useState(from);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      onEnd?.();
      return;
    }

    const start = from;
    const end = to;
    const durMs = duration * 1000;

    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    const step = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / durMs, 1);
      const eased = easeOutExpo(progress);
      const current = start + (end - start) * eased;

      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setValue(end);
        onEnd?.();
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startTimeRef.current = null;
    };
  }, [to, from, duration, onEnd]);

  const formatNumber = (num) => {
    const fixed = Number(num).toFixed(decimals);
    const parts = fixed.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return parts.join('.');
  };

  return (
    <span className={`inline-block tabular-nums font-mono ${className}`}>
      {prefix}
      {formatNumber(value)}
      {suffix}
    </span>
  );
}
