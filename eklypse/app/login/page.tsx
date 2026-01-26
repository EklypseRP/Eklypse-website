'use client';

import { signIn } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

// ===== CONSTANTES (Identiques à app/page.tsx) =====
const COLORS = {
  purple: '#683892',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
  lightText: '#CBDBFC',
  cardBg: 'rgba(50, 27, 70, 0.5)',
};

const SCROLL_COLORS = {
  start: { r: 28, g: 15, b: 38 },
  mid: { r: 20, g: 10, b: 28 },
  end: { r: 10, g: 6, b: 18 },
};

const FADE_IN_ANIMATION = `
  @keyframes smoothFadeIn {
    from { 
      opacity: 0; 
      transform: translateY(4px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;

// ===== HOOKS & LOGIQUE DE COULEUR =====
const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / (documentHeight || 1), 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return scrollProgress;
};

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

export default function LoginPage() {
  const scrollProgress = useScrollProgress();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{
      minHeight: '100vh',
      background: calculateBackgroundColor(scrollProgress),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 1.5rem',
      transition: 'background 0.3s ease'
    }}>
      {/* Injection de l'animation CSS */}
      <style dangerouslySetInnerHTML={{ __html: FADE_IN_ANIMATION }} />

      <main style={{ 
        width: '100%',
        maxWidth: '450px',
        animation: 'smoothFadeIn 0.8s ease-in-out forwards' 
      }}>
        <div 
          style={{ 
            background: COLORS.cardBg,
            border: `1px solid ${COLORS.cardBorder}`,
            backdropFilter: 'blur(10px)',
            padding: '3.5rem 2.5rem',
            borderRadius: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}
        >
          {/* Titre avec la couleur demandée */}
          <h1 className="text-4xl font-bold mb-4  tracking-[0.2em]" 
              style={{ color: 'rgba(203, 219, 252, 0.9)' }}>
            Espace Membre
          </h1>
          
          <div style={{ height: '2px', width: '200px', background: `linear-gradient(to right, transparent, ${COLORS.purple}, transparent)`, margin: '0 auto 2rem', opacity: 1 }} />
          
          <p style={{ color: 'rgba(203, 219, 252, 0.6)' }} className="mb-10 text-sm leading-relaxed">
            Connectez-vous avec votre compte Discord pour accéder à l'espace candidature et rejoindre le monde d'Eklypse.
          </p>

          <button 
            onClick={() => signIn('discord', { callbackUrl: '/candidature' })}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              backgroundColor: isHovered ? '#4752C4' : '#5865F2',
              boxShadow: isHovered 
                ? '0 15px 25px -5px rgba(88, 101, 242, 0.5)' 
                : '0 10px 15px -3px rgba(88, 101, 242, 0.3)',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              width: '100%',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1rem',
              padding: '1.25rem',
              borderRadius: '0.75rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            {/* Icône Discord */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Continuer avec Discord
          </button>
        </div>
      </main>
    </div>
  );
}