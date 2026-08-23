import React from 'react';
import { Feather, Sun, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

export default function CraftStory({ craftContent = {} }) {
  const tag = craftContent?.tag || 'The Durgesh Collection Promise';
  const title = craftContent?.title || 'Preserving Ancient Indian Handloom Crafts';
  const description = craftContent?.description || 'Unlike fast-fashion polyester garments, every Durgesh Collection kurti is individually crafted by skilled artisans in Rajasthan and Lucknow. We believe ethnic clothing should feel as pure and gentle on your skin as it looks magnificent.';
  const image = craftContent?.image || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80';
  const badgeYears = craftContent?.badgeYears || '30+';
  const badgeText = craftContent?.badgeText || 'Years of Heritage Artisan Weaving';

  const craftFeatures = [
    {
      icon: <Feather size={26} color="#d4af37" />,
      title: 'Hand-Carved Teakwood Blocks',
      desc: 'Each motif is painstakingly carved by third-generation master artisans onto seasoned teak wood.'
    },
    {
      icon: <Sun size={26} color="#d4af37" />,
      title: 'Sun-Cured Organic Dyes',
      desc: 'Naturally derived plant colors and vegetable pigments rinsed in open-air sunlight for rich luster.'
    },
    {
      icon: <Sparkles size={26} color="#d4af37" />,
      title: 'Feather-Soft Mulmul Cotton',
      desc: '100% breathable organic cotton weave that keeps you effortlessly cool through Indian summers.'
    },
    {
      icon: <HeartHandshake size={26} color="#d4af37" />,
      title: 'Fair Trade & Inclusive Sizing',
      desc: 'Ethically crafted directly empowering 450+ rural women weavers with sizes ranging from XS to 3XL.'
    }
  ];

  return (
    <section
      style={{
        backgroundColor: '#5c0017',
        color: '#ffffff',
        padding: '80px 0',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative Gold Accent */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }}
      />

      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px',
            alignItems: 'center'
          }}
        >
          {/* Left: Artisan Story Image Grid */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                border: '2px solid rgba(212, 175, 55, 0.4)',
                backgroundColor: 'rgba(28, 25, 23, 0.85)',
                minHeight: '340px',
                maxHeight: '460px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Soft ambient blur backdrop */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(25px) opacity(0.35)',
                  transform: 'scale(1.15)',
                  pointerEvents: 'none'
                }}
              />

              <img
                src={image}
                alt="Durgesh Collection Artisan Craft"
                style={{
                  position: 'relative',
                  zIndex: 2,
                  maxWidth: '100%',
                  maxHeight: '440px',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  margin: '0 auto'
                }}
              />

              {/* Seamless Experience Floating Glass Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  right: '12px',
                  zIndex: 10,
                  backgroundColor: 'rgba(20, 16, 15, 0.94)',
                  border: '1.5px solid #d4af37',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.7)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <span className="brand-crown-icon" style={{ fontSize: '1.2rem' }}>👑</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fef08a', lineHeight: 1, fontFamily: 'var(--font-royal)' }}>
                  {badgeYears}
                </span>
                <div style={{ fontSize: '0.75rem', color: '#e7dfd5', lineHeight: 1.3, fontWeight: 600 }}>
                  {badgeText}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Craft Principles */}
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(212, 175, 55, 0.25)',
                color: '#fef08a',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '6px 14px',
                borderRadius: '9999px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                border: '1.5px solid rgba(212, 175, 55, 0.6)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
              }}
            >
              <span className="brand-crown-icon">👑</span>
              <span className="brand-shimmer-gold" style={{ fontSize: '0.78rem' }}>{tag}</span>
            </div>

            <h2
              style={{
                fontSize: 'clamp(2rem, 4vw, 2.8rem)',
                fontWeight: 700,
                color: '#ffffff',
                margin: '14px 0 16px',
                lineHeight: 1.2
              }}
            >
              {title}
            </h2>

            <p style={{ color: '#f5d0c5', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '32px' }}>
              {description}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px'
              }}
            >
              {craftFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <div style={{ marginBottom: '8px' }}>{feat.icon}</div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', margin: '0 0 4px' }}>
                    {feat.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#f5d0c5', lineHeight: 1.45 }}>
                    {feat.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
