/**
 * Migrate existing Markdown files from content/wiki/ into MongoDB.
 * Run once: node scripts/migrate-wiki.mjs
 */

import { MongoClient } from 'mongodb';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
// Load .env.local manually
import { readFileSync as _rfs } from 'fs';
try {
  const env = _rfs(new URL('../.env.local', import.meta.url), 'utf8');
  for (const line of env.split('\n')) {
    const [k, ...v] = line.split('=');
    if (k && v.length) process.env[k.trim()] ??= v.join('=').trim();
  }
} catch { /* no .env.local */ }

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const WIKI_DIR = join(ROOT, 'content/wiki');
const MONGO_URI = process.env.MONGODB_URI;
const DB_NAME = 'Website';

if (!MONGO_URI) {
  console.error('❌  Set MONGODB_URI in .env.local');
  process.exit(1);
}

function formatTitle(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function collectPages(dir, parentSlug = '') {
  const pages = [];
  if (!existsSync(dir)) return pages;

  for (const item of readdirSync(dir)) {
    if (item.startsWith('.')) continue;
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    const isDir = stat.isDirectory();

    if (isDir) {
      const slug = parentSlug ? `${parentSlug}/${item}` : item;
      const indexPath = join(fullPath, 'index.md');
      let title = formatTitle(item);
      let icon = '📁';
      let description = '';
      let content = '';
      let order = 999;

      if (existsSync(indexPath)) {
        const { data, content: c } = matter(readFileSync(indexPath, 'utf8'));
        if (data.title) title = data.title;
        if (data.icon || data.categoryIcon) icon = data.categoryIcon || data.icon;
        if (data.description) description = data.description;
        if (data.order !== undefined) order = Number(data.order);
        content = c;
      }

      pages.push({
        slug,
        title,
        icon,
        description,
        content,
        type: 'folder',
        parentSlug,
        order,
        isPublished: true,
      });

      pages.push(...collectPages(fullPath, slug));
    } else if (item !== 'index.md' && item !== 'index.markdown' && (item.endsWith('.md') || item.endsWith('.markdown'))) {
      const name = item.replace(/\.(md|markdown)$/, '');
      const slug = parentSlug ? `${parentSlug}/${name}` : name;
      const { data, content } = matter(readFileSync(fullPath, 'utf8'));

      pages.push({
        slug,
        title: data.title || formatTitle(name),
        icon: data.icon || '📜',
        description: data.description || '',
        content,
        type: 'file',
        parentSlug,
        order: data.order !== undefined ? Number(data.order) : 999,
        isPublished: true,
      });
    }
  }

  return pages;
}

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const col = client.db(DB_NAME).collection('wiki_pages');

  const pages = collectPages(WIKI_DIR);
  console.log(`📄  Found ${pages.length} pages to migrate`);

  let inserted = 0;
  let skipped = 0;

  for (const page of pages) {
    const existing = await col.findOne({ slug: page.slug });
    if (existing) {
      console.log(`  ⏭  Skip (already exists): ${page.slug}`);
      skipped++;
      continue;
    }
    await col.insertOne({ ...page, createdAt: new Date(), updatedAt: new Date() });
    console.log(`  ✅  Inserted: ${page.slug}`);
    inserted++;
  }

  // Ensure indexes
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ parentSlug: 1 });

  console.log(`\n✨  Done — ${inserted} inserted, ${skipped} skipped`);
  await client.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
