import React, { useState } from 'react';

/**
 * SplineAreaChart: Smooth cubic bezier multi-series area chart
 * Inspired by Image 2 (Dappr revenue graph) with interactive tooltips and gradients.
 */
export function SplineAreaChart({
  data = [
    { label: '06:00', rides: 120, revenue: 18000 },
    { label: '09:00', rides: 480, revenue: 76000 },
    { label: '12:00', rides: 320, revenue: 51000 },
    { label: '15:00', rides: 290, revenue: 46000 },
    { label: '18:00', rides: 560, revenue: 92000 },
    { label: '21:00', rides: 410, revenue: 64000 },
    { label: '00:00', rides: 180, revenue: 29000 },
  ],
  height = 200,
  accentColor = '#1FD88A',
  secondaryColor = '#A31C18',
}) {
  const [hoverIndex, setHoverIndex] = useState(null);

  const padding = 20;
  const width = 500;
  const maxRides = Math.max(...data.map((d) => d.rides), 600);

  const getPoints = (key) =>
    data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const val = key === 'revenue' ? (d.revenue / 100000) * maxRides : d[key];
      const y = height - padding - (val / maxRides) * (height - padding * 2);
      return { x, y, ...d };
    });

  const pointsPrimary = getPoints('rides');

  // Generate smooth SVG curve path using cubic bezier
  const createSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const linePath = createSmoothPath(pointsPrimary);
  const areaPath = `${linePath} L ${pointsPrimary[pointsPrimary.length - 1].x} ${height - padding} L ${pointsPrimary[0].x} ${height - padding} Z`;

  return (
    <div className="w-full select-none">
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="splineGreenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
            </linearGradient>
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={accentColor} floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = padding + ratio * (height - padding * 2);
            return (
              <line
                key={idx}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#2A322D"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#splineGreenGradient)" />

          {/* Smooth line */}
          <path
            d={linePath}
            fill="none"
            stroke={accentColor}
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#glowGreen)"
          />

          {/* Interactive points */}
          {pointsPrimary.map((pt, i) => (
            <g
              key={i}
              className="cursor-pointer"
              onMouseEnter={() => setHoverIndex(i)}
              onMouseLeave={() => setHoverIndex(null)}
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoverIndex === i ? 6 : 4}
                fill={hoverIndex === i ? '#FFFFFF' : accentColor}
                stroke="#06110C"
                strokeWidth="2"
                className="transition-all"
              />
              {/* Invisible larger hit target */}
              <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoverIndex !== null && (
          <div
            className="absolute -top-10 transform -translate-x-1/2 pointer-events-none bg-[#171717] border border-[#2A322D] shadow-card-glow rounded-lg px-2.5 py-1 text-center text-xs z-20"
            style={{
              left: `${(pointsPrimary[hoverIndex].x / width) * 100}%`,
            }}
          >
            <p className="font-bold text-[#1FD88A] leading-tight">
              {data[hoverIndex].rides} Rides
            </p>
            <p className="text-[10px] text-[#9AA6A0] leading-none">
              ₹{(data[hoverIndex].revenue / 100).toLocaleString('en-IN')}
            </p>
          </div>
        )}
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between px-2 mt-2 text-[11px] text-[#9AA6A0] font-mono">
        {data.map((d, i) => (
          <span
            key={i}
            className={hoverIndex === i ? 'text-[#1FD88A] font-bold' : ''}
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * DonutProgressCircle: Circular radial score / completion indicator
 * Displays percentage, glowing track, and centered metric.
 */
export function DonutProgressCircle({
  percentage = 78,
  size = 110,
  strokeWidth = 10,
  accentColor = '#1FD88A',
  label = 'Availability',
  sublabel = 'Mumbai Fleet',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#2A322D"
            strokeWidth={strokeWidth}
          />
          {/* Progress stroke */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={accentColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xl font-extrabold tracking-tight text-[#F4F6F5]">
            {percentage}%
          </span>
          <span className="text-[10px] text-[#9AA6A0] uppercase font-bold tracking-wider">
            Match
          </span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <p className="text-xs font-semibold text-[#F4F6F5]">{label}</p>
        <p className="text-[10px] text-[#9AA6A0]">{sublabel}</p>
      </div>
    </div>
  );
}

/**
 * ZoneProgressBar: Demographics / Regional Progress Bar
 * Inspired by Image 1 (TailAdmin Customers Demographic bars)
 */
export function ZoneProgressBar({ zone, count, percentage, color = '#1FD88A' }) {
  return (
    <div className="space-y-1.5 py-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-semibold text-[#F4F6F5]">{zone}</span>
          <span className="text-[11px] text-[#9AA6A0]">({count} active)</span>
        </div>
        <span className="font-mono font-bold text-[#F4F6F5]">{percentage}%</span>
      </div>

      <div className="w-full h-2 rounded-full bg-[#2A322D] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
