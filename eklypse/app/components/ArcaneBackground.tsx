'use client';

import React, { useMemo } from 'react';
import MagicCircle from './MagicCircle';

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const ArcaneBackground: React.FC = () => {
  const stars = useMemo(() => {
    const rand = seededRng(42);
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: 0.7 + rand() * 1.4,
      delay: rand() * 10,
      duration: 4 + rand() * 6,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, #0F0525 0%, #07031A 45%, #05020D 100%)',
      }}
    >
      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            borderRadius: '50%',
            background: s.size > 1.7 ? 'rgba(201,168,76,0.9)' : 'rgba(232,213,255,0.9)',
            animation: `star-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* Ambient orbs — colour wash */}
      <div style={{
        position: 'absolute',
        top: '-30%',
        left: '-20%',
        width: '60%',
        height: '60%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.06) 0%, transparent 70%)',
        animation: 'orb-drift 28s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-25%',
        right: '-15%',
        width: '50%',
        height: '50%',
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(6,182,212,0.04) 0%, transparent 70%)',
        animation: 'orb-drift 35s ease-in-out 6s infinite',
      }} />

      {/* Magic circle — top-left, very faint */}
      <div style={{
        position: 'absolute',
        top: '-18%',
        left: '-18%',
        animation: 'float 22s ease-in-out infinite',
      }}>
        <MagicCircle
          size={500}
          opacity={0.08}
          speedMultiplier={0.4}
          primaryColor="#7C3AED"
          goldColor="#C9A84C"
          tealColor="#06B6D4"
        />
      </div>

      {/* Magic circle — bottom-right, very faint */}
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        right: '-16%',
        animation: 'float 26s ease-in-out 8s infinite',
      }}>
        <MagicCircle
          size={440}
          opacity={0.06}
          speedMultiplier={0.35}
          primaryColor="#5B21B6"
          goldColor="#B8890A"
          tealColor="#0891B2"
        />
      </div>

      {/* Top fade overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: '100px',
        background: 'linear-gradient(to bottom, rgba(5,2,13,0.5), transparent)',
        pointerEvents: 'none',
      }} />
    </div>
  );
};

export default ArcaneBackground;
