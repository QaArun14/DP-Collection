import React, { useState, useMemo } from 'react';
import { CATEGORIES } from '../data/products';
import ProductCard from './ProductCard';
import { SlidersHorizontal, ArrowUpDown, SearchX } from 'lucide-react';

export default function ProductGrid({
  products,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onQuickView
}) {
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all'); // 'all', 'under1000', '1000-2000', 'above2000'

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      // Search query filter
      const query = (searchQuery || '').toLowerCase().trim();
      const matchesSearch =
        !query ||
        (p.name || '').toLowerCase().includes(query) ||
        (p.fabric || '').toLowerCase().includes(query) ||
        (p.craft || '').toLowerCase().includes(query) ||
        (p.category || '').toLowerCase().includes(query) ||
        (p.tag || '').toLowerCase().includes(query) ||
        (p.description || '').toLowerCase().includes(query);

      // Price filter
      let matchesPrice = true;
      if (priceFilter === 'under1000') matchesPrice = p.price < 1000;
      else if (priceFilter === '1000-2000') matchesPrice = p.price >= 1000 && p.price <= 2000;
      else if (priceFilter === 'above2000') matchesPrice = p.price > 2000;

      return matchesCategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.originalPrice - b.price - (a.originalPrice - a.price);
      return b.isFeatured ? 1 : -1; // Default 'featured'
    });
  }, [products, selectedCategory, searchQuery, priceFilter, sortBy]);

  return (
    <section id="catalog-section" style={{ padding: '60px 0 80px', backgroundColor: 'var(--color-cream)' }}>
      <div className="container">
        {/* Section Title & Subtitle */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 36px' }}>
          <span className="badge-gold" style={{ marginBottom: '8px', display: 'inline-block' }}>
            Artisan Handcrafted
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 700,
              color: '#1c1917',
              margin: '8px 0'
            }}
          >
            Explore Designer Kurtis
          </h2>
          <p style={{ color: '#78716c', fontSize: '0.95rem', margin: 0 }}>
            Every thread woven with tradition. Pure mulmul cotton, authentic block prints, and festive silks crafted for grace.
          </p>
        </div>

        {/* Category Pill Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '30px'
          }}
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  backgroundColor: isSelected ? 'var(--color-primary)' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#44403c',
                  border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  boxShadow: isSelected ? '0 4px 12px rgba(128,0,32,0.25)' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>{cat.name}</span>
                {cat.id === 'all' && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : '#f5f5f4',
                      padding: '1px 6px',
                      borderRadius: '9999px'
                    }}
                  >
                    {products.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Filter Controls Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            border: '1px solid var(--color-border)',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px'
          }}
        >
          {/* Left: Price Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#78716c', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <SlidersHorizontal size={15} /> Price Filter:
            </span>
            {[
              { id: 'all', label: 'All Prices' },
              { id: 'under1000', label: 'Under ₹999' },
              { id: '1000-2000', label: '₹1,000 - ₹2,000' },
              { id: 'above2000', label: 'Above ₹2,000' }
            ].map((p) => {
              const active = priceFilter === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPriceFilter(p.id)}
                  style={{
                    backgroundColor: active ? '#fef3c7' : '#f5f5f4',
                    color: active ? '#92400e' : '#57534e',
                    border: active ? '1px solid #fde68a' : '1px solid transparent',
                    fontSize: '0.75rem',
                    fontWeight: active ? 700 : 500,
                    padding: '4px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Right: Results Count & Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.82rem', color: '#78716c', fontWeight: 500 }}>
              Showing <strong style={{ color: '#1c1917' }}>{filteredProducts.length}</strong> styles
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={14} color="#78716c" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  fontSize: '0.82rem',
                  fontFamily: 'inherit',
                  color: '#1c1917',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Customer Rated</option>
                <option value="discount">Biggest Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px dashed var(--color-border)',
              padding: '60px 20px',
              textAlign: 'center',
              maxWidth: '500px',
              margin: '0 auto'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#fef2f2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#ef4444'
              }}
            >
              <SearchX size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1c1917', margin: '0 0 8px' }}>
              No kurtis found
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#78716c', margin: '0 0 20px' }}>
              We couldn't find any designs matching your filter criteria. Try resetting filters or searching with different keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setPriceFilter('all');
              }}
              className="btn-primary"
              style={{ fontSize: '0.85rem', padding: '8px 20px' }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
              gap: '26px'
            }}
          >
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.includes(product.id)}
                onToggleWishlist={onToggleWishlist}
                onAddToCart={onAddToCart}
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
