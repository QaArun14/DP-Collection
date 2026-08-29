import React, { useState } from 'react';
import { Heart, Eye, ShoppingBag, Star, Check, MessageCircle } from 'lucide-react';
import { getProductWhatsAppUrl } from '../utils/whatsapp';

export default function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onQuickView
}) {
  const sizesList = Array.isArray(product?.sizes) && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
  const [selectedSize, setSelectedSize] = useState(sizesList[0] || 'M');
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const primaryPhoto = product?.primaryImage || product?.images?.[0] || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80';
  const secondaryPhoto = product?.images?.[1] || product?.secondaryImage || primaryPhoto;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor: product?.colors?.[0]?.name || 'Standard'
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleWhatsAppOrder = (e) => {
    e.stopPropagation();
    const colorName = product?.colors?.[0]?.name || '';
    const url = getProductWhatsAppUrl(product, selectedSize, colorName);
    window.open(url, '_blank');
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: isHovered
          ? '0 16px 30px -6px rgba(80, 20, 20, 0.15), 0 4px 10px -2px rgba(0,0,0,0.05)'
          : '0 2px 8px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Product Image Area */}
      <div
        style={{
          position: 'relative',
          height: 'clamp(200px, 30vh, 340px)',
          overflow: 'hidden',
          backgroundColor: '#f5f5f4',
          cursor: 'pointer'
        }}
        onClick={() => onQuickView(product)}
      >
        <img
          src={isHovered ? secondaryPhoto : primaryPhoto}
          alt={product?.name || 'Kurti'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top center',
            transition: 'transform 0.5s ease'
          }}
        />

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 2
          }}
        >
          {product.tag && (
            <span
              style={{
                backgroundColor: 'rgba(128, 0, 32, 0.95)',
                color: '#ffffff',
                fontSize: '0.68rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              {product.tag}
            </span>
          )}
          {product.stock <= 4 && (
            <span
              style={{
                backgroundColor: 'rgba(194, 65, 12, 0.95)',
                color: '#ffffff',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              Only {product.stock} Left!
            </span>
          )}
        </div>

        {/* Top Right Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 2,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: isWishlisted ? '#e11d48' : '#78716c',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            transition: 'all 0.2s ease'
          }}
          aria-label="Wishlist Item"
        >
          <Heart size={18} fill={isWishlisted ? '#e11d48' : 'none'} />
        </button>

        {/* Quick View Button Hover Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            right: '12px',
            display: 'flex',
            justifyContent: 'center',
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.25s ease',
            zIndex: 3
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(8px)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-border)',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            <Eye size={15} /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information Details */}
      <div style={{ padding: 'clamp(10px, 2.5vw, 16px)', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Rating & Fabric Pill */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
            <div
              style={{
                backgroundColor: '#fef3c7',
                color: '#b45309',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
                padding: '2px 5px',
                borderRadius: '5px',
                fontSize: '0.7rem',
                fontWeight: 700
              }}
            >
              <span>{product.rating}</span>
              <Star size={10} fill="#b45309" color="#b45309" />
            </div>
            <span style={{ fontSize: '0.68rem', color: '#a8a29e' }}>({product.reviewCount})</span>
          </div>

          <span
            style={{
              fontSize: '0.68rem',
              color: '#065f46',
              backgroundColor: '#ecfdf5',
              padding: '2px 5px',
              borderRadius: '4px',
              fontWeight: 600,
              maxWidth: '80px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {product.fabric?.split(' ')[0]} {product.fabric?.split(' ')[1] || ''}
          </span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => onQuickView(product)}
          style={{
            fontSize: 'clamp(0.85rem, 2.2vw, 1rem)',
            fontWeight: 700,
            color: '#1c1917',
            margin: '0 0 4px',
            lineHeight: 1.3,
            cursor: 'pointer',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            minHeight: '2.6em'
          }}
        >
          {product.name}
        </h3>

        {/* Craft / Neckline specs */}
        <p
          style={{
            fontSize: '0.75rem',
            color: '#78716c',
            margin: '0 0 12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {product.craft} • {product.neckline}
        </p>

        {/* Size Selection Chips */}
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#78716c' }}>Size:</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-primary)' }}>{selectedSize}</span>
          </div>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {sizesList.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  style={{
                    border: isSelected ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: isSelected ? 'rgba(128,0,32,0.08)' : '#ffffff',
                    color: isSelected ? 'var(--color-primary)' : '#57534e',
                    fontSize: '0.7rem',
                    fontWeight: isSelected ? 800 : 500,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    minWidth: '28px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price & Action Buttons Footer */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '12px',
            borderTop: '1px solid #f5f5f4',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <span style={{ fontSize: 'clamp(1rem, 2.8vw, 1.25rem)', fontWeight: 800, color: '#1c1917' }}>
                ₹{product.price?.toLocaleString()}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#a8a29e', textDecoration: 'line-through' }}>
                ₹{product.originalPrice?.toLocaleString()}
              </span>
            </div>
            <span className="badge-discount" style={{ fontSize: '0.65rem', padding: '2px 4px' }}>{product.discount}</span>
          </div>

          {/* Action Row: Add to Bag + WhatsApp Direct Order */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={handleAddToCart}
              style={{
                flex: 1,
                backgroundColor: justAdded ? '#059669' : 'var(--color-primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '7px clamp(4px, 1.5vw, 10px)',
                fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 6px rgba(128,0,32,0.2)'
              }}
            >
              {justAdded ? (
                <>
                  <Check size={14} /> Added
                </>
              ) : (
                <>
                  <ShoppingBag size={14} /> Add
                </>
              )}
            </button>

            <button
              onClick={handleWhatsAppOrder}
              style={{
                backgroundColor: '#25D366',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '7px clamp(4px, 1.5vw, 10px)',
                fontSize: 'clamp(0.72rem, 1.8vw, 0.8rem)',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(37, 211, 102, 0.3)',
                transition: 'all 0.2s ease'
              }}
              title="Order on WhatsApp"
            >
              <MessageCircle size={14} /> WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
