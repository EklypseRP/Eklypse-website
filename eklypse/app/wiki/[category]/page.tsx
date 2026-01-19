import React from 'react';
import { getAllWikiData, getDynamicCategories } from '@/lib/wiki';
import { ArticleCard } from '@/app/wiki/WikiClientComponents';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  
  const allArticles = getAllWikiData();
  const articles = allArticles.filter(a => a.category === category);
  
  // Récupère les infos de la catégorie de façon dynamique
  const currentCat = getDynamicCategories().find(c => c.id === category);
  
  const title = currentCat?.name || category;
  const icon = currentCat?.icon || "📁";

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      <a href="/wiki" style={{ display: 'inline-block', marginBottom: '1rem', color: '#CBDBFC', textDecoration: 'none', fontWeight: 600 }}>
        ← Retour aux catégories
      </a>

      <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', marginBottom: '2rem', color: '#CBDBFC' }}>
        {icon} {title}
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.8rem'
      }}>
        {articles.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}