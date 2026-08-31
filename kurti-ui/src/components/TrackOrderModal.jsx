import React, { useState } from 'react';
import { X, Search, Package, Truck, CheckCircle2, AlertCircle, Clock, MapPin, MessageCircle } from 'lucide-react';
import { apiTrackOrder } from '../utils/api';
import { STORE_WHATSAPP_NUMBER } from '../utils/whatsapp';

export default function TrackOrderModal({ isOpen, onClose, storeSettings = {} }) {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundOrders, setFoundOrders] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setFoundOrders(null);

    const res = await apiTrackOrder(searchQuery.trim());
    setLoading(false);

    if (res.success && Array.isArray(res.orders) && res.orders.length > 0) {
      setFoundOrders(res.orders);
    } else {
      setErrorMsg(res.message || 'No order found with this Order ID or Mobile Number. Please check and try again.');
    }
  };

  const getStepIndex = (status = '') => {
    const s = status.toLowerCase();
    if (s.includes('delivered')) return 4;
    if (s.includes('out for delivery') || s.includes('delivery')) return 3;
    if (s.includes('dispatched') || s.includes('shipped')) return 2;
    if (s.includes('processing') || s.includes('packed')) return 1;
    return 0; // Placed / Confirmed
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1250, padding: '16px' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          border: '1px solid var(--color-border)',
          animation: 'fadeIn 0.25s ease-out'
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

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              backgroundColor: '#eff6ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              border: '1.5px solid #3b82f6',
              color: '#2563eb'
            }}
          >
            <Truck size={28} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1c1917', margin: '0 0 4px' }}>
            Track Your Order Status
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#78716c', margin: 0 }}>
            Enter your <strong>Order ID</strong> (e.g. DC-ORD-XXXXXX) or <strong>Registered Mobile Number</strong>
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              required
              placeholder="e.g. DC-ORD-519284 or 9876543210"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '10px 12px 10px 36px',
                borderRadius: '8px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              padding: '10px 20px',
              fontSize: '0.85rem',
              borderRadius: '8px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {/* Error State */}
        {errorMsg && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#b91c1c',
              fontSize: '0.82rem',
              marginBottom: '16px'
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Search Results Display */}
        {foundOrders && foundOrders.map((ord) => {
          const stepIdx = getStepIndex(ord.status);
          const isCod = (ord.paymentMethod || '').toLowerCase().includes('cash') || (ord.paymentMethod || '').toLowerCase().includes('cod');

          return (
            <div
              key={ord.orderId}
              style={{
                backgroundColor: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderRadius: '14px',
                padding: '18px',
                marginBottom: '14px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.04)'
              }}
            >
              {/* Top Banner */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                    Order #{ord.orderId}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Placed on: {ord.date || 'Recent'}</span>
                </div>
                <span
                  style={{
                    backgroundColor: ord.status === 'Delivered' ? '#dcfce7' : ord.status === 'Dispatched' ? '#eff6ff' : '#fef9c3',
                    color: ord.status === 'Delivered' ? '#166534' : ord.status === 'Dispatched' ? '#1e40af' : '#854d0e',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontWeight: 700,
                    fontSize: '0.75rem'
                  }}
                >
                  ● {ord.status || 'Confirmed'}
                </span>
              </div>

              {/* Real-time Visual Stepper */}
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '14px 0', position: 'relative' }}>
                {[
                  { name: 'Placed', sub: 'Confirmed' },
                  { name: 'Quality Check', sub: 'Packed' },
                  { name: 'Dispatched', sub: ord.courierPartner || 'Courier Partner' },
                  { name: 'Doorstep', sub: 'Delivered' }
                ].map((st, sIdx) => {
                  const isDone = stepIdx >= sIdx;
                  const isCurrent = stepIdx === sIdx;
                  return (
                    <div key={sIdx} style={{ textAlign: 'center', flex: 1 }}>
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: isDone ? '#059669' : '#e2e8f0',
                          color: isDone ? '#ffffff' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          boxShadow: isCurrent ? '0 0 0 3px rgba(5, 150, 105, 0.25)' : 'none'
                        }}
                      >
                        {isDone ? '✓' : sIdx + 1}
                      </div>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: isDone ? '#0f172a' : '#94a3b8', display: 'block' }}>
                        {st.name}
                      </span>
                      <span style={{ fontSize: '0.62rem', color: isCurrent ? '#059669' : '#94a3b8' }}>
                        {st.sub}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Order Info Details */}
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px', fontSize: '0.78rem', color: '#334155' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Customer: <strong>{ord.customerName}</strong> ({ord.customerPhone})</span>
                  <span>Mode: <strong>{ord.paymentMethod || (isCod ? 'Cash on Delivery' : 'Prepaid')}</strong></span>
                </div>
                {ord.customerAddress && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', color: '#64748b', marginTop: '4px' }}>
                    <MapPin size={13} style={{ flexShrink: 0, marginTop: '2px', color: '#d97706' }} />
                    <span>{ord.customerAddress}, {ord.customerCity} - {ord.customerPin}</span>
                  </div>
                )}
                {ord.trackingNumber && (
                  <div style={{ marginTop: '6px', color: '#1e40af', fontWeight: 700 }}>
                    🚚 Courier AWB / Tracking: {ord.trackingNumber} ({ord.courierPartner || 'Delhivery'})
                  </div>
                )}
                <div style={{ marginTop: '6px', fontWeight: 800, color: 'var(--color-primary)', fontSize: '0.85rem' }}>
                  Total Amount: ₹{ord.total?.toLocaleString()}
                </div>
              </div>

              {/* WhatsApp Support Button */}
              <div style={{ marginTop: '10px', textAlign: 'right' }}>
                <a
                  href={`https://wa.me/${storeSettings.whatsappNumber || STORE_WHATSAPP_NUMBER || '919758999617'}?text=${encodeURIComponent(`Hello Durgesh Collection, I am tracking my order #${ord.orderId}. Please provide delivery status update.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    color: '#059669',
                    textDecoration: 'none'
                  }}
                >
                  <MessageCircle size={14} /> WhatsApp Support for this Order →
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
