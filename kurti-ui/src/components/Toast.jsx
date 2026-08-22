import React from 'react';
import { CheckCircle, Heart, ShoppingBag, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: '#1c1917',
        color: '#ffffff',
        padding: '14px 20px',
        borderRadius: '12px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        border: '1px solid #d4af37',
        maxWidth: '380px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      {toast.type === 'wishlist' ? (
        <Heart size={20} color="#e11d48" fill="#e11d48" style={{ flexShrink: 0 }} />
      ) : toast.type === 'cart' ? (
        <ShoppingBag size={20} color="#d4af37" style={{ flexShrink: 0 }} />
      ) : (
        <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0 }} />
      )}
      <div style={{ flex: 1, fontSize: '0.875rem' }}>
        <p style={{ fontWeight: 600, margin: 0, color: '#fef3c7' }}>{toast.title}</p>
        <p style={{ margin: '2px 0 0', opacity: 0.85, fontSize: '0.8rem' }}>{toast.message}</p>
      </div>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#a8a29e',
          cursor: 'pointer',
          padding: '4px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
