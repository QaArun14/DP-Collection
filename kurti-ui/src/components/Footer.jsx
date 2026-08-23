import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function Footer({ onCategoryClick, storeSettings, onOpenAdmin }) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <footer style={{ backgroundColor: '#1c1917', color: '#e7dfd5', paddingTop: '60px', borderTop: '4px solid #d4af37' }}>
      <div className="container">
        {/* VIP Newsletter Box */}
        <div
          style={{
            backgroundColor: '#292524',
            borderRadius: '16px',
            padding: 'clamp(20px, 4vw, 36px) clamp(16px, 3.5vw, 32px)',
            marginBottom: '48px',
            border: '1px solid #44403c',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            alignItems: 'center'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={18} color="#d4af37" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fef08a', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Join {storeSettings?.storeName || 'Durgesh Collection'} VIP Club
              </span>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#ffffff', margin: '0 0 6px' }}>
              Get Flat 15% OFF On Your First Order
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#a8a29e' }}>
              Subscribe for exclusive festive drop alerts, secret flash sales, and styling tips from our master drapers.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  borderRadius: '12px',
                  padding: '16px',
                  textAlign: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#34d399', fontWeight: 700 }}>
                  <CheckCircle2 size={20} />
                  <span>Welcome to the Club!</span>
                </div>
                <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: '#e7dfd5' }}>
                  Use promo code <strong style={{ color: '#fef08a', letterSpacing: '0.05em' }}>FIRSTBUY</strong> at checkout for your special discount!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '9999px',
                      border: '1px solid #57534e',
                      backgroundColor: '#1c1917',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-gold btn-mobile-full"
                  style={{ padding: '12px 22px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
                >
                  <Send size={15} /> Claim 15% Off
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4-Column Main Footer Links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '30px',
            paddingBottom: '48px',
            borderBottom: '1px solid #292524'
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <div
                className="brand-emblem-shield"
                style={{
                  width: '38px',
                  height: '38px',
                  flexShrink: 0
                }}
              >
                <div style={{ textAlign: 'center', lineHeight: 1 }}>
                  <span className="brand-crown-icon" style={{ fontSize: '0.62rem', color: '#fef08a', display: 'block', marginBottom: '1px' }}>
                    👑
                  </span>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, fontFamily: 'var(--font-royal)', color: '#ffffff', letterSpacing: '0.04em' }}>
                    DC
                  </span>
                </div>
              </div>

              <div>
                <span
                  className="brand-shimmer-gold"
                  style={{
                    fontSize: '1.45rem',
                    lineHeight: 1.1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {storeSettings?.storeName?.toUpperCase() || 'DURGESH COLLECTION'}
                </span>
                <span className="brand-tagline-glow" style={{ color: '#fef08a', marginTop: '2px' }}>
                  {storeSettings?.tagline || 'Ethnic Elegance'}
                </span>
              </div>
            </div>

            <p style={{ margin: '14px 0 20px', fontSize: '0.85rem', color: '#a8a29e', lineHeight: 1.6 }}>
              Celebrating authentic Indian craftsmanship. Pure mulmul cotton, chanderi silks, and heritage block prints tailored with passion.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.82rem', color: '#d6d3d1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={15} color="#d4af37" /> {storeSettings?.phone || '+91 97589 99617 (10 AM - 8 PM)'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={15} color="#d4af37" /> {storeSettings?.email || 'care@durgeshcollection.in'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={15} color="#d4af37" /> {storeSettings?.address || 'Sanjay Place, Agra, Uttar Pradesh, India'}
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Shop By Style
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              {[
                { id: 'straight', name: 'Straight Cut Kurtis' },
                { id: 'anarkali', name: 'Anarkali & Kalidar' },
                { id: 'sets', name: 'Kurta Pant Sets' },
                { id: 'short', name: 'Short Peplum & Fusion' },
                { id: 'festive', name: 'Festive Silk Editions' }
              ].map((c) => (
                <a
                  key={c.id}
                  href="#catalog-section"
                  onClick={() => onCategoryClick && onCategoryClick(c.id)}
                  style={{ color: '#a8a29e', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={(e) => (e.target.style.color = '#fef08a')}
                  onMouseLeave={(e) => (e.target.style.color = '#a8a29e')}
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px', letterSpacing: '0.05em' }}>
              Customer Care
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: '#a8a29e' }}>
              <span style={{ cursor: 'pointer' }}>Track Your Order</span>
              <span style={{ cursor: 'pointer' }}>Size Guide & Measurement Chart</span>
              <span style={{ cursor: 'pointer' }}>7-Day Easy Exchange Policy</span>
              <span style={{ cursor: 'pointer' }}>Shipping & COD Guidelines</span>
              <span
                onClick={onOpenAdmin}
                style={{ cursor: 'pointer', color: '#fef08a', fontWeight: 700 }}
              >
                🔐 Admin CMS Login
              </span>
            </div>
          </div>

          {/* Trust & Safe Payment */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '16px', letterSpacing: '0.05em' }}>
              100% Safe & Secure
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#a8a29e', margin: '0 0 16px' }}>
              We support all major Indian UPI Apps, Credit/Debit Cards, Netbanking & Cash On Delivery.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['UPI / GPay / PhonePe', 'Paytm', 'Visa / RuPay', 'Mastercard', 'Cash On Delivery'].map((m, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: '#292524',
                    border: '1px solid #44403c',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    fontSize: '0.72rem',
                    color: '#d6d3d1',
                    fontWeight: 600
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div
          style={{
            padding: '24px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#78716c'
          }}
        >
          <div>
            © 2026 <strong>Durgesh Collection Pvt. Ltd.</strong> All Rights Reserved. Handcrafted with pride in India.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Made with</span> <Heart size={13} color="#e11d48" fill="#e11d48" /> <span>for ethnic fashion lovers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
