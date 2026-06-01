'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronDown, ArrowRight, Theater, Swords } from 'lucide-react';
import MapBackground from './components/MapBackground';

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  body: string;
  accent: string;
}

const FEATURES: FeatureItem[] = [
  {
    icon: <BookOpen size={22} strokeWidth={1.5} aria-hidden="true" />,
    title: 'Ressources & Guides',
    body: "Une bibliothèque de guides pour rejoindre Eklypse dans les meilleures conditions — du guide de candidature à l'optimisation de votre expérience. Contribuez vous aussi à leur rédaction.",
    accent: 'var(--brand-primary)',
  },
  {
    icon: <Theater size={22} strokeWidth={1.5} aria-hidden="true" />,
    title: 'Immersion & Roleplay',
    body: "L'intégralité du lore est canoniquement accessible en jeu. Maîtrisez chaque fait de notre univers et incarnez votre personnage avec une précision de lore totale.",
    accent: 'var(--brand-teal)',
  },
  {
    icon: <Swords size={22} strokeWidth={1.5} aria-hidden="true" />,
    title: "Écrivez l'Histoire",
    body: "Vos actions forgent le lore. Devenez les auteurs des prochaines pages d'un univers vivant et inspirez les générations futures de joueurs.",
    accent: 'var(--brand-gold)',
  },
];

const PARTICLES: { left: string; delay: string; dur: string; size: number; gold: boolean }[] = [
  { left: '4%',  delay: '0.0s', dur: '4.5s', size: 2,   gold: false },
  { left: '10%', delay: '1.3s', dur: '3.8s', size: 1.5, gold: true  },
  { left: '17%', delay: '2.8s', dur: '5.2s', size: 2.5, gold: false },
  { left: '24%', delay: '0.5s', dur: '4.1s', size: 2,   gold: true  },
  { left: '31%', delay: '3.5s', dur: '3.5s', size: 1,   gold: false },
  { left: '37%', delay: '1.7s', dur: '4.8s', size: 2.5, gold: true  },
  { left: '43%', delay: '3.2s', dur: '5.5s', size: 1.5, gold: false },
  { left: '50%', delay: '0.9s', dur: '4.0s', size: 3,   gold: true  },
  { left: '57%', delay: '2.1s', dur: '3.9s', size: 2,   gold: false },
  { left: '63%', delay: '4.3s', dur: '4.3s', size: 1.5, gold: true  },
  { left: '70%', delay: '1.4s', dur: '4.7s', size: 2,   gold: false },
  { left: '76%', delay: '3.0s', dur: '5.1s', size: 2.5, gold: true  },
  { left: '82%', delay: '0.6s', dur: '3.6s', size: 1.5, gold: false },
  { left: '89%', delay: '2.3s', dur: '4.9s', size: 2,   gold: true  },
  { left: '95%', delay: '1.8s', dur: '4.2s', size: 1,   gold: false },
  { left: '21%', delay: '4.8s', dur: '6.0s', size: 1,   gold: true  },
  { left: '58%', delay: '3.9s', dur: '5.8s', size: 1,   gold: false },
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100dvh' }}>
      <HeroSection />
      <MagicDivider />
      <LoreSection />
      <FeaturesSection />
      <JoinSection />
    </div>
  );
}

