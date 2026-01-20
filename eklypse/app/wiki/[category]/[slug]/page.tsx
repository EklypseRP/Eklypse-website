import React from 'react';
import { getAllWikiData } from '@/lib/wiki';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import WikiSidebar from '@/app/components/WikiSidebar';
import { BackButton } from '@/app/wiki/WikiClientComponents';

const DARK_BG = '#0A0612'; // Couleur constante foncée

export default async function ArticlePage({ params }: { params: Promise<{ category: string, slug: string }> }) {
  const { category: currentCategory, slug: currentSlug } = await params;
  const allArticles = getAllWikiData();
  const article = allArticles.find((a) => a.category === currentCategory && a.slug === currentSlug);

  // --- LOGIQUE DYNAMIQUE POUR LA SIDEBAR ---
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

  if (!article) return <div style={{ textAlign: 'center', padding: '5rem', color: '#CBDBFC' }}>Article introuvable</div>;

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'stretch', 
      minHeight: '100vh',
      backgroundColor: DARK_BG, 
      color: '#CBDBFC',
      position: 'relative',
      // Supprime les espaces entre le layout et le header/footer
      marginTop: '-2rem', 
      marginBottom: '-4rem',
    }}>
      
      {/* SIDEBAR : Fusionnée avec le header et footer */}
      <WikiSidebar categories={categoriesData} />

      {/* ZONE DE CONTENU PRINCIPALE */}
      <main style={{ 
        flex: 1, 
        // Padding-top ajusté à 4rem pour aligner le BackButton avec les autres pages
        padding: '4rem clamp(1rem, 5vw, 4rem) 6rem',
        position: 'relative'
      }}>
        
        {/* NAVIGATION HAUTE ALIGNÉE */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '3rem' }}>
          <BackButton href={`/wiki/${currentCategory}`} label="Retour à la liste" />
          <nav style={{ 
            fontSize: '0.75rem', 
            color: 'rgba(255, 255, 255, 0.2)', 
            letterSpacing: '0.15em', 
            textTransform: 'uppercase',
            marginLeft: '0.2rem'
          }}>
            WIKI / <span style={{ color: 'rgba(255, 255, 255, 0.5)' }}>{currentCategory}</span>
          </nav>
        </div>

        {/* BLOC ARTICLE */}
        <article style={{
          maxWidth: '1000px',
          background: 'rgba(255, 255, 255, 0.02)', // Fond subtil pour détacher l'article
          backdropFilter: 'blur(20px)',
          padding: 'clamp(2rem, 5vw, 4rem)',
          borderRadius: '12px',
          border: '1px solid rgba(104, 56, 146, 0.2)',
          boxShadow: '0 30px 60px rgba(0, 0, 0, 0.4)',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.8rem', marginBottom: '3rem' }}>
             <span style={{ fontSize: '3.8rem', filter: 'drop-shadow(0 0 15px rgba(104, 56, 146, 0.4))' }}>
                {article.icon || '📜'}
             </span>
             <div>
                <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)', fontWeight: '900', color: '#CBDBFC', margin: 0 }}>
                  {article.title}
                </h1>
                <p style={{ color: 'rgba(203, 219, 252, 0.3)', marginTop: '0.5rem', fontSize: '0.85rem', letterSpacing: '0.1em' }}>
                  ARCHIVES MISES À JOUR : {article.lastUpdated}
                </p>
             </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(104, 56, 146, 0.2)', marginBottom: '3.5rem' }} />
          
          <MarkdownRenderer content={article.content} />
          
        </article>
      </main>
    </div>
  );
}