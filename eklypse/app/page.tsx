'use client';

import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Lucide React icons as inline SVG components
const Sword = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"></polyline>
    <line x1="13" y1="19" x2="19" y2="13"></line>
    <line x1="16" y1="16" x2="20" y2="20"></line>
    <line x1="19" y1="21" x2="21" y2="19"></line>
  </svg>
);

const BookOpen = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const Users = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const ChevronRight = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

export default function EklypseWebsite() {
  const [currentPage, setCurrentPage] = useState<'home' | 'lore'>('home');

  const navigateTo = (page: 'home' | 'lore') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #1C0F26, #321B46, #683892)',
      color: '#CBDBFC'
    }}>
      <Header currentPage={currentPage} onNavigate={navigateTo} />
      
      <main style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
        {currentPage === 'lore' && <LorePage />}
      </main>

      <Footer />
    </div>
  );
}

interface HomePageProps {
  navigateTo: (page: 'home' | 'lore') => void;
}

const HomePage: React.FC<HomePageProps> = ({ navigateTo }) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', padding: '3rem 0' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            background: 'linear-gradient(to right, #CBDBFC, #683892, #CBDBFC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Bienvenue sur Eklypse
          </h2>
          <p style={{
            fontSize: 'clamp(1.125rem, 2vw, 1.25rem)',
            color: 'rgba(203, 219, 252, 0.9)',
            marginBottom: '2rem',
            lineHeight: '1.75'
          }}>
            Un Serveur Minecraft MMORPG Médiéval-Fantastique
          </p>
        </div>
      </section>

      {/* Story Preview */}
      <section style={{ maxWidth: '56rem', margin: '0 auto 4rem' }}>
        <div style={{
          backgroundColor: 'rgba(50, 27, 70, 0.5)',
          backdropFilter: 'blur(8px)',
          borderRadius: '0.5rem',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          border: '1px solid rgba(104, 56, 146, 0.3)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
            <BookOpen style={{ width: '24px', height: '24px', color: '#683892', marginRight: '0.75rem' }} />
            <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', fontWeight: 'bold' }}>La Légende Commence</h3>
          </div>
          <p style={{ color: 'rgba(203, 219, 252, 0.9)', lineHeight: '1.75', marginBottom: '1rem' }}>
            Il y a trois cents ans, à la fin d'une guerre dévastatrice, le Roi Démon, mortellement blessé, 
            lança son ultime sort. Dans un dernier acte de malveillance, il enferma la capitale du seul 
            continent peuplé dans un donjon colossal, isolant l'humanité du reste du monde.
          </p>
          <p style={{ color: 'rgba(203, 219, 252, 0.9)', lineHeight: '1.75', marginBottom: '1.5rem' }}>
            Ce sort consuma toute son énergie, le plongeant dans un sommeil éternel dans les profondeurs de 
            l'abysse, où il attend qu'un groupe d'élite vienne l'affronter une dernière fois. Pour se libérer, 
            les gens doivent atteindre le niveau final du donjon pour libérer le Roi Démon et le vaincre une fois pour toutes.
          </p>
          <button
            onClick={() => navigateTo('lore')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(to right, #683892, #321B46)',
              borderRadius: '0.5rem',
              border: 'none',
              color: '#CBDBFC',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #321B46, #683892)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(104, 56, 146, 0.5)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(to right, #683892, #321B46)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
          >
            Découvrir l'Histoire Complète
            <ChevronRight style={{ width: '20px', height: '20px', marginLeft: '0.5rem' }} />
          </button>
        </div>
      </section>

      {/* Features */}
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
            icon={<Sword style={{ width: '48px', height: '48px' }} />}
            title="Donjons Épiques"
            description="Naviguez à travers des niveaux difficiles remplis de monstres, de trésors et de mystères à découvrir."
          />
          <FeatureCard
            icon={<Users style={{ width: '48px', height: '48px' }} />}
            title="Jouez en Équipe"
            description="Formez des guildes, créez des groupes et collaborez avec d'autres joueurs pour conquérir les défis les plus difficiles."
          />
          <FeatureCard
            icon={<BookOpen style={{ width: '48px', height: '48px' }} />}
            title="Histoire Riche"
            description="Plongez dans une histoire profonde et captivante qui se dévoile au fur et à mesure de votre progression dans le monde."
          />
        </div>
      </section>

      {/* How to Join */}
      <section style={{ maxWidth: '56rem', margin: '0 auto' }}>
        <div style={{
          background: 'linear-gradient(to bottom right, rgba(104, 56, 146, 0.3), rgba(50, 27, 70, 0.3))',
          backdropFilter: 'blur(8px)',
          borderRadius: '0.5rem',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          border: '1px solid rgba(104, 56, 146, 0.5)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
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
            <p style={{ color: 'rgba(203, 219, 252, 0.7)', marginBottom: '1rem', fontSize: '1.125rem' }}>
              🔒 Serveur en Whitelist - Rejoignez notre Discord pour accéder
            </p>
            <a
              href="https://discord.gg/67H3ccmvvW"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                backgroundColor: '#5865F2',
                padding: '1rem 2rem',
                borderRadius: '0.5rem',
                border: 'none',
                color: '#FFFFFF',
                fontWeight: '600',
                fontSize: '1.125rem',
                textDecoration: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(88, 101, 242, 0.3)',
                transition: 'all 0.3s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#4752C4';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 15px 25px -5px rgba(88, 101, 242, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#5865F2';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(88, 101, 242, 0.3)';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Rejoindre le Discord
            </a>
            <p style={{ 
              color: 'rgba(203, 219, 252, 0.6)', 
              marginTop: '1.5rem',
              fontSize: '0.875rem',
              fontStyle: 'italic'
            }}>
              Une fois vérifié sur Discord, vous recevrez toutes les informations nécessaires pour rejoindre le serveur
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const LorePage: React.FC = () => {
  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '0 1rem' }}>
      <h2 style={{
        fontSize: 'clamp(2.25rem, 5vw, 3rem)',
        fontWeight: 'bold',
        marginBottom: '2rem',
        textAlign: 'center',
        background: 'linear-gradient(to right, #CBDBFC, #683892)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        L'Histoire d'Eklypse
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <LoreCard
          title="L'Âge de Prospérité"
          content={[
            "Il y a fort longtemps, le continent d'Eklypse prospérait dans une ère de paix et de prospérité. De grands royaumes s'élevaient, la magie florissait, et l'humanité vivait en harmonie avec la terre. La capitale se dressait comme un phare de civilisation, un joyau brillant qui représentait le summum des réalisations humaines."
          ]}
        />

        <LoreCard
          title="La Grande Guerre"
          content={[
            "Mais la paix n'était pas destinée à durer. Des profondeurs les plus sombres de l'abysse, le Roi Démon émergea avec ses armées des ténèbres. Une guerre terrible engloutit le continent, durant des décennies et faisant d'innombrables victimes. Des héros se levèrent et tombèrent, des royaumes s'effondrèrent, et le tissu même de la réalité semblait se déchirer sous le poids du conflit.",
            "Lors de la bataille finale, les forces combinées de l'humanité parvinrent à blesser mortellement le Roi Démon. Mais la victoire eut un prix inimaginable."
          ]}
        />

        <LoreCard
          title="La Malédiction Finale"
          content={[
            "Il y a trois cents ans, avec son dernier souffle, le Roi Démon déchaîna son sort ultime. La capitale et tous ses habitants furent scellés dans un énorme donjon, un labyrinthe tordu de niveaux innombrables descendant profondément dans la terre. Le sort consuma le pouvoir restant du Roi Démon, le plongeant dans un sommeil éternel dans la chambre la plus profonde de l'abysse.",
            "Les survivants se retrouvèrent piégés, coupés du reste du monde, forcés de s'adapter à cette nouvelle réalité d'obscurité et de danger."
          ]}
        />

        <LoreCard
          title="Nos Jours"
          content={[
            "Aujourd'hui, trois siècles plus tard, les descendants des survivants originaux continuent de vivre dans les niveaux supérieurs du donjon. Ils ont construit de nouvelles communautés, développé de nouvelles façons de vivre, et préservé l'espoir qu'un jour, la liberté sera atteinte.",
            "Le chemin vers la libération est clair : les aventuriers doivent descendre à travers chaque niveau du donjon, affronter ses innombrables dangers, atteindre la chambre finale où le Roi Démon sommeille, et le vaincre une fois pour toutes. C'est seulement alors que la malédiction sera brisée et l'humanité libérée de sa prison de trois cents ans."
          ]}
        />

        <div style={{
          background: 'linear-gradient(to bottom right, rgba(104, 56, 146, 0.4), rgba(28, 15, 38, 0.4))',
          backdropFilter: 'blur(8px)',
          borderRadius: '0.5rem',
          padding: 'clamp(1.5rem, 3vw, 2rem)',
          border: '1px solid rgba(104, 56, 146, 0.5)',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.875rem)', fontWeight: 'bold', marginBottom: '1rem' }}>
            Serez-Vous le Héros ?
          </h3>
          <p style={{ color: 'rgba(203, 219, 252, 0.9)', lineHeight: '1.75' }}>
            Le donjon vous attend. Le Roi Démon dort. Le destin de l'humanité repose entre les mains 
            d'aventuriers courageux prêts à affronter les ténèbres et à en sortir victorieux. Votre légende 
            commence maintenant.
          </p>
        </div>
      </div>
    </div>
  );
};

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
        backgroundColor: 'rgba(50, 27, 70, 0.5)',
        backdropFilter: 'blur(8px)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        border: isHovered ? '1px solid #683892' : '1px solid rgba(104, 56, 146, 0.3)',
        transition: 'all 0.3s',
        boxShadow: isHovered ? '0 10px 15px -3px rgba(104, 56, 146, 0.2)' : 'none',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)',
        cursor: 'default'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ color: '#683892', marginBottom: '1rem' }}>{icon}</div>
      <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>{title}</h4>
      <p style={{ color: 'rgba(203, 219, 252, 0.8)', lineHeight: '1.75' }}>{description}</p>
    </div>
  );
};

interface StepProps {
  number: string;
  text: string;
}

const Step: React.FC<StepProps> = ({ number, text }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <div style={{
        flexShrink: 0,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'linear-gradient(to bottom right, #683892, #321B46)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        marginRight: '1rem'
      }}>
        {number}
      </div>
      <p style={{ color: 'rgba(203, 219, 252, 0.9)', paddingTop: '0.5rem' }}>{text}</p>
    </div>
  );
};

interface LoreCardProps {
  title: string;
  content: string[];
}

const LoreCard: React.FC<LoreCardProps> = ({ title, content }) => {
  return (
    <div style={{
      backgroundColor: 'rgba(50, 27, 70, 0.5)',
      backdropFilter: 'blur(8px)',
      borderRadius: '0.5rem',
      padding: 'clamp(1.5rem, 3vw, 2rem)',
      border: '1px solid rgba(104, 56, 146, 0.3)'
    }}>
      <h3 style={{
        fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#683892'
      }}>
        {title}
      </h3>
      {content.map((paragraph, index) => (
        <p
          key={index}
          style={{
            color: 'rgba(203, 219, 252, 0.9)',
            lineHeight: '1.75',
            marginBottom: index < content.length - 1 ? '1rem' : '0'
          }}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
};