/* ── Hero — map background with dark overlay ── */
const HeroSection: React.FC = () => (
  <section
    aria-label="Bienvenue sur Eklypse"
    style={{
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: '100dvh',
      padding: '0 clamp(1.25rem, 5vw, 4rem)',
      overflow: 'hidden',
    }}
  >
    <MapBackground overlay="rgba(8, 5, 20, 0.62)" />

    {/* Content */}
    <div style={{
      position: 'relative', zIndex: 1,
      maxWidth: '760px', width: '100%',
      animation: 'fade-up var(--duration-slow) var(--ease-out) both',
    }}>
      {/* Label */}
      <p style={{
        display: 'inline-block',
        fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.65)',
        border: '1px solid rgba(255,255,255,0.18)',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '999px',
        padding: '0.35rem 1.1rem',
        marginBottom: '2rem',
      }}>
        Serveur Minecraft RP Médiéval-Fantasy
      </p>

      {/* Title */}
      <h1 style={{
        fontFamily: 'var(--font-cinzel), serif',
        fontSize: 'clamp(4rem, 12vw, 8rem)',
        fontWeight: 900,
        lineHeight: 1,
        letterSpacing: '-0.01em',
        marginBottom: '1.5rem',
        color: '#FFFFFF',
      }}>
        EKLYPSE
      </h1>

      {/* Tagline */}
      <p style={{
        fontSize: 'clamp(1rem, 2.4vw, 1.2rem)',
        color: 'rgba(255,255,255,0.72)',
        lineHeight: 1.8,
        maxWidth: '520px',
        margin: '0 auto 2.75rem',
      }}>
        Un monde en sursis, une légende à écrire.
        <br />
        <em style={{ color: '#FFFFFF', fontStyle: 'italic', whiteSpace: 'nowrap' }}>Qui choisirez-vous d'être&nbsp;?</em>
      </p>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href="https://discord.gg/67H3ccmvvW"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rejoindre le serveur Discord officiel d'Eklypse"
          onMouseEnter={e => {
            e.currentTarget.style.background = '#4752C4';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#5865F2';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.8rem 1.75rem', minHeight: 48,
            borderRadius: 'var(--radius-base)',
            background: '#5865F2',
            color: '#fff', fontWeight: 700, fontSize: '0.95rem',
            textDecoration: 'none',
            boxShadow: '0 4px 18px rgba(88,101,242,0.45)',
            transition: 'background var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Rejoindre le Discord
        </a>

        <Link
          href="/wiki"
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.10)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.8rem 1.75rem', minHeight: 48,
            borderRadius: 'var(--radius-base)',
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff', fontWeight: 600, fontSize: '0.95rem',
            textDecoration: 'none',
            transition: 'background var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)',
          }}
        >
          <BookOpen size={16} strokeWidth={2} aria-hidden="true" />
          Explorer le Wiki
        </Link>
      </div>
    </div>

    {/* Scroll indicator */}
    <div
      aria-hidden="true"
      style={{
        position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
        color: 'rgba(255,255,255,0.45)',
        animation: 'float 3s ease-in-out infinite',
        zIndex: 1,
      }}
    >
      <span style={{ fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Défiler</span>
      <ChevronDown size={16} strokeWidth={1.5} />
    </div>
  </section>
);

/* ── Magical transition divider ── */
const MagicDivider: React.FC = () => (
  <div
    aria-hidden="true"
    style={{
      position: 'relative',
      zIndex: 1,
      height: 220,
      marginTop: -80,
      overflow: 'hidden',
      background: 'linear-gradient(to bottom, transparent 0%, var(--surface-raised) 100%)',
      pointerEvents: 'none',
    }}
  >
    {/* Horizontal glow beam */}
    <div style={{
      position: 'absolute',
      top: '44%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '72%', height: 1,
      background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.65) 25%, rgba(201,168,76,0.85) 50%, rgba(124,58,237,0.65) 75%, transparent)',
      filter: 'blur(1px)',
      animation: 'glow-pulse 3s ease-in-out infinite',
    }} />

    {/* Ambient radial glow */}
    <div style={{
      position: 'absolute',
      top: '44%', left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 300, height: 130,
      borderRadius: '50%',
      background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.14) 0%, transparent 70%)',
    }} />

    {/* SVG Sigil */}
    <svg
      viewBox="0 0 100 100"
      width={100}
      height={100}
      style={{
        position: 'absolute',
        top: '44%', left: '50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'visible',
        filter: 'drop-shadow(0 0 6px rgba(124,58,237,0.85)) drop-shadow(0 0 18px rgba(124,58,237,0.35))',
      }}
    >
      {/* Outer dashed ring — rotating CW */}
      <circle
        cx="50" cy="50" r="44"
        fill="none"
        stroke="rgba(124,58,237,0.55)"
        strokeWidth="0.7"
        strokeDasharray="3 5"
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: 'rune-spin-cw 48s linear infinite',
        }}
      />
      {/* Middle dashed ring — rotating CCW */}
      <circle
        cx="50" cy="50" r="34"
        fill="none"
        stroke="rgba(201,168,76,0.35)"
        strokeWidth="0.55"
        strokeDasharray="6 3 1.5 3"
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: 'rune-spin-ccw 32s linear infinite',
        }}
      />
      {/* Inner static ring */}
      <circle
        cx="50" cy="50" r="22"
        fill="none"
        stroke="rgba(124,58,237,0.28)"
        strokeWidth="0.45"
      />
      {/* Hexagram — triangle pointing up — slow CW */}
      <polygon
        points="50,28 69,61 31,61"
        fill="rgba(124,58,237,0.04)"
        stroke="rgba(201,168,76,0.5)"
        strokeWidth="0.65"
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: 'rune-spin-cw 90s linear infinite',
        }}
      />
      {/* Hexagram — triangle pointing down — slow CCW */}
      <polygon
        points="50,72 69,39 31,39"
        fill="rgba(124,58,237,0.04)"
        stroke="rgba(124,58,237,0.55)"
        strokeWidth="0.65"
        style={{
          transformBox: 'fill-box',
          transformOrigin: 'center',
          animation: 'rune-spin-ccw 90s linear infinite',
        }}
      />
      {/* Center glow dot */}
      <circle
        cx="50" cy="50" r="2.5"
        fill="rgba(201,168,76,1)"
        style={{ animation: 'glow-pulse 2.5s ease-in-out infinite' }}
      />
      {/* Center halo ring */}
      <circle
        cx="50" cy="50" r="6"
        fill="none"
        stroke="rgba(201,168,76,0.35)"
        strokeWidth="0.6"
        style={{ animation: 'glow-pulse 2.5s ease-in-out infinite 1.25s' }}
      />
    </svg>

    {/* Ember particles */}
    {PARTICLES.map((p, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          bottom: '18%',
          left: p.left,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: p.gold ? 'rgba(201,168,76,0.9)' : 'rgba(164,122,255,0.9)',
          boxShadow: p.gold
            ? '0 0 5px 1px rgba(201,168,76,0.5)'
            : '0 0 5px 1px rgba(124,58,237,0.5)',
          animation: `ember-rise ${p.dur} ${p.delay} ease-out infinite`,
        }}
      />
    ))}
  </div>
);

