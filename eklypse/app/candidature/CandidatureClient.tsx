'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import CandidatureForm from "./CandidatureForm";

const COLORS = {
  purple: '#683892',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
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
    from { opacity: 0; transform: translateY(10px); }
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
      padding: '8rem 1rem 4rem'
    }}>
      <style dangerouslySetInnerHTML={{ __html: FADE_IN_ANIMATION }} />
      
      <div 
        style={{ animation: 'smoothFadeIn 0.8s ease-in-out forwards' }}
        className="w-full max-w-6xl flex flex-col items-center"
      >
        <header className="mb-10 text-center flex flex-col items-center w-full">
          <h2 
            style={{ 
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 'bold',
              color: COLORS.textBlue 
            }}
            className="tracking-tighter text-4xl md:text-6xl"
          >
            Candidature
          </h2>
          <br />
          
          {/* Badge Discord repositionné */}
          <div 
            style={{ border: `1px solid ${COLORS.cardBorder}` }}
            className="group flex items-center gap-6 px-8 py-4 rounded-[2rem] bg-white/[0.02] backdrop-blur-md transition-all duration-500 hover:bg-white/[0.05]"
          >
            <div className="relative">
              {user?.image && (
                <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-[#683892]/40">
                  <Image src={user.image} alt="Avatar" fill className="object-cover" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 flex h-3 w-3">
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-[#1c0f26]"></span>
              </div>
            </div>
            <div className="flex flex-col text-left border-l border-white/10 pl-5">
              <span className="text-[9px] text-neutral-500 uppercase font-black tracking-widest opacity-70">Rédacteur actif</span>
              <p className="text-lg font-bold text-white tracking-tight">{user?.name}</p>
            </div>
          </div>
        </header>

        {/* CARTE DE FORMULAIRE (MAX LARGEUR) */}
        <div 
          style={{ 
            background: COLORS.cardBg,
            border: `1px solid ${COLORS.cardBorder}`,
            backdropFilter: 'blur(20px)',
          }}
          className="w-full p-8 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden"
        >
          <CandidatureForm />
        </div>
      </div>
    </div>
  );
}