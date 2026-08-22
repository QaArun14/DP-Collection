import React from 'react';
import { CheckCircle2, PackageCheck, Truck, MessageCircle, X, Download, ShieldCheck } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER } from '../utils/whatsapp';

export default function OrderSuccessModal({ orderDetails, onClose }) {
  if (!orderDetails) return null;

  const handleTrackOnWhatsApp = () => {
    const text = `Hello Durgesh Collection, I just placed order *${orderDetails.orderId}* (Payment ID: *${orderDetails.paymentId}*) for ₹${orderDetails.total.toLocaleString()}. Please update me on the dispatch status!`;
    window.open(`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '540px',
          width: '100%',
          padding: '32px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border)',
          animation: 'fadeIn 0.3s ease-out',
          textAlign: 'center'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            color: '#78716c',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={20} />
        </button>

        {/* Success Icon Animation */}
        <div
          style={{
            width: '72px',
            height: '72px',
            backgroundColor: '#ecfdf5',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            border: '2px solid #10b981'
          }}
        >
          <CheckCircle2 size={44} color="#059669" />
        </div>

        <span className="badge-gold" style={{ marginBottom: '8px', display: 'inline-block' }}>
          Razorpay Test Payment Verified
        </span>

        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1c1917', margin: '4px 0 6px' }}>
          Order Confirmed! 🎉
        </h2>
        <p style={{ fontSize: '0.88rem', color: '#78716c', margin: '0 0 20px' }}>
          Thank you for shopping with <strong>Durgesh Collection</strong>. Your order has been placed successfully.
        </p>

        {/* Order Details Receipt Card */}
        <div
          style={{
            backgroundColor: 'var(--color-cream)',
            borderRadius: '16px',
            padding: '16px 20px',
            textAlign: 'left',
            marginBottom: '20px',
            border: '1px solid var(--color-border)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#57534e', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dashed #d6d3d1' }}>
            <span>Order ID: <strong style={{ color: '#1c1917' }}>{orderDetails.orderId}</strong></span>
            <span>Date: <strong>Today</strong></span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#57534e', marginBottom: '12px' }}>
            <span>Razorpay Payment ID:</span>
            <span style={{ fontFamily: 'monospace', color: '#047857', fontWeight: 700 }}>{orderDetails.paymentId}</span>
          </div>

          {/* Purchased Items Mini List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {orderDetails.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <span style={{ color: '#292524', fontWeight: 600 }}>
                  {item.name} <span style={{ color: '#78716c', fontWeight: 400 }}>({item.selectedSize} x {item.quantity})</span>
                </span>
                <span style={{ fontWeight: 700, color: '#1c1917' }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #e7dfd5', fontSize: '0.95rem', fontWeight: 800 }}>
            <span>Total Paid (INR):</span>
            <span style={{ color: 'var(--color-primary)' }}>₹{orderDetails.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Delivery Estimate Box */}
        <div
          style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textAlign: 'left',
            marginBottom: '24px'
          }}
        >
          <Truck size={24} color="#2563eb" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#1e40af' }}>
              Estimated Delivery: 3 to 5 Business Days
            </h4>
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#3b82f6' }}>
              Express shipping with real-time SMS & WhatsApp tracking updates.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={handleTrackOnWhatsApp}
            style={{
              backgroundColor: '#25D366',
              color: '#ffffff',
              border: 'none',
              borderRadius: '9999px',
              padding: '12px 20px',
              fontSize: '0.9rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
            }}
          >
            <MessageCircle size={18} /> Track & Confirm Order on WhatsApp
          </button>

          <button
            onClick={onClose}
            className="btn-outline"
            style={{ padding: '10px 20px', fontSize: '0.85rem' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
