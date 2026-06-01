'use client';

import { signIn } from 'next-auth/react';
import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [hov, setHov]         = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    await signIn('discord', { callbackUrl: '/candidature' });
  };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '5rem 1.5rem 3rem',
      background: 'var(--surface-bg)',
      animation: 'fade-in var(--duration-slow) var(--ease-out) both',
    }}>
      <div className="card" style={{
        width: '100%', maxWidth: 420,
        padding: 'clamp(2rem,5vw,3.25rem)',
        textAlign: 'center',
        boxShadow: 'var(--shadow-raised)',
      }}>
        {/* Icon */}
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(109,40,217,0.08)',
          border: '1px solid rgba(109,40,217,0.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: 'var(--brand-primary)',
        }}>
          <Sparkles size={24} strokeWidth={1.5} aria-hidden="true" />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: 'clamp(1.4rem,3.5vw,1.8rem)',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '0.75rem',
        }}>
          Espace Membre
        </h1>

        <div style={{ height: 1, background: 'var(--border-subtle)', width: 80, margin: '0 auto 1.5rem' }} />

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '0.9rem',
          lineHeight: 1.7,
          marginBottom: '2.25rem',
        }}>
          Connectez-vous avec Discord pour accéder à l'espace candidature et rejoindre le monde d'Eklypse.
        </p>

        <button
          onClick={handleSignIn}
          disabled={loading}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          aria-label="Se connecter avec Discord"
          style={{
            width: '100%', minHeight: 52,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            background: hov ? '#4752C4' : '#5865F2',
            border: 'none', borderRadius: 'var(--radius-base)',
            color: '#fff', fontWeight: 700, fontSize: '1rem',
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.75 : 1,
            boxShadow: hov ? '0 8px 24px rgba(88,101,242,0.45)' : '0 4px 16px rgba(88,101,242,0.28)',
            transform: hov && !loading ? 'translateY(-2px)' : 'none',
            transition: 'background var(--duration-base) var(--ease-out), box-shadow var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)',
          }}
        >
          {loading ? (
            <Loader2 size={20} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
          )}
          {loading ? 'Connexion…' : 'Continuer avec Discord'}
        </button>

        <p style={{ marginTop: '1.25rem', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Vous devez être membre du serveur Discord pour accéder.
        </p>
      </div>
    </div>
  );
}
