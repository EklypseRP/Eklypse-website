'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon: string;
    type?: 'folder' | 'file'; // On ajoute le type ici
    articleCount?: number;
    subFolderCount?: number;
  };
}

export default function WikiCategoryCard({ category }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  // On considère que c'est un dossier si le type est 'folder' ou s'il y a un articleCount défini
  const isFolder = category.type === 'folder' || category.articleCount !== undefined;

  return (
    <Link href={`/wiki/${category.id}`} style={{ textDecoration: 'none' }}>
      <div 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: 'rgba(104, 56, 146, 0.2)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${isHovered ? 'rgba(104, 56, 146, 0.5)' : 'rgba(104, 56, 146, 0.2)'}`,
          borderRadius: '16px',
          padding: '2rem',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          position: 'relative',
          transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 25px 50px rgba(0,0,0,0.5), 0 0 15px rgba(104, 56, 146, 0.1)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '0.8rem' }}>
          <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 10px rgba(104, 56, 146, 0.3))' }}>
            {category.icon}
          </span>
          
          <h2 style={{ 
            color: 'rgb(203, 219, 252)', 
            fontSize: '1.4rem', 
            fontWeight: '700', 
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            margin: 0 
          }}>
            {category.name}
          </h2>
        </div>
        
        {/* AFFICHAGE CONDITIONNEL : Seulement pour les dossiers */}
        {isFolder && (
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <p style={{ color: 'rgba(203, 219, 252, 0.3)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              {category.articleCount || 0} article{(category.articleCount || 0) > 1 ? 's' : ''}
            </p>
            {category.subFolderCount ? (
              <p style={{ color: '#683892', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                • {category.subFolderCount} dossier{category.subFolderCount > 1 ? 's' : ''}
              </p>
            ) : null}
          </div>
        )}

        <div style={{
          position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)',
          width: isHovered ? '60px' : '0px', height: '2px',
          background: 'linear-gradient(to right, transparent, #683892, transparent)',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </Link>
  );
}