'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import CandidatureForm from "./CandidatureForm";

const COLORS = {
  purple: '#683892',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
  lightText: '#CBDBFC',
  cardBg: 'rgba(50, 27, 70, 0.5)',
  textBlue: 'rgba(203, 219, 252, 0.9)',
};

const SCROLL_COLORS = {
  start: { r: 28, g: 15, b: 38 },
  mid: { r: 20, g: 10, b: 28 },
  end: { r: 10, g: 6, b: 18 },
};

const FADE_IN_ANIMATION = `
  @keyframes smoothFadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

export default function CandidatureClient({ user }: { user: any }) {
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
      transition: 'background 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '10rem 1rem 4rem' // Augmenté pour éviter le header
    }}>
      <style dangerouslySetInnerHTML={{ __html: FADE_IN_ANIMATION }} />
      
      <div 
        style={{ 
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          backdropFilter: 'blur(10px)',
          animation: 'smoothFadeIn 0.8s ease-in-out forwards'
        }}
        className="w-full max-w-4xl p-8 md:p-12 rounded-[2rem] shadow-2xl"
      >
        <header className="mb-12 text-center flex flex-col items-center">
          <h1 
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                      fontWeight: 'bold',
                      marginBottom: '1.5rem',
              color: COLORS.textBlue }}
            className="text-4xl font-bold mb-6 tracking-tighter"
          >
            Candidature
          </h1>
          
          {/* Badge Profil Discord AGRANDI */}
          <div className="flex items-center gap-6 px-10 py-5 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
            {user?.image && (
              <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#683892]">
                <Image src={user.image} alt="Avatar" fill className="object-cover" />
              </div>
            )}
            <div className="text-left">
              <p className="text-xs text-neutral-500 uppercase font-black tracking-[0.2em] mb-1">Connecté en tant que</p>
              <p className="text-xl font-bold text-blue-400 leading-tight">{user?.name}</p>
            </div>
            <div className="ml-4 flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </div>
          </div>
        </header>

        <CandidatureForm />
      </div>
    </div>
  );
}