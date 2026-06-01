'use client';

import Image from 'next/image';
import CandidatureForm from './CandidatureForm';

export default function CandidatureClient({ user }: { user: any }) {
  return (
    <div style={{
      padding: 'clamp(2rem,5vw,4rem) clamp(1rem,4vw,2rem)',
      animation: 'fade-up var(--duration-slow) var(--ease-out) both',
    }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: 'clamp(2rem,5vw,3.25rem)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '0.08em',
            marginBottom: '1.5rem',
          }}>
            Candidature
          </h1>

          {/* User badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '1rem',
            padding: '0.625rem 1.25rem',
            background: 'var(--surface-card)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-xl)',
          }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              {user?.image ? (
                <div style={{
                  position: 'relative', width: 40, height: 40,
                  borderRadius: '50%', overflow: 'hidden',
                  border: '2px solid rgba(124,58,237,0.4)',
                }}>
                  <Image src={user.image} alt="Avatar" fill style={{ objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{
                  width: 40, height: 40,
                  borderRadius: '50%',
                  background: 'rgba(124,58,237,0.15)',
                  border: '2px solid rgba(124,58,237,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--brand-primary)', fontWeight: 700, fontSize: '1rem',
                }}>
                  {user?.name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <span style={{
                position: 'absolute', bottom: 0, right: 0,
                width: 10, height: 10,
                borderRadius: '50%',
                background: '#22C55E',
                border: '2px solid var(--surface-bg)',
              }} />
            </div>
            <div style={{
              borderLeft: '1px solid var(--border-subtle)',
              paddingLeft: '1rem',
              textAlign: 'left',
            }}>
              <span style={{
                display: 'block',
                fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '0.15rem',
              }}>
                Rédacteur actif
              </span>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Form card */}
        <div style={{
          background: 'var(--surface-card)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--border-base)',
          borderRadius: 'var(--radius-xl)',
          padding: 'clamp(1.5rem,4vw,3rem)',
          boxShadow: 'var(--shadow-raised)',
        }}>
          <CandidatureForm />
        </div>
      </div>
    </div>
  );
}
