'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ===== CONSTANTES DESIGN (Identiques aux autres pages) =====
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

// ===== LOGIQUE DE BACKGROUND =====
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

export default function AdminCandidaturesPage() {
  const { data: session, status }: any = useSession();
  const router = useRouter();
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollProgress = useScrollProgress();

  const fetchCandidatures = async () => {
    try {
      const res = await fetch('/api/admin/candidatures');
      if (res.ok) {
        const data = await res.json();
        setCandidatures(data);
      }
    } catch (err) {
      console.error("Erreur de rafraîchissement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && !session?.user)) {
      router.push('/');
      return;
    }
    if (session?.user && !session.user.isRecruiter) {
      router.push('/');
      return;
    }
    if (session?.user?.isRecruiter) {
      fetchCandidatures();
      const interval = setInterval(fetchCandidatures, 10000);
      return () => clearInterval(interval);
    }
  }, [session, status, router]);

  if (status === "loading" || (loading && status === "authenticated")) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0A0612]">
        <div className="text-neutral-500 text-sm uppercase tracking-[0.3em] animate-pulse">
          Chargement du Codex...
        </div>
      </div>
    );
  }

  if (!session?.user?.isRecruiter) return null;

  return (
    <div style={{
      minHeight: '100vh',
      background: calculateBackgroundColor(scrollProgress),
      transition: 'background 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '8rem 1.5rem 4rem' // Augmenté pour éviter le header
    }}>
      <style dangerouslySetInnerHTML={{ __html: FADE_IN_ANIMATION }} />

      <main style={{ 
        width: '100%',
        maxWidth: '1200px',
        animation: 'smoothFadeIn 0.8s ease-in-out forwards' 
      }}>
        
        {/* En-tête du Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h2 
              style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                      fontWeight: 'bold',
                      marginBottom: '1.5rem',
                color: COLORS.textBlue }}
              className="text-4xl font-extrabold tracking-tighter"
            >
              Gestion des Candidatures
            </h2>
            <div className="h-[1px] w-20 bg-[#683892] mt-2 mx-auto md:mx-0 opacity-60" />
          </div>

          <div className="flex items-center gap-3 px-5 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-green-500 uppercase font-black tracking-[0.2em]">Flux en direct</span>
          </div>
        </div>

        {/* Grille des candidatures */}
        <div className="grid gap-8">
          {candidatures.map((c: any) => (
            <div 
              key={c._id} 
              style={{ 
                background: COLORS.cardBg,
                border: `1px solid ${COLORS.cardBorder}`,
                backdropFilter: 'blur(10px)'
              }}
              className="p-8 rounded-[2rem] shadow-2xl transition-all hover:border-[#683892]/60 group"
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                <div className="flex items-center gap-5">
                  <div className="bg-[#683892]/20 text-[#CBDBFC] h-14 w-14 flex items-center justify-center rounded-2xl font-black border border-[#683892]/30 text-xl shadow-inner">
                    {c.rpName ? c.rpName.substring(0, 2).toUpperCase() : '??'}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white uppercase italic tracking-tight">{c.rpName}</h3>
                    <p className="text-[10px] text-neutral-500 font-mono tracking-widest mt-1">DISCORD: {c.discordId || "NON_LIE"}</p>
                  </div>
                </div>
                
                <div className="bg-black/20 px-4 py-2 rounded-xl border border-white/5 text-right">
                  <span className="block text-[10px] text-neutral-600 uppercase font-black tracking-widest mb-1">Date de réception</span>
                  <span className="text-sm text-neutral-400 font-bold tracking-wide">{new Date(c.submittedAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
              
              <div className="bg-black/30 border border-white/5 p-6 rounded-2xl text-neutral-300 italic text-sm leading-relaxed mb-8 border-l-4 border-l-[#683892] shadow-inner">
                "{c.motivations}"
              </div>

              {/* Boutons (Hauteur augmentée comme CandidatureForm) */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-white text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#CBDBFC] transition-all duration-300 shadow-lg">
                  Accepter le sujet
                </button>
                <button className="flex-1 bg-neutral-900 text-white border border-white/10 py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-red-600 hover:border-red-600 transition-all duration-300 shadow-lg">
                  Refuser le sujet
                </button>
              </div>
            </div>
          ))}

          {candidatures.length === 0 && (
            <div className="text-center py-32 rounded-xl bg-white/5 border border-dashed border-white/10 rounded-[3rem] backdrop-blur-sm">
              <p className="text-neutral-600 font-black uppercase tracking-[0.3em] text-xs">Aucune candidature pour le moment</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}