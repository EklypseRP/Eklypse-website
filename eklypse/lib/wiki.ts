// lib/wiki.ts
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

// Transforme "ma-categorie" en "Ma Categorie"
export const formatTitle = (slug: string) => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Fonction récursive pour scanner TOUT le dossier wiki
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
      // Pour un dossier, on cherche un index.md pour l'icône, sinon 📁
      const indexPath = path.join(fullPath, 'index.md');
      let icon = "📁";
      let title = formatTitle(item);

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
      // Pour un fichier
      const { data } = matter(fs.readFileSync(fullPath, 'utf8'));
      const slug = item.replace(/\.(md|markdown)$/, '');
      const cleanPath = itemRelativePath.replace(/\.(md|markdown)$/, '');

      nodes.push({
        name: slug,
        type: 'file',
        path: cleanPath,
        icon: data.icon || "📄",
        title: data.title || formatTitle(slug)
      });
    }
  });

  // Trie : Dossiers d'abord, puis alphabétique
  return nodes.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.title.localeCompare(b.title);
  });
}

// Récupère les données d'un nœud spécifique (dossier ou fichier)
export function getWikiContent(segments: string[]) {
  const relPath = segments.join('/');
  const fullPath = path.join(wikiDirectory, relPath);
  
  // 1. Est-ce un fichier .md ou .markdown ?
  const extensions = ['.md', '.markdown'];
  for (const ext of extensions) {
    if (fs.existsSync(fullPath + ext)) {
      const { data, content } = matter(fs.readFileSync(fullPath + ext, 'utf8'));
      return { data, content, type: 'file' as const };
    }
  }
  
  // 2. Est-ce un dossier ? On cherche son index.md pour le contenu optionnel
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
    const indexPath = path.join(fullPath, 'index.md');
    if (fs.existsSync(indexPath)) {
      const { data, content } = matter(fs.readFileSync(indexPath, 'utf8'));
      return { data, content, type: 'folder' as const };
    }
    return { data: {}, content: "", type: 'folder' as const };
  }

  return null;
}