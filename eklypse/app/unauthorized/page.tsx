'use client';

import Link from 'next/link';
import { ShieldOff, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100dvh - 64px)',
      padding: 'clamp(2rem,5vw,4rem) 1rem',
      animation: 'fade-up var(--duration-slow) var(--ease-out) both',
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: 520,
        background: 'var(--surface-card)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-base)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(2.5rem,6vw,4rem)',
        boxShadow: 'var(--shadow-raised), 0 0 60px rgba(124,58,237,0.07)',
        textAlign: 'center',
      }}>
        {/* Top shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: '25%', right: '25%', height: 1,
          background: 'linear-gradient(to right, transparent, var(--brand-primary), transparent)',
          borderRadius: '0 0 2px 2px',
        }} />

        {/* Icon */}
        <div style={{
          width: 72, height: 72,
          borderRadius: '50%',
          background: 'rgba(124,58,237,0.1)',
          border: '1px solid rgba(124,58,237,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 2rem',
          animation: 'float 4s ease-in-out infinite',
        }}>
          <ShieldOff size={32} strokeWidth={1.5} style={{ color: 'var(--brand-primary)' }} />
        </div>

        <h1 style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: 'clamp(1.75rem,4vw,2.5rem)',
          fontWeight: 900,
          color: 'var(--text-primary)',
          letterSpacing: '0.06em',
          marginBottom: '1rem',
        }}>
          Accès Restreint
        </h1>

        <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.95rem',
          lineHeight: 1.7,
          maxWidth: 380,
          margin: '0 auto 2.5rem',
        }}>
          Pour franchir les portes d'Eklypse, vous devez être membre du serveur Discord et posséder le rôle de membre.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem' }}>
          <Link
            href="https://discord.gg/67H3ccmvvW"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
              width: '100%', maxWidth: 320,
              minHeight: 52,
              padding: '0.875rem 2rem',
              background: 'linear-gradient(135deg, #5865F2, #4752C4)',
              border: '1px solid rgba(88,101,242,0.4)',
              borderRadius: 'var(--radius-lg)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.06em',
              textDecoration: 'none',
              transition: 'opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-out)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'none';
            }}
          >
            <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01a10.12 10.12 0 0 0 .372.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z" />
            </svg>
            Rejoindre le Discord
          </Link>

          <Link
            href="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              minHeight: 44,
              padding: '0.5rem 1rem',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              transition: 'color var(--duration-fast) var(--ease-out)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <ArrowLeft size={13} strokeWidth={2} />
            Retour à l'accueil
          </Link>
        </div>

        <p style={{
          marginTop: '2rem',
          color: 'var(--text-muted)',
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.5,
        }}>
          Eklypse Roleplay · 2026
        </p>
      </div>
    </div>
  );
}
