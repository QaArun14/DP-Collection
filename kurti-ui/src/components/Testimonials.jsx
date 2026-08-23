import React from 'react';
import { Star, CheckCircle, Heart, Camera } from 'lucide-react';

export default function Testimonials({ reviews = [], instaPosts = [], instagramHandle = '@durgesh_collection' }) {
  const displayReviews = reviews || [];
  const displayPosts = instaPosts || [];

  return (
    <section style={{ padding: '80px 0', backgroundColor: 'var(--color-sand)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 48px' }}>
          <span className="badge-gold" style={{ marginBottom: '8px', display: 'inline-block' }}>
            Customer Love
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.6rem)',
              fontWeight: 700,
              color: '#1c1917',
              margin: '8px 0 10px'
            }}
          >
            Loved by 15,000+ Women
          </h2>
          <p style={{ color: '#78716c', fontSize: '0.95rem', margin: 0 }}>
            Read genuine experiences from our verified patrons across India.
          </p>
        </div>

        {/* Testimonials 3-Column Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '64px'
          }}
        >
          {displayReviews.map((t) => (
            <div
              key={t.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '28px',
                border: '1px solid var(--color-border)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Rating Stars & Date */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} size={16} fill="#d97706" color="#d97706" />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#a8a29e' }}>{t.date}</span>
                </div>

                {/* Review Text */}
                <p style={{ fontSize: '0.9rem', color: '#44403c', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '20px' }}>
                  "{t.review}"
                </p>
              </div>

              {/* User Bio & Verified Pill */}
              <div style={{ borderTop: '1px solid #f5f5f4', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img
                  src={t.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'}
                  alt={t.name}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1c1917' }}>
                      {t.name}
                    </h4>
                    {t.verified && (
                      <span
                        style={{
                          color: '#059669',
                          fontSize: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px',
                          fontWeight: 600
                        }}
                      >
                        <CheckCircle size={12} fill="#059669" color="#ffffff" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#78716c' }}>
                    {t.city} • <strong style={{ color: 'var(--color-primary)' }}>{t.productName}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lookbook Community Gallery */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Camera size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#1c1917' }}>
              #DurgeshCollection
            </h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#78716c', margin: 0 }}>
            Tag {instagramHandle} on Instagram to get featured on our official lookbook
          </p>
        </div>

        <div className="lookbook-responsive-grid">
          {displayPosts.map((post, idx) => (
            <div
              key={post.id || idx}
              style={{
                position: 'relative',
                borderRadius: '12px',
                overflow: 'hidden',
                height: 'clamp(180px, 24vh, 240px)',
                cursor: 'pointer'
              }}
              className="img-zoom-wrapper"
            >
              <img
                src={post.image}
                alt={post.handle}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 60%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: '14px',
                  color: '#ffffff'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{post.handle}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#fecdd3' }}>
                    <Heart size={12} fill="#fecdd3" /> {post.likes}
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#e7dfd5', marginTop: '2px' }}>
                  Wearing {post.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
