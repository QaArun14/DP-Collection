import React, { useState } from 'react';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Star,
  Camera,
  Tag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Clock,
  Truck,
  MessageCircle,
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  TrendingUp,
  CreditCard,
  DollarSign,
  Package,
  Eye,
  LogOut,
  KeyRound,
  Sparkles,
  Palette,
  Layers,
  Award
} from 'lucide-react';
import ProductModal from './ProductModal';
import ReviewModal from './ReviewModal';
import InstaPostModal from './InstaPostModal';
import CouponModal from './CouponModal';
import ImageUploadField from './ImageUploadField';
import {
  apiCreateProduct,
  apiUpdateProduct,
  apiDeleteProduct,
  apiUpdateOrderStatus,
  apiDeleteOrder,
  apiClearAllOrders,
  apiCreateReview,
  apiDeleteReview,
  apiCreateInsta,
  apiDeleteInsta,
  apiCreateCoupon,
  apiDeleteCoupon,
  apiUpdateSettings,
  apiChangeAdminPassword,
  apiUpdateLanding
} from '../../utils/api';

export default function AdminDashboard({
  products,
  setProducts,
  orders,
  setOrders,
  reviews,
  setReviews,
  instaPosts,
  setInstaPosts,
  coupons,
  setCoupons,
  storeSettings,
  setStoreSettings,
  landingContent,
  setLandingContent,
  onResetDefaults,
  onViewStore,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'orders', 'reviews', 'insta', 'coupons', 'settings', 'landing'
  const [productSearch, setProductSearch] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');

  // Modals state
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);

  const [instaModalOpen, setInstaModalOpen] = useState(false);
  const [editingInstaPost, setEditingInstaPost] = useState(null);

  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState(storeSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Landing Page form state
  const [landingForm, setLandingForm] = useState(landingContent || {});
  const [landingSaved, setLandingSaved] = useState(false);

  // Synchronize landingForm when landingContent changes
  React.useEffect(() => {
    if (landingContent) setLandingForm(landingContent);
  }, [landingContent]);

  // Admin Credentials form state
  const [authForm, setAuthForm] = useState({ username: 'admin@durgeshcollection.in', password: '' });
  const [authSaved, setAuthSaved] = useState(false);

  const handleSaveLanding = async (e) => {
    if (e) e.preventDefault();
    setLandingContent(landingForm);
    await apiUpdateLanding(landingForm);
    setLandingSaved(true);
    setTimeout(() => setLandingSaved(false), 2500);
  };

  const handleSaveAuth = async (e) => {
    e.preventDefault();
    if (!authForm.username.trim() || !authForm.password.trim()) {
      alert('Username and password cannot be empty.');
      return;
    }
    await apiChangeAdminPassword(authForm.username, authForm.password);
    setAuthSaved(true);
    setTimeout(() => setAuthSaved(false), 2500);
  };

  // --- Product Handlers ---
  const handleSaveProduct = async (prodData) => {
    const cleanImages = Array.isArray(prodData.images) && prodData.images.length > 0
      ? prodData.images.filter(Boolean)
      : [prodData.primaryImage, prodData.secondaryImage].filter(Boolean);

    const safeProduct = {
      ...prodData,
      id: String(prodData.id || Date.now()),
      category: (prodData.category || 'straight').toLowerCase(),
      sizes: Array.isArray(prodData.sizes) && prodData.sizes.length > 0 ? prodData.sizes : ['S', 'M', 'L', 'XL'],
      colors: Array.isArray(prodData.colors) && prodData.colors.length > 0 ? prodData.colors : [{ name: 'Standard', hex: '#881337', image: cleanImages[0] || '' }],
      images: cleanImages.length > 0 ? cleanImages : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
      primaryImage: cleanImages[0] || prodData.primaryImage || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      secondaryImage: cleanImages[1] || prodData.secondaryImage || cleanImages[0] || 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      price: Number(prodData.price) || 999,
      originalPrice: Number(prodData.originalPrice) || (Number(prodData.price) ? Number(prodData.price) * 2 : 1999),
      rating: Number(prodData.rating) || 4.8,
      reviewCount: Number(prodData.reviewCount) || 1,
      stock: Number(prodData.stock) || 10,
      craft: prodData.craft || 'Handblock Print',
      fabric: prodData.fabric || '100% Pure Cotton',
      fit: prodData.fit || 'Regular Fit',
      neckline: prodData.neckline || 'Round Neck',
      tag: prodData.tag || 'New Arrival',
      discount: prodData.discount || '40% OFF',
      isFeatured: Boolean(prodData.isFeatured)
    };

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (String(p.id) === String(safeProduct.id) ? safeProduct : p)));
      await apiUpdateProduct(safeProduct.id, safeProduct);
    } else {
      setProducts((prev) => [safeProduct, ...prev]);
      await apiCreateProduct(safeProduct);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      await apiDeleteProduct(id);
    }
  };

  // --- Order Handlers ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (String(ord.orderId) === String(orderId) ? { ...ord, status: newStatus } : ord))
    );
    await apiUpdateOrderStatus(orderId, newStatus);
  };

  const handleUpdateOrderTracking = async (orderId, trackingNumber, courierPartner) => {
    setOrders((prev) =>
      prev.map((ord) =>
        String(ord.orderId) === String(orderId) ? { ...ord, trackingNumber, courierPartner } : ord
      )
    );
    await apiUpdateOrderStatus(orderId, undefined, trackingNumber, courierPartner);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to delete order #${orderId}?`)) {
      setOrders((prev) => prev.filter((ord) => String(ord.orderId) !== String(orderId)));
      await apiDeleteOrder(orderId);
    }
  };

  const handleClearAllOrders = async () => {
    if (window.confirm('⚠️ WARNING: This will permanently delete ALL order & payment history from the database. Are you sure you want to clear all orders?')) {
      setOrders([]);
      await apiClearAllOrders();
    }
  };

  const handleSendWhatsAppUpdate = (order) => {
    const trackingInfo = order.trackingNumber ? `\n🚚 Courier: *${order.courierPartner || 'Delhivery'}* (AWB: *${order.trackingNumber}*)` : '';
    const text = `Namaste ${order.customerName || 'Customer'}! 🌸\n\n` +
      `Update on your *Durgesh Collection* order *#${order.orderId}*:\n` +
      `📦 Status: *${order.status}*${trackingInfo}\n` +
      `💰 Total Amount: Rs. ${order.total?.toLocaleString()}\n` +
      `💳 Mode: *${order.paymentMethod || 'Confirmed'}*\n\n` +
      `Thank you for choosing Durgesh Collection, Sanjay Place, Agra!`;
    const phone = order.customerPhone || storeSettings.whatsappNumber;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // --- Review Handlers ---
  const handleSaveReview = async (revData) => {
    if (editingReview) {
      setReviews((prev) => prev.map((r) => (String(r.id) === String(revData.id) ? revData : r)));
    } else {
      setReviews((prev) => [revData, ...prev]);
      await apiCreateReview(revData);
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm('Delete this customer review?')) {
      setReviews((prev) => prev.filter((r) => String(r.id) !== String(id)));
      await apiDeleteReview(id);
    }
  };

  // --- Instagram Lookbook Handlers ---
  const handleSaveInstaPost = async (postData) => {
    if (editingInstaPost) {
      setInstaPosts((prev) => prev.map((post) => (String(post.id) === String(postData.id) ? postData : post)));
    } else {
      setInstaPosts((prev) => [postData, ...prev]);
      await apiCreateInsta(postData);
    }
  };

  const handleDeleteInstaPost = async (id) => {
    if (window.confirm('Delete this lookbook item?')) {
      setInstaPosts((prev) => prev.filter((p) => String(p.id) !== String(id)));
      await apiDeleteInsta(id);
    }
  };

  // --- Coupon Handlers ---
  const handleSaveCoupon = async (couponData) => {
    setCoupons((prev) => ({
      ...prev,
      [couponData.code]: couponData
    }));
    await apiCreateCoupon(couponData);
  };

  const handleDeleteCoupon = async (code) => {
    if (window.confirm(`Delete coupon code ${code}?`)) {
      setCoupons((prev) => {
        const copy = { ...prev };
        delete copy[code];
        return copy;
      });
      await apiDeleteCoupon(code);
    }
  };

  // --- Store Settings Handlers ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setStoreSettings(settingsForm);
    await apiUpdateSettings(settingsForm);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  // Derived Analytics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);
  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCatFilter === 'all' || p.category === selectedCatFilter;
    const matchesQuery = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-sans)' }}>
      {/* Top Admin CMS Header */}
      <header
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            className="brand-emblem-shield"
            style={{
              width: '40px',
              height: '40px',
              flexShrink: 0
            }}
          >
            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <span className="brand-crown-icon" style={{ fontSize: '0.62rem', color: '#fef08a', display: 'block', marginBottom: '1px' }}>
                👑
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-royal)', color: '#ffffff', letterSpacing: '0.04em' }}>
                DC
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 className="brand-shimmer-gold" style={{ margin: 0, fontSize: '1.2rem', letterSpacing: '0.06em' }}>
                {storeSettings.storeName?.toUpperCase() || 'DURGESH COLLECTION'}
              </h2>
              <span
                style={{
                  backgroundColor: 'rgba(212, 175, 55, 0.25)',
                  color: '#fef08a',
                  border: '1px solid #d4af37',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  letterSpacing: '0.05em'
                }}
              >
                ADMIN CMS
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#d4af37' }}>📍</span> Sanjay Place, Agra Store Manager
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onResetDefaults}
            style={{
              backgroundColor: 'transparent',
              color: '#94a3b8',
              border: '1px solid #334155',
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Reset to default sample data"
          >
            <RotateCcw size={13} /> Reset Sample Data
          </button>

          <button
            onClick={onViewStore}
            className="btn-gold"
            style={{ padding: '8px 16px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Eye size={16} /> View Live Store
          </button>

          <button
            onClick={onLogout}
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              color: '#f87171',
              border: '1px solid #ef4444',
              padding: '8px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Sign out of Admin CMS"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      {/* Main CMS Layout */}
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Left Admin Navigation Sidebar */}
        <aside
          style={{
            width: '240px',
            backgroundColor: '#1e293b',
            color: '#94a3b8',
            padding: '20px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            flexShrink: 0
          }}
        >
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: <LayoutDashboard size={18} /> },
            { id: 'landing', label: 'Landing Page & Banners', icon: <Sparkles size={18} /> },
            { id: 'products', label: 'Products Catalog', icon: <Shirt size={18} />, badge: products.length },
            { id: 'orders', label: 'Orders & Payments', icon: <ShoppingBag size={18} />, badge: orders.length },
            { id: 'reviews', label: 'Customer Reviews', icon: <Star size={18} />, badge: reviews.length },
            { id: 'insta', label: 'Instagram Lookbook', icon: <Camera size={18} />, badge: instaPosts.length },
            { id: 'coupons', label: 'Promo Coupons', icon: <Tag size={18} /> },
            { id: 'settings', label: 'Store & Contact Settings', icon: <Settings size={18} /> }
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 20px',
                  border: 'none',
                  backgroundColor: isActive ? 'rgba(128, 0, 32, 0.4)' : 'transparent',
                  color: isActive ? '#ffffff' : '#94a3b8',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  borderLeft: isActive ? '4px solid #d4af37' : '4px solid transparent',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      backgroundColor: isActive ? 'var(--color-primary)' : '#334155',
                      color: '#ffffff',
                      padding: '1px 7px',
                      borderRadius: '9999px'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Right Main Content Panel */}
        <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
          {/* 1. DASHBOARD OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Store Performance Overview
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Real-time metrics for Durgesh Collection store & orders
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 18px' }}
                >
                  <Plus size={16} /> Add New Kurti
                </button>
              </div>

              {/* 4 Analytics Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Total Revenue</span>
                    <div style={{ backgroundColor: '#eff6ff', padding: '6px', borderRadius: '8px', color: '#2563eb' }}>
                      <DollarSign size={18} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 4px' }}>
                    ₹{totalRevenue.toLocaleString()}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={13} /> Includes Razorpay & COD orders
                  </span>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Total Orders Placed</span>
                    <div style={{ backgroundColor: '#f0fdf4', padding: '6px', borderRadius: '8px', color: '#16a34a' }}>
                      <ShoppingBag size={18} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 4px' }}>
                    {orders.length}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    All verified live transactions
                  </span>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Active Kurti Styles</span>
                    <div style={{ backgroundColor: '#fdf4ff', padding: '6px', borderRadius: '8px', color: '#c026d3' }}>
                      <Package size={18} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 4px' }}>
                    {products.length}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Straight, Anarkali & Sets in stock
                  </span>
                </div>

                <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.82rem', fontWeight: 600 }}>
                    <span>Customer Reviews</span>
                    <div style={{ backgroundColor: '#fefce8', padding: '6px', borderRadius: '8px', color: '#ca8a04' }}>
                      <Star size={18} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 4px' }}>
                    {reviews.length}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                    ★ 4.9 Average Rating
                  </span>
                </div>
              </div>

              {/* Recent Orders Quick Feed */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '24px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                    Recent Orders & Payments
                  </h3>
                  <button onClick={() => setActiveTab('orders')} style={{ background: 'none', border: 'none', color: '#0052cc', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
                    View All Orders →
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b' }}>
                        <th style={{ padding: '10px 14px' }}>Order ID</th>
                        <th style={{ padding: '10px 14px' }}>Customer</th>
                        <th style={{ padding: '10px 14px' }}>Items</th>
                        <th style={{ padding: '10px 14px' }}>Amount</th>
                        <th style={{ padding: '10px 14px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 4).map((ord) => (
                        <tr key={ord.orderId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0f172a' }}>{ord.orderId}</td>
                          <td style={{ padding: '12px 14px' }}>{ord.customerName || 'Online Customer'}</td>
                          <td style={{ padding: '12px 14px', color: '#475569' }}>{ord.items?.[0]?.name || 'Kurti Item'} ({ord.items?.length || 1} items)</td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--color-primary)' }}>₹{ord.total?.toLocaleString()}</td>
                          <td style={{ padding: '12px 14px' }}>
                            <span
                              style={{
                                backgroundColor: ord.status === 'Delivered' ? '#dcfce7' : ord.status === 'Dispatched' ? '#eff6ff' : '#fef9c3',
                                color: ord.status === 'Delivered' ? '#166534' : ord.status === 'Dispatched' ? '#1e40af' : '#854d0e',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}
                            >
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS CATALOG TAB */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Product Catalog ({products.length} Items)
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Manage prices, photos, descriptions, sizes and stock
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setProductModalOpen(true);
                  }}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 20px' }}
                >
                  <Plus size={16} /> Add New Kurti
                </button>
              </div>

              {/* Filters Bar */}
              <div style={{ backgroundColor: '#ffffff', padding: '14px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <Search size={16} color="#64748b" />
                  <input
                    type="text"
                    placeholder="Search kurtis by name or fabric..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.85rem' }}
                  />
                </div>

                <select
                  value={selectedCatFilter}
                  onChange={(e) => setSelectedCatFilter(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', outline: 'none', backgroundColor: '#fff' }}
                >
                  <option value="all">All Categories</option>
                  <option value="straight">Straight Kurtis</option>
                  <option value="anarkali">Anarkali & Flared</option>
                  <option value="sets">Kurta Pant Sets</option>
                  <option value="short">Short Tunics</option>
                  <option value="festive">Festive Silk</option>
                </select>
              </div>

              {/* Products Table */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b' }}>
                      <th style={{ padding: '12px 16px' }}>Photo</th>
                      <th style={{ padding: '12px 16px' }}>Title & Fabric</th>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Price (₹)</th>
                      <th style={{ padding: '12px 16px' }}>Stock</th>
                      <th style={{ padding: '12px 16px' }}>Sizes</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ position: 'relative', width: '48px' }}>
                            <img src={p.primaryImage || p.images?.[0]} alt={p.name} style={{ width: '48px', height: '62px', borderRadius: '6px', objectFit: 'cover' }} />
                            {(p.images?.length || 1) > 1 && (
                              <span style={{ fontSize: '0.62rem', backgroundColor: 'rgba(15, 23, 42, 0.75)', color: '#ffffff', padding: '1px 4px', borderRadius: '3px', position: 'absolute', bottom: '2px', right: '2px', fontWeight: 700 }}>
                                📸 {p.images.length}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.fabric} • {p.craft}</div>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', textTransform: 'capitalize', fontWeight: 600 }}>
                            {p.category}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>₹{p.price.toLocaleString()}</span>
                          {p.originalPrice && <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '6px', textDecoration: 'line-through' }}>₹{p.originalPrice}</span>}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <span style={{ color: p.stock <= 3 ? '#dc2626' : '#16a34a', fontWeight: 700 }}>
                            {p.stock} pcs
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', fontSize: '0.75rem' }}>
                          {p.sizes?.join(', ')}
                        </td>
                        <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setProductModalOpen(true);
                              }}
                              style={{ background: '#f1f5f9', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#0052cc' }}
                              title="Edit product"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              style={{ background: '#fef2f2', border: 'none', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444' }}
                              title="Delete product"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. ORDERS & PAYMENTS TAB */}
          {activeTab === 'orders' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Customer Orders & Payments ({orders.length})
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Manage live Cash on Delivery (COD), UPI payments, dispatch statuses, and WhatsApp customer alerts
                  </p>
                </div>

                {orders.length > 0 && (
                  <button
                    onClick={handleClearAllOrders}
                    style={{
                      backgroundColor: '#fef2f2',
                      color: '#ef4444',
                      border: '1px solid #fecaca',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Trash2 size={15} /> Clear All Orders
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    border: '1px dashed #cbd5e1'
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      color: '#64748b'
                    }}
                  >
                    <ShoppingBag size={28} />
                  </div>
                  <h3 style={{ margin: '0 0 6px', fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>
                    No Orders Yet
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>
                    When a customer places a live order, it will appear here in real time.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {orders.map((ord) => {
                    const isCod = (ord.paymentMethod || '').toLowerCase().includes('cash') || (ord.paymentMethod || '').toLowerCase().includes('cod');
                    return (
                      <div
                        key={ord.orderId}
                        style={{
                          backgroundColor: '#ffffff',
                          borderRadius: '14px',
                          padding: '20px',
                          border: '1px solid #e2e8f0',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '16px',
                          alignItems: 'start'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                              #{ord.orderId}
                            </h4>
                            <span
                              style={{
                                fontSize: '0.7rem',
                                backgroundColor: isCod ? '#fef3c7' : '#eff6ff',
                                color: isCod ? '#92400e' : '#1e40af',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontWeight: 800
                              }}
                            >
                              {ord.paymentMethod || (isCod ? 'Cash on Delivery (COD)' : 'UPI / Online')}
                            </span>
                          </div>
                          {ord.paymentId && (
                            <p style={{ margin: '0 0 2px', fontSize: '0.75rem', color: '#64748b' }}>
                              Ref ID: <strong style={{ fontFamily: 'monospace', color: '#047857' }}>{ord.paymentId}</strong>
                            </p>
                          )}
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Placed: {ord.date || 'Recent'}</span>
                        </div>

                        <div>
                          <h5 style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                            👤 Customer: {ord.customerName || 'Online Shopper'}
                          </h5>
                          <p style={{ margin: '0 0 2px', fontSize: '0.78rem', color: '#64748b' }}>
                            📞 {ord.customerPhone || storeSettings.whatsappNumber}
                          </p>
                          {ord.customerAddress && (
                            <p style={{ margin: 0, fontSize: '0.76rem', color: '#64748b', lineHeight: 1.3 }}>
                              📍 {ord.customerAddress}, {ord.customerCity} - {ord.customerPin}
                            </p>
                          )}
                        </div>

                        <div>
                          <h5 style={{ margin: '0 0 4px', fontSize: '0.85rem', fontWeight: 700, color: '#1e293b' }}>
                            Items ({ord.items?.length || 1}):
                          </h5>
                          <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                            {ord.items?.map((it, idx) => (
                              <div key={idx} style={{ marginBottom: '2px' }}>
                                • {it.name} <span style={{ color: '#64748b' }}>({it.selectedSize} × {it.quantity})</span>
                              </div>
                            ))}
                          </div>
                          <div style={{ marginTop: '6px', fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-primary)' }}>
                            Total: ₹{ord.total?.toLocaleString()}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                            Order Status:
                          </label>
                          <select
                            value={ord.status || 'Confirmed'}
                            onChange={(e) => handleUpdateOrderStatus(ord.orderId, e.target.value)}
                            style={{
                              padding: '7px 10px',
                              borderRadius: '6px',
                              border: '1px solid #cbd5e1',
                              fontWeight: 700,
                              fontSize: '0.82rem',
                              backgroundColor:
                                ord.status === 'Delivered'
                                  ? '#dcfce7'
                                  : ord.status === 'Dispatched'
                                  ? '#eff6ff'
                                  : ord.status === 'Processing'
                                  ? '#fef9c3'
                                  : '#f1f5f9',
                              color:
                                ord.status === 'Delivered'
                                  ? '#166534'
                                  : ord.status === 'Dispatched'
                                  ? '#1e40af'
                                  : ord.status === 'Processing'
                                  ? '#854d0e'
                                  : '#334155'
                            }}
                          >
                            <option value="Confirmed">1. Confirmed / Placed</option>
                            <option value="Processing">2. Quality Check & Packing</option>
                            <option value="Dispatched">3. Dispatched 🚚</option>
                            <option value="Out for Delivery">4. Out for Delivery 🏡</option>
                            <option value="Delivered">5. Delivered ✅</option>
                            <option value="Cancelled">Cancelled ❌</option>
                          </select>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleSendWhatsAppUpdate(ord)}
                              style={{
                                flex: 1,
                                backgroundColor: '#25D366',
                                color: '#ffffff',
                                border: 'none',
                                padding: '7px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}
                            >
                              <MessageCircle size={14} /> WhatsApp
                            </button>

                            <button
                              onClick={() => handleDeleteOrder(ord.orderId)}
                              style={{
                                backgroundColor: '#fee2e2',
                                color: '#ef4444',
                                border: 'none',
                                padding: '7px 10px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                              title="Delete this order"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 4. CUSTOMER REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Customer Reviews & Ratings ({reviews.length})
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Add real buyer testimonials and feedback displayed on the live website
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingReview(null);
                    setReviewModalOpen(true);
                  }}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 18px' }}
                >
                  <Plus size={16} /> Write Customer Review
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      padding: '20px',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', gap: '2px', color: '#d97706' }}>
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} size={15} fill="#d97706" color="#d97706" />
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setEditingReview(rev);
                              setReviewModalOpen(true);
                            }}
                            style={{ background: '#f1f5f9', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', color: '#0052cc' }}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            style={{ background: '#fef2f2', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', color: '#ef4444' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p style={{ fontStyle: 'italic', fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, marginBottom: '14px' }}>
                        "{rev.review}"
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={rev.avatar} alt={rev.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {rev.name}
                          {rev.verified && <CheckCircle2 size={13} color="#16a34a" fill="#16a34a" />}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {rev.city} • {rev.productName}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. INSTAGRAM LOOKBOOK TAB */}
          {activeTab === 'insta' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Instagram Lookbook ({instaPosts.length} Photos)
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Manage #DurgeshCollection lookbook photos and handles displayed on landing page
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingInstaPost(null);
                    setInstaModalOpen(true);
                  }}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 18px' }}
                >
                  <Plus size={16} /> Add Lookbook Photo
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
                {instaPosts.map((post) => (
                  <div
                    key={post.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      position: 'relative'
                    }}
                  >
                    <div style={{ height: '240px', overflow: 'hidden' }}>
                      <img src={post.image} alt={post.handle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{post.handle}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#dc2626' }}>♥ {post.likes}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Wearing: {post.product}</p>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          onClick={() => {
                            setEditingInstaPost(post);
                            setInstaModalOpen(true);
                          }}
                          style={{ flex: 1, backgroundColor: '#f1f5f9', border: 'none', padding: '6px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#0052cc', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteInstaPost(post.id)}
                          style={{ backgroundColor: '#fef2f2', border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: '#ef4444', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. PROMO COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Promo Coupons & Discounts
                  </h2>
                  <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                    Create special discount codes for Agra & India customers (e.g. AGRA25, FESTIVE30)
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingCoupon(null);
                    setCouponModalOpen(true);
                  }}
                  className="btn-primary"
                  style={{ fontSize: '0.85rem', padding: '10px 18px' }}
                >
                  <Plus size={16} /> Create New Coupon
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                {Object.entries(coupons).map(([code, c]) => (
                  <div
                    key={code}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      padding: '20px',
                      border: '1px dashed #cbd5e1',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span
                        style={{
                          backgroundColor: 'rgba(128, 0, 32, 0.1)',
                          color: 'var(--color-primary)',
                          fontWeight: 800,
                          fontSize: '1.1rem',
                          padding: '3px 10px',
                          borderRadius: '6px',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {code}
                      </span>
                      <button
                        onClick={() => handleDeleteCoupon(code)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                        title="Delete coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <h4 style={{ margin: '8px 0 4px', fontSize: '1.2rem', fontWeight: 800, color: '#16a34a' }}>
                      {c.discountPercent ? `${c.discountPercent}% OFF` : `₹${c.discountFlat} FLAT OFF`}
                    </h4>
                    <p style={{ margin: '0 0 6px', fontSize: '0.82rem', color: '#475569' }}>{c.description}</p>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Min. Cart Value: ₹{c.minOrder || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. LANDING PAGE & BANNERS CONTENT EDITOR */}
          {activeTab === 'landing' && (
            <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
              {/* Header Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '28px',
                  backgroundColor: '#ffffff',
                  padding: '20px 24px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 800 }}>
                      LIVE STOREFRONT CUSTOMIZER
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', margin: '6px 0 2px' }}>
                    Landing Page & Banners Editor
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    Customize Hero banner photo, headings, category tiles, and artisan heritage story directly from your device
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {landingSaved && (
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f0fdf4', padding: '8px 14px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                      <CheckCircle2 size={16} /> Updated live on store!
                    </span>
                  )}
                  <button
                    onClick={handleSaveLanding}
                    className="btn-primary"
                    style={{ padding: '12px 28px', fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)' }}
                  >
                    <CheckCircle2 size={18} /> Save & Publish Changes
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* ======================================================== */}
                {/* SECTION 1: HERO BANNER & HEADLINES */}
                {/* ======================================================== */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ backgroundColor: 'rgba(128, 0, 32, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--color-primary)' }}>
                        <Sparkles size={22} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                          1. Main Hero Banner & Headlines
                        </h3>
                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                          The primary showcase and model banner customers see first on your website
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px', alignItems: 'start' }}>
                    {/* Left Column: Headlines & Copy */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          Top Badge / Tagline
                        </label>
                        <input
                          type="text"
                          value={landingForm.hero?.badge || ''}
                          onChange={(e) =>
                            setLandingForm({
                              ...landingForm,
                              hero: { ...landingForm.hero, badge: e.target.value }
                            })
                          }
                          placeholder="e.g. New Autumn / Festive Edition 2026"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', fontWeight: 600 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          Main Hero Headline
                        </label>
                        <textarea
                          rows={2}
                          value={landingForm.hero?.title || ''}
                          onChange={(e) =>
                            setLandingForm({
                              ...landingForm,
                              hero: { ...landingForm.hero, title: e.target.value }
                            })
                          }
                          placeholder="Handcrafted Grace for the Modern Indian Woman"
                          style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.4, resize: 'vertical' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          Subtitle Story Description
                        </label>
                        <textarea
                          rows={3}
                          value={landingForm.hero?.subtitle || ''}
                          onChange={(e) =>
                            setLandingForm({
                              ...landingForm,
                              hero: { ...landingForm.hero, subtitle: e.target.value }
                            })
                          }
                          placeholder="Experience the timeless charm of Jaipur Handblock prints..."
                          style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', lineHeight: 1.5, resize: 'vertical' }}
                        />
                      </div>

                      {/* Action Buttons Row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Primary Button Label
                          </label>
                          <input
                            type="text"
                            value={landingForm.hero?.exploreBtnText || ''}
                            onChange={(e) =>
                              setLandingForm({
                                ...landingForm,
                                hero: { ...landingForm.hero, exploreBtnText: e.target.value }
                              })
                            }
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Secondary Button Label
                          </label>
                          <input
                            type="text"
                            value={landingForm.hero?.festiveBtnText || ''}
                            onChange={(e) =>
                              setLandingForm({
                                ...landingForm,
                                hero: { ...landingForm.hero, festiveBtnText: e.target.value }
                              })
                            }
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                          />
                        </div>
                      </div>

                      {/* Offer Badge & Customer Ratings */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Floating Discount Tag
                          </label>
                          <input
                            type="text"
                            value={landingForm.hero?.offerBadgeTag || ''}
                            onChange={(e) =>
                              setLandingForm({
                                ...landingForm,
                                hero: { ...landingForm.hero, offerBadgeTag: e.target.value }
                              })
                            }
                            placeholder="Flat 48% Off"
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary)' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Customer Rating Text
                          </label>
                          <input
                            type="text"
                            value={landingForm.hero?.ratingScore || ''}
                            onChange={(e) =>
                              setLandingForm({
                                ...landingForm,
                                hero: { ...landingForm.hero, ratingScore: e.target.value }
                              })
                            }
                            placeholder="★ 4.9 / 5.0"
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 700 }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Hero Banner Image & Live Preview Card */}
                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>
                        Hero Model Banner Photo
                      </h4>
                      <ImageUploadField
                        label="Upload Banner Photo"
                        value={landingForm.hero?.image || ''}
                        onChange={(url) =>
                          setLandingForm({
                            ...landingForm,
                            hero: { ...landingForm.hero, image: url }
                          })
                        }
                        aspectRatio="portrait"
                        helperText="Upload portrait or landscape model photo from device or paste web link"
                      />

                      {/* Image Display Fit Option */}
                      <div style={{ marginTop: '12px', marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          Image Display Fit Mode (Photo Cutting Setting)
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() =>
                              setLandingForm({
                                ...landingForm,
                                hero: { ...landingForm.hero, imageFit: 'contain' }
                              })
                            }
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: (landingForm.hero?.imageFit || 'contain') === 'contain' ? '2px solid var(--color-primary)' : '1px solid #cbd5e1',
                              backgroundColor: (landingForm.hero?.imageFit || 'contain') === 'contain' ? 'rgba(128, 0, 32, 0.08)' : '#ffffff',
                              color: (landingForm.hero?.imageFit || 'contain') === 'contain' ? 'var(--color-primary)' : '#475569',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            🖼️ Full Image (No Cropping)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setLandingForm({
                                ...landingForm,
                                hero: { ...landingForm.hero, imageFit: 'cover' }
                              })
                            }
                            style={{
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: landingForm.hero?.imageFit === 'cover' ? '2px solid var(--color-primary)' : '1px solid #cbd5e1',
                              backgroundColor: landingForm.hero?.imageFit === 'cover' ? 'rgba(128, 0, 32, 0.08)' : '#ffffff',
                              color: landingForm.hero?.imageFit === 'cover' ? 'var(--color-primary)' : '#475569',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            📐 Fill / Cover Area
                          </button>
                        </div>
                      </div>

                      {/* Live Image Preview Card - Full Uncropped */}
                      {landingForm.hero?.image && (
                        <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e2e8f0', position: 'relative', backgroundColor: '#faf7f2', minHeight: '340px', maxHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {/* Ambient soft blur */}
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              backgroundImage: `url(${landingForm.hero.image})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              filter: 'blur(25px) opacity(0.35)',
                              transform: 'scale(1.15)',
                              pointerEvents: 'none'
                            }}
                          />
                          <img
                            src={landingForm.hero.image}
                            alt="Hero Preview"
                            style={{
                              position: 'relative',
                              zIndex: 2,
                              maxWidth: '100%',
                              maxHeight: '400px',
                              width: (landingForm.hero?.imageFit || 'contain') === 'cover' ? '100%' : 'auto',
                              height: (landingForm.hero?.imageFit || 'contain') === 'cover' ? '100%' : 'auto',
                              objectFit: (landingForm.hero?.imageFit || 'contain') === 'contain' ? 'contain' : 'cover',
                              display: 'block',
                              margin: '0 auto'
                            }}
                          />
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', padding: '8px 12px', color: '#ffffff', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Preview: {(landingForm.hero?.imageFit || 'contain') === 'contain' ? 'Full Image (No Cropping)' : 'Cover Fit'}</span>
                            <span style={{ color: '#fde68a', fontWeight: 700 }}>Live Asset</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SECTION 2: CATEGORY SHOWCASE TILES */}
                {/* ======================================================== */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ backgroundColor: 'rgba(128, 0, 32, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--color-primary)' }}>
                        <Layers size={22} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                          2. Category Showcase Tiles (5 Categories)
                        </h3>
                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                          Upload custom photos and edit titles for Straight Kurtis, Anarkalis, Sets, Short Tunics & Festive Silks
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                    {(landingForm.categories || []).map((cat, idx) => (
                      <div
                        key={cat.id || idx}
                        style={{
                          backgroundColor: '#f8fafc',
                          borderRadius: '14px',
                          padding: '20px',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {cat.title || `Category ${idx + 1}`}
                          </span>
                          <span style={{ backgroundColor: '#fef08a', color: '#854d0e', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px' }}>
                            {cat.tag || 'Popular'}
                          </span>
                        </div>

                        <ImageUploadField
                          label="Category Tile Photo"
                          value={cat.image || ''}
                          onChange={(newUrl) => {
                            const updated = [...(landingForm.categories || [])];
                            updated[idx] = { ...updated[idx], image: newUrl };
                            setLandingForm({ ...landingForm, categories: updated });
                          }}
                          aspectRatio="portrait"
                          helperText="Upload clean category thumbnail"
                        />

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                            Category Title
                          </label>
                          <input
                            type="text"
                            value={cat.title || ''}
                            onChange={(e) => {
                              const updated = [...(landingForm.categories || [])];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setLandingForm({ ...landingForm, categories: updated });
                            }}
                            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                            Subtitle Tagline
                          </label>
                          <input
                            type="text"
                            value={cat.subtitle || ''}
                            onChange={(e) => {
                              const updated = [...(landingForm.categories || [])];
                              updated[idx] = { ...updated[idx], subtitle: e.target.value };
                              setLandingForm({ ...landingForm, categories: updated });
                            }}
                            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.82rem' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ======================================================== */}
                {/* SECTION 3: ARTISAN & CRAFT HERITAGE STORY */}
                {/* ======================================================== */}
                <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ backgroundColor: 'rgba(128, 0, 32, 0.1)', padding: '10px', borderRadius: '10px', color: 'var(--color-primary)' }}>
                        <Award size={22} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                          3. Artisan & Craft Heritage Story Section
                        </h3>
                        <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                          Showcase your Agra & Jaipur heritage handloom craft, master weavers, and brand promise
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '32px', alignItems: 'start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          Story Badge Tag
                        </label>
                        <input
                          type="text"
                          value={landingForm.craftStory?.tag || ''}
                          onChange={(e) =>
                            setLandingForm({
                              ...landingForm,
                              craftStory: { ...landingForm.craftStory, tag: e.target.value }
                            })
                          }
                          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          Heritage Heading
                        </label>
                        <input
                          type="text"
                          value={landingForm.craftStory?.title || ''}
                          onChange={(e) =>
                            setLandingForm({
                              ...landingForm,
                              craftStory: { ...landingForm.craftStory, title: e.target.value }
                            })
                          }
                          style={{ width: '100%', boxSizing: 'border-box', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.92rem', fontWeight: 700 }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                          Story Description Copy
                        </label>
                        <textarea
                          rows={4}
                          value={landingForm.craftStory?.description || ''}
                          onChange={(e) =>
                            setLandingForm({
                              ...landingForm,
                              craftStory: { ...landingForm.craftStory, description: e.target.value }
                            })
                          }
                          style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.88rem', lineHeight: 1.5, resize: 'vertical' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Heritage Experience
                          </label>
                          <input
                            type="text"
                            value={landingForm.craftStory?.badgeYears || ''}
                            onChange={(e) =>
                              setLandingForm({
                                ...landingForm,
                                craftStory: { ...landingForm.craftStory, badgeYears: e.target.value }
                              })
                            }
                            placeholder="30+"
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-primary)' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                            Badge Label
                          </label>
                          <input
                            type="text"
                            value={landingForm.craftStory?.badgeText || ''}
                            onChange={(e) =>
                              setLandingForm({
                                ...landingForm,
                                craftStory: { ...landingForm.craftStory, badgeText: e.target.value }
                              })
                            }
                            placeholder="Years of Heritage Artisan Weaving"
                            style={{ width: '100%', boxSizing: 'border-box', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '14px', padding: '20px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 12px', fontSize: '0.9rem', fontWeight: 800, color: '#1e293b' }}>
                        Artisan Workshop Photo
                      </h4>
                      <ImageUploadField
                        label="Upload Workshop Photo"
                        value={landingForm.craftStory?.image || ''}
                        onChange={(url) =>
                          setLandingForm({
                            ...landingForm,
                            craftStory: { ...landingForm.craftStory, image: url }
                          })
                        }
                        aspectRatio="portrait"
                        helperText="Upload photo of master weavers or handblock carving"
                      />

                      {/* Live Image Preview Card - Full Uncropped */}
                      {landingForm.craftStory?.image && (
                        <div style={{ marginTop: '16px', borderRadius: '12px', overflow: 'hidden', border: '2px solid #e2e8f0', position: 'relative', backgroundColor: '#faf7f2', minHeight: '280px', maxHeight: '340px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {/* Ambient soft blur */}
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              backgroundImage: `url(${landingForm.craftStory.image})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              filter: 'blur(20px) opacity(0.35)',
                              transform: 'scale(1.15)',
                              pointerEvents: 'none'
                            }}
                          />
                          <img
                            src={landingForm.craftStory.image}
                            alt="Artisan Story Preview"
                            style={{
                              position: 'relative',
                              zIndex: 2,
                              maxWidth: '100%',
                              maxHeight: '320px',
                              width: 'auto',
                              height: 'auto',
                              objectFit: 'contain',
                              display: 'block',
                              margin: '0 auto'
                            }}
                          />
                          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', padding: '8px 12px', color: '#ffffff', fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Preview: Artisan Heritage Story (Full View)</span>
                            <span style={{ color: '#fde68a', fontWeight: 700 }}>Live Asset</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ======================================================== */}
                {/* BOTTOM SAVE BUTTON BAR */}
                {/* ======================================================== */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    padding: '20px 28px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                  }}
                >
                  {landingSaved ? (
                    <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f0fdf4', padding: '8px 16px', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                      <CheckCircle2 size={18} /> All Landing Page sections updated & live!
                    </span>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                      Click below to publish all headline, image, and category changes to your store.
                    </span>
                  )}
                  <button
                    onClick={handleSaveLanding}
                    className="btn-primary"
                    style={{ padding: '14px 36px', fontSize: '0.95rem', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(128, 0, 32, 0.25)' }}
                  >
                    <CheckCircle2 size={18} /> Save & Publish to Live Store
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 7. STORE & CONTACT SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Store & Contact Settings
                </h2>
                <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#64748b' }}>
                  Update store brand name, WhatsApp ordering number, Agra address, and top promo announcement
                </p>
              </div>

              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', maxWidth: '720px' }}>
                <form onSubmit={handleSaveSettings}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Store Brand Name
                      </label>
                      <input
                        type="text"
                        value={settingsForm.storeName}
                        onChange={(e) => setSettingsForm({ ...settingsForm, storeName: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        WhatsApp Order Number (10 digits with 91)
                      </label>
                      <input
                        type="text"
                        value={settingsForm.whatsappNumber}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        placeholder="919758999617"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600 }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Store Physical Address
                    </label>
                    <input
                      type="text"
                      value={settingsForm.address}
                      onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Customer Helpline Phone
                      </label>
                      <input
                        type="text"
                        value={settingsForm.phone}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Customer Support Email
                      </label>
                      <input
                        type="email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Top Announcement Bar Message
                    </label>
                    <input
                      type="text"
                      value={settingsForm.announcementText}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcementText: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Free Shipping Min Order (₹)
                      </label>
                      <input
                        type="number"
                        value={settingsForm.freeShippingThreshold}
                        onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Instagram Official Handle
                      </label>
                      <input
                        type="text"
                        value={settingsForm.instagramHandle}
                        onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* RAZORPAY LIVE PAYMENT GATEWAY CONFIGURATION */}
                  {/* ======================================================== */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1.5px solid #e2e8f0',
                      marginBottom: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ backgroundColor: 'rgba(0, 82, 204, 0.1)', padding: '6px', borderRadius: '6px', color: '#0052cc' }}>
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                            Razorpay Live Payment Gateway Setup
                          </h4>
                          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                            Accept live online payments directly into your bank account via Cards, UPI Apps, & Netbanking
                          </p>
                        </div>
                      </div>

                      {/* Status indicator pill */}
                      {settingsForm.razorpayKeyId?.startsWith('rzp_live_') ? (
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', backgroundColor: '#ecfdf5', padding: '3px 9px', borderRadius: '6px', border: '1px solid #a7f3d0' }}>
                          ● Live Production Mode Active
                        </span>
                      ) : settingsForm.razorpayKeyId?.startsWith('rzp_test_') ? (
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#b45309', backgroundColor: '#fffbeb', padding: '3px 9px', borderRadius: '6px', border: '1px solid #fde68a' }}>
                          ⚠️ Test Key (Change to rzp_live_...)
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', backgroundColor: '#f1f5f9', padding: '3px 9px', borderRadius: '6px' }}>
                          Ready for Live Key
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '8px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Razorpay Live Key ID (rzp_live_...)
                        </label>
                        <input
                          type="text"
                          value={settingsForm.razorpayKeyId || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKeyId: e.target.value })}
                          placeholder="e.g. rzp_live_xxxxxxxxxxxxxx"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}
                        />
                        <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                          Found in Razorpay Dashboard → Settings → API Keys
                        </span>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Razorpay Live Key Secret
                        </label>
                        <input
                          type="password"
                          value={settingsForm.razorpayKeySecret || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, razorpayKeySecret: e.target.value })}
                          placeholder="••••••••••••••••"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        />
                        <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '3px', display: 'block' }}>
                          Kept secure & encrypted for order verification
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* LIVE UPI & CUSTOM SHOP QR CODE CONFIGURATION */}
                  {/* ======================================================== */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '20px',
                      border: '1.5px solid #e2e8f0',
                      marginBottom: '24px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ backgroundColor: 'rgba(0, 82, 204, 0.1)', padding: '6px', borderRadius: '6px', color: '#0052cc' }}>
                        <CreditCard size={18} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                          Live UPI Payments & Custom QR Code Setup
                        </h4>
                        <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#64748b' }}>
                          Upload your shop's official GPay / PhonePe / Paytm UPI QR code or enter your UPI ID for direct scan payments
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Store UPI ID (VPA) *
                        </label>
                        <input
                          type="text"
                          value={settingsForm.upiId || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, upiId: e.target.value })}
                          placeholder="e.g. 9758999617@upi or durgesh@okaxis"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem', fontWeight: 600, color: '#0052cc' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                          Merchant / Account Name
                        </label>
                        <input
                          type="text"
                          value={settingsForm.upiAccountName || ''}
                          onChange={(e) => setSettingsForm({ ...settingsForm, upiAccountName: e.target.value })}
                          placeholder="Durgesh Collection"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>

                    {/* Custom Store QR Code Photo Upload */}
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        Upload Custom Merchant QR Code Image (GPay / PhonePe / Paytm / Shop Scanner)
                      </label>
                      <ImageUploadField
                        label="Upload UPI QR Code Image"
                        value={settingsForm.customQrImage || ''}
                        onChange={(url) => setSettingsForm({ ...settingsForm, customQrImage: url })}
                        aspectRatio="square"
                        helperText="Upload your real store UPI QR code scanner image"
                      />
                    </div>

                    {/* Enable COD Option */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                      <div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                          Accept Cash on Delivery (COD)
                        </span>
                        <span style={{ fontSize: '0.74rem', color: '#64748b' }}>
                          Allow customers across India to pay in cash or QR scan at the time of doorstep delivery
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settingsForm.enableCod !== false}
                        onChange={(e) => setSettingsForm({ ...settingsForm, enableCod: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#059669' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {settingsSaved && (
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={16} /> Settings saved & updated on live store!
                      </span>
                    )}
                    <button type="submit" className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem', marginLeft: 'auto' }}>
                      Save All Settings
                    </button>
                  </div>
                </form>
              </div>

              {/* Admin Portal Credentials Manager */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', maxWidth: '720px', marginTop: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ backgroundColor: 'rgba(128, 0, 32, 0.1)', padding: '8px', borderRadius: '8px', color: 'var(--color-primary)' }}>
                    <KeyRound size={20} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                      Admin Security & Password
                    </h3>
                    <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                      Change your admin login ID / email and login password
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveAuth}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Admin Login ID / Email
                      </label>
                      <input
                        type="text"
                        required
                        value={authForm.username}
                        onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                        Admin Password
                      </label>
                      <input
                        type="text"
                        required
                        value={authForm.password}
                        onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {authSaved && (
                      <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={16} /> Admin credentials updated successfully!
                      </span>
                    )}
                    <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem', marginLeft: 'auto' }}>
                      Update Admin Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CRUD Modals */}
      {productModalOpen && (
        <ProductModal
          isOpen={productModalOpen}
          onClose={() => setProductModalOpen(false)}
          onSave={handleSaveProduct}
          productToEdit={editingProduct}
        />
      )}

      {reviewModalOpen && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          onSave={handleSaveReview}
          reviewToEdit={editingReview}
        />
      )}

      {instaModalOpen && (
        <InstaPostModal
          isOpen={instaModalOpen}
          onClose={() => setInstaModalOpen(false)}
          onSave={handleSaveInstaPost}
          postToEdit={editingInstaPost}
        />
      )}

      {couponModalOpen && (
        <CouponModal
          isOpen={couponModalOpen}
          onClose={() => setCouponModalOpen(false)}
          onSave={handleSaveCoupon}
          couponToEdit={editingCoupon}
        />
      )}
    </div>
  );
}
