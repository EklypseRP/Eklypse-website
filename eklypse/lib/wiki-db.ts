import clientPromise from '@/lib/mongodb';

const DB_NAME = 'Website';
const COLLECTION = 'wiki_pages';

export interface WikiPageDoc {
  slug: string;          // e.g. "histoire/age-prosperite"
  title: string;
  icon: string;          // emoji for content display (not UI chrome)
  description?: string;
  content: string;       // Markdown
  type: 'file' | 'folder';
  parentSlug: string;    // "" for root, "histoire" for children
  order: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string;
  updatedById?: string;
}

export interface WikiTreeNode {
  slug: string;
  title: string;
  icon: string;
  type: 'file' | 'folder';
  order: number;
  children?: WikiTreeNode[];
}

function buildTree(pages: WikiPageDoc[], parentSlug = ''): WikiTreeNode[] {
  return pages
    .filter((p) => p.parentSlug === parentSlug && p.isPublished)
    .sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title, 'fr');
    })
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      icon: p.icon,
      type: p.type,
      order: p.order,
      ...(p.type === 'folder' ? { children: buildTree(pages, p.slug) } : {}),
    }));
}

async function getCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<WikiPageDoc>(COLLECTION);
}

export async function getWikiTreeFromDB(): Promise<WikiTreeNode[]> {
  const col = await getCollection();
  const pages = await col.find({}).toArray();
  return buildTree(pages);
}

export async function getWikiPageFromDB(slug: string): Promise<WikiPageDoc | null> {
  const col = await getCollection();
  return col.findOne({ slug, isPublished: true }) ?? null;
}

export async function updateWikiPage(
  slug: string,
  data: { content: string; title?: string; icon?: string },
  user: { name: string; id: string }
): Promise<void> {
  const col = await getCollection();
  await col.updateOne(
    { slug },
    {
      $set: {
        content: data.content,
        ...(data.title ? { title: data.title } : {}),
        ...(data.icon ? { icon: data.icon } : {}),
        updatedAt: new Date(),
        updatedBy: user.name,
        updatedById: user.id,
      },
    }
  );
}

export async function createWikiPage(page: Omit<WikiPageDoc, 'createdAt' | 'updatedAt'>): Promise<void> {
  const col = await getCollection();
  await col.insertOne({
    ...page,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function ensureIndexes(): Promise<void> {
  const col = await getCollection();
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ parentSlug: 1 });
}
