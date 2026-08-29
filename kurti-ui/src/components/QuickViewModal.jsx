import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check, Sparkles, MessageCircle, CreditCard } from 'lucide-react';
import { getProductWhatsAppUrl } from '../utils/whatsapp';

export default function QuickViewModal({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onDirectCheckout,
  onRazorpayDirectPay
}) {
  if (!product) return null;

  const sizesList = Array.isArray(product?.sizes) && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];
  const colorsList = Array.isArray(product?.colors) && product.colors.length > 0 ? product.colors : [{ name: 'Standard', hex: '#800020' }];

  const [selectedImg, setSelectedImg] = useState(product?.primaryImage || product?.images?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(sizesList[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(colorsList[0] || { name: 'Standard', hex: '#800020' });
  const [quantity, setQuantity] = useState(1);
  const [showAddedMsg, setShowAddedMsg] = useState(false);

  const images =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images.filter((img) => img && typeof img === 'string' && img.trim() !== '')
      : [product?.primaryImage, product?.secondaryImage].filter(Boolean);

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedSize,
      selectedColor: selectedColor?.name || 'Standard',
      quantity
    });
    setShowAddedMsg(true);
    setTimeout(() => setShowAddedMsg(false), 2000);
  };

  const handleBuyNow = () => {
    const item = {
      ...product,
      selectedSize,
      selectedColor: selectedColor?.name || 'Standard',
      quantity
    };
    if (onRazorpayDirectPay) {
      onRazorpayDirectPay([item]);
    } else {
      onAddToCart(item);
      onDirectCheckout();
    }
  };

  const handleWhatsAppOrder = () => {
    const url = getProductWhatsAppUrl(product, selectedSize, selectedColor.name);
    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '920px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border)',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: '#ffffff',
            border: '1px solid var(--color-border)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 'clamp(16px, 3.5vw, 30px)',
            padding: 'clamp(16px, 3.5vw, 28px)'
          }}
        >
          {/* Left Column: Image Gallery */}
          <div>
            <div
              style={{
                borderRadius: '16px',
                overflow: 'hidden',
                height: 'clamp(260px, 38vh, 420px)',
                backgroundColor: '#f5f5f4',
                marginBottom: '12px'
              }}
            >
              <img
                src={selectedImg}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>

            {/* Thumbnail Switcher (Up to 6 Product Photos) */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImg(img)}
                  style={{
                    border: selectedImg === img ? '2.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    width: '54px',
                    height: '54px',
                    padding: 0,
                    cursor: 'pointer',
                    backgroundColor: '#fff',
                    boxShadow: selectedImg === img ? '0 2px 8px rgba(128,0,32,0.25)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                  title={`View Angle ${idx + 1}`}
                >
                  <img src={img} alt={`thumb ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Specs & Ordering */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Badges & Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-gold">{product.craft}</span>
              {product.tag && (
                <span
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  {product.tag}
                </span>
              )}
            </div>

            {/* Product Name */}
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1c1917',
                margin: '0 0 8px',
                lineHeight: 1.25
              }}
            >
              {product.name}
            </h2>

            {/* Ratings & Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div
                style={{
                  backgroundColor: '#fef3c7',
                  color: '#b45309',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
              >
                <span>{product.rating}</span>
                <Star size={12} fill="#b45309" color="#b45309" />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#78716c' }}>
                {product.reviewCount} Verified Customer Ratings
              </span>
            </div>

            {/* Price section */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '10px',
                padding: '12px 16px',
                backgroundColor: 'var(--color-cream)',
                borderRadius: '10px',
                marginBottom: '16px'
              }}
            >
              <span style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                ₹{product.price.toLocaleString()}
              </span>
              <span style={{ fontSize: '1rem', color: '#a8a29e', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString()}
              </span>
              <span className="badge-discount">{product.discount}</span>
              <span style={{ fontSize: '0.75rem', color: '#78716c', marginLeft: 'auto' }}>
                Inclusive of all taxes
              </span>
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#44403c' }}>
                    Color: <strong>{selectedColor.name}</strong>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedColor(c);
                        if (c.image) setSelectedImg(c.image);
                      }}
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: c.hex,
                        border: selectedColor.name === c.name ? '3px solid #1c1917' : '2px solid #ffffff',
                        boxShadow: '0 0 0 1px #d6d3d1',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={c.name}
                    >
                      {selectedColor.name === c.name && <Check size={14} color="#ffffff" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#44403c' }}>
                  Select Size: <strong>{selectedSize}</strong>
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600, cursor: 'pointer' }}>
                  Standard Indian Size Chart
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {sizesList.map((s) => {
                  const isSel = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      style={{
                        border: isSel ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: isSel ? 'rgba(128,0,32,0.08)' : '#ffffff',
                        color: isSel ? 'var(--color-primary)' : '#44403c',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontWeight: isSel ? 700 : 500,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        minWidth: '42px'
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector & Stock Urgency */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    border: 'none',
                    background: '#f5f5f4',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                >
                  -
                </button>
                <span style={{ padding: '0 14px', fontWeight: 700, fontSize: '0.9rem' }}>{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    border: 'none',
                    background: '#f5f5f4',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                >
                  +
                </button>
              </div>

              {product.stock <= 5 && (
                <span style={{ fontSize: '0.78rem', color: '#c2410c', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={14} /> High Demand: Only {product.stock} pieces left!
                </span>
              )}
            </div>

            {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={handleAddToCart}
                className="btn-primary"
                style={{ flex: 1, padding: '12px 14px', fontSize: '0.85rem' }}
              >
                {showAddedMsg ? (
                  <>
                    <Check size={18} /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Bag
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="btn-gold"
                style={{ flex: 1, padding: '12px 14px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <CreditCard size={16} /> Pay with Razorpay
              </button>

              <button
                onClick={() => onToggleWishlist(product)}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: '9999px',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: isWishlisted ? '#e11d48' : '#78716c',
                  flexShrink: 0
                }}
                title="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? '#e11d48' : 'none'} />
              </button>
            </div>

            {/* Direct WhatsApp Instant Order Button */}
            <button
              onClick={handleWhatsAppOrder}
              style={{
                backgroundColor: '#25D366',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 18px',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
                marginBottom: '20px',
                transition: 'all 0.2s ease'
              }}
            >
              <MessageCircle size={18} /> Order Directly on WhatsApp
            </button>

            {/* Product Specifications Mini List */}
            <div
              style={{
                borderTop: '1px solid #f5f5f4',
                paddingTop: '14px',
                fontSize: '0.8rem',
                color: '#57534e',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px'
              }}
            >
              <div><strong>Fabric:</strong> {product.fabric}</div>
              <div><strong>Silhouette:</strong> {product.fit}</div>
              <div><strong>Neckline:</strong> {product.neckline}</div>
              <div><strong>Sleeves:</strong> {product.sleeves}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Wash Care:</strong> {product.washCare}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