/* ── Lore ── */
const LoreSection: React.FC = () => (
  <section style={{
    padding: 'clamp(5rem,10vw,9rem) clamp(1.25rem,5vw,4rem)',
    background: 'var(--surface-raised)',
  }}>
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <p style={{
        fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--brand-gold)', marginBottom: '1rem',
      }}>
        Lore &amp; Histoire
      </p>

      <h2 style={{
        fontFamily: 'var(--font-cinzel), serif',
        fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)',
        fontWeight: 800,
        color: 'var(--text-primary)',
        letterSpacing: '0.03em',
        marginBottom: '2rem',
        lineHeight: 1.2,
      }}>
        La Légende Commence
      </h2>

      <p style={{
        color: 'var(--text-secondary)', lineHeight: 1.9,
        marginBottom: '1.25rem', fontSize: '1.02rem',
        borderLeft: '3px solid var(--brand-primary)',
        paddingLeft: '1.25rem',
      }}>
        Il y a trois cents ans, le Roi Démon lança son ultime malédiction avant de sombrer dans la défaite.
        La capitale du seul continent peuplé fut scellée au cœur d'un donjon colossal, coupant l'humanité du reste du monde.
      </p>
      <p style={{
        color: 'var(--text-secondary)', lineHeight: 1.9,
        marginBottom: '2.5rem', fontSize: '1.02rem',
        borderLeft: '3px solid var(--brand-primary)',
        paddingLeft: '1.25rem',
      }}>
        Sa puissance dort toujours. Et chaque jour qui passe, elle croît un peu plus.{' '}
        <em style={{ color: 'var(--text-primary)' }}>Entrez dans la légende… avant qu'elle ne s'éteigne.</em>
      </p>

      <Link
        href="/wiki"
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--brand-gold)'; }}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          color: 'var(--brand-gold)', textDecoration: 'none',
          fontWeight: 600, fontSize: '0.9rem',
          transition: 'color var(--duration-base) var(--ease-out)',
        }}
      >
        Découvrir l'Histoire
        <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
      </Link>
    </div>
  </section>
);

