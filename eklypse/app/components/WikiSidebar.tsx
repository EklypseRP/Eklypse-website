'use client';

import React, { useState, useEffect } from 'react';
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
        transition: 'all 0.8s ease',
        color: (isActive || isHovered) ? COLORS.lightText : 'rgba(203, 219, 252, 0.5)',
        justifyContent: isCollapsed ? 'center' : 'flex-start',
      }}
    >
      <span style={{ 
        fontSize: '1.1rem', 
        filter: isHovered || isActive ? 'none' : 'grayscale(100%) opacity(0.4)',
        transition: 'all 0.8s ease' 
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

      {/* LIGNE DYNAMIQUE DE L'ARTICLE - Toujours présente mais animée */}
      {!isCollapsed && (
        <span style={{
          position: 'absolute',
          bottom: '2px',
          left: '50%',
          transform: 'translateX(-50%)',
          // MODIFICATION : Transition de 0% à 60% pour l'effet de glissement
          width: (isActive || isHovered) ? '60%' : '0%',
          opacity: (isActive || isHovered) ? 1 : 0,
          height: '2px',
          background: `linear-gradient(to right, transparent, ${COLORS.purple}, transparent)`,
          transition: 'width 0.8s ease, opacity 0.8s ease',
          pointerEvents: 'none'
        }} />
      )}
    </Link>
  );
};

// --- COMPOSANT PRINCIPAL ---
export default function WikiSidebar({ categories }: { categories: any[] }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false); // État pour l'effet over du titre

  useEffect(() => {
    const width = window.innerWidth;
    setWindowWidth(width);
    setIsMounted(true);
    
    if (width < 1024) {
      setIsCollapsed(true);
    }

    const timer = setTimeout(() => setIsReady(true), 100);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  const isMobile = isMounted ? windowWidth < 1024 : false;

  const transitionStyle = (isReady && !isMobile) 
    ? 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.4s cubic-bezier(0.4, 0, 0.2, 1), padding 0.4s ease' 
    : (isReady && isMobile ? 'height 0.4s ease, padding 0.4s ease' : 'none');

  return (
    <aside style={{
      width: isMobile ? '100%' : (isCollapsed ? '80px' : '300px'),
      minWidth: isMobile ? '100%' : (isCollapsed ? '80px' : '300px'),
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile && isCollapsed ? '0' : '2.5rem',
      position: isMobile ? 'relative' : 'sticky',
      top: 0,
      height: isMobile ? (isCollapsed ? '50px' : 'auto') : '100vh',
      maxHeight: isMobile && !isCollapsed ? '70vh' : 'none',
      overflowY: isMobile && isCollapsed ? 'hidden' : 'auto',
      overflowX: 'hidden',
      backgroundColor: COLORS.almostBlack,
      borderRight: isMobile ? 'none' : `1px solid ${COLORS.cardBorder}`, 
      borderBottom: isMobile ? `1px solid ${COLORS.cardBorder}` : 'none',
      padding: isMobile 
        ? (isCollapsed ? '0.5rem 1.5rem' : '1.5rem') 
        : (isCollapsed ? '2.5rem 0.5rem' : '2.5rem 1.5rem'),
      zIndex: 20,
      transition: transitionStyle,
    }}>
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: isMobile ? 'absolute' : 'fixed',
          right: isMobile ? '1.5rem' : 'auto',
          left: isMobile ? 'auto' : (isCollapsed ? '64px' : '284px'),
          top: isMobile ? '10px' : '50%',
          transform: isMobile ? 'none' : 'translateY(-50%)',
          background: COLORS.almostBlack,
          border: `1px solid ${COLORS.cardBorder}`,
          color: COLORS.lightText,
          borderRadius: '50%',
          width: '30px', height: '30px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.4s ease',
          zIndex: 100,
        }}
      >
        {isMobile ? (isCollapsed ? '▼' : '▲') : (isCollapsed ? '›' : '‹')}
      </button>

      {/* TITRE WIKI AVEC EFFET OVER RESTAURÉ */}
      <div style={{ opacity: isCollapsed && isMobile ? 0.5 : 1, transition: 'opacity 0.3s' }}>
        {(!isCollapsed || isMobile) && (
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
              transition: 'color 0.8s ease',
              display: 'block',
              marginBottom: '0.5rem'
            }}
          >
            Documentation / Wiki
          </Link>
        )}
      </div>

      <nav style={{ 
        display: isMobile && isCollapsed ? 'none' : 'flex', 
        flexDirection: 'column', 
        gap: '2.5rem',
        marginTop: isMobile ? '1rem' : '0'
      }}>
        {categories.map((cat) => {
          const isCategoryActive = pathname.includes(`/wiki/${cat.id}`);
          return (
            <div key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: COLORS.lightText, position: 'relative', paddingBottom: isCollapsed ? '0' : '0.6rem' }}>
                <span style={{ fontSize: '1.3rem' }}>{cat.icon}</span>
                {!isCollapsed && <span style={{ fontWeight: '800', fontSize: '0.8rem', textTransform: 'uppercase' }}>{cat.title}</span>}
                
                {isCategoryActive && !isCollapsed && (
                  <div style={{ 
                    position: 'absolute', 
                    bottom: 0, 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    width: '75%', 
                    height: '2px', 
                    background: `linear-gradient(to right, transparent, ${COLORS.purple}, transparent)`, 
                    transition: 'width 0.8s ease, opacity 0.8s ease' 
                  }} />
                )}
              </div>

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