'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

// Constantes de couleurs pour le fond
const SCROLL_COLORS = {
  start: { r: 28, g: 15, b: 38 },
  mid: { r: 20, g: 10, b: 28 },
  end: { r: 10, g: 6, b: 18 },
};

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Logique de progression du scroll identique à la page d'accueil
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = documentHeight > 0 ? Math.min(scrolled / documentHeight, 1) : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calcul de la couleur de fond dynamique
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

  return (
    <div style={{
      minHeight: '100vh',
      background: calculateBackgroundColor(scrollProgress),
      color: '#CBDBFC',
      transition: 'background 0.3s ease',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Intégration du Header */}
      <Header />
      
      {/* Contenu principal avec le padding nécessaire pour ne pas être caché sous le Header */}
      <main style={{ flex: 1, paddingTop: '7rem', paddingBottom: '4rem' }}>
        {children}
      </main>

      {/* Intégration du Footer */}
      <Footer />
    </div>
  );
}