/* ── Features ── */
const FeaturesSection: React.FC = () => (
  <section style={{
    padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)',
    background: 'var(--surface-bg)',
  }}>
    <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem,6vw,5rem)' }}>
      <p style={{
        fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.22em', textTransform: 'uppercase',
        color: 'var(--brand-gold)', marginBottom: '0.875rem',
      }}>
        Ce que nous offrons
      </p>
      <h2 style={{
        fontFamily: 'var(--font-cinzel), serif',
        fontSize: 'clamp(1.6rem, 3.5vw, 2.3rem)',
        fontWeight: 800, color: 'var(--text-primary)',
        margin: 0, letterSpacing: '0.03em',
      }}>
        L'Expérience Eklypse
      </h2>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '1.25rem',
      maxWidth: '1200px', margin: '0 auto',
    }}>
      {FEATURES.map((f) => <FeatureCard key={f.title} feature={f} />)}
    </div>
  </section>
);

const FeatureCard: React.FC<{ feature: FeatureItem }> = ({ feature }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={ref}
      className="card"
      onMouseEnter={() => { if (ref.current) ref.current.style.borderColor = feature.accent + '55'; }}
      onMouseLeave={() => { if (ref.current) ref.current.style.borderColor = ''; }}
      style={{ padding: 'clamp(1.5rem, 3vw, 2.25rem)', cursor: 'default' }}
    >
      <div style={{
        width: 48, height: 48,
        borderRadius: 'var(--radius-base)',
        background: `${feature.accent}12`,
        border: `1px solid ${feature.accent}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: feature.accent,
        marginBottom: '1.5rem',
      }}>
        {feature.icon}
      </div>

      <h3 style={{
        fontFamily: 'var(--font-cinzel), serif',
        fontSize: '1.05rem', fontWeight: 700,
        color: 'var(--text-primary)', marginBottom: '0.875rem',
      }}>
        {feature.title}
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.8, margin: 0 }}>
        {feature.body}
      </p>
    </div>
  );
};

/* ── Join ── */
const JoinSection: React.FC = () => (
  <section style={{
    padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)',
    background: 'var(--surface-raised)',
  }}>
    <div style={{
      maxWidth: '560px', margin: '0 auto',
      background: 'var(--surface-bg)',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--border-subtle)',
      padding: 'clamp(2rem, 5vw, 3.25rem)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
        <p style={{
          fontSize: '0.7rem', fontWeight: 700,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'var(--brand-gold)', marginBottom: '0.875rem',
        }}>
          Votre aventure commence ici
        </p>
        <h2 style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: 'clamp(1.4rem, 3vw, 1.8rem)',
          fontWeight: 800, color: 'var(--text-primary)',
          margin: '0 0 1.25rem', letterSpacing: '0.03em',
        }}>
          Prêt à Entrer dans la Légende&nbsp;?
        </h2>
        <div style={{ height: 1, background: 'var(--border-subtle)', width: 80, margin: '0 auto' }} />
      </div>

      <ol style={{
        listStyle: 'none', padding: 0,
        margin: '0 0 clamp(2rem,4vw,2.75rem)',
        display: 'flex', flexDirection: 'column', gap: '1rem',
      }}>
        {[
          'Rejoignez notre serveur Discord officiel',
          'Complétez le processus de vérification',
          'Soumettez votre candidature RP',
          'Lancez Minecraft Java et entrez dans Eklypse !',
        ].map((step, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <span style={{
              flexShrink: 0, width: 32, height: 32, borderRadius: '50%',
              background: 'var(--brand-primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-cinzel), serif',
              fontWeight: 700, fontSize: '0.78rem', color: '#fff',
            }}>
              {i + 1}
            </span>
            <p style={{ color: 'var(--text-secondary)', margin: '0.3rem 0 0', fontSize: '0.975rem', lineHeight: 1.6 }}>
              {step}
            </p>
          </li>
        ))}
      </ol>

      <div style={{ textAlign: 'center' }}>
        <a
          href="https://discord.gg/67H3ccmvvW"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Rejoindre le serveur Discord officiel d'Eklypse"
          onMouseEnter={e => {
            e.currentTarget.style.background = '#4752C4';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#5865F2';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.625rem',
            background: '#5865F2', padding: '0.875rem 2.25rem',
            borderRadius: 'var(--radius-base)', color: '#fff',
            fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
            boxShadow: '0 4px 16px rgba(88,101,242,0.3)',
            transition: 'background var(--duration-base) var(--ease-out), transform var(--duration-base) var(--ease-out)',
            minHeight: 52,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          Rejoindre le Discord
        </a>
      </div>
    </div>
  </section>
);
