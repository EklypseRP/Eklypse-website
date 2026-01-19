import React from 'react';
import { getDynamicCategories, getAllWikiData } from '@/lib/wiki';
import { CategoryCard } from '@/app/wiki/WikiClientComponents';

export default async function WikiPage() {
  const categories = getDynamicCategories();
  const allArticles = getAllWikiData();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(to right, #CBDBFC, #683892)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          Wiki d'Eklypse
        </h1>
        <p style={{ color: 'rgba(203, 219, 252, 0.8)', fontSize: '1.125rem' }}>
          Explorez l'univers dynamique d'Eklypse.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {categories.map(cat => (
          <CategoryCard
            key={cat.id}
            category={cat}
            articleCount={allArticles.filter(a => a.category === cat.id).length}
          />
        ))}
      </div>
    </div>
  );
}