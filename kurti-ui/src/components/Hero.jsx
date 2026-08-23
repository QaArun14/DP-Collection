import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw, Award, Heart } from 'lucide-react';
import { TRUST_PILLARS } from '../data/products';

export default function Hero({ onExploreClick, onFestiveClick, heroContent = {} }) {
  const iconMap = {
    Truck: <Truck size={24} color="#800020" />,
    Sparkles: <Sparkles size={24} color="#800020" />,
    RefreshCw: <RefreshCw size={24} color="#800020" />,
    ShieldCheck: <ShieldCheck size={24} color="#800020" />
  };

  const badge = heroContent?.badge || 'New Autumn / Festive Edition 2026';
  const title = heroContent?.title || 'Handcrafted Grace for the Modern Indian Woman';
  const subtitle = heroContent?.subtitle || 'Experience the timeless charm of Jaipur Handblock prints, pure Chanderi silk Anarkalis, and breezy Mulmul cotton Kurtis. Tailored for comfort, celebrations, and everyday poise.';
  const image = heroContent?.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=85';
  const imageFit = heroContent?.imageFit || 'contain';
  const exploreBtnText = heroContent?.exploreBtnText || 'Explore Collection';
  const festiveBtnText = heroContent?.festiveBtnText || 'Festive Silk Edit (Flat 50% Off)';
  const offerBadgeTitle = heroContent?.offerBadgeTitle || 'Special Festive Drop';
  const offerBadgeSubtitle = heroContent?.offerBadgeSubtitle || 'Gulmohar Mulmul Collection';
  const offerBadgeTag = heroContent?.offerBadgeTag || 'Flat 48% Off';
  const ratingScore = heroContent?.ratingScore || '★ 4.9 / 5.0';
  const ratingText = heroContent?.ratingText || '(15,000+ Happy Customers)';
  const ratingSubtext = heroContent?.ratingSubtext || 'Certified 100% Pure Organic Cotton & Handcrafted Silks';

  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Main Hero Banner */}
      <div
        style={{
          background: 'radial-gradient(circle at 10% 20%, rgba(128, 0, 32, 0.06) 0%, rgba(250, 247, 242, 1) 90%)',
          borderBottom: '1px solid var(--color-border)',
          padding: '48px 0 64px'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '40px',
              alignItems: 'center'
            }}
          >
            {/* Left Content Column */}
            <div style={{ maxWidth: '580px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#fffbeb',
                  border: '1.5px solid #fde68a',
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  marginBottom: '20px',
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.2)'
                }}
              >
                <span className="brand-crown-icon" style={{ fontSize: '1rem' }}>👑</span>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span className="brand-shimmer-maroon" style={{ fontSize: '0.82rem' }}>Durgesh Collection</span>
                  <span style={{ color: '#d97706', fontWeight: 600 }}>• {badge}</span>
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
                  fontWeight: 700,
                  lineHeight: 1.15,
                  color: '#292524',
                  marginBottom: '18px'
                }}
              >
                {title}
              </h1>

              <p
                style={{
                  fontSize: '1.05rem',
                  color: '#57534e',
                  marginBottom: '32px',
                  lineHeight: 1.6
                }}
              >
                {subtitle}
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', marginBottom: '32px' }}>
                <button
                  onClick={onExploreClick}
                  className="btn-primary btn-mobile-full"
                  style={{ fontSize: '0.95rem', padding: '14px 28px' }}
                >
                  {exploreBtnText} <ArrowRight size={18} />
                </button>
                <button
                  onClick={onFestiveClick}
                  className="btn-gold btn-mobile-full"
                  style={{ fontSize: '0.95rem', padding: '14px 26px' }}
                >
                  {festiveBtnText}
                </button>
              </div>

              {/* Social Proof Mini Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(231, 223, 213, 0.9)'
                }}
              >
                <div style={{ display: 'flex', marginLeft: '6px' }}>
                  {['photo-1544005313-94ddf0286df2', 'photo-1534528741775-53994a69daeb', 'photo-1517841905240-472988babdf9', 'photo-1539109136881-3be0616acf4b'].map((img, i) => (
                    <img
                      key={i}
                      src={`https://images.unsplash.com/${img}?auto=format&fit=crop&w=80&q=80`}
                      alt="Customer"
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        border: '2px solid #ffffff',
                        marginLeft: '-10px',
                        objectFit: 'cover'
                      }}
                    />
                  ))}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#d97706', fontWeight: 800, fontSize: '0.9rem' }}>{ratingScore}</span>
                    <span style={{ color: '#78716c', fontSize: '0.8rem' }}>{ratingText}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#a8a29e' }}>
                    {ratingSubtext}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual Image Showcase - Full Image Display Without Cropping */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(92, 0, 23, 0.25)',
                  border: '4px solid #ffffff',
                  backgroundColor: '#fbf9f5',
                  minHeight: 'clamp(340px, 50vh, 520px)',
                  maxHeight: 'clamp(380px, 60vh, 580px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                className="img-zoom-wrapper"
              >
                {/* Ambient Soft Blur Backdrop Layer */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(30px) opacity(0.35)',
                    transform: 'scale(1.15)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Main Full Uncropped Foreground Image */}
                <img
                  src={image}
                  alt="Durgesh Collection Hero Model"
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '100%',
                    maxHeight: 'clamp(360px, 58vh, 560px)',
                    width: imageFit === 'cover' ? '100%' : 'auto',
                    height: imageFit === 'cover' ? '100%' : 'auto',
                    objectFit: imageFit === 'cover' ? 'cover' : 'contain',
                    display: 'block',
                    margin: '0 auto',
                    transition: 'transform 0.4s ease'
                  }}
                />

                {/* Overlay Offer Card (Compact & positioned cleanly) */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: '16px',
                    right: '16px',
                    zIndex: 3,
                    backgroundColor: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(12px)',
                    borderRadius: '14px',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.12)'
                  }}
                >
                  <div>
                    <span className="badge-gold" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>{offerBadgeTitle}</span>
                    <h2
                      style={{
                        fontSize: '0.98rem',
                        fontWeight: 700,
                        margin: '3px 0 1px',
                        color: 'var(--color-primary)'
                      }}
                    >
                      {offerBadgeSubtitle}
                    </h2>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#78716c' }}>
                      Starting at just <strong style={{ color: '#1c1917', fontSize: '0.9rem' }}>₹1,299</strong>
                    </p>
                  </div>
                  <button
                    onClick={onExploreClick}
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '9999px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(128,0,32,0.3)'
                    }}
                  >
                    Shop Now
                  </button>
                </div>

                {/* Floating Discount Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    zIndex: 3,
                    backgroundColor: '#881337',
                    color: '#ffffff',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    letterSpacing: '0.02em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Award size={16} color="#fef08a" />
                  <span>{offerBadgeTag}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Trust Highlights Strip */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid var(--color-border)', padding: '24px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '14px'
            }}
          >
            {TRUST_PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '8px 12px'
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(128, 0, 32, 0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {iconMap[pillar.icon]}
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 2px', color: '#1c1917' }}>
                    {pillar.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#78716c', lineHeight: 1.4 }}>
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
