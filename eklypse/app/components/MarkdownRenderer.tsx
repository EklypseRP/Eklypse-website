import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
          // On personnalise chaque balise HTML pour qu'elle corresponde au design
          h1: ({node, ...props}) => <h1 style={{ color: COLORS.lightText, fontSize: '2.5rem', marginBottom: '1.5rem', borderBottom: `1px solid ${COLORS.purple}`, paddingBottom: '0.5rem' }} {...props} />,
          h2: ({node, ...props}) => <h2 style={{ color: COLORS.lightText, fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem' }} {...props} />,
          h3: ({node, ...props}) => <h3 style={{ color: COLORS.purple, fontSize: '1.4rem', marginTop: '1.5rem' }} {...props} />,
          p: ({node, ...props}) => <p style={{ marginBottom: '1.2rem' }} {...props} />,
          strong: ({node, ...props}) => <strong style={{ color: COLORS.purple, fontWeight: 'bold' }} {...props} />,
          ul: ({node, ...props}) => <ul style={{ marginBottom: '1.2rem', paddingLeft: '1.5rem', listStyleType: 'square' }} {...props} />,
          li: ({node, ...props}) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
          code: ({node, ...props}) => (
            <code style={{ 
              backgroundColor: 'rgba(104, 56, 146, 0.2)', 
              padding: '0.2rem 0.4rem', 
              borderRadius: '4px',
              fontFamily: 'monospace',
              color: COLORS.purple
            }} {...props} />
          ),
          blockquote: ({node, ...props}) => (
            <blockquote style={{ 
              borderLeft: `4px solid ${COLORS.purple}`, 
              paddingLeft: '1rem', 
              fontStyle: 'italic', 
              margin: '1.5rem 0',
              color: 'rgba(203, 219, 252, 0.7)'
            }} {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}