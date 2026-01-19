import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Constantes de couleurs pour garder la cohérence avec le thème Eklypse
const COLORS = {
  purple: '#683892',
  lightText: '#CBDBFC',
};

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-container" style={{
      lineHeight: '1.8',
      fontSize: '1.1rem',
      color: 'rgba(203, 219, 252, 0.9)',
    }}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          // --- TITRES ---
          h1: ({ ...props }) => (
            <h1 style={{ color: COLORS.lightText, fontSize: '2.5rem', marginBottom: '1.5rem', borderBottom: `1px solid ${COLORS.purple}`, paddingBottom: '0.5rem', fontWeight: 'bold' }} {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 style={{ color: COLORS.lightText, fontSize: '1.8rem', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }} {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 style={{ color: COLORS.purple, fontSize: '1.4rem', marginTop: '2rem', fontWeight: 'semibold' }} {...props} />
          ),
          
          // --- TEXTE ---
          p: ({ ...props }) => (
            <p style={{ marginBottom: '1.2rem', maxWidth: '100%' }} {...props} />
          ),
          strong: ({ ...props }) => (
            <strong style={{ color: COLORS.purple, fontWeight: 'bold' }} {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote style={{ borderLeft: `4px solid ${COLORS.purple}`, paddingLeft: '1.5rem', fontStyle: 'italic', margin: '2rem 0', color: 'rgba(203, 219, 252, 0.7)', backgroundColor: 'rgba(104, 56, 146, 0.05)', padding: '1rem 1.5rem' }} {...props} />
          ),
          
          // --- TABLEAUX (GFM) ---
          table: ({ ...props }) => (
            <div style={{ overflowX: 'auto', margin: '2.5rem 0', borderRadius: '8px', border: '1px solid rgba(104, 56, 146, 0.3)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(28, 15, 38, 0.4)' }} {...props} />
            </div>
          ),
          thead: ({ ...props }) => (
            <thead style={{ background: 'rgba(104, 56, 146, 0.4)' }} {...props} />
          ),
          th: ({ ...props }) => (
            <th style={{ border: '1px solid rgba(104, 56, 146, 0.3)', padding: '1rem', textAlign: 'left', color: COLORS.lightText, fontWeight: 'bold' }} {...props} />
          ),
          td: ({ ...props }) => (
            <td style={{ border: '1px solid rgba(104, 56, 146, 0.2)', padding: '1rem' }} {...props} />
          ),
          
          // --- IMAGES ---
          img: ({ ...props }) => (
            <span style={{ display: 'block', textAlign: 'center', margin: '3rem 0' }}>
              <img 
                {...props} 
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto', 
                  borderRadius: '12px',
                  border: '1px solid rgba(104, 56, 146, 0.4)',
                  boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6)'
                }} 
              />
              {props.title && (
                <span style={{ display: 'block', marginTop: '1rem', fontSize: '0.9rem', opacity: 0.5, fontStyle: 'italic' }}>
                  {props.title}
                </span>
              )}
            </span>
          ),

          // --- CODE ET LISTES ---
          code: ({ ...props }) => (
            <code style={{ backgroundColor: 'rgba(104, 56, 146, 0.2)', padding: '0.2rem 0.5rem', borderRadius: '4px', color: COLORS.purple, fontFamily: 'monospace' }} {...props} />
          ),
          ul: ({ ...props }) => <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem', listStyleType: 'square' }} {...props} />,
          ol: ({ ...props }) => <ol style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }} {...props} />,
          li: ({ ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />,

          // --- LIENS ---
          a: ({ ...props }) => (
            <a style={{ color: COLORS.purple, textDecoration: 'underline', transition: 'opacity 0.2s' }} 
               onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
               onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
               {...props} 
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}