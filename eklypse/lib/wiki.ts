import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const wikiDirectory = path.join(process.cwd(), 'content/wiki');

export interface WikiArticle {
  slug: string;
  category: string;
  title: string;
  content: string;
  icon?: string;         // Icône de l'article (petite carte)
  categoryIcon?: string; // Icône de la catégorie (grosse carte)
  lastUpdated?: string;
}

export function getAllWikiData(): WikiArticle[] {
  if (!fs.existsSync(wikiDirectory)) return [];

  const categories = fs.readdirSync(wikiDirectory);
  const allArticles: WikiArticle[] = [];

  categories.forEach((category) => {
    const categoryPath = path.join(wikiDirectory, category);
    if (fs.statSync(categoryPath).isDirectory()) {
      const files = fs.readdirSync(categoryPath);
      
      files.forEach((file) => {
        if (file.endsWith('.md')) {
          const filePath = path.join(categoryPath, file);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const { data, content } = matter(fileContent);
          
          allArticles.push({
            slug: file.replace('.md', ''),
            category,
            title: data.title || file.replace('.md', ''),
            content: content,
            icon: data.icon,
            categoryIcon: data.categoryIcon,
            lastUpdated: data.lastUpdated,
          });
        }
      });
    }
  });

  return allArticles;
}

// Génère les noms et icônes uniquement à partir des dossiers et du frontmatter
export function getDynamicCategories() {
  if (!fs.existsSync(wikiDirectory)) return [];

  const folders = fs.readdirSync(wikiDirectory).filter(file => 
    fs.statSync(path.join(wikiDirectory, file)).isDirectory()
  );

  const allArticles = getAllWikiData();

  return folders.map(folder => {
    // Cherche si un article du dossier définit l'icône de catégorie
    const articleWithCatIcon = allArticles.find(a => a.category === folder && a.categoryIcon);
    
    // Formate le nom du dossier (ex: "histoire-du-monde" -> "Histoire Du Monde")
    const formattedName = folder
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      id: folder,
      name: formattedName,
      icon: articleWithCatIcon?.categoryIcon || "📁"
    };
  });
}