'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Importé pour la navigation vers le wiki
import Header from './components/Header';
import Footer from './components/Footer';

// ===== CONSTANTES =====
const COLORS = {
  purple: '#683892',
  darkPurple: '#321B46',
  veryDarkPurple: '#1C0F26',
  almostBlack: '#0A0612',
  lightText: '#CBDBFC',
  transparentPurple: 'rgba(104, 56, 146, 0.3)',
  cardBg: 'rgba(50, 27, 70, 0.5)',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
  discordBlue: '#5865F2',
  discordBlueDark: '#4752C4',
};

const SCROLL_COLORS = {
  start: { r: 28, g: 15, b: 38 },
  mid: { r: 20, g: 10, b: 28 },
  end: { r: 10, g: 6, b: 18 },
};

// ===== ICÔNES SVG =====
const Icon = {
  Sword: ({ style }: { style?: React.CSSProperties }) => (
    <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline>
      <line x1="13" y1="19" x2="19" y2="13"></line>
      <line x1="16" y1="16" x2="20" y2="20"></line>
      <line x1="19" y1="21" x2="21" y2="19"></line>
    </svg>
  ),
  BookOpen: ({ style }: { style?: React.CSSProperties }) => (
    <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  ),
  Users: ({ style }: { style?: React.CSSProperties }) => (
    <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  ChevronRight: ({ style }: { style?: React.CSSProperties }) => (
    <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  ),
  Discord: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  ),
};

const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = Math.min(scrolled / documentHeight, 1);
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

export default function EklypseWebsite() {
  const scrollProgress = useScrollProgress();

  return (
    <div style={{
      minHeight: '100vh',
      background: calculateBackgroundColor(scrollProgress),
      color: COLORS.lightText,
      transition: 'background 0.3s ease'
    }}>
      {/* Le Header ne prend plus de props de navigation */}
      <Header />
      
      <main style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <HomePage />
      </main>

      <Footer />
    </div>
  );
}

const HomePage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      <HeroSection />
      <StoryPreview />
      <FeaturesSection />
      <JoinSection />
    </div>
  );
};

