import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const wikiDirectory = path.join(process.cwd(), 'content/wiki');

export interface WikiNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  icon: string;
  title: string;
  order: number;
  children?: WikiNode[];
  content?: string;
}

export const formatTitle = (slug: string) => {
  const decoded = decodeURIComponent(slug);
  
  return decoded
    .replace(/-/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function getWikiTree(currentDir: string = wikiDirectory, relativePath: string = ""): WikiNode[] {
  if (!fs.existsSync(currentDir)) return [];
  
  const items = fs.readdirSync(currentDir);
  const nodes: WikiNode[] = [];

  items.forEach((item) => {
    if (item === 'index.md' || item === 'index.markdown' || item.startsWith('.')) return;

    const fullPath = path.join(currentDir, item);
    const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.md');
      let icon = "📁";
      let title = formatTitle(item);
      let order = 999;

      if (fs.existsSync(indexPath)) {
        const { data } = matter(fs.readFileSync(indexPath, 'utf8'));
        if (data.categoryIcon || data.icon) icon = data.categoryIcon || data.icon;
        if (data.title) title = data.title;
        if (data.order !== undefined) order = Number(data.order);
      }

      nodes.push({
        name: item,
        type: 'folder',
        path: itemRelativePath,
        icon,
        title,
        order,
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
        title: data.title || formatTitle(slug),
        order: data.order !== undefined ? Number(data.order) : 999 // Valeur par défaut pour les fichiers
      });
    }
  });

  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    
    if (a.order !== b.order) {
      return a.order - b.order;
    }

    // Tri alphabétique final si tout le reste est identique
    return a.title.localeCompare(b.title);
  });
}

export function getWikiContent(segments: string[]) {
  // Décodage des segments d'URL pour correspondre au système de fichiers
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