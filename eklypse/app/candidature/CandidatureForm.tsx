'use client';

import { useState } from 'react';

const COLORS = {
  purple: '#683892',
  darkPurple: '#321B46',
  lightText: '#CBDBFC',
};

export default function CandidatureForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/candidature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) setStatus('success');
      else setStatus('error');
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-white uppercase italic">Candidature transmise</h2>
        <p className="text-neutral-400 mt-2">Votre destin est désormais entre les mains des scribes.</p>
      </div>
    );
  }

  const inputStyle = "w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#683892] transition-all";
  const labelStyle = "block  text-xs font-black text-neutral-500 uppercase tracking-widest mb-2 ml-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <div className="flex flex-col">
          <label className={labelStyle}>Identité RP</label>
          <input name="rpName" required placeholder="Ex: Alistair de Rivia" className={inputStyle} />
        </div>
        <div className="flex flex-col">
          <label className={labelStyle}>Âge</label>
          <input name="age" type="number" required placeholder="25" className={inputStyle} />
        </div>
      </div>
      
      <div className="flex flex-col">
        <label className={labelStyle}>Récit & Motivations</label>
        <textarea 
          name="motivations" 
          rows={6} 
          required 
          placeholder="Racontez votre histoire..." 
          className={`${inputStyle} resize-none`} 
        />
      </div>

      <br />
      <button 
        type="submit" 
        disabled={loading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: isHovered 
            ? `linear-gradient(to right, ${COLORS.darkPurple}, ${COLORS.purple})`
            : `linear-gradient(to right, ${COLORS.purple}, ${COLORS.darkPurple})`,
          transform: isHovered ? 'scale(1.02)' : 'scale(1)',
          boxShadow: isHovered ? '0 10px 20px rgba(104, 56, 146, 0.4)' : 'none',
        }}
        className="w-full py-6 rounded-xl text-white font-black uppercase text-base tracking-[0.2em] transition-all duration-300 disabled:opacity-50"
      >
        {loading ? "Envoi du parchemin..." : "Soumettre ma candidature"}
      </button>

      {status === 'error' && <p className="text-red-500 text-center font-bold uppercase text-[10px] tracking-widest">Une erreur magique est survenue.</p>}
    </form>
  );
}