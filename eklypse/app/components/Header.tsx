'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// On utilise les constantes de couleurs basées sur votre page.tsx
const COLORS = {
  purple: '#683892',
  lightText: '#CBDBFC',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
  almostBlack: '#0A0612', // Noir profond original
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Accueil' },
    { href: '/wiki', label: 'Wiki' },
  ];

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: '0.75rem 2rem',
      
      /* --- MODIFICATION : Fond plus sombre pour la séparation --- */
      // On utilise 0.98 d'opacité pour un effet presque plein, avec un léger flou
      backgroundColor: isScrolled ? 'rgba(10, 6, 18, 0.98)' : 'rgba(10, 6, 18, 0.4)', 
      backdropFilter: 'blur(12px)',
      // Bordure toujours visible mais plus marquée lors du scroll
      borderBottom: `0.5px solid ${isScrolled ? COLORS.cardBorder : 'rgba(104, 56, 146, 0.1)'}`,
      /* ----------------------------------------------------------- */
      
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center'
    }}>
      
      {/* Logo Image à Gauche */}
      <div style={{ justifySelf: 'start' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/Eklypse.png" 
            alt="Logo Eklypse" 
            width={120} 
            height={40}
            style={{ 
              height: '80px', 
              width: 'auto',
              objectFit: 'contain'
            }}
            priority 
          />
        </Link>
      </div>

      {/* Navigation au Centre */}
      <nav style={{ 
        display: 'flex', 
        gap: '2.5rem',
        alignItems: 'center',
        justifySelf: 'center' 
      }}>
        {navItems.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href);

          return (
            <NavLink 
              key={item.href} 
              href={item.href} 
              label={item.label} 
              isActive={isActive} 
            />
          );
        })}
      </nav>

      {/* Colonne de droite vide pour maintenir l'équilibre du centrage */}
      <div style={{ justifySelf: 'end' }} />

    </header>
  );
};

const NavLink = ({ href, label, isActive }: { href: string, label: string, isActive: boolean }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={href}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        textDecoration: 'none',
        color: (isActive || isHovered) ? COLORS.lightText : 'rgba(203, 219, 252, 0.65)',
        fontWeight: '600',
        fontSize: '0.9rem',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        position: 'relative',
        transition: 'all 0.3s ease',
        padding: '0.5rem 0'
      }}
    >
      {label}
      <span style={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        width: (isActive || isHovered) ? '100%' : '0%',
        height: '2px',
        background: `linear-gradient(to right, transparent, ${COLORS.purple}, transparent)`,
        transform: 'translateX(-50%)',
        transition: 'width 0.3s ease',
        opacity: (isActive || isHovered) ? 1 : 0
      }} />
    </Link>
  );
};

export default Header;