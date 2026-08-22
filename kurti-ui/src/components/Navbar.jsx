import React, { useState } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Sparkles, LayoutDashboard } from 'lucide-react';

export default function Navbar({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  storeSettings,
  onOpenAdmin,
  products = [],
  onQuickView
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const matchingProducts = React.useMemo(() => {
    const q = (searchQuery || '').toLowerCase().trim();
    if (!q) return [];
    return products.filter((p) => {
      return (
        (p.name || '').toLowerCase().includes(q) ||
        (p.fabric || '').toLowerCase().includes(q) ||
        (p.craft || '').toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.tag || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    });
  }, [products, searchQuery]);

  const navLinks = [
    { id: 'all', label: 'All Kurtis' },
    { id: 'straight', label: 'Straight Kurtis' },
    { id: 'anarkali', label: 'Anarkali & Flared' },
    { id: 'sets', label: 'Kurta Pant Sets' },
    { id: 'short', label: 'Short Tunics' },
    { id: 'festive', label: 'Festive Silk' },
  ];

  const handleNavClick = (id) => {
    setSelectedCategory(id);
    setMobileMenuOpen(false);
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, width: '100%' }}>
      {/* Top Festive Announcement Bar */}
      <div
        style={{
          backgroundColor: '#5c0017',
          color: '#ffffff',
          padding: '7px 16px',
          fontSize: '0.8rem',
          fontWeight: 500,
          letterSpacing: '0.03em',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(212, 175, 55, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}>
          <Sparkles size={14} color="#d4af37" />
          <span>
            {storeSettings?.announcementText || '🌸 FESTIVE UTSAV SALE: Get Flat 25% OFF with code FESTIVE25 | Free Delivery above ₹999 🚚'}
          </span>
        </div>

        {/* Quick Admin CMS Button in Header */}
        <button
          onClick={onOpenAdmin}
          style={{
            backgroundColor: 'rgba(212, 175, 55, 0.2)',
            color: '#fef08a',
            border: '1px solid #d4af37',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Open Admin Content Management System"
        >
          <LayoutDashboard size={13} /> Admin CMS
        </button>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className="glass-header"
        style={{
          borderBottom: '1px solid var(--color-border)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: '12px',
            paddingBottom: '12px',
            gap: '16px'
          }}
        >
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-primary)'
            }}
            className="mobile-only-btn"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Luxury Animated Brand Logo */}
          <a
            href="#"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              transition: 'transform 0.25s ease'
            }}
            className="brand-container-hover"
          >
            {/* Animated Royal Monogram Emblem */}
            <div
              className="brand-emblem-shield"
              style={{
                width: '42px',
                height: '42px',
                flexShrink: 0
              }}
            >
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <span className="brand-crown-icon" style={{ fontSize: '0.68rem', color: '#fef08a', display: 'block', marginBottom: '1px' }}>
                  👑
                </span>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, fontFamily: 'var(--font-royal)', color: '#ffffff', letterSpacing: '0.04em' }}>
                  DC
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span
                className="brand-shimmer-maroon"
                style={{
                  fontSize: 'clamp(1.2rem, 2.8vw, 1.55rem)',
                  lineHeight: 1.1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {storeSettings?.storeName?.toUpperCase() || 'DURGESH COLLECTION'}
                <Sparkles size={14} color="#d4af37" className="brand-crown-icon" />
              </span>
              <span className="brand-tagline-glow" style={{ marginTop: '2px' }}>
                {storeSettings?.tagline || 'Ethnic Elegance'}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '24px'
            }}
            className="desktop-nav-links"
          >
            {navLinks.map((link) => {
              const isActive = selectedCategory === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'var(--color-primary)' : '#44403c',
                    cursor: 'pointer',
                    padding: '6px 0',
                    position: 'relative',
                    transition: 'color 0.2s ease',
                    borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent'
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Action Icons (Search, Wishlist, Cart) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Enhanced Search Input Box with Live Autocomplete Dropdown */}
            <div style={{ position: 'relative' }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsSearchFocused(false);
                  setSelectedCategory('all');
                  document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  border: isSearchFocused ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  gap: '8px',
                  width: isSearchFocused ? '240px' : '180px',
                  transition: 'all 0.25s ease',
                  boxShadow: isSearchFocused ? '0 4px 14px rgba(128, 0, 32, 0.15)' : 'none'
                }}
                className="search-container"
              >
                <Search size={16} color={isSearchFocused ? 'var(--color-primary)' : 'var(--color-muted)'} />
                <input
                  type="text"
                  placeholder="Search kurtis, fabrics..."
                  value={searchQuery}
                  onFocus={() => setIsSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim().length > 0) {
                      setSelectedCategory('all');
                    }
                  }}
                  style={{
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.85rem',
                    width: '100%',
                    backgroundColor: 'transparent',
                    fontFamily: 'inherit'
                  }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchFocused(false);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    <X size={14} color="#64748b" />
                  </button>
                )}
              </form>

              {/* Live Instant Search Autocomplete Dropdown */}
              {isSearchFocused && (
                <>
                  {/* Backdrop click dismiss */}
                  <div
                    onClick={() => setIsSearchFocused(false)}
                    style={{ position: 'fixed', inset: 0, zIndex: 110 }}
                  />

                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      width: '320px',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      boxShadow: '0 12px 36px rgba(0,0,0,0.15)',
                      border: '1px solid #e2e8f0',
                      padding: '16px',
                      zIndex: 120,
                      animation: 'fadeIn 0.2s ease-out'
                    }}
                  >
                    {/* If user is typing query */}
                    {searchQuery.trim().length > 0 ? (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                            Search Results ({matchingProducts.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setIsSearchFocused(false);
                              setSelectedCategory('all');
                              document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            View All →
                          </button>
                        </div>

                        {matchingProducts.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto' }}>
                            {matchingProducts.slice(0, 4).map((prod) => (
                              <div
                                key={prod.id}
                                onClick={() => {
                                  setIsSearchFocused(false);
                                  if (onQuickView) onQuickView(prod);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '8px',
                                  borderRadius: '10px',
                                  cursor: 'pointer',
                                  transition: 'background 0.15s ease',
                                  backgroundColor: '#f8fafc'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                              >
                                <img
                                  src={prod.primaryImage}
                                  alt={prod.name}
                                  style={{ width: '42px', height: '54px', borderRadius: '6px', objectFit: 'contain', backgroundColor: '#ffffff', flexShrink: 0 }}
                                />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <h5 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {prod.name}
                                  </h5>
                                  <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', textTransform: 'capitalize' }}>
                                    {prod.fabric || prod.category}
                                  </span>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                                    ₹{prod.price?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                            <p style={{ margin: '0 0 8px', fontSize: '0.85rem', color: '#64748b' }}>
                              No kurtis found matching "{searchQuery}"
                            </p>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Try searching popular styles below:</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* If input is empty, show trending quick search tags */
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', display: 'block', marginBottom: '10px' }}>
                          🔥 Popular Searches
                        </span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {['Anarkali', 'Mulmul Cotton', 'Jaipuri Print', 'Chanderi Silk', 'Kurta Pant Set', 'Festive'].map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => {
                                setSearchQuery(tag);
                                setSelectedCategory('all');
                                setIsSearchFocused(false);
                                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              style={{
                                backgroundColor: '#f8fafc',
                                border: '1px solid #cbd5e1',
                                padding: '5px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                color: '#334155',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                e.currentTarget.style.color = '#ffffff';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#f8fafc';
                                e.currentTarget.style.color = '#334155';
                              }}
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom Submit Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchFocused(false);
                        setSelectedCategory('all');
                        document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn-primary"
                      style={{
                        width: '100%',
                        marginTop: '12px',
                        padding: '8px',
                        fontSize: '0.8rem',
                        borderRadius: '8px'
                      }}
                    >
                      Search All Catalog Kurtis →
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              style={{
                position: 'relative',
                background: '#ffffff',
                border: '1px solid var(--color-border)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: wishlistCount > 0 ? '#e11d48' : '#44403c',
                transition: 'all 0.2s ease'
              }}
              title="View Wishlist"
              aria-label="Wishlist"
            >
              <Heart size={19} fill={wishlistCount > 0 ? '#e11d48' : 'none'} />
              {wishlistCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: '#e11d48',
                    color: '#ffffff',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff'
                  }}
                >
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              style={{
                position: 'relative',
                background: 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                height: '40px',
                padding: '0 16px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                boxShadow: '0 3px 10px rgba(128,0,32,0.25)',
                transition: 'all 0.2s ease'
              }}
              aria-label="Open Shopping Bag"
            >
              <ShoppingBag size={18} />
              <span className="cart-label">Bag</span>
              <span
                style={{
                  backgroundColor: '#d4af37',
                  color: '#1a1a1a',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  lineHeight: 1
                }}
              >
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Search */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--color-border)',
              padding: '16px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {/* Mobile Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                setSelectedCategory('all');
                document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px',
                gap: '10px'
              }}
            >
              <Search size={18} color="#64748b" />
              <input
                type="text"
                placeholder="Search kurtis by name, fabric, style..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedCategory('all');
                }}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9rem',
                  width: '100%',
                  backgroundColor: 'transparent'
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <X size={16} color="#64748b" />
                </button>
              )}
            </form>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: selectedCategory === link.id ? 700 : 500,
                  color: selectedCategory === link.id ? 'var(--color-primary)' : '#292524',
                  padding: '8px 0',
                  cursor: 'pointer',
                  borderBottom: '1px dashed #f5f5f4'
                }}
              >
                {link.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .mobile-only-btn {
            display: none !important;
          }
          .search-container {
            width: 220px !important;
          }
        }
        @media (max-width: 480px) {
          .cart-label {
            display: none;
          }
          .search-container {
            width: 140px !important;
          }
        }
      `}</style>
    </header>
  );
}
