'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const COLORS = {
  purple: '#683892',
  lightText: '#CBDBFC',
  cardBg: 'rgba(50, 27, 70, 0.5)',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
};

export function BackButton({ href, label }: { href: string; label: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link href={href} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        color: isHovered ? COLORS.purple : COLORS.lightText, 
        textDecoration: 'none', 
        fontSize: '1rem', 
        fontWeight: '600', 
        marginBottom: '2rem', 
        transition: 'all 0.3s ease' 
      }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
      {label}
    </Link>
  );
}

export function CategoryCard({ category, articleCount, subFolderCount }: { category: any, articleCount: number, subFolderCount?: number }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link href={`/wiki/${category.id}`} style={{ textDecoration: 'none' }}>
      <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        style={{ 
          background: COLORS.cardBg, 
          backdropFilter: 'blur(8px)', 
          borderRadius: '0.5rem', 
          padding: '2rem', 
          border: `1px solid ${isHovered ? COLORS.purple : COLORS.cardBorder}`, 
          transition: 'all 0.3s', 
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{category.icon}</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: COLORS.lightText, flex: 1 }}>{category.name}</h3>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: COLORS.purple, fontWeight: '600', textTransform: 'uppercase' }}>
            {articleCount} article{articleCount > 1 ? 's' : ''}
          </div>
          {subFolderCount && subFolderCount > 0 ? (
            <div style={{ fontSize: '0.8rem', color: 'rgba(203, 219, 252, 0.4)', fontWeight: '600', textTransform: 'uppercase' }}>
              • {subFolderCount} dossier{subFolderCount > 1 ? 's' : ''}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function ArticleCard({ article }: { article: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const fullPath = article.category ? `${article.category}/${article.slug}` : article.slug;

  return (
    <Link href={`/wiki/${fullPath}`} style={{ textDecoration: 'none' }}>
      <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
        style={{ 
          background: COLORS.cardBg, 
          backdropFilter: 'blur(8px)', 
          borderRadius: '0.5rem', 
          padding: '1.5rem', 
          border: `1px solid ${isHovered ? COLORS.purple : COLORS.cardBorder}`, 
          transition: 'all 0.3s', 
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)', 
          height: '100%',
          display: 'flex',
          alignItems: 'center' // Centre verticalement l'icône et le titre
        }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          margin: 0, // Retrait de la marge basse puisqu'il n'y a plus de texte dessous
          color: COLORS.lightText 
        }}>
          {article.icon && <span style={{ marginRight: '0.75rem' }}>{article.icon}</span>}
          {article.title}
        </h3>
      </div>
    </Link>
  );
}