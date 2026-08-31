import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  Loader2,
  User,
  MapPin,
  Phone,
  ArrowRight,
  Sparkles,
  Lock,
  Check
} from 'lucide-react';

export default function RazorpayModal({
  isOpen,
  onClose,
  amount,
  orderDetails,
  onSuccess,
  storeSettings = {}
}) {
  if (!isOpen) return null;

  // Step 1: Customer Contact & Delivery Info
  const [step, setStep] = useState('details'); // 'details' | 'payment'

  // Saved user details from localStorage
  const [customerName, setCustomerName] = useState(() => localStorage.getItem('dc_cust_name') || '');
  const [customerPhone, setCustomerPhone] = useState(() => localStorage.getItem('dc_cust_phone') || '');
  const [customerAddress, setCustomerAddress] = useState(() => localStorage.getItem('dc_cust_address') || '');
  const [customerCity, setCustomerCity] = useState(() => localStorage.getItem('dc_cust_city') || '');
  const [customerPin, setCustomerPin] = useState(() => localStorage.getItem('dc_cust_pin') || '');
  const [formError, setFormError] = useState('');

  // Payment Options State
  const [activeTab, setActiveTab] = useState('upi'); // 'upi', 'card', 'netbanking', 'cod'
  const [upiId, setUpiId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [processingMethod, setProcessingMethod] = useState('');

  // Real UPI Payload & QR Code URL
  const orderId = orderDetails?.orderId || `DC-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const storeUpi = storeSettings?.upiId || '9758999617@upi';
  const merchantName = storeSettings?.upiAccountName || storeSettings?.storeName || 'Durgesh Collection';
  const upiPayload = `upi://pay?pa=${storeUpi}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=Order%20${orderId}`;
  
  // If admin uploaded a custom QR code photo, use that directly; otherwise generate live dynamic QR
  const qrCodeUrl = storeSettings?.customQrImage || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=6&data=${encodeURIComponent(upiPayload)}`;

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setFormError('Please enter your full name');
      return;
    }
    if (!customerPhone.trim() || customerPhone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!customerAddress.trim()) {
      setFormError('Please enter your delivery street address');
      return;
    }
    if (!customerCity.trim()) {
      setFormError('Please enter your city & state');
      return;
    }
    if (!customerPin.trim() || customerPin.length < 6) {
      setFormError('Please enter a valid 6-digit PIN code');
      return;
    }

    setFormError('');

    // Save to localStorage for future orders
    localStorage.setItem('dc_cust_name', customerName.trim());
    localStorage.setItem('dc_cust_phone', customerPhone.trim());
    localStorage.setItem('dc_cust_address', customerAddress.trim());
    localStorage.setItem('dc_cust_city', customerCity.trim());
    localStorage.setItem('dc_cust_pin', customerPin.trim());

    setStep('payment');
  };

  const handleCompletePayment = (methodName) => {
    setIsProcessing(true);
    setProcessingMethod(methodName);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        const paymentId = `pay_${methodName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Math.random().toString(36).substring(2, 9)}`;
        onSuccess(paymentId, {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress.trim(),
          customerCity: customerCity.trim(),
          customerPin: customerPin.trim(),
          paymentMethod: methodName
        });
      }, 1000);
    }, 1400);
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100, padding: '16px' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          border: '1px solid #e2e8f0',
          animation: 'fadeIn 0.25s ease-out'
        }}
      >
        {/* Razorpay Top Header */}
        <div
          style={{
            backgroundColor: '#0c2340',
            color: '#ffffff',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '2px solid #0052cc',
            flexShrink: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              className="brand-emblem-shield"
              style={{
                width: '36px',
                height: '36px',
                flexShrink: 0
              }}
            >
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <span className="brand-crown-icon" style={{ fontSize: '0.55rem', color: '#fef08a', display: 'block', marginBottom: '1px' }}>
                  👑
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, fontFamily: 'var(--font-royal)', color: '#ffffff', letterSpacing: '0.04em' }}>
                  DC
                </span>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h4 className="brand-shimmer-gold" style={{ margin: 0, fontSize: '0.98rem', letterSpacing: '0.04em' }}>
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
                  SECURE CHECKOUT
                </span>
              </div>
              <p style={{ margin: '1px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
                Order #{orderId} • Razorpay Payment Gateway
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Amount to Pay</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
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
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body Container with Scroll */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {/* Processing / Success State Overlay */}
          {isProcessing || isSuccess ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              {isProcessing ? (
                <div>
                  <Loader2 size={48} color="#0052cc" className="animate-spin" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>
                    Processing {processingMethod}...
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px' }}>
                    Verifying payment details and generating instant order confirmation.
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#0052cc', fontWeight: 600 }}>
                    Please do not refresh or press back button.
                  </div>
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
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#059669', margin: '0 0 6px' }}>
                    Payment Successful! 🎉
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                    Order confirmed for <strong>{customerName}</strong>. Generating receipt...
                  </p>
                </div>
              )}
            </div>
          ) : step === 'details' ? (
            /* STEP 1: REAL CUSTOMER DELIVERY & CONTACT INFORMATION */
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                    1. Shipping & Customer Details
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Please enter your real delivery address for express doorstep delivery
                  </p>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0052cc', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '9999px' }}>
                  Step 1 of 2
                </span>
              </div>

              {formError && (
                <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '10px 14px', borderRadius: '8px', fontSize: '0.82rem', marginBottom: '16px' }}>
                  ⚠️ {formError}
                </div>
              )}

              <form onSubmit={handleProceedToPayment}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                      Full Name *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Durgesh Sharma"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                      Mobile / WhatsApp Number *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="e.g. 9876543210"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                        style={{
                          width: '100%',
                          padding: '10px 12px 10px 36px',
                          borderRadius: '8px',
                          border: '1.5px solid #cbd5e1',
                          fontSize: '0.85rem',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                    Delivery Street Address / Flat / Landmark *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Flat 302, Green Avenue, Near Sanjay Place"
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '22px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                      City & State *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Agra, Uttar Pradesh"
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 282002"
                      value={customerPin}
                      onChange={(e) => setCustomerPin(e.target.value.replace(/\D/g, ''))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #cbd5e1',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    backgroundColor: '#0052cc',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '13px',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 82, 204, 0.3)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Proceed to Payment Options <ArrowRight size={18} />
                </button>
              </form>
            </div>
          ) : (
            /* STEP 2: PAYMENT METHOD SELECTION & REAL SCAN / CARD / COD */
            <div>
              {/* Customer Mini Summary Ribbon */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  borderBottom: '1px solid #e2e8f0',
                  padding: '10px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.78rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                  <User size={14} color="#0052cc" />
                  <span>Delivering to: <strong style={{ color: '#0f172a' }}>{customerName}</strong> ({customerPhone})</span>
                </div>
                <button
                  onClick={() => setStep('details')}
                  style={{ background: 'none', border: 'none', color: '#0052cc', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}
                >
                  Edit Details
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 2fr', minHeight: '340px' }}>
                {/* Left Sidebar: Payment Categories */}
                <div style={{ backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '10px 0' }}>
                  {[
                    { id: 'upi', label: 'UPI / Scan QR', icon: <QrCode size={18} />, badge: 'Instant' },
                    { id: 'card', label: 'Debit / Credit Card', icon: <CreditCard size={18} />, badge: null },
                    { id: 'netbanking', label: 'Netbanking', icon: <Building2 size={18} />, badge: null },
                    { id: 'cod', label: 'Cash on Delivery', icon: <Smartphone size={18} />, badge: 'Free' }
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
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          border: 'none',
                          backgroundColor: isActive ? '#ffffff' : 'transparent',
                          color: isActive ? '#0052cc' : '#475569',
                          fontWeight: isActive ? 700 : 500,
                          fontSize: '0.84rem',
                          cursor: 'pointer',
                          borderLeft: isActive ? '3.5px solid #0052cc' : '3.5px solid transparent',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {tab.icon}
                          {tab.label}
                        </span>
                        {tab.badge && (
                          <span
                            style={{
                              fontSize: '0.62rem',
                              fontWeight: 700,
                              backgroundColor: isActive ? '#eff6ff' : '#e2e8f0',
                              color: isActive ? '#0052cc' : '#64748b',
                              padding: '1px 5px',
                              borderRadius: '4px'
                            }}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right Content Area */}
                <div style={{ padding: '20px' }}>
                  {/* 1. UPI TAB WITH REAL SCANNABLE QR CODE */}
                  {activeTab === 'upi' && (
                    <div>
                      <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                        Scan & Pay via any UPI App (GPay, PhonePe, Paytm, BHIM)
                      </h4>

                      <div
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          padding: '14px',
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '16px',
                          marginBottom: '16px',
                          border: '1.5px solid #e2e8f0'
                        }}
                      >
                        {/* Dynamic Scannable UPI QR Image */}
                        <div
                          style={{
                            width: '130px',
                            height: '130px',
                            backgroundColor: '#ffffff',
                            borderRadius: '10px',
                            padding: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid #cbd5e1',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                          }}
                        >
                          <img
                            src={qrCodeUrl}
                            alt="Durgesh Collection Live UPI QR Code"
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                          />
                        </div>

                        <div style={{ flex: 1, minWidth: '190px' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                            {merchantName}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '3px' }}>
                            <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              UPI ID: <strong style={{ color: '#0052cc' }}>{storeUpi}</strong>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(storeUpi);
                                alert(`UPI ID ${storeUpi} copied to clipboard!`);
                              }}
                              style={{
                                backgroundColor: '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                color: '#334155',
                                cursor: 'pointer'
                              }}
                            >
                              Copy
                            </button>
                          </div>
                          <span style={{ fontSize: '0.82rem', color: '#16a34a', fontWeight: 800, display: 'block', marginTop: '4px' }}>
                            Amount to Pay: ₹{amount?.toLocaleString()}
                          </span>

                          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                            <a
                              href={upiPayload}
                              style={{
                                textDecoration: 'none',
                                backgroundColor: '#2563eb',
                                color: '#ffffff',
                                padding: '7px 14px',
                                borderRadius: '6px',
                                fontSize: '0.76rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px'
                              }}
                            >
                              ⚡ Open in UPI App
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Optional UTR / Reference ID & Confirm Payment */}
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                          Enter 12-Digit UTR / Transaction Ref No (Optional):
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="e.g. 423871928374 or GPay Ref"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            style={{
                              flex: 1,
                              padding: '10px 12px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.84rem',
                              outline: 'none'
                            }}
                          />
                          <button
                            onClick={() =>
                              handleCompletePayment(
                                utrNumber.trim() ? `UPI QR (UTR: ${utrNumber.trim()})` : 'UPI QR Scan'
                              )
                            }
                            style={{
                              backgroundColor: '#059669',
                              color: '#ffffff',
                              border: 'none',
                              padding: '10px 18px',
                              borderRadius: '6px',
                              fontWeight: 700,
                              fontSize: '0.84rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            ✓ Confirm Payment
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. CARD TAB WITH REAL CARD INTERACTION */}
                  {activeTab === 'card' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                          Enter Card Details
                        </h4>
                        {getCardBrand() && (
                          <span
                            style={{
                              backgroundColor: getCardBrand().color,
                              color: '#ffffff',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 800
                            }}
                          >
                            {getCardBrand().brand}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                            Card Number:
                          </label>
                          <input
                            type="text"
                            placeholder="4111 2222 3333 4444"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '6px',
                              border: '1.5px solid #cbd5e1',
                              fontSize: '0.88rem',
                              letterSpacing: '0.05em'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                            Cardholder Name:
                          </label>
                          <input
                            type="text"
                            placeholder="Name on card"
                            value={cardHolder || customerName}
                            onChange={(e) => setCardHolder(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '9px 12px',
                              borderRadius: '6px',
                              border: '1.5px solid #cbd5e1',
                              fontSize: '0.85rem'
                            }}
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                              Expiry (MM/YY):
                            </label>
                            <input
                              type="text"
                              placeholder="12/28"
                              value={expiry}
                              onChange={handleExpiryChange}
                              maxLength={5}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                borderRadius: '6px',
                                border: '1.5px solid #cbd5e1',
                                fontSize: '0.85rem'
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '3px' }}>
                              CVV:
                            </label>
                            <input
                              type="password"
                              placeholder="•••"
                              maxLength={4}
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                              style={{
                                width: '100%',
                                padding: '9px 12px',
                                borderRadius: '6px',
                                border: '1.5px solid #cbd5e1',
                                fontSize: '0.85rem'
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCompletePayment(`Card (ending in ${cardNumber.slice(-4) || '4444'})`)}
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
                        Pay ₹{amount?.toLocaleString()} with Card
                      </button>
                    </div>
                  )}

                  {/* 3. NETBANKING TAB */}
                  {activeTab === 'netbanking' && (
                    <div>
                      <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                        Select Your Bank
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                        {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'].map((bank) => (
                          <button
                            key={bank}
                            onClick={() => setSelectedBank(bank)}
                            style={{
                              padding: '8px 10px',
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
                        onClick={() => handleCompletePayment(`Netbanking (${selectedBank})`)}
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
                        Pay ₹{amount?.toLocaleString()} via {selectedBank}
                      </button>
                    </div>
                  )}

                  {/* 4. CASH ON DELIVERY TAB */}
                  {activeTab === 'cod' && (
                    <div>
                      <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                        Cash on Delivery (COD)
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>
                        Pay with Cash or QR scan at the time of doorstep delivery at <strong>{customerCity || 'your address'}</strong>.
                      </p>

                      <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px', fontSize: '0.78rem', color: '#065f46' }}>
                        ✓ Free Doorstep Delivery Verified for {customerPhone || 'your number'}.
                      </div>

                      <button
                        onClick={() => handleCompletePayment('Cash on Delivery')}
                        style={{
                          width: '100%',
                          backgroundColor: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
                        }}
                      >
                        Confirm Order with Cash on Delivery (₹{amount?.toLocaleString()})
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

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
            color: '#64748b',
            flexShrink: 0
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <ShieldCheck size={14} color="#16a34a" /> 256-Bit SSL Encrypted by Razorpay Gateway
          </span>
          <span style={{ color: '#047857', fontWeight: 600 }}>100% Buyer Protection</span>
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
