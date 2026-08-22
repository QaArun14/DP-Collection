import React, { useState } from 'react';
import { X, ShieldCheck, QrCode, Smartphone, CreditCard, Building2, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function RazorpayModal({
  isOpen,
  onClose,
  amount,
  orderDetails,
  onSuccess
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('upi'); // 'upi', 'card', 'netbanking', 'cod'
  const [upiId, setUpiId] = useState('9758999617@upi');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  const [cardHolder, setCardHolder] = useState('Durgesh Customer');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSimulatePayment = (methodName) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        const paymentId = `pay_test_${Math.random().toString(36).substring(2, 10)}`;
        onSuccess(paymentId);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          maxWidth: '680px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          border: '1px solid #e2e8f0',
          animation: 'fadeIn 0.2s ease-out'
        }}
      >
        {/* Razorpay Top Header */}
        <div
          style={{
            backgroundColor: '#0c2340',
            color: '#ffffff',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #0052cc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="brand-emblem-shield"
              style={{
                width: '38px',
                height: '38px',
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
                <h4 className="brand-shimmer-gold" style={{ margin: 0, fontSize: '1rem', letterSpacing: '0.04em' }}>
                  Durgesh Collection
                </h4>
                <span
                  style={{
                    backgroundColor: '#1e3a8a',
                    color: '#93c5fd',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '4px',
                    border: '1px solid #3b82f6'
                  }}
                >
                  TEST MODE
                </span>
              </div>
              <p style={{ margin: '1px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
                Secured by Razorpay Payment Gateway
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', display: 'block' }}>Amount to Pay</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                ₹{amount?.toLocaleString()}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Processing / Success State Overlay */}
        {isProcessing || isSuccess ? (
          <div style={{ padding: '60px 20px', textAlign: 'center' }}>
            {isProcessing ? (
              <div>
                <Loader2 size={48} color="#0052cc" className="animate-spin" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>
                  Processing Test Payment...
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Connecting securely with bank test servers. Do not close or refresh.
                </p>
              </div>
            ) : (
              <div>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    border: '2px solid #10b981'
                  }}
                >
                  <CheckCircle2 size={40} color="#059669" />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#059669', margin: '0 0 6px' }}>
                  Payment Successful!
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                  Generating order confirmation and receipt...
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Main Payment Methods Layout */
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '340px' }}>
            {/* Left Sidebar: Payment Categories */}
            <div style={{ backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '12px 0' }}>
              {[
                { id: 'upi', label: 'UPI / QR Code', icon: <QrCode size={18} /> },
                { id: 'card', label: 'Cards (Credit/Debit)', icon: <CreditCard size={18} /> },
                { id: 'netbanking', label: 'Netbanking', icon: <Building2 size={18} /> },
                { id: 'cod', label: 'Cash on Delivery', icon: <Smartphone size={18} /> }
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '12px 18px',
                      border: 'none',
                      backgroundColor: isActive ? '#ffffff' : 'transparent',
                      color: isActive ? '#0052cc' : '#475569',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      borderLeft: isActive ? '3px solid #0052cc' : '3px solid transparent',
                      textAlign: 'left',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right Content Area: Payment Method Details */}
            <div style={{ padding: '24px' }}>
              {/* 1. UPI Tab */}
              {activeTab === 'upi' && (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                    Pay via UPI (Google Pay, PhonePe, Paytm, BHIM)
                  </h4>

                  {/* QR Code Demo Box */}
                  <div
                    style={{
                      backgroundColor: '#f1f5f9',
                      borderRadius: '12px',
                      padding: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '16px',
                      border: '1px dashed #cbd5e1'
                    }}
                  >
                    <div
                      style={{
                        width: '80px',
                        height: '80px',
                        backgroundColor: '#ffffff',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #cbd5e1'
                      }}
                    >
                      <QrCode size={64} color="#0c2340" />
                    </div>
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a', display: 'block' }}>
                        Scan & Pay with any UPI App
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Razorpay Test UPI QR Code ready
                      </span>
                      <button
                        onClick={() => handleSimulatePayment('UPI QR')}
                        style={{
                          marginTop: '6px',
                          backgroundColor: '#0052cc',
                          color: '#ffffff',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '4px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        ⚡ Simulate Scan & Pay
                      </button>
                    </div>
                  </div>

                  {/* UPI ID Input */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>
                      Or Enter UPI ID:
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <button
                    onClick={() => handleSimulatePayment('UPI ID')}
                    style={{
                      width: '100%',
                      backgroundColor: '#0052cc',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0, 82, 204, 0.25)'
                    }}
                  >
                    Pay ₹{amount?.toLocaleString()} via UPI
                  </button>
                </div>
              )}

              {/* 2. Card Tab */}
              {activeTab === 'card' && (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                    Credit or Debit Card (Test Mode)
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '3px' }}>
                        Card Number:
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '3px' }}>
                          Expiry (MM/YY):
                        </label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', marginBottom: '3px' }}>
                          CVV:
                        </label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSimulatePayment('Test Card')}
                    style={{
                      width: '100%',
                      backgroundColor: '#0052cc',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Pay ₹{amount?.toLocaleString()} with Card
                  </button>
                </div>
              )}

              {/* 3. Netbanking Tab */}
              {activeTab === 'netbanking' && (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                    Select Your Bank
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        style={{
                          padding: '8px 12px',
                          border: selectedBank === bank ? '1.5px solid #0052cc' : '1px solid #cbd5e1',
                          backgroundColor: selectedBank === bank ? '#eff6ff' : '#ffffff',
                          borderRadius: '6px',
                          fontSize: '0.78rem',
                          fontWeight: selectedBank === bank ? 700 : 500,
                          color: selectedBank === bank ? '#0052cc' : '#334155',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSimulatePayment(selectedBank)}
                    style={{
                      width: '100%',
                      backgroundColor: '#0052cc',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Pay via {selectedBank}
                  </button>
                </div>
              )}

              {/* 4. COD Tab */}
              {activeTab === 'cod' && (
                <div>
                  <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                    Cash on Delivery (COD)
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
                    Pay with Cash / UPI at the time of doorstep delivery at your address in India. No extra COD charge!
                  </p>
                  <button
                    onClick={() => handleSimulatePayment('Cash on Delivery')}
                    style={{
                      width: '100%',
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer'
                    }}
                  >
                    Confirm Order with Cash on Delivery
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Security Notice */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            padding: '10px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem',
            color: '#64748b'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} color="#16a34a" /> 256-Bit SSL Encrypted by Razorpay
          </span>
          <span style={{ color: '#94a3b8' }}>Test Mode Sandbox</span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
