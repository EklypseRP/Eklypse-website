import React from 'react';
import { getWikiTree, formatTitle } from '@/lib/wiki';
import { CategoryCard } from './WikiClientComponents';
import WikiSidebar from '@/app/components/WikiSidebar';
import WikiCategoryCard from '@/app/components/WikiCategoryCard';

const DARK_BG = '#0A0612';

// On utilise EXACTEMENT la même animation pour la cohérence
const FADE_IN_ANIMATION = `
  @keyframes wikiFadeIn {
    from { 
      opacity: 0; 
      transform: translateY(4px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;

export default async function WikiPage() {
  const tree = getWikiTree();
  // On récupère les dossiers racines pour les cartes de l'accueil
  const rootCategories = tree.filter(node => node.type === 'folder');

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      backgroundColor: DARK_BG, 
      color: '#CBDBFC', 
      width: '100%' 
    }}>
      {/* Injection de l'animation CSS */}
      <style dangerouslySetInnerHTML={{ __html: FADE_IN_ANIMATION }} />
      
      <WikiSidebar tree={tree} />
      
      <main style={{ 
        flex: 1, 
        minWidth: 0, 
        padding: '1.5rem clamp(1rem, 5vw, 4rem) 4rem',
        // Application de la transition douce
        animation: 'wikiFadeIn 0.8s ease-in-out forwards'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ 
              fontSize: 'clamp(2rem, 5vw, 3.5rem)', 
              fontWeight: '900', 
              letterSpacing: '0.15em',
              marginBottom: '0.5rem' 
            }}>
              ARCHIVES EKLYPSE
            </h1>
            <div style={{ 
              height: '3px', 
              width: '80px', 
              background: 'linear-gradient(to right, transparent, #683892, transparent)', 
              margin: '0 auto' 
            }} />
            <p style={{ 
              color: 'rgba(203, 219, 252, 0.5)', 
              marginTop: '1rem',
              fontSize: '1rem'
            }}>
              Explorez les secrets et l'histoire de notre monde
            </p>
          </header>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
            gap: '2.5rem' 
          }}>
            {rootCategories.map((cat) => (
              <WikiCategoryCard 
                key={cat.path} 
                category={{ 
                  id: cat.path, 
                  name: cat.title, 
                  icon: cat.icon,
                  articleCount: cat.children?.filter(c => c.type === 'file').length || 0,
                  subFolderCount: cat.children?.filter(c => c.type === 'folder').length || 0
                }} 
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}