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
      fontSize: '1.05rem',
      color: 'rgba(203, 219, 252, 0.9)',
    }}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // --- TITRES (h1 à h6) ---
          h1: ({ ...props }) => <h1 style={{ color: COLORS.lightText, fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1.5rem', borderBottom: `2px solid ${COLORS.purple}`, paddingBottom: '0.5rem' }} {...props} />,
          h2: ({ ...props }) => <h2 style={{ color: COLORS.lightText, fontSize: '2rem', fontWeight: 'bold', marginTop: '2.5rem', marginBottom: '1rem' }} {...props} />,
          h3: ({ ...props }) => <h3 style={{ color: COLORS.lightText, fontSize: '1.5rem', fontWeight: 'bold', marginTop: '2rem', marginBottom: '0.75rem' }} {...props} />,

          // --- MISE EN FORME ---
          p: ({ ...props }) => <p style={{ marginBottom: '1.25rem' }} {...props} />,
          strong: ({ ...props }) => <strong style={{ color: COLORS.purple, fontWeight: 'bold' }} {...props} />,
          em: ({ ...props }) => <em style={{ fontStyle: 'italic' }} {...props} />,

          // --- LISTES ---
          ul: ({ ...props }) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'square' }} {...props} />,
          ol: ({ ...props }) => <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem', listStyleType: 'decimal' }} {...props} />,
          li: ({ ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />,

          // --- BLOCS DE CODE (Le conteneur) ---
          pre: ({ ...props }) => (
            <pre style={{ 
              background: '#0D0D0D', 
              padding: '1.5rem', 
              borderRadius: '12px', 
              overflowX: 'auto', 
              border: '1px solid rgba(104, 56, 146, 0.3)',
              margin: '1.5rem 0',
              lineHeight: '1.5'
            }} {...props} />
          ),

          // --- CODE (La logique intelligente Inline vs Bloc) ---
          code: ({ className, children, ...props }) => {
            // Un bloc de code a généralement une classe "language-xxxx"
            // ou contient des retours à la ligne.
            const isBlock = !!className || String(children).includes('\n');

            if (isBlock) {
              return (
                <code 
                  className={className}
                  style={{ 
                    display: 'block',
                    fontFamily: 'monospace', 
                    color: '#CBDBFC', 
                    fontSize: '0.9rem',
                    background: 'transparent', // Pas de fond violet ici
                    padding: 0
                  }} 
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // Style pour le code INLINE (au milieu d'une phrase)
            return (
              <code 
                style={{ 
                  fontFamily: 'monospace', 
                  color: COLORS.purple, 
                  background: 'rgba(104, 56, 146, 0.2)',
                  padding: '0.2rem 0.4rem',
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }} 
                {...props}
              >
                {children}
              </code>
            );
          },

          // --- AUTRES ÉLÉMENTS ---
          blockquote: ({ ...props }) => (
            <blockquote style={{ borderLeft: `4px solid ${COLORS.purple}`, background: 'rgba(104, 56, 146, 0.1)', margin: '1.5rem 0', padding: '1rem 1.5rem', fontStyle: 'italic', borderRadius: '0 8px 8px 0' }} {...props} />
          ),
          table: ({ ...props }) => (
            <div style={{ overflowX: 'auto', margin: '2rem 0', borderRadius: '8px', border: '1px solid rgba(104, 56, 146, 0.2)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(28, 15, 38, 0.6)' }} {...props} />
            </div>
          ),
          th: ({ ...props }) => <th style={{ background: 'rgba(104, 56, 146, 0.3)', color: COLORS.lightText, padding: '0.75rem', border: '1px solid rgba(104, 56, 146, 0.2)', textAlign: 'left' }} {...props} />,
          td: ({ ...props }) => <td style={{ padding: '0.75rem', border: '1px solid rgba(104, 56, 146, 0.1)' }} {...props} />,
          img: ({ ...props }) => (
            <span style={{ display: 'block', textAlign: 'center', margin: '2.5rem 0' }}>
              <img {...props} style={{ maxWidth: '100%', borderRadius: '12px', border: '1px solid rgba(104, 56, 146, 0.3)' }} />
            </span>
          ),
          a: ({ ...props }) => <a style={{ color: COLORS.purple, textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer" {...props} />,
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