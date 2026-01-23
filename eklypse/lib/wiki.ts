import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const wikiDirectory = path.join(process.cwd(), 'content/wiki');

export interface WikiNode {
  name: string;
  type: 'file' | 'folder';
  path: string; // ex: "races/elfes"
  icon: string;
  title: string;
  children?: WikiNode[];
  content?: string;
}

/**
 * Transforme "ma-categorie" ou "ma categorie" en "Ma Categorie"
 * Gère les tirets et les espaces multiples.
 */
export const formatTitle = (slug: string) => {
  // On décode d'abord l'URL (le %20 devient un espace)
  const decoded = decodeURIComponent(slug);
  
  return decoded
    .replace(/-/g, ' ') // Remplace les tirets par des espaces
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Fonction récursive pour scanner TOUT le dossier wiki
 */
export function getWikiTree(currentDir: string = wikiDirectory, relativePath: string = ""): WikiNode[] {
  if (!fs.existsSync(currentDir)) return [];
  
  const items = fs.readdirSync(currentDir);
  const nodes: WikiNode[] = [];

  items.forEach((item) => {
    // On ignore les fichiers d'index et les fichiers cachés
    if (item === 'index.md' || item === 'index.markdown' || item.startsWith('.')) return;

    const fullPath = path.join(currentDir, item);
    const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.md');
      let icon = "📁";
      let title = formatTitle(item);

      // Récupération des métadonnées du dossier via index.md
      if (fs.existsSync(indexPath)) {
        const { data } = matter(fs.readFileSync(indexPath, 'utf8'));
        if (data.categoryIcon || data.icon) icon = data.categoryIcon || data.icon;
        if (data.title) title = data.title;
      }

      nodes.push({
        name: item,
        type: 'folder',
        path: itemRelativePath,
        icon,
        title,
        children: getWikiTree(fullPath, itemRelativePath) // RÉCURSIVITÉ
      });
    } else if (item.endsWith('.md') || item.endsWith('.markdown')) {
      const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
      const slug = item.replace(/\.(md|markdown)$/, '');
      const cleanPath = itemRelativePath.replace(/\.(md|markdown)$/, '');

      nodes.push({
        name: slug,
        type: 'file',
        path: cleanPath,
        icon: data.icon || "📜",
        title: data.title || formatTitle(slug)
      });
    }
  });

  // Tri : Dossiers d'abord, puis ordre alphabétique
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

/**
 * Récupère les données d'un nœud spécifique (dossier ou fichier)
 * Décode les segments pour supporter les espaces dans les noms de fichiers.
 */
export function getWikiContent(segments: string[]) {
  // RÉPARATION : Décodage des segments d'URL pour correspondre au système de fichiers
  const decodedSegments = segments.map(s => decodeURIComponent(s));
  const relPath = decodedSegments.join('/');
  const fullPath = path.join(wikiDirectory, relPath);
  
  // 1. Vérification des fichiers
  const extensions = ['.md', '.markdown'];
  for (const ext of extensions) {
    if (fs.existsSync(fullPath + ext)) {
      const { data, content } = matter(fs.readFileSync(fullPath + ext, 'utf8'));
      return { data, content, type: 'file' as const };
    }
  }
  
  // 2. Vérification des dossiers
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    const indexPath = path.join(fullPath, 'index.md');
    if (fs.existsSync(indexPath)) {
      const { data, content } = matter(fs.readFileSync(indexPath, 'utf8'));
      return { data, content, type: 'folder' as const };
    }
    return { data: {} as any, content: "", type: 'folder' as const };
  }

  return null;
}