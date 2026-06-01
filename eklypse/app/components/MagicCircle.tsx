'use client';

import React, { useState, useEffect } from 'react';

interface MagicCircleProps {
  size?: number;
  opacity?: number;
  primaryColor?: string;
  goldColor?: string;
  tealColor?: string;
  speedMultiplier?: number;
  style?: React.CSSProperties;
  className?: string;
}

const MagicCircle: React.FC<MagicCircleProps> = ({
  size = 500,
  opacity = 0.35,
  primaryColor = '#7C3AED',
  goldColor = '#C9A84C',
  tealColor = '#06B6D4',
  speedMultiplier = 1,
  style,
  className,
}) => {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Decorative only — hide entirely for reduced-motion users
  if (reducedMotion) return null;

  const cx = size / 2;
  const cy = size / 2;
  const R = (f: number) => (size / 2) * f;

  const dur = (seconds: number) => `${(seconds / speedMultiplier).toFixed(1)}s`;

  const polygonPoints = (sides: number, radius: number, angleOffset = 0): string =>
    Array.from({ length: sides }, (_, i) => {
      const angle = (i * 2 * Math.PI) / sides + angleOffset;
      return `${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`;
    }).join(' ');

  const circleMarkers = (count: number, radius: number, majorEvery = 4) =>
    Array.from({ length: count }, (_, i) => {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      return {
        x: cx + radius * Math.cos(angle),
        y: cy + radius * Math.sin(angle),
        major: i % majorEvery === 0,
      };
    });

  const tickMarks = (count: number, innerR: number, outerR: number, majorEvery = 4) =>
    Array.from({ length: count }, (_, i) => {
      const angle = (i * 2 * Math.PI) / count - Math.PI / 2;
      const isMajor = i % majorEvery === 0;
      return {
        x1: cx + innerR * Math.cos(angle),
        y1: cy + innerR * Math.sin(angle),
        x2: cx + outerR * Math.cos(angle),
        y2: cy + outerR * Math.sin(angle),
        major: isMajor,
      };
    });

  const filterId = `mc-glow-${size}-${Math.round(opacity * 100)}`;
  const strongFilterId = `mc-strong-${size}-${Math.round(opacity * 100)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ opacity, ...style }}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={strongFilterId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ── RING 1: Outermost — very slow CW ── */}
      <g>
        <animateTransform
          attributeName="transform" type="rotate"
          from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`}
          dur={dur(100)} repeatCount="indefinite"
        />
        <circle cx={cx} cy={cy} r={R(0.95)} fill="none"
          stroke={primaryColor} strokeWidth="0.7" strokeOpacity="0.5" />
        {circleMarkers(32, R(0.95), 4).map((m, i) => (
          <circle key={i} cx={m.x} cy={m.y}
            r={m.major ? 3 : 1.5}
            fill={m.major ? goldColor : primaryColor}
            opacity={m.major ? 0.85 : 0.55}
          />
        ))}
      </g>

      {/* ── RING 2: Rune ring — medium CCW ── */}
      <g>
        <animateTransform
          attributeName="transform" type="rotate"
          from={`360 ${cx} ${cy}`} to={`0 ${cx} ${cy}`}
          dur={dur(65)} repeatCount="indefinite"
        />
        <circle cx={cx} cy={cy} r={R(0.84)} fill="none"
          stroke={primaryColor} strokeWidth="0.5" strokeOpacity="0.3"
          strokeDasharray="2 8" />
        {['ᚠ', 'ᚢ', 'ᚦ', 'ᚨ', 'ᚱ', 'ᚲ', 'ᚷ', 'ᚹ'].map((rune, i) => {
          const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
          return (
            <text key={i}
              x={(cx + R(0.84) * Math.cos(angle)).toFixed(2)}
              y={(cy + R(0.84) * Math.sin(angle)).toFixed(2)}
              textAnchor="middle" dominantBaseline="central"
              fill={goldColor} fontSize={R(0.065).toFixed(1)}
              opacity="0.75" fontFamily="serif"
            >
              {rune}
            </text>
          );
        })}
      </g>

      {/* ── RING 3: Geometric dashed — medium CW ── */}
      <g>
        <animateTransform
          attributeName="transform" type="rotate"
          from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`}
          dur={dur(45)} repeatCount="indefinite"
        />
        <circle cx={cx} cy={cy} r={R(0.73)} fill="none"
          stroke={primaryColor} strokeWidth="1.4" strokeOpacity="0.6"
          strokeDasharray="10 4 2 4" />
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i * 2 * Math.PI) / 8 - Math.PI / 2;
          const x = cx + R(0.73) * Math.cos(angle);
          const y = cy + R(0.73) * Math.sin(angle);
          const hw = R(0.028);
          const hh = R(0.038);
          const cos = Math.cos(angle + Math.PI / 2);
          const sin = Math.sin(angle + Math.PI / 2);
          return (
            <polygon key={i}
              points={`${(x + hh * Math.cos(angle)).toFixed(2)},${(y + hh * Math.sin(angle)).toFixed(2)} ${(x - hw * cos - hh * Math.cos(angle) / 2).toFixed(2)},${(y - hw * sin - hh * Math.sin(angle) / 2).toFixed(2)} ${(x + hw * cos - hh * Math.cos(angle) / 2).toFixed(2)},${(y + hw * sin - hh * Math.sin(angle) / 2).toFixed(2)}`}
              fill={i % 2 === 0 ? primaryColor : goldColor}
              opacity="0.7"
            />
          );
        })}
      </g>

      {/* ── HEXAGRAM — static geometric ── */}
      <g filter={`url(#${filterId})`} opacity="0.6">
        <polygon points={polygonPoints(6, R(0.55), 0)}
          fill="none" stroke={primaryColor} strokeWidth="1.2" />
        <polygon points={polygonPoints(6, R(0.55), Math.PI / 6)}
          fill="none" stroke={goldColor} strokeWidth="0.9" strokeOpacity="0.7" />
        <polygon points={polygonPoints(6, R(0.36), 0)}
          fill="none" stroke={primaryColor} strokeWidth="0.6" strokeOpacity="0.5" />
        <polygon points={polygonPoints(6, R(0.36), Math.PI / 6)}
          fill="none" stroke={tealColor} strokeWidth="0.4" strokeOpacity="0.4" />
      </g>

      {/* ── RING 4: Tick ring — CCW ── */}
      <g>
        <animateTransform
          attributeName="transform" type="rotate"
          from={`360 ${cx} ${cy}`} to={`0 ${cx} ${cy}`}
          dur={dur(30)} repeatCount="indefinite"
        />
        <circle cx={cx} cy={cy} r={R(0.62)} fill="none"
          stroke={tealColor} strokeWidth="1.5" strokeOpacity="0.5" />
        {tickMarks(24, R(0.62), R(0.56), 4).map((t, i) => (
          <line key={i}
            x1={t.x1.toFixed(2)} y1={t.y1.toFixed(2)}
            x2={t.x2.toFixed(2)} y2={t.y2.toFixed(2)}
            stroke={t.major ? goldColor : tealColor}
            strokeWidth={t.major ? 2 : 0.8}
            opacity={t.major ? 0.9 : 0.5}
          />
        ))}
      </g>

      {/* ── RING 5: Inner symbol ring — CW ── */}
      <g>
        <animateTransform
          attributeName="transform" type="rotate"
          from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`}
          dur={dur(18)} repeatCount="indefinite"
        />
        <circle cx={cx} cy={cy} r={R(0.44)} fill="none"
          stroke={primaryColor} strokeWidth="1" strokeOpacity="0.7" />
        {['⊕', '⊗', '⊙', '⊛'].map((sym, i) => {
          const angle = (i * Math.PI) / 2 - Math.PI / 4;
          return (
            <text key={i}
              x={(cx + R(0.44) * Math.cos(angle)).toFixed(2)}
              y={(cy + R(0.44) * Math.sin(angle)).toFixed(2)}
              textAnchor="middle" dominantBaseline="central"
              fill={tealColor} fontSize={R(0.075).toFixed(1)} opacity="0.85"
            >
              {sym}
            </text>
          );
        })}
      </g>

      {/* ── RING 6: Near-inner — CCW fast ── */}
      <g>
        <animateTransform
          attributeName="transform" type="rotate"
          from={`360 ${cx} ${cy}`} to={`0 ${cx} ${cy}`}
          dur={dur(11)} repeatCount="indefinite"
        />
        <circle cx={cx} cy={cy} r={R(0.29)} fill="none"
          stroke={primaryColor} strokeWidth="1.2" strokeOpacity="0.8" />
        <circle cx={cx} cy={cy} r={R(0.23)} fill="none"
          stroke={primaryColor} strokeWidth="0.5" strokeOpacity="0.35"
          strokeDasharray="2 4" />
        {Array.from({ length: 4 }, (_, i) => {
          const angle = (i * Math.PI) / 2 - Math.PI / 4;
          const x = cx + R(0.29) * Math.cos(angle);
          const y = cy + R(0.29) * Math.sin(angle);
          const d = R(0.025);
          return (
            <polygon key={i}
              points={`${x.toFixed(2)},${(y - d * 1.6).toFixed(2)} ${(x + d).toFixed(2)},${y.toFixed(2)} ${x.toFixed(2)},${(y + d * 1.6).toFixed(2)} ${(x - d).toFixed(2)},${y.toFixed(2)}`}
              fill={goldColor} opacity="0.8"
            />
          );
        })}
      </g>

      {/* ── CENTER: Pulsing arcane core ── */}
      <g filter={`url(#${strongFilterId})`}>
        <circle cx={cx} cy={cy} r={R(0.11)} fill={`${primaryColor}18`} stroke={primaryColor} strokeWidth="1.5">
          <animate attributeName="r"
            values={`${R(0.09).toFixed(2)};${R(0.13).toFixed(2)};${R(0.09).toFixed(2)}`}
            dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite" />
        </circle>
        <line x1={cx} y1={(cy - R(0.11)).toFixed(2)} x2={cx} y2={(cy + R(0.11)).toFixed(2)}
          stroke={goldColor} strokeWidth="1.5">
          <animate attributeName="opacity" values="0.55;1;0.55" dur="3.5s" repeatCount="indefinite" />
        </line>
        <line x1={(cx - R(0.11)).toFixed(2)} y1={cy} x2={(cx + R(0.11)).toFixed(2)} y2={cy}
          stroke={goldColor} strokeWidth="1.5">
          <animate attributeName="opacity" values="0.55;1;0.55" dur="3.5s" repeatCount="indefinite" />
        </line>
        <line
          x1={(cx - R(0.075)).toFixed(2)} y1={(cy - R(0.075)).toFixed(2)}
          x2={(cx + R(0.075)).toFixed(2)} y2={(cy + R(0.075)).toFixed(2)}
          stroke={tealColor} strokeWidth="0.9">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" />
        </line>
        <line
          x1={(cx + R(0.075)).toFixed(2)} y1={(cy - R(0.075)).toFixed(2)}
          x2={(cx - R(0.075)).toFixed(2)} y2={(cy + R(0.075)).toFixed(2)}
          stroke={tealColor} strokeWidth="0.9">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2.5s" repeatCount="indefinite" begin="0.5s" />
        </line>
      </g>
    </svg>
  );
};

export default MagicCircle;
