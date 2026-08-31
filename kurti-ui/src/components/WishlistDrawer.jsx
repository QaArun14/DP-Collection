import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistProducts,
  onRemoveFromWishlist,
  onMoveToCart,
  onAddAllToCart
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-drawer"
        style={{
          width: '100%',
          maxWidth: '440px',
          height: '100vh',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Wishlist Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-cream)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Heart size={22} color="#e11d48" fill="#e11d48" />
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#1c1917' }}>
              My Wishlist
            </h3>
            <span
              style={{
                backgroundColor: '#e11d48',
                color: '#ffffff',
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px'
              }}
            >
              {wishlistProducts.length} Items
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#78716c',
              padding: '4px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Wishlist Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {wishlistProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Heart size={54} color="#fecdd3" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#292524', margin: '0 0 6px' }}>
                Your wishlist is empty
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#78716c', margin: '0 0 20px' }}>
                Tap the heart icon on any kurti to save it for later or track sales.
              </p>
              <button onClick={onClose} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                Explore Kurtis
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {wishlistProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #f5f5f4'
                  }}
                >
                  <img
                    src={product.primaryImage || product.images?.[0]}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
                    }}
                    style={{
                      width: '74px',
                      height: '96px',
                      borderRadius: '8px',
                      objectFit: 'cover'
                    }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1c1917', lineHeight: 1.25 }}>
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          style={{ background: 'none', border: 'none', color: '#a8a29e', cursor: 'pointer', padding: 0 }}
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#78716c' }}>
                        {product.fabric}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1c1917' }}>
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#a8a29e', textDecoration: 'line-through' }}>
                          ₹{product.originalPrice.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => onMoveToCart(product)}
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: '#ffffff',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <ShoppingBag size={13} /> Move to Bag
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Wishlist Bottom Footer */}
        {wishlistProducts.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-cream)'
            }}
          >
            <button
              onClick={onAddAllToCart}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '0.9rem', borderRadius: '10px' }}
            >
              Move All to Bag <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
