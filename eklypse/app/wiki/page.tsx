import React from 'react';
import Link from 'next/link';
import { getWikiTreeFromDB, WikiTreeNode } from '@/lib/wiki-db';
import WikiSidebar from '@/app/components/WikiSidebar';
import { BookOpen, FolderOpen, ChevronRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function WikiIndexPage() {
  const tree = await getWikiTreeFromDB();
  const categories   = tree.filter((n) => n.type === 'folder');
  const rootArticles = tree.filter((n) => n.type === 'file');

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <WikiSidebar tree={tree} />

      <main style={{
        flex: 1, minWidth: 0,
        padding: 'clamp(2rem, 4vw, 3.5rem) clamp(1.5rem, 5vw, 4rem)',
        animation: 'fade-up var(--duration-slow) var(--ease-out) both',
        background: 'var(--surface-bg)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>

          {/* Header */}
          <header style={{ marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <p style={{
              fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'var(--brand-gold)', marginBottom: '0.5rem',
            }}>
              Documentation
            </p>
            <h1 style={{
              fontFamily: 'var(--font-cinzel), serif',
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 900, color: 'var(--text-primary)',
              letterSpacing: '0.04em', lineHeight: 1.15,
              marginBottom: '0.75rem',
            }}>
              Archives d'Eklypse
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
              Explorez les secrets et l'histoire de notre monde.
            </p>
            <div style={{ marginTop: '1.5rem', height: 1, background: 'var(--border-subtle)' }} />
          </header>

          {/* Empty state */}
          {tree.length === 0 && (
            <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
              <BookOpen
                size={48} strokeWidth={1} aria-hidden="true"
                style={{ color: 'var(--text-muted)', margin: '0 auto 1.5rem', display: 'block' }}
              />
              <h2 style={{
                fontFamily: 'var(--font-cinzel), serif',
                fontSize: '1.2rem', fontWeight: 700,
                color: 'var(--text-secondary)', marginBottom: '0.75rem',
              }}>
                Les archives sont vides
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Le wiki est vide pour l'instant. Les administrateurs peuvent créer du contenu.
              </p>
            </div>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <section style={{ marginBottom: '2.5rem' }}>
              <h2 style={{
                fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--text-muted)', marginBottom: '1rem',
              }}>
                Catégories
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                gap: '1rem',
              }}>
                {categories.map((cat) => <CategoryCard key={cat.slug} node={cat} />)}
              </div>
            </section>
          )}

          {/* Root articles */}
          {rootArticles.length > 0 && (
            <section>
              <h2 style={{
                fontSize: '0.72rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--text-muted)', marginBottom: '1rem',
              }}>
                Articles
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {rootArticles.map((a) => <ArticleRow key={a.slug} node={a} />)}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function CategoryCard({ node }: { node: WikiTreeNode }) {
  const articleCount = node.children?.filter((c) => c.type === 'file').length ?? 0;
  const folderCount  = node.children?.filter((c) => c.type === 'folder').length ?? 0;

  return (
    <Link href={`/wiki/${node.slug}`} style={{ textDecoration: 'none' }}>
      <div
        className="card"
        style={{ padding: '1.25rem', cursor: 'pointer', height: '100%', minHeight: 130 }}
      >
        <div style={{
          width: 38, height: 38, borderRadius: 'var(--radius-sm)',
          background: 'rgba(109,40,217,0.08)',
          border: '1px solid rgba(109,40,217,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.2rem', marginBottom: '0.875rem',
        }}>
          {node.icon}
        </div>

        <h3 style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '0.95rem', fontWeight: 700,
          color: 'var(--text-primary)', margin: '0 0 auto',
          lineHeight: 1.3,
        }}>
          {node.title}
        </h3>

        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', marginTop: '1rem',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {articleCount > 0 && (
              <span style={{
                fontSize: '0.7rem', color: 'var(--text-muted)',
                background: 'rgba(0,0,0,0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px', padding: '0.15rem 0.55rem',
                display: 'flex', alignItems: 'center', gap: '0.3rem',
              }}>
                <BookOpen size={10} strokeWidth={1.5} aria-hidden="true" />
                {articleCount}
              </span>
            )}
            {folderCount > 0 && (
              <span style={{
                fontSize: '0.7rem', color: 'var(--text-muted)',
                background: 'rgba(0,0,0,0.04)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '999px', padding: '0.15rem 0.55rem',
                display: 'flex', alignItems: 'center', gap: '0.3rem',
              }}>
                <FolderOpen size={10} strokeWidth={1.5} aria-hidden="true" />
                {folderCount}
              </span>
            )}
            {articleCount === 0 && folderCount === 0 && (
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Vide</span>
            )}
          </div>
          <ChevronRight size={14} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
        </div>
      </div>
    </Link>
  );
}

function ArticleRow({ node }: { node: WikiTreeNode }) {
  return (
    <Link href={`/wiki/${node.slug}`} style={{ textDecoration: 'none' }}>
      <div
        className="card"
        style={{
          padding: '0.75rem 1.25rem',
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: '1rem', flexShrink: 0 }} aria-hidden="true">{node.icon}</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.925rem', flex: 1 }}>
          {node.title}
        </span>
        <ChevronRight size={14} strokeWidth={1.5} style={{ color: 'var(--text-muted)', flexShrink: 0 }} aria-hidden="true" />
      </div>
    </Link>
  );
}
