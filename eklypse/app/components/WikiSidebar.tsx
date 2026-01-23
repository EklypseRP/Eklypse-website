'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const COLORS = { 
  purple: '#683892', 
  lightText: '#CBDBFC', 
  cardBorder: 'rgba(104, 56, 146, 0.3)', 
  almostBlack: '#0A0612' 
};

// Composant récursif pour chaque élément (Dossier ou Article)
const NavNode = ({ node, depth = 0, isCollapsed }: { node: any, depth?: number, isCollapsed: boolean }) => {
  const pathname = usePathname();
  
  // RÉPARATION : On décode l'URL (ex: %20 devient un espace) pour comparer avec node.path
  const decodedPathname = decodeURIComponent(pathname);
  const isActive = decodedPathname === `/wiki/${node.path}`;
  const isParentActive = decodedPathname.startsWith(`/wiki/${node.path}`);
  
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Link 
        // RÉPARATION : On encode l'URL pour que le navigateur gère bien les espaces au clic
        href={`/wiki/${encodeURI(node.path)}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: '0.5rem 1rem',
          paddingLeft: isCollapsed ? '1rem' : `${(depth * 1.2) + 1}rem`,
          fontSize: depth === 0 ? '0.85rem' : '0.8rem',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.7rem',
          color: (isActive || isHovered) ? COLORS.lightText : 'rgba(203, 219, 252, 0.5)',
          transition: 'all 0.3s ease',
          position: 'relative',
          justifyContent: isCollapsed ? 'center' : 'flex-start'
        }}
      >
        <span style={{ 
          fontSize: '1.1rem', 
          filter: (isActive || isHovered) ? 'none' : 'grayscale(100%) opacity(0.4)',
          transition: 'all 0.8s ease'
        }}>
          {node.icon}
        </span>
        
        {!isCollapsed && (
          <span style={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            fontWeight: (depth === 0 || isActive) ? '800' : '400',
            textTransform: depth === 0 ? 'uppercase' : 'none',
            letterSpacing: depth === 0 ? '0.1em' : 'normal'
          }}>
            {node.title}
          </span>
        )}
        
        {!isCollapsed && (
          <span style={{
            position: 'absolute',
            bottom: '2px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: (isActive || isHovered || (depth === 0 && isParentActive)) ? '60%' : '0%',
            opacity: (isActive || isHovered || (depth === 0 && isParentActive)) ? 1 : 0,
            height: '2px',
            background: `linear-gradient(to right, transparent, ${COLORS.purple}, transparent)`,
            transition: 'width 0.8s ease, opacity 0.8s ease',
            pointerEvents: 'none'
          }} />
        )}
      </Link>

      {!isCollapsed && node.children && node.children.length > 0 && (
        <div style={{ 
          borderLeft: '1px solid rgba(104, 56, 146, 0.44)', 
          marginLeft: `${(depth * 1.2) + 1.5}rem`,
          marginTop: '0.2rem',
          marginBottom: '0.5rem'
        }}>
          {node.children.map((child: any) => (
            <NavNode key={child.path} node={child} depth={depth + 1} isCollapsed={isCollapsed} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function WikiSidebar({ tree = [] }: { tree: any[] }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isTitleHovered, setIsTitleHovered] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Gestion auto du responsive
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsCollapsed(true);
    }
  }, []);

  if (!isMounted) return null;

  return (
    <aside style={{
      width: isCollapsed ? '80px' : '300px',
      flexShrink: 0,
      position: 'sticky',
      top: 0,
      height: '100vh',
      backgroundColor: COLORS.almostBlack,
      borderRight: `1px solid ${COLORS.cardBorder}`,
      padding: isCollapsed ? '2rem 0.5rem' : '2.5rem 1rem',
      transition: 'width 0.4s ease',
      zIndex: 20
    }}>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        style={{
          position: 'fixed',
          left: isCollapsed ? '64px' : '284px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: COLORS.almostBlack,
          border: `1px solid ${COLORS.cardBorder}`,
          color: COLORS.lightText,
          borderRadius: '50%',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
          zIndex: 100,
          transition: 'all 0.4s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {isCollapsed ? '›' : '‹'}
      </button>

      <div style={{ marginBottom: '2.5rem', textAlign: isCollapsed ? 'center' : 'left' }}>
        <Link 
          href="/wiki" 
          onMouseEnter={() => setIsTitleHovered(true)} 
          onMouseLeave={() => setIsTitleHovered(false)}
          style={{ 
            fontSize: '0.7rem', 
            fontWeight: '900', 
            letterSpacing: '0.2em', 
            textTransform: 'uppercase', 
            textDecoration: 'none',
            color: isTitleHovered ? COLORS.lightText : 'rgba(203, 219, 252, 0.3)', 
            transition: 'color 0.8s ease'
          }}
        >
          {isCollapsed ? 'W' : 'Documentation / Wiki'}
        </Link>
      </div>

      <nav style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '0.2rem', 
        overflowY: 'auto', 
        maxHeight: 'calc(100vh - 150px)' 
      }}>
        {tree.map((node: any) => (
          <NavNode key={node.path} node={node} isCollapsed={isCollapsed} />
        ))}
      </nav>
    </aside>
  );
}