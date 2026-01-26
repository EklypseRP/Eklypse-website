'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';
import CandidatureForm from "./CandidatureForm";

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

  const calculateBackgroundColor = (progress: number) => {
    const start = { r: 28, g: 15, b: 38 };
    const end = { r: 10, g: 6, b: 18 };
    const r = Math.round(start.r + (end.r - start.r) * progress);
    const g = Math.round(start.g + (end.g - start.g) * progress);
    const b = Math.round(start.b + (end.b - start.b) * progress);
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
      {/* Conteneur principal : max-w-4xl et bords arrondis premium */}
      <div className="w-full max-w-4xl p-8 md:p-14 rounded-[2.5rem] border border-[rgba(104,56,146,0.3)] bg-[rgba(50,27,70,0.5)] backdrop-blur-xl shadow-2xl">
        
        <header className="mb-14 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter  text-[rgba(203,219,252,0.9)] mb-8">
            Candidature
          </h1>
          
          {/* Badge Discord : Bordure violette claire et design épuré */}
          <div className="flex items-center gap-5 px-8 py-4 rounded-[2rem] bg-white/[0.03] border border-[rgba(104,56,146,0.3)] backdrop-blur-md transition-all hover:bg-white/[0.06]">
            <div className="relative h-14 w-14">
              {user?.image && (
                <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-[#683892]/40">
                  <Image src={user.image} alt="Avatar" fill className="object-cover" />
                </div>
              )}
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-green-500 border-[3px] border-[#1c0f26]"></div>
            </div>

            <div className="flex flex-col text-left border-l border-white/10 pl-5">
              <span className="text-[20px] text-neutral-500 uppercase font-black tracking-widest opacity-70">Session Active</span>
              <span className="text-xl text-center font-bold text-white tracking-tight">{user?.name}</span>
            </div>
          </div>
        </header>

        <CandidatureForm />
      </div>
    </div>
  );
}