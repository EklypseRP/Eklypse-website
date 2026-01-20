'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const COLORS = {
  purple: '#683892',
  lightText: '#CBDBFC',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
  almostBlack: '#0A0612', 
};

// --- COMPOSANT DE LIEN (Articles) ---
const SidebarLink = ({ href, title, icon, isActive, isCollapsed }: any) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '0.6rem 1rem',
        fontSize: '0.9rem',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.7rem',
        position: 'relative',
        transition: 'all 0.3s ease',
        color: (isActive || isHovered) ? COLORS.lightText : 'rgba(203, 219, 252, 0.5)',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
      }}
    >
      <span style={{ 
        fontSize: '1.1rem', 
        filter: isHovered || isActive ? 'none' : 'grayscale(100%) opacity(0.4)',
        transition: 'all 0.3s' 
      }}>
        {icon || '📄'}
      </span>

      {!isCollapsed && (
        <span style={{ 
          overflow: 'hidden', 
          textOverflow: 'ellipsis', 
          whiteSpace: 'nowrap', 
          fontWeight: isActive ? '600' : '400',
        }}>
          {title}
        </span>
      )}

      {!isCollapsed && (isActive || isHovered) && (
        <span style={{
          position: 'absolute',
          bottom: '2px',
          left: '50%',
          width: '80%',
          height: '2px',
          background: `linear-gradient(to right, transparent, ${COLORS.purple}, transparent)`,
          transform: 'translateX(-50%)',
          transition: 'all 0.3s ease',
        }} />
      )}
    </Link>
  );
};

// --- COMPOSANT PRINCIPAL ---
export default function WikiSidebar({ categories }: { categories: any[] }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  return (
    <aside style={{
      width: isCollapsed ? '80px' : '300px',
      minWidth: isCollapsed ? '80px' : '300px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2.5rem',
      position: 'sticky',
      top: 0,
      height: '100vh',
      overflowY: 'auto',
      overflowX: 'hidden',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      backgroundColor: COLORS.almostBlack,
      borderRight: `1px solid ${COLORS.cardBorder}`, 
      padding: isCollapsed ? '2.5rem 0.5rem' : '2.5rem 1.5rem',
      zIndex: 20,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      
      <style>{`aside::-webkit-scrollbar { display: none; }`}</style>
      
      {/* BOUTON TOGGLE */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        onMouseEnter={() => setIsBtnHovered(true)}
        onMouseLeave={() => setIsBtnHovered(false)}
        style={{
          position: 'fixed',
          left: isCollapsed ? '64px' : '284px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: isBtnHovered ? COLORS.purple : COLORS.almostBlack,
          border: `1px solid ${COLORS.cardBorder}`,
          color: COLORS.lightText,
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: isBtnHovered ? `0 0 15px ${COLORS.purple}` : '0 4px 10px rgba(0,0,0,0.5)',
          zIndex: 100,
          fontSize: '1.2rem',
        }}
      >
        {isCollapsed ? '›' : '‹'}
      </button>

      {/* TITRE WIKI */}
      {!isCollapsed && (
        <Link 
          href="/wiki" 
          onMouseEnter={() => setIsTitleHovered(true)}
          onMouseLeave={() => setIsTitleHovered(false)}
          style={{
            fontSize: '0.7rem',
            fontWeight: '900',
            color: isTitleHovered ? COLORS.lightText : 'rgba(203, 219, 252, 0.3)',
            textDecoration: 'none',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
            transition: 'all 0.3s ease',
          }}
        >
          Documentation / Wiki
        </Link>
      )}

      {/* NAVIGATION CATEGORIES */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {categories.map((cat) => {
          const isCategoryActive = pathname.includes(`/wiki/${cat.id}`);

          return (
            <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* TITRE DE CATÉGORIE AVEC LIGNE DYNAMIQUE */}
              <div style={{ 
                display: 'inline-flex', // Utilisation d'inline-flex pour que la largeur s'adapte au contenu
                alignItems: 'center', 
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '0.8rem',
                color: COLORS.lightText,
                paddingLeft: isCollapsed ? '0' : '0.5rem',
                position: 'relative',
                paddingBottom: isCollapsed ? '0' : '0.6rem', // Espace pour la ligne
                width: isCollapsed ? '100%' : 'fit-content' // S'adapte au mot si déplié
              }}>
                <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
                {!isCollapsed && (
                  <span style={{ 
                    fontWeight: '800', 
                    fontSize: '0.8rem', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em' 
                  }}>
                    {cat.title}
                  </span>
                )}

                {/* LA LIGNE DÉGRADÉE (Même style que les articles) */}
                {isCategoryActive && !isCollapsed && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)', // Centrage sous le mot
                    width: '100%', // Toute la longueur du mot + icône
                    height: '2px',
                    background: `linear-gradient(to right, transparent, ${COLORS.purple}, transparent)`,
                    borderRadius: '2px'
                  }} />
                )}
              </div>

              {/* LISTE ARTICLES */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0.3rem',
                borderLeft: isCollapsed ? 'none' : '1px solid rgba(104, 56, 146, 0.1)',
                marginLeft: isCollapsed ? '0' : '0.65rem'
              }}>
                {cat.articles.map((art: any) => (
                  <SidebarLink 
                    key={art.slug}
                    href={`/wiki/${cat.id}/${art.slug}`}
                    title={art.title}
                    icon={art.icon}
                    isActive={pathname === `/wiki/${cat.id}/${art.slug}`}
                    isCollapsed={isCollapsed}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}