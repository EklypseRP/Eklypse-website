'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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

// RÉGLAGE DE L'ANIMATION (Harmonisé avec le Wiki)
const FADE_IN_ANIMATION = `
  @keyframes smoothFadeIn {
    from { 
      opacity: 0; 
      transform: translateY(4px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;

const SCROLL_COLORS = {
  start: { r: 28, g: 15, b: 38 },
  mid: { r: 20, g: 10, b: 28 },
  end: { r: 10, g: 6, b: 18 },
};

// ===== ICÔNES SVG =====
const Icon = {
  PenTool: ({ style }: { style?: React.CSSProperties }) => (
    <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
      <path d="M2 2l7.5 1.5"></path>
      <path d="M7 11l5-5"></path>
    </svg>
  ),
  Masks: ({ style }: { style?: React.CSSProperties }) => (
    <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
      <path d="M18 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
      <path d="M12 20a8 8 0 0 0 8-8h-16a8 8 0 0 0 8 8Z"></path>
    </svg>
  ),
  BookOpen: ({ style }: { style?: React.CSSProperties }) => (
    <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
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

export default function EklypseWebsite() {
  const scrollProgress = useScrollProgress();
  return (
    <div style={{
      minHeight: '100vh',
      background: calculateBackgroundColor(scrollProgress),
      color: COLORS.lightText,
      transition: 'background 0.3s ease'
    }}>
      {/* Injection de l'animation CSS */}
      <style dangerouslySetInnerHTML={{ __html: FADE_IN_ANIMATION }} />
      
      <Header />
      
      {/* Application de l'animation sur le conteneur principal */}
      <main style={{ 
        paddingTop: '6rem', 
        paddingBottom: '4rem',
        animation: 'smoothFadeIn 0.8s ease-in-out forwards' 
      }}>
        <HomePage />
      </main>
      
      <Footer />
    </div>
  );
}

const HomePage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem' }}>
      <HeroSection />
      <StoryPreview />
      <FeaturesSection />
      <JoinSection />
    </div>
  );
};

const HeroSection: React.FC = () => (
  <section style={{ textAlign: 'center', padding: '3rem 0' }}>
    <div style={{ maxWidth: '70rem', margin: '0 auto' }}>
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
        Un Serveur Minecraft MMORPG Médiéval-Fantasy
      </p>
    </div>
  </section>
);

const StoryPreview: React.FC = () => (
  <section style={{ maxWidth: '68rem', margin: '0 auto 4rem' }}>
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', marginBottom: '1.5rem' }}>
        <Icon.BookOpen style={{ width: '28px', height: '28px', color: COLORS.purple, marginRight: '1rem' }} />
        <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', fontWeight: 'bold', margin: 0 }}>La Légende Commence</h3>
      </div>
      <p style={{ color: `rgba(203, 219, 252, 0.9)`, lineHeight: '1.8', marginBottom: '1rem', fontSize: '1.05rem' }}>
        Il y a trois cents ans, au terme d'une guerre dévastatrice, le Roi Démon, au bord de la défaite, lança son ultime malédiction. 
        Dans un dernier acte de haine, il scella la capitale du seul continent peuplé au cœur d'un donjon colossal, coupant l'humanité du reste du monde.
        Ce sortilège consuma l'entièreté de son mana, le plongeant dans une profonde léthargie au cœur des abysses, où il attend patiemment de recouvrer ses forces.
        Simple mythe ou terrible réalité ? Une rumeur enfle : chaque jour qui passe, la menace du Démon grandit et sa puissance ne fait que croitre.
      </p>
      <p style={{ color: `rgba(203, 219, 252, 0.9)`, lineHeight: '1.8', marginBottom: '1.5rem', fontSize: '1.05rem' }}>
        Dans ce monde en sursis, qui choisirez-vous d'être ? Du marchand astucieux au guerrier légendaire, votre destin vous appartient.<br />
        Entrez dans la légende... avant qu'elle ne s'éteigne.
      </p>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
  <section style={{ maxWidth: '1400px', margin: '0 auto 4rem' }}>
    <h3 style={{ fontSize: 'clamp(1.875rem, 4vw, 2.25rem)', fontWeight: 'bold', textAlign: 'center', marginBottom: '3rem' }}>
      L'Expérience Eklypse
    </h3>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
      gap: '2.5rem'
    }}>
      <FeatureCard
        icon={<Icon.BookOpen style={{ width: '32px', height: '32px' }} />}
        title="Ressources & Guides"
        description="Vous retrouverez sur le site une multitude de ressources et de guides pour vous aider à nous rejoindre dans les meilleures conditions, allant du guide de candidature à l'optimisation de votre jeu ! Vous pouvez aussi participer à sa rédaction si vous pensez qu'une ressource est pertinente."
      />
      <FeatureCard
        icon={<Icon.Masks style={{ width: '32px', height: '32px' }} />}
        title="Immersion & RP"
        description="L'entièreté du lore disponible sur le Wiki est canoniquement accessible en jeu. Si vous souhaitez l'apprendre sur le bout des doigts et l'utiliser en RP, vous êtes dans votre droit. Libre à vous de nous rejoindre en connaissant chacune des dates et faits de notre univers !"
      />
      <FeatureCard
        icon={<Icon.PenTool style={{ width: '32px', height: '32px' }} />}
        title="Écrivez l'Histoire"
        description="Mieux que de lire notre lore, devenez les personnes qui l'écrivent ! Grâce à vos actions, inspirez les futurs joueurs en rédigeant les prochaines pages de notre univers."
      />
    </div>
  </section>
);

const JoinSection: React.FC = () => (
  <section style={{ maxWidth: '45rem', margin: '0 auto' }}>
    <Card gradient>
      <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>
        Prêt à Commencer Votre Aventure ?
      </h3>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Step number="1" text="Rejoignez notre serveur Discord officiel" />
          <Step number="2" text="Complétez le processus de vérification (serveur en whitelist)" />
          <Step number="3" text="Recevez l'adresse IP du serveur après validation" />
          <Step number="4" text="Lancez Minecraft Java Edition et rejoignez Eklypse !" />
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
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
    padding: 'clamp(1.5rem, 4vw, 3.5rem)',
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
        backdropFilter: 'blur(12px)',
        borderRadius: '0.8rem',
        padding: '3rem',
        border: `1px solid ${isHovered ? COLORS.purple : COLORS.cardBorder}`,
        transition: 'all 0.4s ease',
        boxShadow: isHovered ? '0 15px 30px -5px rgba(104, 56, 146, 0.3)' : '0 10px 15px -3px rgba(0,0,0,0.2)',
        transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
        cursor: 'default',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1.25rem', 
        marginBottom: '1.5rem' 
      }}>
        <div style={{ color: COLORS.purple, display: 'flex', alignItems: 'center' }}>
          {icon}
        </div>
        <h4 style={{ 
          fontSize: '1.6rem', 
          fontWeight: 'bold', 
          color: COLORS.lightText,
          margin: 0 
        }}>
          {title}
        </h4>
      </div>
      
      <p style={{ 
        color: `rgba(203, 219, 252, 0.85)`, 
        lineHeight: '1.8', 
        fontSize: '1.05rem',
        margin: 0
      }}>
        {description}
      </p>
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
    <p style={{ color: `rgba(203, 219, 252, 0.9)`, paddingTop: '0.5rem', fontSize: '1.05rem' }}>{text}</p>
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
        padding: '0.75rem 1.75rem',
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
        padding: '1.25rem 2.5rem',
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