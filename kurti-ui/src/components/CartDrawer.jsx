import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck, ShieldCheck, CheckCircle, MessageCircle, CreditCard } from 'lucide-react';
import { PROMO_CODES } from '../data/products';
import { getCartWhatsAppUrl } from '../utils/whatsapp';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  appliedPromo,
  setAppliedPromo,
  onRazorpayPay,
  onCheckoutSuccess
}) {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const FREE_SHIPPING_THRESHOLD = 999;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Discount calculation
  let discountAmount = 0;
  if (appliedPromo && PROMO_CODES[appliedPromo]) {
    const promo = PROMO_CODES[appliedPromo];
    if (promo.discountPercent) {
      discountAmount = Math.round((subtotal * promo.discountPercent) / 100);
    } else if (promo.discountFlat) {
      discountAmount = promo.discountFlat;
    }
  }

  const shippingFee = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    setPromoError('');
    setPromoSuccess('');

    if (!code) return;

    if (PROMO_CODES[code]) {
      const promo = PROMO_CODES[code];
      if (subtotal < promo.minOrder) {
        setPromoError(`Minimum cart value of ₹${promo.minOrder} required for ${code}`);
        return;
      }
      setAppliedPromo(code);
      setPromoSuccess(`Coupon ${code} applied successfully!`);
      setPromoInput('');
    } else {
      setPromoError('Invalid coupon code. Try FESTIVE25 or KURTI10');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoSuccess('');
    setPromoError('');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-drawer"
        style={{
          width: '100%',
          maxWidth: '460px',
          height: '100vh',
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 30px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Cart Header */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="brand-emblem-shield"
              style={{
                width: '36px',
                height: '36px',
                flexShrink: 0
              }}
            >
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <span className="brand-crown-icon" style={{ fontSize: '0.58rem', color: '#fef08a', display: 'block', marginBottom: '1px' }}>
                  👑
                </span>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, fontFamily: 'var(--font-royal)', color: '#ffffff', letterSpacing: '0.04em' }}>
                  DC
                </span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 className="brand-shimmer-maroon" style={{ margin: 0, fontSize: '1.15rem' }}>
                  Shopping Bag
                </h3>
                <span
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}
                >
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
                </span>
              </div>
              <span style={{ fontSize: '0.68rem', color: '#78716c', fontWeight: 600 }}>
                Durgesh Collection • Handcrafted Ethnic
              </span>
            </div>
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

        {/* Free Shipping Progress Meter */}
        <div style={{ padding: '12px 24px', backgroundColor: '#fefce8', borderBottom: '1px solid #fef08a' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#854d0e', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={16} />
              {amountNeededForFreeShipping === 0 ? (
                <strong style={{ color: '#15803d' }}>🎉 You unlocked FREE Express Shipping!</strong>
              ) : (
                <span>Add <strong>₹{amountNeededForFreeShipping}</strong> more for FREE Shipping!</span>
              )}
            </span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: '#fef08a', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${shippingProgress}%`,
                height: '100%',
                backgroundColor: amountNeededForFreeShipping === 0 ? '#16a34a' : 'var(--color-primary)',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <ShoppingBag size={54} color="#d6d3d1" style={{ margin: '0 auto 16px' }} />
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#292524', margin: '0 0 6px' }}>
                Your bag is empty
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#78716c', margin: '0 0 20px' }}>
                Looks like you haven't added any designer kurtis to your bag yet.
              </p>
              <button onClick={onClose} className="btn-primary" style={{ fontSize: '0.85rem' }}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #f5f5f4'
                  }}
                >
                  <img
                    src={item.primaryImage || item.images?.[0]}
                    alt={item.name}
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
                          {item.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id, item.selectedSize, item.selectedColor)}
                          style={{ background: 'none', border: 'none', color: '#a8a29e', cursor: 'pointer', padding: 0 }}
                          title="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', color: '#78716c', marginTop: '4px' }}>
                        <span>Size: <strong style={{ color: '#1c1917' }}>{item.selectedSize}</strong></span>
                        {item.selectedColor && (
                          <span>Color: <strong style={{ color: '#1c1917' }}>{item.selectedColor}</strong></span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#1c1917' }}>
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                        {item.quantity > 1 && (
                          <span style={{ fontSize: '0.72rem', color: '#a8a29e' }}>
                            (₹{item.price}/ea)
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid var(--color-border)',
                          borderRadius: '6px',
                          overflow: 'hidden'
                        }}
                      >
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                          style={{ background: '#f5f5f4', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span style={{ padding: '0 10px', fontSize: '0.8rem', fontWeight: 700 }}>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                          style={{ background: '#f5f5f4', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Promo Code & Order Summary (Only when items exist) */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-cream)'
            }}
          >
            {/* Promo Code Input */}
            <div style={{ marginBottom: '16px' }}>
              {appliedPromo ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#ecfdf5',
                    border: '1px dashed #10b981',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#065f46', fontWeight: 600 }}>
                    <Tag size={15} />
                    <span>Coupon <strong>{appliedPromo}</strong> Applied (-₹{discountAmount})</span>
                  </div>
                  <button
                    onClick={handleRemovePromo}
                    style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. FESTIVE25)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid var(--color-border)',
                      fontSize: '0.8rem',
                      outline: 'none',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Apply
                  </button>
                </form>
              )}
              {promoError && <p style={{ margin: '4px 0 0', color: '#dc2626', fontSize: '0.72rem' }}>{promoError}</p>}
              {promoSuccess && <p style={{ margin: '4px 0 0', color: '#16a34a', fontSize: '0.72rem' }}>{promoSuccess}</p>}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#57534e' }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 600 }}>
                  <span>Coupon Discount</span>
                  <span>-₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#57534e' }}>
                <span>Estimated Shipping</span>
                <span>{shippingFee === 0 ? <strong style={{ color: '#16a34a' }}>FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  color: '#1c1917',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--color-border)'
                }}
              >
                <span>Grand Total</span>
                <span style={{ color: 'var(--color-primary)' }}>₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Razorpay Live Payment Gateway Button */}
              <button
                onClick={() => {
                  if (onRazorpayPay) {
                    onRazorpayPay({
                      amount: grandTotal,
                      items: cartItems,
                      appliedPromo
                    });
                  } else {
                    onCheckoutSuccess();
                  }
                }}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.95rem',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <CreditCard size={18} /> Pay ₹{grandTotal.toLocaleString()} with Razorpay
              </button>

              {/* WhatsApp Direct Bag Checkout Button */}
              <button
                onClick={() => {
                  const url = getCartWhatsAppUrl(cartItems, grandTotal, appliedPromo);
                  window.open(url, '_blank');
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)',
                  transition: 'all 0.2s ease'
                }}
              >
                <MessageCircle size={18} /> Complete Order via WhatsApp
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '14px', fontSize: '0.72rem', color: '#78716c' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} color="#16a34a" /> 256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span>COD, UPI & Cards Supported</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
