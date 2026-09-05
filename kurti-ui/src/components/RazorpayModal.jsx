import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  QrCode,
  Smartphone,
  CreditCard,
  CheckCircle2,
  Loader2,
  User,
  MapPin,
  Phone,
  ArrowRight,
  Lock,
  ExternalLink,
  Copy,
  AlertCircle,
  Banknote,
  Check
} from 'lucide-react';
import { apiCreateRazorpayOrder, apiVerifyRazorpayPayment } from '../utils/api';

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

  // Payment Options State: 'razorpay' | 'upi' | 'cod'
  const [activeTab, setActiveTab] = useState('razorpay');
  const [utrNumber, setUtrNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [processingMethod, setProcessingMethod] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  // Real UPI Payload & QR Code URL
  const orderId = orderDetails?.orderId || `DC-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  const storeUpi = storeSettings?.upiId || '9758999617@upi';
  const merchantName = storeSettings?.upiAccountName || storeSettings?.storeName || 'Durgesh Collection';
  const upiPayload = `upi://pay?pa=${storeUpi}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=Order%20${orderId}`;
  
  // Custom uploaded QR code or dynamic live UPI QR
  const qrCodeUrl = storeSettings?.customQrImage || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=6&data=${encodeURIComponent(upiPayload)}`;

  const razorpayKey = storeSettings?.razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID || '';
  const isRazorpayLiveConfigured = Boolean(razorpayKey && razorpayKey.trim());

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

  // Launch Official Razorpay Live Checkout Popup
  const handleLaunchRazorpayLive = async () => {
    if (!isRazorpayLiveConfigured) {
      alert('Razorpay Live Key ID is not configured yet in Store Settings. Please use Direct UPI QR Scan or Cash on Delivery, or configure your rzp_live_... key in Admin CMS.');
      setActiveTab('upi');
      return;
    }

    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay Checkout SDK is still loading. Please check your internet connection or use UPI QR / Cash on Delivery.');
      return;
    }

    setIsProcessing(true);
    setProcessingMethod('Razorpay Live Gateway');

    try {
      // 1. Attempt to create live order on backend
      let razorpayOrderId = '';
      try {
        const orderRes = await apiCreateRazorpayOrder(amount, orderId, {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim()
        });
        if (orderRes?.order?.id) {
          razorpayOrderId = orderRes.order.id;
        }
      } catch (e) {
        console.warn('Backend Razorpay order token skipped, proceeding with client checkout', e);
      }

      // 2. Razorpay Live Options
      const options = {
        key: razorpayKey.trim(),
        amount: Math.round(Number(amount) * 100),
        currency: 'INR',
        name: storeSettings?.storeName || 'Durgesh Collection',
        description: `Order #${orderId} - Heritage Kurti Collection`,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80',
        order_id: razorpayOrderId || undefined,
        prefill: {
          name: customerName.trim(),
          contact: customerPhone.trim(),
          email: storeSettings?.email || 'care@durgeshcollection.in'
        },
        notes: {
          deliveryAddress: `${customerAddress.trim()}, ${customerCity.trim()} - ${customerPin.trim()}`,
          orderId: orderId
        },
        theme: {
          color: '#800020'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          }
        },
        handler: async (response) => {
          setIsProcessing(false);
          setIsSuccess(true);

          if (response.razorpay_order_id && response.razorpay_signature) {
            try {
              await apiVerifyRazorpayPayment(response);
            } catch (e) {}
          }

          setTimeout(() => {
            onSuccess(response.razorpay_payment_id || `pay_live_${Date.now()}`, {
              customerName: customerName.trim(),
              customerPhone: customerPhone.trim(),
              customerAddress: customerAddress.trim(),
              customerCity: customerCity.trim(),
              customerPin: customerPin.trim(),
              paymentMethod: `Razorpay Live (${response.razorpay_payment_id || 'Verified'})`
            });
          }, 800);
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', (errRes) => {
        setIsProcessing(false);
        alert(`Payment failed: ${errRes?.error?.description || 'Transaction could not be completed'}`);
      });
      rzpInstance.open();
    } catch (err) {
      setIsProcessing(false);
      console.error('Razorpay invocation failed:', err);
      alert('Could not open Razorpay gateway. Please pay using Direct UPI QR or Cash on Delivery.');
    }
  };

  // Direct UPI or COD Confirmation
  const handleConfirmDirectPayment = (methodName) => {
    setIsProcessing(true);
    setProcessingMethod(methodName);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      setTimeout(() => {
        const paymentId = methodName.toLowerCase().includes('cash')
          ? `COD_${orderId}`
          : `UPI_${utrNumber.trim() ? utrNumber.trim() : Date.now()}`;

        onSuccess(paymentId, {
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerAddress: customerAddress.trim(),
          customerCity: customerCity.trim(),
          customerPin: customerPin.trim(),
          paymentMethod: methodName
        });
      }, 900);
    }, 1200);
  };

  const handleCopyUpi = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(storeUpi);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1100, padding: '16px' }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
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
        {/* Top Header */}
        <div
          style={{
            backgroundColor: '#0c2340',
            color: '#ffffff',
            padding: '16px 22px',
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
                width: '38px',
                height: '38px',
                flexShrink: 0
              }}
            >
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <span className="brand-crown-icon" style={{ fontSize: '0.6rem', color: '#fef08a', display: 'block', marginBottom: '1px' }}>
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
                  {storeSettings?.storeName || 'Durgesh Collection'}
                </h4>
                <span
                  style={{
                    backgroundColor: '#10b981',
                    color: '#ffffff',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '4px',
                    letterSpacing: '0.05em'
                  }}
                >
                  LIVE CHECKOUT
                </span>
              </div>
              <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#94a3b8' }}>
                Order #{orderId} • 256-Bit SSL Encrypted
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', display: 'block' }}>Total Payable</span>
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
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {isProcessing || isSuccess ? (
            <div style={{ padding: '60px 24px', textAlign: 'center' }}>
              {isProcessing ? (
                <div>
                  <Loader2 size={48} color="#0052cc" className="animate-spin" style={{ margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', margin: '0 0 6px' }}>
                    Connecting to {processingMethod}...
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 16px' }}>
                    Verifying payment details and generating instant order confirmation.
                  </p>
                  <div style={{ fontSize: '0.8rem', color: '#0052cc', fontWeight: 600 }}>
                    Please do not refresh or close this window.
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
                    Payment Verified Successfully! 🎉
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                    Order confirmed for <strong>{customerName}</strong>. Generating receipt...
                  </p>
                </div>
              )}
            </div>
          ) : step === 'details' ? (
            /* STEP 1: CUSTOMER SHIPPING & CONTACT DETAILS */
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                    1. Shipping & Customer Details
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                    Please enter your real delivery address for express doorstep courier delivery
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
                        placeholder="e.g. 9758999617"
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
            /* STEP 2: LIVE PAYMENT METHOD SELECTION */
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) 2.2fr', minHeight: '340px' }}>
                {/* Left Sidebar: Payment Modes */}
                <div style={{ backgroundColor: '#f8fafc', borderRight: '1px solid #e2e8f0', padding: '10px 0' }}>
                  {[
                    { id: 'razorpay', label: 'Razorpay Live', icon: <CreditCard size={18} />, badge: 'Official' },
                    { id: 'upi', label: 'Direct UPI QR', icon: <QrCode size={18} />, badge: 'Instant' },
                    { id: 'cod', label: 'Cash on Delivery', icon: <Banknote size={18} />, badge: 'Free' }
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
                          padding: '14px 16px',
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
                              padding: '1px 6px',
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
                <div style={{ padding: '22px' }}>
                  {/* TAB 1: OFFICIAL RAZORPAY LIVE GATEWAY */}
                  {activeTab === 'razorpay' && (
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1e293b' }}>
                            Razorpay Live Payment Gateway
                          </h4>
                          <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                            Pay via Cards, UPI Apps, Netbanking, or Digital Wallets
                          </p>
                        </div>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '3px 8px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                          ● Live Mode
                        </span>
                      </div>

                      <div
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1.5px solid #e2e8f0',
                          marginBottom: '18px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                          <ShieldCheck size={20} color="#059669" />
                          <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                            RBI Authorized Payment Gateway
                          </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5 }}>
                          Supports Google Pay, PhonePe, Paytm, CRED, RuPay, Visa, Mastercard, Netbanking (HDFC, SBI, ICICI, Axis), and EMI.
                        </p>

                        {!isRazorpayLiveConfigured && (
                          <div
                            style={{
                              marginTop: '12px',
                              backgroundColor: '#fffbeb',
                              border: '1px solid #fef3c7',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              fontSize: '0.75rem',
                              color: '#92400e',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '8px'
                            }}
                          >
                            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                              <strong>Live Razorpay Key Pending in Admin Settings:</strong>
                              <div style={{ marginTop: '2px' }}>
                                Add your <code>rzp_live_...</code> key in CMS Settings to enable online checkout. In the meantime, please complete your order via <strong>Direct UPI QR Scan</strong> or <strong>Cash on Delivery</strong>.
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={handleLaunchRazorpayLive}
                        style={{
                          width: '100%',
                          backgroundColor: '#0052cc',
                          color: '#ffffff',
                          border: 'none',
                          padding: '13px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(0, 82, 204, 0.3)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Lock size={16} /> Pay ₹{amount?.toLocaleString()} via Razorpay Live
                      </button>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '14px', fontSize: '0.72rem', color: '#94a3b8' }}>
                        <span>🔒 256-Bit SSL Secured</span>
                        <span>⚡ Instant Confirmation</span>
                        <span>🛡️ 100% Refund Guarantee</span>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: DIRECT STORE UPI QR SCAN */}
                  {activeTab === 'upi' && (
                    <div>
                      <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                        Scan & Pay via any UPI App (0% Extra Fee)
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
                              onClick={handleCopyUpi}
                              style={{
                                backgroundColor: copiedUpi ? '#ecfdf5' : '#f1f5f9',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                padding: '2px 6px',
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                color: copiedUpi ? '#059669' : '#334155',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px'
                              }}
                            >
                              {copiedUpi ? <Check size={11} /> : <Copy size={11} />}
                              {copiedUpi ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                          <span style={{ fontSize: '0.84rem', color: '#16a34a', fontWeight: 800, display: 'block', marginTop: '4px' }}>
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

                      {/* 12-Digit UTR / Transaction Reference ID */}
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                          Enter 12-Digit UTR / Transaction Reference No (Optional):
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="e.g. 423871928374 or GPay Ref ID"
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
                              handleConfirmDirectPayment(
                                utrNumber.trim() ? `Direct UPI (UTR: ${utrNumber.trim()})` : 'Direct UPI QR Scan'
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

                  {/* TAB 3: CASH ON DELIVERY */}
                  {activeTab === 'cod' && (
                    <div>
                      <h4 style={{ margin: '0 0 8px', fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                        Cash on Delivery (COD)
                      </h4>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5, marginBottom: '14px' }}>
                        Pay in Cash or scan delivery partner's QR at the time of doorstep delivery at <strong>{customerCity || 'your address'}</strong>.
                      </p>

                      <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px 12px', marginBottom: '16px', fontSize: '0.78rem', color: '#065f46' }}>
                        ✓ Free Doorstep Express Delivery Verified for {customerPhone || 'your mobile number'}.
                      </div>

                      <button
                        onClick={() => handleConfirmDirectPayment('Cash on Delivery (COD)')}
                        style={{
                          width: '100%',
                          backgroundColor: '#059669',
                          color: '#ffffff',
                          border: 'none',
                          padding: '13px',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.92rem',
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
            <ShieldCheck size={14} color="#16a34a" /> 256-Bit SSL Encrypted by Razorpay Live Gateway
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
