'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

const SCROLL_COLORS = {
  start: { r: 28, g: 15, b: 38 },
  mid: { r: 20, g: 10, b: 28 },
  end: { r: 10, g: 6, b: 18 },
};

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setIsMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const progress = documentHeight > 0 ? Math.min(window.scrollY / documentHeight, 1) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const calculateBackgroundColor = (progress: number): string => {
    const { start, mid, end } = SCROLL_COLORS;
    let r, g, b;
    if (progress < 0.5) {
      const localProgress = progress * 2;
      r = Math.round(start.r + (mid.r - start.r) * localProgress);
      g = Math.round(start.g + (mid.g - start.g) * localProgress);
      b = Math.round(start.b + (mid.b - start.b) * localProgress);
    } else {
      const localProgress = (progress - 0.5) * 2;
      r = Math.round(mid.r + (end.r - mid.r) * localProgress);
      g = Math.round(mid.g + (end.g - mid.g) * localProgress);
      b = Math.round(mid.b + (end.b - mid.b) * localProgress);
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  const isMobile = isMounted ? windowWidth < 1024 : false;

  return (
    <div style={{
      minHeight: '100vh',
      background: calculateBackgroundColor(scrollProgress),
      color: '#CBDBFC',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    }}>
      <Header />
      <main style={{ 
        flex: 1, 
        paddingTop: isMobile ? '4.5rem' : '6rem', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row' 
      }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}