import { MetadataRoute } from 'next';
import { getWikiTree, WikiNode } from '@/lib/wiki';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://eklypse.xyz';

  // 1. Définition de vos pages statiques (l'accueil, les formulaires, etc.)
  const staticPages = ['', '/wiki', '/login', '/register', '/candidature'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8, // L'accueil a la priorité maximale (1.0)
  }));

  // 2. Récupération de l'arborescence dynamique de votre Wiki
  const tree = getWikiTree();
  const dynamicPages: MetadataRoute.Sitemap = [];

  // Fonction récursive pour extraire tous les chemins (dossiers et fichiers) du Wiki
  function extractPaths(nodes: WikiNode[]) {
    nodes.forEach((node) => {
      // On génère l'URL complète pour chaque élément du wiki
      dynamicPages.push({
        url: `${baseUrl}/wiki/${node.path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6, // Les sous-pages ont une priorité standard
      });

      // Si le nœud contient des enfants (c'est un dossier), on explore à l'intérieur
      if (node.children && node.children.length > 0) {
        extractPaths(node.children);
      }
    });
  }
  extractPaths(tree);
  return [...staticPages, ...dynamicPages];
}