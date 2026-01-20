'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const COLORS = {
  purple: '#683892',
  lightText: '#CBDBFC',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
  almostBlack: '#0A0612',
};

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth > 1024) setIsMobileMenuOpen(false);
    };
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isMobile = windowWidth < 1024;

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
      padding: isMobile ? '0.5rem 1.5rem' : '0.75rem 2rem',
      backgroundColor: (isScrolled || isMobileMenuOpen) ? 'rgba(10, 6, 18, 0.98)' : 'rgba(10, 6, 18, 0.4)', 
      backdropFilter: 'blur(12px)',
      borderBottom: `0.5px solid ${(isScrolled || isMobileMenuOpen) ? COLORS.cardBorder : 'rgba(104, 56, 146, 0.1)'}`,
      transition: 'background-color 0.4s ease',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/Eklypse.png" 
            alt="Logo Eklypse" 
            width={120} 
            height={40}
            style={{ 
              height: isMobile ? '55px' : '80px', 
              width: 'auto',
              objectFit: 'contain'
            }}
            priority 
          />
        </Link>
      </div>

      {!isMobile && (
        <nav style={{ 
          display: 'flex', 
          gap: '2.5rem',
          alignItems: 'center',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          {navItems.map((item) => (
            <NavLink 
              key={item.href} 
              href={item.href} 
              label={item.label} 
              isActive={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)} 
            />
          ))}
        </nav>
      )}

      {isMobile && (
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: COLORS.lightText,
            fontSize: '1.8rem',
            cursor: 'pointer',
            padding: '0.5rem',
            zIndex: 110
          }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      )}

      {!isMobile && <div style={{ flex: 1 }} />}

      {isMobile && isMobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'rgba(10, 6, 18, 0.98)',
          borderBottom: `1px solid ${COLORS.cardBorder}`,
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          animation: 'slideDown 0.3s ease-out'
        }}>
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                color: (pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))) ? COLORS.lightText : 'rgba(203, 219, 252, 0.65)',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                padding: '0.75rem 0',
                borderBottom: '1px solid rgba(104, 56, 146, 0.1)'
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
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
        transition: 'color 0.3s ease',
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