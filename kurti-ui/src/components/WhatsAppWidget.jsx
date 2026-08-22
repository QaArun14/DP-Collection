import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER } from '../utils/whatsapp';

export default function WhatsAppWidget() {
  const [showTooltip, setShowTooltip] = useState(true);

  const handleOpenWhatsApp = () => {
    const text = 'Hello Durgesh Collection! I am browsing your online kurti store and need help with sizes / custom orders.';
    window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 990,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}
    >
      {/* WhatsApp Circular Button */}
      <button
        onClick={handleOpenWhatsApp}
        style={{
          backgroundColor: '#25D366',
          color: '#ffffff',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: '2px solid #ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(37, 211, 102, 0.45)',
          transition: 'all 0.25s ease'
        }}
        title="Direct Order & Chat on WhatsApp"
        aria-label="WhatsApp Order"
      >
        <MessageCircle size={30} fill="#ffffff" color="#25D366" />
      </button>

      {/* Floating Help Speech Bubble */}
      {showTooltip && (
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '14px',
            padding: '10px 14px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
            border: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            maxWidth: '220px',
            position: 'relative',
            animation: 'fadeIn 0.3s ease-out'
          }}
          className="mobile-hide-tooltip"
        >
          <div style={{ fontSize: '0.78rem', color: '#1c1917', lineHeight: 1.3 }}>
            <strong style={{ color: '#059669', display: 'block' }}>Order on WhatsApp</strong>
            Need instant sizing help or COD?
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            style={{
              background: 'none',
              border: 'none',
              color: '#a8a29e',
              cursor: 'pointer',
              padding: '2px'
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .mobile-hide-tooltip {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
