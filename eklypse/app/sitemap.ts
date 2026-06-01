import { MetadataRoute } from 'next';
import { getWikiTreeFromDB, WikiTreeNode } from '@/lib/wiki-db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eklypse.xyz';

  const staticPages = ['', '/wiki', '/login', '/candidature'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  let dynamicPages: MetadataRoute.Sitemap = [];
  try {
    const tree = await getWikiTreeFromDB();
    function extractPaths(nodes: WikiTreeNode[]) {
      nodes.forEach((node) => {
        dynamicPages.push({
          url: `${baseUrl}/wiki/${node.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        });
        if (node.children?.length) extractPaths(node.children);
      });
    }
    extractPaths(tree);
  } catch {
    // DB unavailable during build — skip dynamic pages
  }

  return [...staticPages, ...dynamicPages];
}
