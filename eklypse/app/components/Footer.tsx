'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Accueil',      href: '/' },
  { label: 'Wiki',         href: '/wiki' },
  { label: 'Candidature',  href: '/candidature' },
];

const Footer: React.FC = () => {
  const pathname = usePathname();

  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--surface-raised)',
      padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem) clamp(1.5rem,3vw,2rem)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 'clamp(2rem,6vw,5rem)',
        flexWrap: 'wrap',
        marginBottom: 'clamp(2rem,4vw,3rem)',
      }}>
        {/* Brand */}
        <div style={{ flex: '1 1 220px' }}>
          <p style={{
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: '1.3rem',
            fontWeight: 900,
            color: 'var(--text-primary)',
            letterSpacing: '0.1em',
            marginBottom: '0.35rem',
          }}>
            EKLYPSE
          </p>
          <p style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>
            Serveur RP Médiéval-Fantasy
          </p>
        </div>

        {/* Nav */}
        <nav aria-label="Navigation pied de page">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-primary)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
                    textDecoration: 'none',
                    transition: 'color var(--duration-base) var(--ease-out)',
                    minHeight: 36,
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
        <p style={{
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          © 2026 Eklypse RP — Tous droits réservés
        </p>
      </div>
    </footer>
  );
};

export default Footer;
