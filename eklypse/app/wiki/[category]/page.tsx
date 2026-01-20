import React from 'react';
import { getAllWikiData } from '@/lib/wiki';
import { ArticleCard, BackButton } from '../WikiClientComponents';
import WikiSidebar from '@/app/components/WikiSidebar';

const DARK_BG = '#0A0612';

export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ category: string }> 
}) {
  const { category: categoryId } = await params;
  const allArticles = getAllWikiData();
  const categoryArticles = allArticles.filter(a => a.category === categoryId);

  const categoryIds = Array.from(new Set(allArticles.map(a => a.category)));
  const categoriesData = categoryIds.map(id => {
    const articlesInCat = allArticles.filter(a => a.category === id);
    const catIcon = articlesInCat.find(a => a.categoryIcon)?.categoryIcon || '📁';
    return {
      id,
      title: id.charAt(0).toUpperCase() + id.slice(1),
      icon: catIcon,
      articles: articlesInCat.map(a => ({ slug: a.slug, title: a.title, icon: a.icon }))
    };
  });

  const categoryTitle = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
  const categoryIcon = categoryArticles[0]?.categoryIcon || '📚';

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'inherit',
      flex: 1,
      backgroundColor: DARK_BG, 
      color: '#CBDBFC',
      position: 'relative',
    }}>
      <WikiSidebar categories={categoriesData} />

      <main style={{ 
        flex: 1, 
        padding: '3rem clamp(1rem, 5vw, 4rem) 6rem', 
        position: 'relative'
      }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '2.5rem' }}>
          <BackButton href="/wiki" label="Retour aux catégories" />
          <nav style={{ 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.2)', 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase',
            marginLeft: '0.2rem'
          }}>
            WIKI / <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{categoryId}</span>
          </nav>
        </div>

        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '3.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 15px rgba(104, 56, 146, 0.4))' }}>
              {categoryIcon}
            </span>
            <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3.5rem)', fontWeight: '900', color: 'rgb(203, 219, 252)', textTransform: 'uppercase', margin: 0 }}>
              {categoryTitle}
            </h1>
          </div>
          <div style={{ height: '3px', width: '80px', background: 'linear-gradient(to right, transparent, #683892, transparent)', marginBottom: '1rem' }} />
        </header>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', 
          gap: '2rem', 
          maxWidth: '1200px', 
          margin: '0 auto' 
        }}>
          {categoryArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </main>
    </div>
  );
}