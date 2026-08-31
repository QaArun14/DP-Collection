import React from 'react';
import { CheckCircle2, PackageCheck, Truck, MessageCircle, X, ShieldCheck, MapPin, Clock, ArrowRight } from 'lucide-react';
import { STORE_WHATSAPP_NUMBER } from '../utils/whatsapp';

export default function OrderSuccessModal({ orderDetails, onClose, storeSettings = {} }) {
  if (!orderDetails) return null;

  const isCod = (orderDetails.paymentMethod || '').toLowerCase().includes('cash') || (orderDetails.paymentMethod || '').toLowerCase().includes('cod');
  const whatsappNum = storeSettings.whatsappNumber || STORE_WHATSAPP_NUMBER || '919758999617';

  const handleTrackOnWhatsApp = () => {
    const itemsList = (orderDetails.items || []).map((it) => `${it.name} (${it.selectedSize}) x ${it.quantity}`).join(', ');
    const text = `Namaste Durgesh Collection! 🌸\n\nI just placed order *#${orderDetails.orderId}* on your website.\n\n📦 *Items:* ${itemsList}\n💰 *Amount:* ₹${orderDetails.total?.toLocaleString()}\n💳 *Payment Mode:* ${orderDetails.paymentMethod || 'Confirmed'}\n📍 *Delivery Address:* ${orderDetails.customerAddress || ''}, ${orderDetails.customerCity || ''} - ${orderDetails.customerPin || ''}\n\nPlease confirm my order and share courier tracking updates. Thank you!`;
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1200, padding: '16px' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border)',
          animation: 'fadeIn 0.3s ease-out'
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

        {/* Success Header Animation */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '68px',
              height: '68px',
              backgroundColor: '#ecfdf5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
              border: '2px solid #10b981',
              boxShadow: '0 8px 20px rgba(16, 185, 129, 0.25)'
            }}
          >
            <CheckCircle2 size={40} color="#059669" />
          </div>

          <span
            style={{
              display: 'inline-block',
              backgroundColor: isCod ? '#fef3c7' : '#ecfdf5',
              color: isCod ? '#92400e' : '#065f46',
              border: isCod ? '1px solid #fde68a' : '1px solid #a7f3d0',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '8px'
            }}
          >
            {isCod ? '💵 Cash on Delivery Verified' : '⚡ UPI Payment Confirmed'}
          </span>

          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1c1917', margin: '0 0 4px' }}>
            Order Placed Successfully! 🎉
          </h2>
          <p style={{ fontSize: '0.84rem', color: '#78716c', margin: 0 }}>
            Thank you, <strong style={{ color: '#1c1917' }}>{orderDetails.customerName}</strong>! Your artisan kurtis are getting packed.
          </p>
        </div>

        {/* LIVE ORDER STATUS PROGRESS STEPPER */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PackageCheck size={16} color="#0052cc" /> Real-Time Order Journey
            </span>
            <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, backgroundColor: '#ecfdf5', padding: '2px 8px', borderRadius: '6px' }}>
              ● Live Tracking Active
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', margin: '0 8px' }}>
            {/* Step 1 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#059669', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '0.75rem', fontWeight: 700 }}>
                ✓
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>Order Placed</span>
              <span style={{ fontSize: '0.65rem', color: '#64748b' }}>Confirmed</span>
            </div>

            {/* Step 2 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '0.75rem', fontWeight: 700 }}>
                2
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>Quality Check</span>
              <span style={{ fontSize: '0.65rem', color: '#2563eb' }}>In Progress</span>
            </div>

            {/* Step 3 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '0.75rem', fontWeight: 700 }}>
                3
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Dispatch</span>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Delhivery / DTDC</span>
            </div>

            {/* Step 4 */}
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px', fontSize: '0.75rem', fontWeight: 700 }}>
                4
              </div>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', display: 'block' }}>Doorstep</span>
              <span style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Delivered</span>
            </div>
          </div>
        </div>

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
            <span>Order ID: <strong style={{ color: '#1c1917', letterSpacing: '0.02em' }}>{orderDetails.orderId}</strong></span>
            <span>Mode: <strong style={{ color: isCod ? '#d97706' : '#0052cc' }}>{orderDetails.paymentMethod || 'Confirmed'}</strong></span>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#334155', marginBottom: '8px' }}>
            <span>👤 Customer: <strong style={{ color: '#0f172a' }}>{orderDetails.customerName}</strong> ({orderDetails.customerPhone})</span>
          </div>

          {orderDetails.customerAddress && (
            <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '10px', lineHeight: 1.35, display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
              <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
              <span>Deliver to: {orderDetails.customerAddress}, {orderDetails.customerCity} - {orderDetails.customerPin}</span>
            </div>
          )}

          {/* Purchased Items Mini List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', margin: '12px 0', borderTop: '1px solid #e7dfd5', paddingTop: '10px' }}>
            {orderDetails.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                <span style={{ color: '#292524', fontWeight: 600 }}>
                  • {item.name} <span style={{ color: '#78716c', fontWeight: 400 }}>({item.selectedSize} × {item.quantity})</span>
                </span>
                <span style={{ fontWeight: 700, color: '#1c1917' }}>
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #e7dfd5', fontSize: '0.95rem', fontWeight: 800 }}>
            <span>{isCod ? 'Payable on Delivery (INR):' : 'Total Amount Paid (INR):'}</span>
            <span style={{ color: 'var(--color-primary)' }}>₹{orderDetails.total?.toLocaleString()}</span>
          </div>
        </div>

        {/* Estimated Shipping Info */}
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
            marginBottom: '20px'
          }}
        >
          <Truck size={22} color="#2563eb" style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ margin: 0, fontSize: '0.84rem', fontWeight: 700, color: '#1e40af' }}>
              Estimated Delivery: 3 to 5 Working Days
            </h4>
            <p style={{ margin: '2px 0 0', fontSize: '0.74rem', color: '#3b82f6' }}>
              {isCod ? 'Keep cash or UPI app ready when delivery agent arrives.' : 'Free Express insured shipping across India.'}
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
            <MessageCircle size={18} /> Confirm & Get Dispatch Updates on WhatsApp
          </button>

          <button
            onClick={onClose}
            className="btn-outline"
            style={{ padding: '10px 20px', fontSize: '0.85rem', borderRadius: '9999px' }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
