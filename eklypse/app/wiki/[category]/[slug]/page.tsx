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
  
  // Récupération de toutes les données du wiki
  const allArticles = getAllWikiData();
  
  // Recherche de l'article correspondant à la catégorie et au slug
  const article = allArticles.find(
    (a) => a.category === category && a.slug === slug
  );

  // Gestion du cas où l'article n'existe pas
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
      
      {/* Bouton retour vers la liste de la catégorie */}
      <BackButton href={`/wiki/${category}`} label="Retour à la liste" />
      
      <article style={{
        background: 'rgba(50, 27, 70, 0.4)',
        backdropFilter: 'blur(10px)',
        // Padding adaptatif : plus grand sur PC (4rem) pour plus de confort
        padding: 'clamp(1.5rem, 5vw, 4rem)', 
        borderRadius: '1rem',
        border: '1px solid rgba(104, 56, 146, 0.3)',
        marginBottom: '4rem',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
        width: '100%'
      }}>
        
        {/* Rendu dynamique du contenu Markdown */}
        <MarkdownRenderer content={article.content} />
        
        {/* Pied de page de l'article : Date de mise à jour */}
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