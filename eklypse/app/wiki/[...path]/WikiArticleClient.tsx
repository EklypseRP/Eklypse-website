'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Pencil, ChevronRight, ArrowLeft, BookOpen, FolderOpen, FilePlus, List } from 'lucide-react';
import type { WikiTreeNode } from '@/lib/wiki-db';
import WikiEditor from './WikiEditor';
import WikiPageCreator from './WikiPageCreator';

interface SerializedPage {
  slug: string;
  title: string;
  icon: string;
  description: string | null;
  content: string;
  type: 'file' | 'folder';
  parentSlug: string;
  order: number;
  isPublished: boolean;
  updatedBy: string | null;
}

interface WikiArticleClientProps {
  slug: string;
  page: SerializedPage | null;
  subPages: WikiTreeNode[];
  isAdmin: boolean;
  pathSegments: string[];
}

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/* Extract headings from markdown string to build TOC */
function extractToc(markdown: string): TocItem[] {
  const lines = markdown.split('\n');
  const items: TocItem[] = [];
  for (const line of lines) {
    const h2 = line.match(/^## (.+)/);
    const h3 = line.match(/^### (.+)/);
    if (h2) {
      const text = h2[1].trim();
      items.push({ id: slugify(text), text, level: 2 });
    } else if (h3) {
      const text = h3[1].trim();
      items.push({ id: slugify(text), text, level: 3 });
    }
  }
  return items;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/* Heading components that inject id attributes for anchor links */
const headingComponents = {
  h2: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : String(children ?? '');
    return <h2 id={slugify(text)} {...props}>{children}</h2>;
  },
  h3: ({ children, ...props }: any) => {
    const text = typeof children === 'string' ? children : String(children ?? '');
    return <h3 id={slugify(text)} {...props}>{children}</h3>;
  },
};

export default function WikiArticleClient({
  slug, page, subPages, isAdmin, pathSegments,
}: WikiArticleClientProps) {
  const [editing,  setEditing]  = useState(false);
  const [creating, setCreating] = useState(false);
  const [content,  setContent]  = useState(page?.content ?? '');
  const [activeId, setActiveId] = useState('');

  const toc = useMemo(() => extractToc(content), [content]);

  /* Track active heading for TOC highlight */
  useEffect(() => {
    if (toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 },
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  /* ── 404 ── */
  if (!page) {
    return (
      <main style={{
        flex: 1, minWidth: 0,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(2rem, 5vw, 4rem)',
        animation: 'fade-up var(--duration-slow) var(--ease-out) both',
        background: 'var(--surface-bg)',
      }}>
        <BookOpen size={48} strokeWidth={1} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
        <h1 style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          fontWeight: 700, color: 'var(--text-primary)',
          letterSpacing: '0.06em', marginBottom: '0.75rem', textAlign: 'center',
        }}>
          Page introuvable
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
          Cette page n'existe pas encore dans les archives.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/wiki" style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.625rem 1.25rem', minHeight: 44,
            background: 'var(--surface-card)', border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-base)', color: 'var(--text-secondary)',
            textDecoration: 'none', fontSize: '0.875rem',
          }}>
            <ArrowLeft size={14} strokeWidth={2} />
            Retour au wiki
          </Link>

          {isAdmin && (
            <button
              onClick={() => setCreating(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.625rem 1.25rem', minHeight: 44,
                background: 'var(--brand-primary)',
                border: 'none', borderRadius: 'var(--radius-base)',
                color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              <FilePlus size={14} strokeWidth={2} />
              Créer cette page
            </button>
          )}
        </div>

        {creating && (
          <WikiPageCreator
            slug={slug} pathSegments={pathSegments}
            onClose={() => setCreating(false)}
            onCreated={() => window.location.reload()}
          />
        )}
      </main>
    );
  }

  const crumbs = pathSegments.reduce<{ label: string; href: string }[]>((acc, seg, i) => {
    acc.push({ label: decodeURIComponent(seg), href: '/wiki/' + pathSegments.slice(0, i + 1).join('/') });
    return acc;
  }, []);

  const parentSlug = pathSegments.length > 1 ? pathSegments.slice(0, -1).join('/') : null;

  return (
    <>
      {editing && (
        <WikiEditor
          slug={slug} initialContent={content}
          onClose={() => setEditing(false)}
          onSaved={(newContent) => { setContent(newContent); setEditing(false); }}
        />
      )}

      {creating && (
        <WikiPageCreator
          slug={slug} pathSegments={pathSegments}
          onClose={() => setCreating(false)}
          onCreated={() => window.location.reload()}
        />
      )}

      {/* Article + TOC wrapper */}
      <div style={{ display: 'flex', flex: 1, minWidth: 0, background: 'var(--surface-bg)' }}>

        {/* Main article */}
        <main style={{
          flex: 1, minWidth: 0,
          padding: 'clamp(2rem, 4vw, 3rem) clamp(1.5rem, 5vw, 3.5rem)',
          animation: 'fade-up var(--duration-slow) var(--ease-out) both',
        }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>

            {/* Breadcrumb */}
            <nav aria-label="Fil d'Ariane" style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              flexWrap: 'wrap', marginBottom: '1.5rem',
            }}>
              <Link href="/wiki" style={{
                fontSize: '0.72rem', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--text-muted)', textDecoration: 'none',
              }}>
                Wiki
              </Link>
              {crumbs.map((crumb, i) => (
                <React.Fragment key={crumb.href}>
                  <ChevronRight size={11} strokeWidth={2} style={{ color: 'var(--border-base)', flexShrink: 0 }} />
                  {i === crumbs.length - 1 ? (
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 600,
                      letterSpacing: '0.04em', textTransform: 'capitalize',
                      color: 'var(--brand-primary)',
                    }}>
                      {crumb.label}
                    </span>
                  ) : (
                    <Link href={crumb.href} style={{
                      fontSize: '0.72rem', letterSpacing: '0.04em',
                      textTransform: 'capitalize',
                      color: 'var(--text-muted)', textDecoration: 'none',
                    }}>
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Page header */}
            <header style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                  {page.icon && (
                    <div style={{
                      width: 52, height: 52, flexShrink: 0,
                      borderRadius: 'var(--radius-base)',
                      background: 'rgba(109,40,217,0.08)',
                      border: '1px solid rgba(109,40,217,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.55rem',
                    }}>
                      {page.icon}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <h1 style={{
                      fontFamily: 'var(--font-cinzel), serif',
                      fontSize: 'clamp(1.5rem, 3.5vw, 2.1rem)',
                      fontWeight: 900, color: 'var(--text-primary)',
                      letterSpacing: '0.04em', margin: 0, lineHeight: 1.2,
                    }}>
                      {page.title}
                    </h1>
                    {page.description && (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.4rem' }}>
                        {page.description}
                      </p>
                    )}
                  </div>
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      onClick={() => setEditing(true)}
                      aria-label="Éditer la page"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.5rem 1rem', minHeight: 40,
                        background: 'var(--surface-card)', border: '1px solid var(--border-base)',
                        borderRadius: 'var(--radius-base)',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        transition: 'background var(--duration-fast) var(--ease-out)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(109,40,217,0.06)'; e.currentTarget.style.color = 'var(--brand-primary)'; e.currentTarget.style.borderColor = 'rgba(109,40,217,0.3)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-card)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border-base)'; }}
                    >
                      <Pencil size={13} strokeWidth={2} />
                      Éditer
                    </button>

                    <button
                      onClick={() => setCreating(true)}
                      aria-label="Créer une sous-page"
                      title="Créer une sous-page"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: 40, height: 40,
                        background: 'var(--surface-card)', border: '1px solid var(--border-base)',
                        borderRadius: 'var(--radius-base)',
                        color: 'var(--brand-gold)', cursor: 'pointer',
                        transition: 'background var(--duration-fast) var(--ease-out)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(180,83,9,0.06)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface-card)'; }}
                    >
                      <FilePlus size={14} strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '1.5rem', height: 1, background: 'var(--border-subtle)' }} />
            </header>

            {/* Article body */}
            <article
              aria-live="polite"
              className={content ? 'wiki-content' : undefined}
              style={{ marginBottom: subPages.length > 0 ? '3rem' : 0 }}
            >
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={headingComponents}>
                  {content}
                </ReactMarkdown>
              ) : (
                subPages.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontStyle: 'italic', padding: '1.5rem 0' }}>
                    {isAdmin ? 'Cliquez sur Éditer pour ajouter du contenu.' : "Cette page est vide pour l'instant."}
                  </p>
                )
              )}
            </article>

            {/* Sub-pages */}
            {subPages.length > 0 && (
              <section>
                <h2 style={{
                  fontSize: '0.72rem', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--text-muted)', marginBottom: '1rem',
                }}>
                  Contenu
                </h2>

                {subPages.filter(c => c.type === 'folder').length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '0.875rem', marginBottom: '0.875rem',
                  }}>
                    {subPages.filter(c => c.type === 'folder').map(child => (
                      <Link key={child.slug} href={`/wiki/${encodeURI(child.slug)}`} style={{ textDecoration: 'none' }}>
                        <div className="card" style={{
                          padding: '1rem', display: 'flex', alignItems: 'center',
                          gap: '0.75rem', cursor: 'pointer', height: '100%', minHeight: 72,
                        }}>
                          <div style={{
                            width: 34, height: 34, flexShrink: 0,
                            borderRadius: 'var(--radius-sm)',
                            background: 'rgba(109,40,217,0.07)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                          }}>
                            {child.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {child.title}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '0.2rem' }}>
                              <FolderOpen size={10} strokeWidth={1.5} style={{ color: 'var(--brand-gold)' }} />
                              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Catégorie</span>
                            </div>
                          </div>
                          <ChevronRight size={13} strokeWidth={1.5} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {subPages.filter(c => c.type === 'file').length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {subPages.filter(c => c.type === 'file').map(child => (
                      <Link key={child.slug} href={`/wiki/${encodeURI(child.slug)}`} style={{ textDecoration: 'none' }}>
                        <div className="card" style={{
                          padding: '0.75rem 1.25rem', display: 'flex',
                          alignItems: 'center', gap: '0.75rem', cursor: 'pointer',
                        }}>
                          <span style={{ fontSize: '1rem', flexShrink: 0 }}>{child.icon}</span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', flex: 1 }}>
                            {child.title}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <BookOpen size={10} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                            <ChevronRight size={13} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Back link */}
            {parentSlug && (
              <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
                <Link href={`/wiki/${parentSlug}`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                  fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none',
                  transition: 'color var(--duration-fast) var(--ease-out)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  <ArrowLeft size={13} strokeWidth={2} />
                  Retour
                </Link>
              </div>
            )}
          </div>
        </main>

        {/* TOC — right side, hidden on small screens via CSS class */}
        {toc.length > 0 && (
          <aside
            className="wiki-toc"
            aria-label="Table des matières"
            style={{
              width: 220, flexShrink: 0,
              position: 'sticky', top: 64,
              height: 'calc(100dvh - 64px)',
              overflowY: 'auto',
              padding: '2rem 0.75rem 2rem 0',
              borderLeft: '1px solid var(--border-subtle)',
              background: 'var(--surface-bg)',
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              marginBottom: '0.875rem', paddingLeft: '0.75rem',
            }}>
              <List size={13} strokeWidth={2} style={{ color: 'var(--text-muted)' }} />
              <span style={{
                fontSize: '0.68rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}>
                Sur cette page
              </span>
            </div>

            <nav>
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={activeId === item.id ? 'active' : ''}
                  style={{
                    paddingLeft: item.level === 3 ? '1.25rem' : '0.75rem',
                  }}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>
    </>
  );
}
