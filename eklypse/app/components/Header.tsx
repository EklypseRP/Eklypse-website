'use client';

import React, { useState } from 'react';

// Lucide React icons as inline SVG components
const Menu = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const X = ({ style }: { style?: React.CSSProperties }) => (
  <svg style={style} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface HeaderProps {
  currentPage: 'home' | 'lore';
  onNavigate: (page: 'home' | 'lore') => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigation = (page: 'home' | 'lore') => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      backgroundColor: 'rgba(28, 15, 38, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(104, 56, 146, 0.3)'
    }}>
      <nav style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => handleNavigation('home')}>
            <img 
              src="/Eklypse.png" 
              alt="Eklypse Logo" 
              style={{ width: '48px', height: '48px', objectFit: 'contain' }}
            />
          </div>

          {/* Desktop Navigation */}
          <div style={{ display: 'none', gap: '2rem', alignItems: 'center' }} className="md:flex">
            <button
              onClick={() => handleNavigation('home')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'home' ? '#683892' : '#CBDBFC',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'color 0.3s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#683892')}
              onMouseOut={(e) => (e.currentTarget.style.color = currentPage === 'home' ? '#683892' : '#CBDBFC')}
            >
              Accueil
            </button>
            <button
              onClick={() => handleNavigation('lore')}
              style={{
                background: 'none',
                border: 'none',
                color: currentPage === 'lore' ? '#683892' : '#CBDBFC',
                cursor: 'pointer',
                fontSize: '1rem',
                transition: 'color 0.3s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = '#683892')}
              onMouseOut={(e) => (e.currentTarget.style.color = currentPage === 'lore' ? '#683892' : '#CBDBFC')}
            >
              Histoire & Détails
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            style={{
              background: 'none',
              border: 'none',
              color: '#CBDBFC',
              cursor: 'pointer'
            }}
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div style={{ marginTop: '1rem', paddingBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button
              onClick={() => handleNavigation('home')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: currentPage === 'home' ? 'rgba(104, 56, 146, 0.3)' : 'transparent',
                color: currentPage === 'home' ? '#683892' : '#CBDBFC',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              Accueil
            </button>
            <button
              onClick={() => handleNavigation('lore')}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                backgroundColor: currentPage === 'lore' ? 'rgba(104, 56, 146, 0.3)' : 'transparent',
                color: currentPage === 'lore' ? '#683892' : '#CBDBFC',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
            >
              Histoire & Détails
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;