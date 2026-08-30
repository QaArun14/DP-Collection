import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const CATEGORY_CARDS = [
  {
    id: 'straight',
    title: 'Straight Kurtis',
    subtitle: 'Everyday Office & Casual Charm',
    count: '4 Styles',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    tag: 'Popular'
  },
  {
    id: 'anarkali',
    title: 'Anarkali & Flared',
    subtitle: 'Dramatic Flares & Festive Drama',
    count: '3 Styles',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    tag: 'Trending'
  },
  {
    id: 'sets',
    title: 'Kurta Pant & Dupatta Sets',
    subtitle: 'Ready-to-Wear 3-Piece Elegance',
    count: '3 Sets',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    tag: 'Bestseller'
  },
  {
    id: 'short',
    title: 'Short Tunics & Fusion',
    subtitle: 'Denim Pairings & Boho Silhouettes',
    count: '2 Styles',
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80',
    tag: 'Youth Edit'
  },
  {
    id: 'festive',
    title: 'Festive Silk & Velvet',
    subtitle: 'Royal Zardozi & Banarasi Weaves',
    count: '3 Styles',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80',
    tag: 'Luxury'
  }
];

export default function CategoryShowcase({ onSelectCategory, selectedCategory, products = [], categoryCards }) {
  const displayCards = categoryCards && categoryCards.length > 0 ? categoryCards : CATEGORY_CARDS;

  const getCategoryCount = (catId) => {
    if (!products || products.length === 0) return '';
    const count = products.filter((p) => (p.category || '').toLowerCase().trim() === catId.toLowerCase().trim()).length;
    return `${count} Style${count === 1 ? '' : 's'}`;
  };

  const getCategoryCoverImage = (cat) => {
    const matchingProd = products.find(
      (p) => (p.category || '').toLowerCase().trim() === cat.id.toLowerCase().trim() && (p.primaryImage || p.images?.[0])
    );
    return matchingProd?.primaryImage || matchingProd?.images?.[0] || cat.image;
  };

  const handleCategoryClick = (id) => {
    onSelectCategory(id);
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section style={{ padding: '64px 0 40px', backgroundColor: 'var(--color-sand)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px' }}>
          <span className="badge-gold" style={{ marginBottom: '8px', display: 'inline-block' }}>
            Curated Silhouettes
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.6rem)',
              fontWeight: 700,
              color: '#1c1917',
              margin: '8px 0 12px'
            }}
          >
            Shop Kurtis By Category
          </h2>
          <p style={{ color: '#78716c', fontSize: '0.95rem', margin: 0 }}>
            From everyday office elegance to majestic festive flares, discover hand-tailored pieces crafted for every celebration.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="categories-responsive-grid">
          {displayCards.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                style={{
                  position: 'relative',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  height: 'clamp(240px, 32vh, 340px)',
                  backgroundColor: '#f5f0eb',
                  boxShadow: isSelected
                    ? '0 0 0 3px var(--color-primary), 0 10px 25px rgba(128,0,32,0.3)'
                    : '0 4px 14px rgba(0,0,0,0.06)',
                  transition: 'all 0.3s ease'
                }}
                className="img-zoom-wrapper"
              >
                <img
                  src={getCategoryCoverImage(cat)}
                  alt={cat.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center'
                  }}
                />

                {/* Dark Gradient Overlay for Readability */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(15, 10, 10, 0.88) 0%, rgba(15, 10, 10, 0.2) 60%, rgba(0,0,0,0) 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '18px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'var(--color-primary)',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {cat.tag}
                    </span>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff'
                      }}
                    >
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        margin: '0 0 4px',
                        lineHeight: 1.2
                      }}
                    >
                      {cat.title}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#e7dfd5' }}>
                      {cat.subtitle}
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#fef08a'
                      }}
                    >
                      Explore {getCategoryCount(cat.id) || cat.count} →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
