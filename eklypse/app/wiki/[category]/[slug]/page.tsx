import React from 'react';
import { getAllWikiData } from '@/lib/wiki';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import { BackButton } from '@/app/wiki/WikiClientComponents';

export default async function ArticlePage({ 
  params 
}: { 
  params: Promise<{ category: string, slug: string }> 
}) {
  const { category, slug } = await params;
  
  const allArticles = getAllWikiData();
  
  // Recherche l'article (que l'extension soit .md ou .markdown, le slug est le même)
  const article = allArticles.find(
    (a) => a.category === category && a.slug === slug
  );

  if (!article) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1rem', textAlign: 'center' }}>
        <h2 style={{ color: '#CBDBFC', marginBottom: '2rem' }}>Article introuvable</h2>
        <BackButton href="/wiki" label="Retour au Wiki" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      
      <BackButton href={`/wiki/${category}`} label="Retour à la liste" />
      
      <article style={{
        // Utilisation de la couleur la plus sombre du gradient
        background: 'rgba(10, 6, 18, 0.9)', 
        backdropFilter: 'blur(12px)',
        padding: 'clamp(1.5rem, 5vw, 4rem)', 
        borderRadius: '1rem',
        border: '1px solid rgba(104, 56, 146, 0.2)',
        marginBottom: '4rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        width: '100%'
      }}>
        
        <MarkdownRenderer content={article.content} />
        
        {article.lastUpdated && (
          <div style={{ 
            marginTop: '3rem', 
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(104, 56, 146, 0.2)',
            fontSize: '0.9rem', 
            color: 'rgba(203, 219, 252, 0.5)',
            fontStyle: 'italic'
          }}>
            Dernière mise à jour : {article.lastUpdated}
          </div>
        )}
      </article>
    </div>
  );
}