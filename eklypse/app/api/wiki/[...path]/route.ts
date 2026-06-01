import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getWikiPageFromDB, updateWikiPage, createWikiPage } from '@/lib/wiki-db';

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(_req: NextRequest, { params }: Ctx) {
  const { path } = await params;
  const slug = path.join('/');
  const page = await getWikiPageFromDB(slug);
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(page);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { path } = await params;
  const slug = path.join('/');
  const body = (await req.json()) as {
    content: string;
    title?: string;
    icon?: string;
  };

  if (typeof body.content !== 'string') {
    return NextResponse.json({ error: 'content is required' }, { status: 400 });
  }

  const existing = await getWikiPageFromDB(slug);

  if (existing) {
    await updateWikiPage(slug, body, {
      name: session.user.name,
      id: session.user.discordId,
    });
  } else {
    // Auto-create page if it doesn't exist yet
    const segments = slug.split('/');
    const parentSlug = segments.slice(0, -1).join('/');
    await createWikiPage({
      slug,
      title: body.title ?? segments[segments.length - 1],
      icon: body.icon ?? '📜',
      content: body.content,
      type: 'file',
      parentSlug,
      order: 999,
      isPublished: true,
      updatedBy: session.user.name,
      updatedById: session.user.discordId,
    });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(req: NextRequest, { params }: Ctx) {
  const session: any = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { path } = await params;
  const slug = path.join('/');
  const body = (await req.json()) as {
    title: string;
    icon?: string;
    type?: 'file' | 'folder';
    description?: string;
    content?: string;
    parentSlug?: string;
    order?: number;
    isPublished?: boolean;
  };

  if (!body.title) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }

  const segments = slug.split('/');
  const parentSlug = body.parentSlug ?? segments.slice(0, -1).join('/');

  await createWikiPage({
    slug,
    title: body.title,
    icon: body.icon ?? (body.type === 'folder' ? '📁' : '📜'),
    description: body.description,
    content: body.content ?? '',
    type: body.type ?? 'file',
    parentSlug,
    order: body.order ?? 999,
    isPublished: body.isPublished ?? true,
    updatedBy: session.user.name,
    updatedById: session.user.discordId,
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
