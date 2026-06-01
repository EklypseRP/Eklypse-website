import type { Metadata } from 'next';
import React from 'react';
import { getWikiTreeFromDB, getWikiPageFromDB } from '@/lib/wiki-db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import WikiSidebar from '@/app/components/WikiSidebar';
import WikiArticleClient from './WikiArticleClient';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ path: string[] }> };

// Strips all non-serializable MongoDB values (ObjectId, Date, etc.)
function deepSerialize<T>(val: T): T {
  return JSON.parse(JSON.stringify(val));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params;
  const slug = path.join('/');
  const page = await getWikiPageFromDB(slug);
  if (!page) return { title: 'Page introuvable' };
  return {
    title: page.title,
    description: page.description ?? `Découvrez ${page.title} sur le wiki d'Eklypse.`,
    alternates: { canonical: `/wiki/${slug}` },
    openGraph: { title: `${page.title} | Wiki Eklypse`, type: 'article' },
  };
}

export default async function WikiPage({ params }: Props) {
  const { path } = await params;
  const slug = path.join('/');

  const [rawTree, rawPage, session] = await Promise.all([
    getWikiTreeFromDB(),
    getWikiPageFromDB(slug),
    getServerSession(authOptions) as any,
  ]);

  const isAdmin: boolean = session?.user?.isAdmin ?? false;

  // JSON round-trip removes ObjectId, Date, and any toJSON methods
  const tree = deepSerialize(rawTree);
  const page = rawPage ? deepSerialize(rawPage) : null;

  function findSubPages(nodes: typeof tree, targetSlug: string): typeof tree {
    for (const n of nodes) {
      if (n.slug === targetSlug) return n.children ?? [];
      if (n.children) {
        const found = findSubPages(n.children, targetSlug);
        if (found.length) return found;
      }
    }
    return [];
  }

  const subPages = findSubPages(tree, slug);

  // Pass only serializable fields to the Client Component (avoid full WikiPageDoc)
  const serializedPage = page ? {
    slug:        page.slug        as string,
    title:       page.title       as string,
    icon:        page.icon        as string,
    description: (page.description ?? null) as string | null,
    content:     page.content     as string,
    type:        page.type        as 'file' | 'folder',
    parentSlug:  page.parentSlug  as string,
    order:       page.order       as number,
    isPublished: page.isPublished as boolean,
    updatedBy:   (page.updatedBy ?? null) as string | null,
  } : null;

  return (
    <div style={{ display: 'flex', flex: 1 }}>
      <WikiSidebar tree={tree} />
      <WikiArticleClient
        slug={slug}
        page={serializedPage}
        subPages={subPages}
        isAdmin={isAdmin}
        pathSegments={path}
      />
    </div>
  );
}
