'use client';

import React, { useEffect, useState } from 'react';

// Add your map screenshot filenames here — placed in /public/map/
const MAP_IMAGES = [
  '/map/map_01.png',
  '/map/map_02.png',
];

const DISPLAY_MS = 7000;
const FADE_MS    = 1600;

interface MapBackgroundProps {
  overlay?: string;
  className?: string;
}

export default function MapBackground({
  overlay = 'rgba(15, 12, 8, 0.55)',
  className,
}: MapBackgroundProps) {
  const [mounted,        setMounted]        = useState(false);
  const [baseIdx,        setBaseIdx]        = useState(0);
  const [topIdx,         setTopIdx]         = useState(1 % MAP_IMAGES.length);
  const [topOpacity,     setTopOpacity]     = useState(0);
  const [topTransition,  setTopTransition]  = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || MAP_IMAGES.length < 2) return;

    const display = setTimeout(() => {
      // Fade top layer (next image) in
      setTopTransition(true);
      setTopOpacity(1);

      // Once fade completes: promote top→base, reset top instantly (no transition)
      const swap = setTimeout(() => {
        const newBase = topIdx;
        const newTop  = (topIdx + 1) % MAP_IMAGES.length;
        setBaseIdx(newBase);
        setTopTransition(false); // instant reset — no visible rollback
        setTopOpacity(0);
        setTopIdx(newTop);
      }, FADE_MS + 50);

      return () => clearTimeout(swap);
    }, DISPLAY_MS);

    return () => clearTimeout(display);
  }, [mounted, baseIdx, topIdx]);

  if (!mounted || MAP_IMAGES.length === 0) return null;

  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 }}
    >
      {/* Base — current image, no transition ever */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${MAP_IMAGES[baseIdx]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      {/* Top — next image, fades in then is reset instantly */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `url(${MAP_IMAGES[topIdx]})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: topOpacity,
        transition: topTransition ? `opacity ${FADE_MS}ms ease-in-out` : 'none',
      }} />

      {/* Colour overlay */}
      <div style={{ position: 'absolute', inset: 0, background: overlay }} />
    </div>
  );
}
