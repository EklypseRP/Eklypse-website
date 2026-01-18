'use client';

import React, { useState } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { loreCategories, loreArticles, LoreArticle, LoreCategory } from '../data/loreData';

const COLORS = {
  purple: '#683892',
  darkPurple: '#321B46',
  lightText: '#CBDBFC',
  cardBg: 'rgba(50, 27, 70, 0.5)',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
};

// Icône de recherche
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

// Icône de retour
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const LorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<LoreArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les articles par catégorie et recherche
  const getFilteredArticles = (): LoreArticle[] => {
    let filtered = loreArticles;

    if (selectedCategory) {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedArticle(null);
  };

  const handleArticleClick = (article: LoreArticle) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setSelectedArticle(null);
    setSearchQuery('');
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '3rem' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: `linear-gradient(to right, ${COLORS.lightText}, ${COLORS.purple})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Wiki d'Eklypse
        </h1>
        <p style={{ color: 'rgba(203, 219, 252, 0.8)', fontSize: '1.125rem' }}>
          Explorez l'histoire, les lieux et les secrets du monde d'Eklypse
        </p>
      </div>

      {/* Barre de recherche */}
      <div style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: COLORS.cardBg,
          border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: '0.5rem',
          padding: '0.75rem 1rem',
          backdropFilter: 'blur(8px)'
        }}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Rechercher dans le wiki..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              marginLeft: '0.75rem',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: COLORS.lightText,
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      {/* Vue Article */}
      {selectedArticle ? (
        <div>
          <button
            onClick={handleBackToList}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: COLORS.purple,
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '1.5rem',
              padding: '0.5rem',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = COLORS.lightText}
            onMouseOut={(e) => e.currentTarget.style.color = COLORS.purple}
          >
            <BackIcon />
            Retour à la liste
          </button>

          <div style={{
            background: COLORS.cardBg,
            backdropFilter: 'blur(8px)',
            borderRadius: '0.5rem',
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            border: `1px solid ${COLORS.cardBorder}`
          }}>
            <MarkdownRenderer content={selectedArticle.content} />
            
            {selectedArticle.lastUpdated && (
              <div style={{
                marginTop: '2rem',
                paddingTop: '1rem',
                borderTop: `1px solid ${COLORS.cardBorder}`,
                fontSize: '0.875rem',
                color: 'rgba(203, 219, 252, 0.6)'
              }}>
                Dernière mise à jour : {selectedArticle.lastUpdated}
              </div>
            )}
          </div>
        </div>
      ) : selectedCategory ? (
        /* Vue Liste d'articles */
        <div>
          <button
            onClick={handleBackToCategories}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'transparent',
              border: 'none',
              color: COLORS.purple,
              cursor: 'pointer',
              fontSize: '1rem',
              marginBottom: '1.5rem',
              padding: '0.5rem',
              transition: 'color 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.color = COLORS.lightText}
            onMouseOut={(e) => e.currentTarget.style.color = COLORS.purple}
          >
            <BackIcon />
            Retour aux catégories
          </button>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            color: COLORS.lightText
          }}>
            {loreCategories.find(cat => cat.id === selectedCategory)?.name}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem'
          }}>
            {getFilteredArticles().map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                onClick={() => handleArticleClick(article)}
              />
            ))}
          </div>

          {getFilteredArticles().length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'rgba(203, 219, 252, 0.6)'
            }}>
              Aucun article trouvé dans cette catégorie.
            </div>
          )}
        </div>
      ) : (
        /* Vue Catégories */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem'
        }}>
          {loreCategories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              articleCount={loreArticles.filter(a => a.category === category.id).length}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Composant Carte de Catégorie
interface CategoryCardProps {
  category: LoreCategory;
  articleCount: number;
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, articleCount, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.cardBg,
        backdropFilter: 'blur(8px)',
        borderRadius: '0.5rem',
        padding: '2rem',
        border: `1px solid ${isHovered ? COLORS.purple : COLORS.cardBorder}`,
        cursor: 'pointer',
        transition: 'all 0.3s',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 20px rgba(104, 56, 146, 0.2)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{category.icon}</div>
      <h3 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
        color: COLORS.lightText
      }}>
        {category.name}
      </h3>
      <p style={{
        color: 'rgba(203, 219, 252, 0.7)',
        marginBottom: '1rem',
        fontSize: '0.95rem'
      }}>
        {category.description}
      </p>
      <div style={{
        fontSize: '0.875rem',
        color: COLORS.purple,
        fontWeight: '600'
      }}>
        {articleCount} article{articleCount > 1 ? 's' : ''}
      </div>
    </div>
  );
};

// Composant Carte d'Article
interface ArticleCardProps {
  article: LoreArticle;
  onClick: () => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Extraire un aperçu du contenu (premier paragraphe)
  const getPreview = (content: string): string => {
    const firstParagraph = content.split('\n\n')[1] || content.split('\n\n')[0];
    return firstParagraph.replace(/[#*>\-\d\.]/g, '').substring(0, 150) + '...';
  };

  return (
    <div
      onClick={onClick}
      style={{
        background: COLORS.cardBg,
        backdropFilter: 'blur(8px)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        border: `1px solid ${isHovered ? COLORS.purple : COLORS.cardBorder}`,
        cursor: 'pointer',
        transition: 'all 0.3s',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 10px 20px rgba(104, 56, 146, 0.2)' : 'none'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h4 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '0.75rem',
        color: COLORS.lightText
      }}>
        {article.title}
      </h4>
      <p style={{
        color: 'rgba(203, 219, 252, 0.7)',
        fontSize: '0.9rem',
        lineHeight: '1.5'
      }}>
        {getPreview(article.content)}
      </p>
    </div>
  );
};

export default LorePage;