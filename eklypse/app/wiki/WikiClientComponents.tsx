'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const COLORS = {
  purple: '#683892',
  lightText: '#CBDBFC',
  cardBg: 'rgba(50, 27, 70, 0.5)',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
};

// Icône de flèche pour le bouton retour
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

/**
 * COMPOSANT : BackButton
 * Doit impérativement avoir "export" devant "function"
 */
export function BackButton({ href, label }: { href: string; label: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      href={href} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: isHovered ? COLORS.purple : COLORS.lightText,
        textDecoration: 'none',
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '2rem',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
    >
      <BackIcon />
      {label}
    </Link>
  );
}

export function CategoryCard({ category, articleCount }: { category: any, articleCount: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href={`/wiki/${category.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: COLORS.cardBg,
          backdropFilter: 'blur(8px)',
          borderRadius: '0.5rem',
          padding: '2rem',
          border: `1px solid ${isHovered ? COLORS.purple : COLORS.cardBorder}`,
          cursor: 'pointer',
          transition: 'all 0.3s',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 10px 20px rgba(104, 56, 146, 0.2)' : 'none',
          height: '100%'
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{category.icon}</div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: COLORS.lightText }}>
          {category.name}
        </h3>
        <p style={{ color: 'rgba(203, 219, 252, 0.7)', marginBottom: '1rem', fontSize: '0.95rem' }}>
          {category.description}
        </p>
        <div style={{ fontSize: '0.875rem', color: COLORS.purple, fontWeight: '600' }}>
          {articleCount} article{articleCount > 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  );
}

export function ArticleCard({ article }: { article: any }) {
  const [isHovered, setIsHovered] = useState(false);
  // Nettoyage sommaire du Markdown pour l'aperçu
  const preview = article.content.replace(/[#*>\-\d\.]/g, '').substring(0, 150) + '...';

  return (
    <Link href={`/wiki/${article.category}/${article.slug}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: COLORS.cardBg,
          backdropFilter: 'blur(8px)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          border: `1px solid ${isHovered ? COLORS.purple : COLORS.cardBorder}`,
          transition: 'all 0.3s',
          transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 10px 20px rgba(104, 56, 146, 0.2)' : 'none',
          height: '100%'
        }}
      >
        <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem', color: COLORS.lightText }}>
            {article.icon && <span>{article.icon}</span>} {/* Utilise 'icon', pas 'categoryIcon' */}
            {article.title}
        </h4>
        <p style={{ color: 'rgba(203, 219, 252, 0.7)', fontSize: '0.9rem', lineHeight: '1.5' }}>
          {preview}
        </p>
      </div>
    </Link>
  );
}