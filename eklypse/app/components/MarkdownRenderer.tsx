'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const parseMarkdown = (text: string): string => {
    let html = text;

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="md-h3">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="md-h2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="md-h1">$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="md-link">$1</a>');

    // Lists (unordered)
    html = html.replace(/^\- (.*$)/gim, '<li class="md-li">$1</li>');
    // Remplacer toutes les balises <li> consécutives par une liste
    html = html.replace(/(<li class="md-li">[\s\S]*?<\/li>)(?=\n(?!<li)|\n*$)/g, '<ul class="md-ul">$1</ul>');

    // Lists (ordered)
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="md-li-ordered">$1</li>');
    html = html.replace(/(<li class="md-li-ordered">[\s\S]*?<\/li>)(?=\n(?!<li)|\n*$)/g, '<ol class="md-ol">$1</ol>');

    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="md-blockquote">$1</blockquote>');

    // Paragraphs
    html = html.replace(/\n\n/g, '</p><p class="md-p">');
    html = '<p class="md-p">' + html + '</p>';

    // Clean up empty paragraphs
    html = html.replace(/<p class="md-p"><\/p>/g, '');
    html = html.replace(/<p class="md-p">(<h[1-3])/g, '$1');
    html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1');
    html = html.replace(/<p class="md-p">(<ul)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p class="md-p">(<ol)/g, '$1');
    html = html.replace(/(<\/ol>)<\/p>/g, '$1');
    html = html.replace(/<p class="md-p">(<blockquote)/g, '$1');
    html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');

    return html;
  };

  return (
    <div 
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
      style={{
        color: 'rgba(203, 219, 252, 0.9)',
        lineHeight: '1.75'
      }}
    />
  );
};

export default MarkdownRenderer;