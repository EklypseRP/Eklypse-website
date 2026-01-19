import React from 'react';
import { getAllWikiData } from '@/lib/wiki';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';

// Couleurs pour le style de la page
const COLORS = {
  purple: '#683892',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
  cardBg: 'rgba(50, 27, 70, 0.5)',
};

// Interface pour les paramètres de la page (Next.js 15/16)
interface PageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

/**
 * Page de l'article de lore (Server Component)
 * Ce composant est asynchrone pour lire les fichiers Markdown via fs dans lib/wiki.ts
 */
export default async function ArticlePage(props: PageProps) {
  // Résolution des paramètres asynchrones
  const params = await props.params;
  const { category, slug } = params;
  
  // Récupération des données depuis le système de fichiers
  const allArticles = getAllWikiData();
  const article = allArticles.find(a => a.category === category && a.slug === slug);

  // Si l'article n'existe pas
  if (!article) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem', color: '#CBDBFC' }}>
        <h2>Article non trouvé.</h2>
        <a
          href={`/wiki/${category}`}
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            color: '#CBDBFC',
            background: 'transparent',
            border: `1px solid ${COLORS.cardBorder}`,
            padding: '0.5rem 0.75rem',
            borderRadius: '0.375rem',
            textDecoration: 'none'
          }}
        >
          Retour à la liste
        </a>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Bouton de retour interactif */}
      <a
        href={`/wiki/${category}`}
        style={{
          display: 'inline-block',
          margin: '1rem 0',
          color: '#CBDBFC',
          background: 'transparent',
          border: `1px solid ${COLORS.cardBorder}`,
          padding: '0.5rem 0.75rem',
          borderRadius: '0.375rem',
          textDecoration: 'none'
        }}
      >
        Retour à la liste
      </a>

      {/* Conteneur de l'article avec le style original */}
      <div style={{
        background: COLORS.cardBg,
        backdropFilter: 'blur(8px)',
        borderRadius: '0.6rem',
        padding: 'clamp(1.5rem, 3vw, 3rem)',
        border: `1px solid ${COLORS.cardBorder}`,
        marginBottom: '4rem'
      }}>
        {/* Rendu du contenu Markdown */}
        <MarkdownRenderer content={article.content} />
        
        {/* Date de mise à jour */}
        {article.lastUpdated && (
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '1.2rem',
            borderTop: `1px solid ${COLORS.cardBorder}`,
            fontSize: '0.9rem',
            color: 'rgba(203, 219, 252, 0.6)'
          }}>
            Dernière mise à jour : {article.lastUpdated}
          </div>
        )}
      </div>
    </div>
  );
}