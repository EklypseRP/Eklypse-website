import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={{
      backgroundColor: 'rgba(28, 15, 38, 0.5)',
      borderTop: '1px solid rgba(104, 56, 146, 0.3)',
      padding: '2rem 0',
      textAlign: 'center'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <p style={{ color: 'rgba(203, 219, 252, 0.7)' }}>
          © 2026 Eklypse MMORPG. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;