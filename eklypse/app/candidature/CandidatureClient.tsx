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
      padding: '10rem 1rem 4rem'
    }}>
      <style dangerouslySetInnerHTML={{ __html: FADE_IN_ANIMATION }} />
      
      <div 
        style={{ 
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          backdropFilter: 'blur(20px)',
          animation: 'smoothFadeIn 0.8s ease-in-out forwards'
        }}
        className="w-full max-w-4xl p-8 md:p-14 rounded-[3rem] shadow-2xl relative overflow-hidden"
      >
        <header className="mb-14 text-center flex flex-col items-center">
          <h2 
            style={{ 
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 'bold',
              marginBottom: '2rem',
              color: COLORS.textBlue 
            }}
            className="tracking-tighter "
          >
            Candidature
          </h2>
          
          {/* Badge Discord avec bordure Violette (COLORS.cardBorder) */}
          <div 
            style={{ border: `1px solid ${COLORS.cardBorder}` }}
            className="group flex items-center gap-6 px-10 py-5 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-md transition-all duration-500 hover:bg-white/[0.07] hover:shadow-[0_0_30px_rgba(104,56,146,0.15)]"
          >
            <div className="relative">
              {user?.image && (
                <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-[#683892]/40 group-hover:border-[#683892] transition-all duration-300">
                  <Image src={user.image} alt="Avatar" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-40"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-[3px] border-[#1c0f26]"></span>
              </div>
            </div>

            <div className="flex flex-col text-left border-l border-white/10 pl-5">
              <span className="text-[10px] text-neutral-500 uppercase font-black tracking-[0.2em] mb-1 opacity-70">Session Active</span>
              <p className="text-xl font-bold text-white tracking-tight">{user?.name}</p>
            </div>
          </div>
        </header>

        <CandidatureForm />
      </div>
    </div>
  );
}