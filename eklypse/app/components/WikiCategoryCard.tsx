'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  category: {
    id: string;
    title: string;
    icon: string;
    articles: any[];
  };
}

export default function WikiCategoryCard({ category }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={`/wiki/${category.id}`}
      style={{ textDecoration: 'none' }}
    >
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          // --- COULEURS ET EFFETS REPRIS DES PAGES ARTICLES ---
          background: 'rgba(104, 56, 146, 0.2)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? 'rgba(104, 56, 146, 0.5)' : 'rgba(104, 56, 146, 0.2)'}`,
          borderRadius: '16px',
          padding: '2rem',
          // ----------------------------------------------------
          
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.5), 0 0 15px rgba(104, 56, 146, 0.1)' : 'none',
        }}
      >
        {/* CONTENEUR ICÔNE + TITRE ALIGNÉS */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.2rem', 
          marginBottom: '0.8rem' 
        }}>
          <span style={{ 
            fontSize: '2.5rem', 
            filter: 'drop-shadow(0 0 10px rgba(104, 56, 146, 0.3))',
            lineHeight: 1
          }}>
            {category.icon}
          </span>
          
          <h2 style={{ 
            color: 'rgb(203, 219, 252)', 
            fontSize: '1.4rem', 
            fontWeight: '700', 
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: 0,
            lineHeight: 1
          }}>
            {category.title}
          </h2>
        </div>
        
        {/* COMPTEUR D'ARTICLES */}
        <p style={{ 
          color: 'rgba(203, 219, 252, 0.3)', 
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          margin: 0
        }}>
          {category.articles.length} article{category.articles.length > 1 ? 's' : ''}
        </p>

        {/* LIGNE DÉCORATIVE STYLE HEADER AU SURVOL */}
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: isHovered ? '60px' : '0px',
          height: '2px',
          background: 'linear-gradient(to right, transparent, #683892, transparent)',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </Link>
  );
}