const HeroSection: React.FC = () => (
  <section style={{ textAlign: 'center', padding: '3rem 0' }}>
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <h2 style={{
        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: COLORS.lightText
      }}>
        Bienvenue sur Eklypse
      </h2>
      <p style={{
        fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
        background: `linear-gradient(to right, ${COLORS.lightText}, ${COLORS.purple}, ${COLORS.lightText})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: '2rem',
        lineHeight: '1.75'
      }}>
        Un Serveur Minecraft MMORPG Médiéval-Fantastique
      </p>
    </div>
  </section>
);

const StoryPreview: React.FC = () => (
  <section style={{ maxWidth: '56rem', margin: '0 auto 4rem' }}>
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <Icon.BookOpen style={{ width: '24px', height: '24px', color: COLORS.purple, marginRight: '0.75rem' }} />
        <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', fontWeight: 'bold' }}>La Légende Commence</h3>
      </div>
      <p style={{ color: `rgba(203, 219, 252, 0.9)`, lineHeight: '1.75', marginBottom: '1rem' }}>
        Il y a trois cents ans, à la fin d'une guerre dévastatrice, le Roi Démon, mortellement blessé, 
        lança son ultime sort. Dans un dernier acte de malveillance, il enferma la capitale du seul 
        continent peuplé dans un donjon colossal, isolant l'humanité du reste du monde.
      </p>
      <p style={{ color: `rgba(203, 219, 252, 0.9)`, lineHeight: '1.75', marginBottom: '1.5rem' }}>
        Ce sort consuma toute son énergie, le plongeant dans un sommeil éternel dans les profondeurs de 
        l'abysse...
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {/* Le bouton utilise maintenant Link pour aller vers /wiki */}
        <Link href="/wiki" style={{ textDecoration: 'none' }}>
            <GradientButton>
                Découvrir l'Histoire Complète
                <Icon.ChevronRight style={{ width: '20px', height: '20px', marginLeft: '0.5rem' }} />
            </GradientButton>
        </Link>
      </div>
    </Card>
  </section>
);

const FeaturesSection: React.FC = () => (
  <section style={{ maxWidth: '72rem', margin: '0 auto 4rem' }}>
    <h3 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem' }}>
      Fonctionnalités du Serveur
    </h3>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 'clamp(1.5rem, 3vw, 2rem)'
    }}>
      <FeatureCard
        icon={<Icon.Sword style={{ width: '48px', height: '48px' }} />}
        title="Donjons Épiques"
        description="Naviguez à travers des niveaux difficiles remplis de monstres, de trésors et de mystères à découvrir."
      />
      <FeatureCard
        icon={<Icon.Users style={{ width: '48px', height: '48px' }} />}
        title="Jouez en Équipe"
        description="Formez des guildes, créez des groupes et collaborez avec d'autres joueurs."
      />
      <FeatureCard
        icon={<Icon.BookOpen style={{ width: '48px', height: '48px' }} />}
        title="Histoire Riche"
        description="Plongez dans une histoire profonde et captivante."
      />
    </div>
  </section>
);

const JoinSection: React.FC = () => (
  <section style={{ maxWidth: '56rem', margin: '0 auto' }}>
    <Card gradient>
      <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Prêt à Commencer Votre Aventure ?
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        <Step number="1" text="Rejoignez notre serveur Discord officiel" />
        <Step number="2" text="Complétez le processus de vérification (serveur en whitelist)" />
        <Step number="3" text="Recevez l'adresse IP du serveur après validation" />
        <Step number="4" text="Lancez Minecraft Java Edition et rejoignez Eklypse !" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: `rgba(203, 219, 252, 0.7)`, marginBottom: '1rem', fontSize: '1.125rem' }}>
          🔒 Serveur en Whitelist - Rejoignez notre Discord pour accéder
        </p>
        <DiscordButton />
      </div>
    </Card>
  </section>
);

// ===== COMPOSANTS RÉUTILISABLES =====
interface CardProps {
  children: React.ReactNode;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ children, gradient = false }) => (
  <div style={{
    background: gradient 
      ? 'linear-gradient(to bottom right, rgba(104, 56, 146, 0.3), rgba(50, 27, 70, 0.3))'
      : COLORS.cardBg,
    backdropFilter: 'blur(8px)',
    borderRadius: '0.5rem',
    padding: 'clamp(1.5rem, 3vw, 2.5rem)',
    border: `1px solid ${gradient ? 'rgba(104, 56, 146, 0.5)' : COLORS.cardBorder}`,
    boxShadow: gradient ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }}>
    {children}
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div
      style={{
        backgroundColor: COLORS.cardBg,
        backdropFilter: 'blur(8px)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        border: `1px solid ${isHovered ? COLORS.purple : COLORS.cardBorder}`,
        transition: 'all 0.3s',
        boxShadow: isHovered ? '0 10px 15px -3px rgba(104, 56, 146, 0.2)' : 'none',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        cursor: 'default'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ color: COLORS.purple, marginBottom: '1rem' }}>{icon}</div>
      <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>{title}</h4>
      <p style={{ color: `rgba(203, 219, 252, 0.8)`, lineHeight: '1.75' }}>{description}</p>
    </div>
  );
};

interface StepProps {
  number: string;
  text: string;
}

const Step: React.FC<StepProps> = ({ number, text }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <div style={{
      flexShrink: 0,
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: `linear-gradient(to bottom right, ${COLORS.purple}, ${COLORS.darkPurple})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      marginRight: '1rem'
    }}>
      {number}
    </div>
    <p style={{ color: `rgba(203, 219, 252, 0.9)`, paddingTop: '0.5rem' }}>{text}</p>
  </div>
);

interface GradientButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({ onClick, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        background: isHovered 
          ? `linear-gradient(to right, ${COLORS.darkPurple}, ${COLORS.purple})`
          : `linear-gradient(to right, ${COLORS.purple}, ${COLORS.darkPurple})`,
        borderRadius: '0.5rem',
        border: 'none',
        color: COLORS.lightText,
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 10px 15px -3px rgba(104, 56, 146, 0.5)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

const DiscordButton: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href="https://discord.gg/67H3ccmvvW"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        backgroundColor: isHovered ? COLORS.discordBlueDark : COLORS.discordBlue,
        padding: '1rem 2rem',
        borderRadius: '0.5rem',
        border: 'none',
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: '1.125rem',
        textDecoration: 'none',
        cursor: 'pointer',
        boxShadow: isHovered ? '0 15px 25px -5px rgba(88, 101, 242, 0.5)' : '0 10px 15px -3px rgba(88, 101, 242, 0.3)',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.3s'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon.Discord />
      Rejoindre le Discord
    </a>
  );
};