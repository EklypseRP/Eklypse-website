'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const COLORS = {
  purple: '#683892',
  lightText: '#CBDBFC',
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-body" style={{
      lineHeight: '1.8',
      fontSize: '1.1rem',
      color: 'rgba(203, 219, 252, 0.9)',
    }}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // --- TITRES (h1 à h6) ---
          h1: ({ ...props }) => <h1 style={{ color: COLORS.lightText, fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: `2px solid ${COLORS.purple}`, paddingBottom: '0.5rem' }} {...props} />,
          h2: ({ ...props }) => <h2 style={{ color: COLORS.lightText, fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem', marginBottom: '1rem' }} {...props} />,
          h3: ({ ...props }) => <h3 style={{ color: COLORS.lightText, fontSize: '1.5rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }} {...props} />,
          h4: ({ ...props }) => <h4 style={{ color: COLORS.purple, fontSize: '1.25rem', fontWeight: 'bold', marginTop: '1.5rem' }} {...props} />,

          // --- MISE EN FORME ---
          strong: ({ ...props }) => <strong style={{ color: COLORS.purple, fontWeight: 'bold' }} {...props} />,
          em: ({ ...props }) => <em style={{ fontStyle: 'italic', color: 'rgba(203, 219, 252, 1)' }} {...props} />,
          p: ({ ...props }) => <p style={{ marginBottom: '1.25rem' }} {...props} />,

          // --- LISTES ---
          ul: ({ ...props }) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'square' }} {...props} />,
          ol: ({ ...props }) => <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'decimal' }} {...props} />,
          li: ({ ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />,

          // --- LIENS ---
          a: ({ ...props }) => (
            <a 
              style={{ color: COLORS.purple, textDecoration: 'underline', fontWeight: '500' }} 
              target={props.href?.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              {...props} 
            />
          ),

          // --- CITATIONS ---
          blockquote: ({ ...props }) => (
            <blockquote style={{ 
              borderLeft: `4px solid ${COLORS.purple}`, 
              background: 'rgba(104, 56, 146, 0.1)', 
              margin: '1.5rem 0', 
              padding: '1rem 1.5rem', 
              fontStyle: 'italic',
              borderRadius: '0 8px 8px 0'
            }} {...props} />
          ),

          // --- TABLEAUX ---
          table: ({ ...props }) => (
            <div style={{ overflowX: 'auto', margin: '2rem 0', borderRadius: '8px', border: '1px solid rgba(104, 56, 146, 0.2)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#050308' }} {...props} />
            </div>
          ),
          th: ({ ...props }) => <th style={{ background: 'rgba(104, 56, 146, 0.3)', color: COLORS.lightText, padding: '0.75rem', border: '1px solid rgba(104, 56, 146, 0.2)', textAlign: 'left' }} {...props} />,
          td: ({ ...props }) => <td style={{ padding: '0.75rem', border: '1px solid rgba(104, 56, 146, 0.1)' }} {...props} />,

          // --- GESTION DU CODE ---
          pre: ({ ...props }) => (
            <pre style={{ 
              background: '#000000', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              overflowX: 'auto', 
              border: '1px solid rgba(104, 56, 146, 0.3)',
              margin: '1.5rem 0'
            }} {...props} />
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = !!className || String(children).includes('\n');
            if (isBlock) {
              return <code style={{ display: 'block', fontFamily: 'monospace', color: '#CBDBFC', background: 'transparent', padding: 0 }} {...props}>{children}</code>;
            }
            return (
              <code style={{ fontFamily: 'monospace', color: COLORS.purple, background: 'rgba(104, 56, 146, 0.2)', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.9em' }} {...props}>
                {children}
              </code>
            );
          },

          // --- IMAGES ---
          img: ({ ...props }) => (
            <span style={{ display: 'block', textAlign: 'center', margin: '2.5rem 0' }}>
              <img {...props} style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px', border: '1px solid rgba(104, 56, 146, 0.3)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} />
              {props.title && <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.5 }}>{props.title}</span>}
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      <style jsx global>{`
        .markdown-body ul ul { margin: 0.5rem 0; list-style-type: circle; }
      `}</style>
    </div>
  );
}