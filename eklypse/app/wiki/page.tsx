import React from 'react';
import { getAllWikiData } from '@/lib/wiki';
import WikiSidebar from '@/app/components/WikiSidebar';
import WikiCategoryCard from '@/app/components/WikiCategoryCard';

const DARK_BG = '#0A0612';

export default async function WikiPage() {
  const allArticles = getAllWikiData();
  
  const categoryIds = Array.from(new Set(allArticles.map(a => a.category)));
  const categoriesData = categoryIds.map(id => {
    const articlesInCat = allArticles.filter(a => a.category === id);
    const catIcon = articlesInCat.find(a => a.categoryIcon)?.categoryIcon || '📁';
    
    return {
      id,
      title: id.charAt(0).toUpperCase() + id.slice(1),
      icon: catIcon,
      articles: articlesInCat.map(a => ({
        slug: a.slug,
        title: a.title,
        icon: a.icon
      }))
    };
  });

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'inherit',
      flex: 1,
      backgroundColor: DARK_BG, 
      color: '#CBDBFC',
      position: 'relative'
    }}>
      <WikiSidebar categories={categoriesData} />

      <main style={{ 
        flex: 1, 
        padding: '3rem clamp(1rem, 5vw, 4rem) 4rem',
        position: 'relative'
      }}>
        
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ 
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '600', 
            color: 'rgb(203, 219, 252)',
            letterSpacing: '0.15em',
            marginBottom: '1rem'
          }}>
            Wiki d'Eklypse
          </h2>
          <div style={{ 
            height: '3px', 
            width: '80px', 
            background: 'linear-gradient(to right, transparent, #683892, transparent)', 
            margin: '0 auto' 
          }} />
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {categoriesData.map((category) => (
            <WikiCategoryCard key={category.id} category={category} />
          ))}
        </div>
      </main>
    </div>
  );
}