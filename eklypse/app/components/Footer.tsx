'use client';

import React from 'react';

const COLORS = {
  purple: '#683892',
  lightText: '#CBDBFC',
};

const Footer: React.FC = () => {
  return (
    <footer style={{
      // Retour à la couleur de base originale
      backgroundColor: 'rgba(28, 15, 38, 0.5)',
      borderTop: '1px solid rgba(104, 56, 146, 0.3)',
      padding: '2rem 0',
      textAlign: 'center',
      position: 'relative',
      zIndex: 10,
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        
        {/* Ligne décorative dégradée conservée */}
        <div style={{
          width: '60px',
          height: '2px',
          background: `linear-gradient(to right, transparent, ${COLORS.purple}, transparent)`,
          margin: '0 auto 1.5rem',
        }} />

        <p style={{ 
          color: 'rgba(203, 219, 252, 0.7)',
          fontSize: '0.9rem',
          fontWeight: '500',
          letterSpacing: '0.05em'
        }}>
          © 2026 EKLYPSE MMORPG. TOUS DROITS RÉSERVÉS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;