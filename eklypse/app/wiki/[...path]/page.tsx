import type { Metadata } from 'next';
import React from 'react';
import { getWikiTree, getWikiContent, formatTitle, WikiNode } from '@/lib/wiki';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import WikiSidebar from '@/app/components/WikiSidebar';
import { ArticleCard, CategoryCard, BackButton } from '../WikiClientComponents';

// Animation assouplie : mouvement réduit (4px au lieu de 8px) et durée plus longue
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

// Génération dynamique du SEO pour chaque page du Wiki
export async function generateMetadata({ params }: { params: Promise<{ path: string[] }> }): Promise<Metadata> {
  const { path: pathSegments } = await params;
  const contentData = getWikiContent(pathSegments);
  
  if (!contentData) {
    return { title: 'Page introuvable' };
  }

  const { data } = contentData;
  const title = data.title || formatTitle(pathSegments[pathSegments.length - 1]);
  const description = data.description || `Découvrez l'histoire et les secrets de ${title} sur le wiki officiel d'Eklypse, notre serveur Minecraft MMORPG.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: `${title} | Wiki Eklypse`,
      description: description,
      type: 'article',
    },
  };
}

export default async function WikiDynamicPage({ params }: { params: Promise<{ path: string[] }> }) {
  const { path: pathSegments } = await params;
  const tree = getWikiTree(); 
  const contentData = getWikiContent(pathSegments);
  
  if (!contentData) return <div>Contenu introuvable</div>;

  const { data, content, type } = contentData;
  const fullPath = pathSegments.join('/');

  const findChildren = (nodes: WikiNode[], targetPath: string): WikiNode[] => {
    for (const node of nodes) {
      if (node.path === targetPath) return node.children || [];
      if (node.children) {
        const found = findChildren(node.children, targetPath);
        if (found.length > 0) return found;
      }
    }
    return [];
  };

  const children = findChildren(tree, fullPath);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0A0612', color: '#CBDBFC', width: '100%' }}>
      <style dangerouslySetInnerHTML={{ __html: FADE_IN_ANIMATION }} />
      
      <WikiSidebar tree={tree} />
      
      <main style={{ 
        flex: 1, 
        minWidth: 0, 
        padding: '1.5rem clamp(1rem, 5vw, 4rem) 6rem',
        // Transition plus lente (0.8s) et courbe ease-in-out pour plus de douceur
        animation: 'wikiFadeIn 0.8s ease-in-out forwards'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
            <BackButton 
              href={pathSegments.length > 1 ? `/wiki/${pathSegments.slice(0, -1).join('/')}` : "/wiki"} 
              label="Retour" 
            />
            <nav style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              WIKI / {pathSegments.slice(0, -1).map((s, i) => (
                <span key={i}>{formatTitle(s)} / </span>
              ))}
              <span style={{ color: 'rgba(203, 219, 252, 0.5)' }}>{data.title || formatTitle(pathSegments[pathSegments.length - 1])}</span>
            </nav>
          </div>

          {(type === 'file' || content) ? (
            <article style={{ 
              width: '100%', 
              background: 'rgba(255, 255, 255, 0.02)', 
              backdropFilter: 'blur(20px)', 
              padding: 'clamp(1.5rem, 5vw, 3rem)', 
              borderRadius: '12px', 
              border: '1px solid rgba(104, 56, 146, 0.2)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <span style={{ fontSize: '3.5rem' }}>{data.icon || (type === 'file' ? '📜' : '📁')}</span>
                <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: '900', margin: 0 }}>{data.title || formatTitle(pathSegments[pathSegments.length - 1])}</h1>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(104, 56, 146, 0.2)', marginBottom: '2rem' }} />
              <MarkdownRenderer content={content} />
            </article>
          ) : null}

          {children.length > 0 && (
            <div style={{ 
              marginTop: content ? '3rem' : '0', 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
              gap: '2rem' 
            }}>
              {children.map((child) => (
                child.type === 'folder' ? (
                  <CategoryCard 
                    key={child.path} 
                    category={{ id: child.path, name: child.title, icon: child.icon }} 
                    articleCount={child.children?.filter(c => c.type === 'file').length || 0}
                    subFolderCount={child.children?.filter(c => c.type === 'folder').length || 0}
                  />
                ) : (
                  <ArticleCard 
                    key={child.path} 
                    article={{ slug: child.name, category: fullPath, title: child.title, icon: child.icon }} 
                  />
                )
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}