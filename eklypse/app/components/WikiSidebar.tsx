'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, FolderOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import type { WikiTreeNode } from '@/lib/wiki-db';

const NavNode: React.FC<{ node: WikiTreeNode; depth?: number; collapsed: boolean }> = ({
  node, depth = 0, collapsed,
}) => {
  const pathname = usePathname();
  const decoded  = decodeURIComponent(pathname);
  const isActive = decoded === `/wiki/${node.slug}`;
  const isParent = decoded.startsWith(`/wiki/${node.slug}/`);
  const isFolder = node.type === 'folder';
  const indent   = collapsed ? 0 : depth * 12;

  return (
    <div>
      <Link
        href={`/wiki/${encodeURI(node.slug)}`}
        title={collapsed ? node.title : undefined}
        style={{
          display: 'flex', alignItems: 'center',
          gap: collapsed ? 0 : '0.5rem',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0.55rem 0' : `0.4rem 0.75rem 0.4rem ${indent + 12}px`,
          borderRadius: 'var(--radius-sm)',
          textDecoration: 'none',
          color: isActive ? 'var(--brand-primary)' : (isParent ? 'var(--text-primary)' : 'var(--text-secondary)'),
          background: isActive ? 'rgba(109,40,217,0.08)' : 'transparent',
          fontWeight: isActive || depth === 0 ? 600 : 400,
          fontSize: depth === 0 ? '0.82rem' : '0.875rem',
          letterSpacing: depth === 0 ? '0.04em' : '0.01em',
          borderLeft: isActive && !collapsed ? '2px solid var(--brand-primary)' : '2px solid transparent',
          transition: 'background var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out)',
          minHeight: 36,
        }}
        onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; }}
        onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
      >
        <span style={{ flexShrink: 0, fontSize: '1rem', lineHeight: 1, display: 'flex', alignItems: 'center' }}>
          {node.icon}
        </span>

        {!collapsed && (
          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {node.title}
          </span>
        )}

        {!collapsed && isFolder && (isParent || isActive) && (
          <FolderOpen size={12} strokeWidth={1.5} style={{ flexShrink: 0, color: 'var(--brand-gold)' }} />
        )}
      </Link>

      {!collapsed && node.children && node.children.length > 0 && (
        <div style={{
          borderLeft: '1px solid var(--border-subtle)',
          marginLeft: `${indent + 20}px`,
        }}>
          {node.children.map((child) => (
            <NavNode key={child.slug} node={child} depth={depth + 1} collapsed={collapsed} />
          ))}
        </div>
      )}
    </div>
  );
};

const WikiSidebar: React.FC<{ tree: WikiTreeNode[] }> = ({ tree }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    if (window.innerWidth < 1024) setCollapsed(true);
  }, []);

  if (!mounted) return null;

  return (
    <aside
      aria-label="Navigation du wiki"
      style={{
        width: collapsed ? 52 : 256,
        flexShrink: 0,
        position: 'sticky',
        top: 64,
        height: 'calc(100dvh - 64px)',
        background: 'var(--surface-raised)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        transition: `width var(--duration-slow) var(--ease-in-out)`,
        overflow: 'hidden',
        zIndex: 'var(--z-raised)' as any,
      }}
    >
      {/* Header */}
      <div style={{
        padding: '0.875rem 0.75rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        flexShrink: 0,
      }}>
        {!collapsed && (
          <Link href="/wiki" style={{
            textDecoration: 'none',
            fontSize: '0.72rem', fontWeight: 700,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--text-muted)',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            <BookOpen size={13} strokeWidth={2} />
            Wiki
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Développer' : 'Réduire'}
          style={{
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background var(--duration-fast) var(--ease-out)',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
        >
          {collapsed
            ? <ChevronRight size={13} strokeWidth={2} />
            : <ChevronLeft  size={13} strokeWidth={2} />}
        </button>
      </div>

      {/* Nav tree */}
      <nav
        aria-label="Navigation du wiki"
        style={{
          flex: 1, overflowY: 'auto', overflowX: 'hidden',
          padding: '0.5rem 0.4rem',
          display: 'flex', flexDirection: 'column', gap: '0.05rem',
        }}
      >
        {tree.length === 0 && !collapsed && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.5rem 0.75rem' }}>
            Aucune page.
          </p>
        )}
        {tree.map((node) => (
          <NavNode key={node.slug} node={node} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  );
};

export default WikiSidebar;
