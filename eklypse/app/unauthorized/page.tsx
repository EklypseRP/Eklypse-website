'use client';

import LinkNext from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="fixed inset-0 min-h-screen bg-[#0a0612] flex items-center justify-center p-6 text-center overflow-hidden font-sans">
      
      {/* Halo violet profond en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#683892] opacity-5 blur-[160px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-2xl w-full bg-[rgba(50,27,70,0.4)] border border-[rgba(104,56,146,0.3)] backdrop-blur-2xl p-10 md:p-16 rounded-[3.5rem] shadow-2xl">
        
        {/* Ligne d'éclat supérieure de la carte */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#683892]/50 to-transparent" />

        <div className="text-6xl mb-8 animate-float">🛡️</div>
        
        <h1 
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          className="font-black tracking-tighter mb-6 text-[rgba(203,219,252,0.9)]"
        >
          Accès Restreint
        </h1>
        
        <p className="text-[#CBDBFC]/60 text-base md:text-lg font-medium leading-relaxed mb-10 max-w-md mx-auto">
          Pour franchir les portes d'Eklypse, vous devez être membre du serveur Discord et posséder le rôle de membre.
        </p>

        <div className="flex flex-col items-center gap-10">
          {/* BOUTON BLEU DISCORD */}
          <LinkNext 
            href="https://discord.gg/67H3ccmvvW" 
            target="_blank"
            className="group relative inline-flex items-center justify-center gap-4 w-full max-w-sm py-6 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_0_40px_rgba(88,101,242,0.35)] active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#5865F2] to-[#4752C4]" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#4752C4] to-[#5865F2] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <svg className="relative z-10 w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
               <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01a10.12 10.12 0 0 0 .372.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
            </svg>

            <span className="relative z-10 text-white font-black uppercase text-sm tracking-[0.4em]">
              Rejoindre le Discord
            </span>
          </LinkNext>

          {/* LIEN RETOUR : Trait strictement identique à ton Header */}
          <LinkNext 
            href="/" 
            className="group relative py-2 flex flex-col items-center"
          >
            <span className="text-neutral-500 uppercase font-black text-[10px] tracking-[0.4em] transition-colors duration-500 group-hover:text-white">
              Retourner a l'acceuil
            </span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#683892] to-transparent transition-all duration-300 ease-in-out group-hover:w-full" />
          </LinkNext>
        </div>
      </div>

      <p className="fixed bottom-8 text-neutral-800 text-[10px] font-black uppercase tracking-[0.5em] opacity-30">
        Eklypse Roleplay • 2026
      </p>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}