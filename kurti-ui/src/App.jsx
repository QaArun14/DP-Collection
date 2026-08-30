import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import CategoryShowcase from './components/CategoryShowcase';
import ProductGrid from './components/ProductGrid';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CraftStory from './components/CraftStory';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import Toast from './components/Toast';
import OrderSuccessModal from './components/OrderSuccessModal';
import RazorpayModal from './components/RazorpayModal';
import WhatsAppWidget from './components/WhatsAppWidget';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLogin from './components/admin/AdminLogin';
import { isAdminLoggedIn, setAdminLoggedIn } from './utils/storage';

import {
  apiFetchProducts,
  apiFetchOrders,
  apiFetchReviews,
  apiFetchInsta,
  apiFetchCoupons,
  apiFetchSettings,
  apiFetchLanding,
  apiCreateOrder
} from './utils/api';

function App() {
  // Determine initial route based on URL path or hash
  const isInitialAdminPath =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/admin') ||
      window.location.hash.startsWith('#admin') ||
      window.location.search.includes('view=admin'));

  // Navigation View: 'store' or 'admin'
  const [currentView, setCurrentView] = useState(isInitialAdminPath ? 'admin' : 'store');
  const [isAdminAuth, setIsAdminAuth] = useState(isAdminLoggedIn());

  // Listen to browser Back/Forward & hash changes for clean navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const isAdminRoute =
        window.location.pathname.startsWith('/admin') ||
        window.location.hash.startsWith('#admin') ||
        window.location.search.includes('view=admin');
      setCurrentView(isAdminRoute ? 'admin' : 'store');
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToAdmin = () => {
    setCurrentView('admin');
    window.history.pushState(null, '', '/#admin');
  };

  const navigateToStore = () => {
    setCurrentView('store');
    window.history.pushState(null, '', '/');
  };

  const handleAdminLogout = () => {
    setAdminLoggedIn(false);
    setIsAdminAuth(false);
    showToast('info', 'Logged Out', 'Successfully logged out of Admin CMS.');
    navigateToStore();
  };

  // Dynamic CMS State (100% Real Database, No Dummy Fallbacks)
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [instaPosts, setInstaPosts] = useState([]);
  const [coupons, setCoupons] = useState({});
  const [landingContent, setLandingContent] = useState(null);
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Durgesh Collection',
    tagline: 'Ethnic Elegance',
    whatsappNumber: '919758999617',
    phone: '+91 97589 99617',
    email: 'care@durgeshcollection.in',
    address: 'Sanjay Place, Agra, Uttar Pradesh, India',
    announcementText: '🌸 FESTIVE UTSAV SALE: Get Flat 25% OFF with code FESTIVE25 | Free Delivery above ₹999 🚚',
    freeShippingThreshold: 999,
    instagramHandle: '@durgesh_collection'
  });

  // Load 100% from Backend REST API / MongoDB on Mount
  useEffect(() => {
    async function loadBackendData() {
      const [prods, ords, revs, insta, coup, sett, land] = await Promise.allSettled([
        apiFetchProducts(),
        apiFetchOrders(),
        apiFetchReviews(),
        apiFetchInsta(),
        apiFetchCoupons(),
        apiFetchSettings(),
        apiFetchLanding()
      ]);

      if (prods.status === 'fulfilled' && Array.isArray(prods.value)) {
        setProducts(prods.value);
      }
      if (ords.status === 'fulfilled' && Array.isArray(ords.value)) {
        setOrders(ords.value);
      }
      if (revs.status === 'fulfilled' && Array.isArray(revs.value)) {
        setReviews(revs.value);
      }
      if (insta.status === 'fulfilled' && Array.isArray(insta.value)) {
        setInstaPosts(insta.value);
      }
      if (coup.status === 'fulfilled' && coup.value && typeof coup.value === 'object') {
        setCoupons(coup.value);
      }
      if (sett.status === 'fulfilled' && sett.value?.storeName) {
        setStoreSettings(sett.value);
      }
      if (land.status === 'fulfilled' && land.value) {
        setLandingContent(land.value);
      }
    }
    loadBackendData();
  }, []);

  // Storefront Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Cart state (starts empty)
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState('KURTI10');

  // Wishlist state (starts empty)
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Razorpay Checkout Modal state
  const [razorpayModalData, setRazorpayModalData] = useState(null);

  // Order Confirmation State
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => {
      setToast((current) => (current?.title === title ? null : current));
    }, 3500);
  };

  // Sync database handler
  const handleResetData = async () => {
    const [prods, ords, revs, insta, coup, sett] = await Promise.allSettled([
      apiFetchProducts(),
      apiFetchOrders(),
      apiFetchReviews(),
      apiFetchInsta(),
      apiFetchCoupons(),
      apiFetchSettings()
    ]);
    if (prods.status === 'fulfilled' && prods.value) setProducts(prods.value);
    if (ords.status === 'fulfilled' && ords.value) setOrders(ords.value);
    if (revs.status === 'fulfilled' && revs.value) setReviews(revs.value);
    if (insta.status === 'fulfilled' && insta.value) setInstaPosts(insta.value);
    if (coup.status === 'fulfilled' && coup.value) setCoupons(coup.value);
    if (sett.status === 'fulfilled' && sett.value?.storeName) setStoreSettings(sett.value);
    showToast('info', 'Data Synced', 'All items synced from backend database.');
  };

  // Cart operations
  const handleAddToCart = (itemToAdd) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (item) =>
          item.id === itemToAdd.id &&
          item.selectedSize === itemToAdd.selectedSize &&
          item.selectedColor === itemToAdd.selectedColor
      );

      const qty = itemToAdd.quantity || 1;

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [...prev, { ...itemToAdd, quantity: qty }];
      }
    });

    showToast(
      'cart',
      'Added to Shopping Bag',
      `${itemToAdd.name} (Size: ${itemToAdd.selectedSize}) was added.`
    );
  };

  const handleUpdateCartQuantity = (id, size, color, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(id, size, color);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity: newQty }
          : item
      )
    );
  };

  const handleRemoveCartItem = (id, size, color) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.selectedSize === size && item.selectedColor === color)
      )
    );
    showToast('info', 'Item Removed', 'Product removed from your shopping bag.');
  };

  // Wishlist operations
  const handleToggleWishlist = (product) => {
    if (wishlistIds.includes(product.id)) {
      setWishlistIds((prev) => prev.filter((id) => id !== product.id));
      showToast('info', 'Removed from Wishlist', `${product.name} removed from your saved items.`);
    } else {
      setWishlistIds((prev) => [...prev, product.id]);
      showToast('wishlist', 'Saved to Wishlist', `${product.name} saved to your favorites!`);
    }
  };

  const handleRemoveFromWishlist = (productId) => {
    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const handleMoveToCart = (product) => {
    handleAddToCart({
      ...product,
      selectedSize: product.sizes[0] || 'M',
      selectedColor: product.colors[0]?.name || 'Standard',
      quantity: 1
    });
    handleRemoveFromWishlist(product.id);
  };

  const handleAddAllWishlistToCart = () => {
    const wishlistedProducts = products.filter((p) => wishlistIds.includes(p.id));
    wishlistedProducts.forEach((p) => {
      handleAddToCart({
        ...p,
        selectedSize: p.sizes[0] || 'M',
        selectedColor: p.colors[0]?.name || 'Standard',
        quantity: 1
      });
    });
    setWishlistIds([]);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    showToast('cart', 'All Items Moved', 'All wishlist items were transferred to your bag.');
  };

  // Open Razorpay Checkout Modal
  const handleOpenRazorpay = ({ amount, items }) => {
    const orderId = `DC-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setRazorpayModalData({
      amount,
      items: items || cartItems,
      orderId
    });
  };

  // Handle successful Razorpay test payment with real customer details
  const handleRazorpaySuccess = (paymentId, customerDetails = {}) => {
    if (!razorpayModalData) return;

    const newOrder = {
      orderId: razorpayModalData.orderId,
      paymentId,
      customerName: customerDetails.customerName || 'Online Customer',
      customerPhone: customerDetails.customerPhone || storeSettings.whatsappNumber,
      customerAddress: customerDetails.customerAddress || '',
      customerCity: customerDetails.customerCity || 'India',
      customerPin: customerDetails.customerPin || '',
      total: razorpayModalData.amount,
      items: razorpayModalData.items,
      status: 'New',
      date: new Date().toLocaleString(),
      paymentMethod: customerDetails.paymentMethod || 'Razorpay Verified'
    };

    // Save order in live database & backend
    setOrders((prev) => [newOrder, ...prev]);
    apiCreateOrder(newOrder);

    setConfirmedOrder(newOrder);
    setRazorpayModalData(null);
    setIsCartOpen(false);
    setQuickViewProduct(null);
    setCartItems([]);
    showToast('cart', 'Payment Received!', `Order ${newOrder.orderId} confirmed for ${newOrder.customerName}.`);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistedProductList = products.filter((p) => wishlistIds.includes(p.id));

  // --- 1. IF ADMIN VIEW: RENDER LOGIN OR DASHBOARD ---
  if (currentView === 'admin') {
    if (!isAdminAuth) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setIsAdminAuth(true);
            showToast('info', 'Welcome Admin', 'Signed in to Durgesh Collection CMS.');
          }}
          onBackToStore={navigateToStore}
        />
      );
    }

    return (
      <AdminDashboard
        products={products}
        setProducts={setProducts}
        orders={orders}
        setOrders={setOrders}
        reviews={reviews}
        setReviews={setReviews}
        instaPosts={instaPosts}
        setInstaPosts={setInstaPosts}
        coupons={coupons}
        setCoupons={setCoupons}
        storeSettings={storeSettings}
        setStoreSettings={setStoreSettings}
        landingContent={landingContent}
        setLandingContent={setLandingContent}
        onResetDefaults={handleResetData}
        onViewStore={navigateToStore}
        onLogout={handleAdminLogout}
      />
    );
  }

  // --- 2. STOREFRONT LIVE VIEW ---
  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast Notification Alert */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Floating WhatsApp Quick Order Widget */}
      <WhatsAppWidget />

      {/* Navigation Header */}
      <Navbar
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        storeSettings={storeSettings}
        onOpenAdmin={navigateToAdmin}
        products={products}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {/* Hero Section */}
      <Hero
        heroContent={landingContent?.hero}
        onExploreClick={() => {
          setSelectedCategory('all');
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onFestiveClick={() => {
          setSelectedCategory('festive');
          document.getElementById('catalog-section')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Categories Showcase Grid */}
      <CategoryShowcase
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        products={products}
        categoryCards={landingContent?.categories}
      />

      {/* Filterable Products Grid */}
      <ProductGrid
        products={products}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        wishlistIds={wishlistIds}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onQuickView={(prod) => setQuickViewProduct(prod)}
      />

      {/* Artisan & Fabric Heritage Story */}
      <CraftStory craftContent={landingContent?.craftStory} />

      {/* Customer Reviews & Instagram Lookbook (Dynamic from CMS) */}
      <Testimonials
        reviews={reviews}
        instaPosts={instaPosts}
        instagramHandle={storeSettings.instagramHandle}
      />

      {/* Footer with dynamic store settings */}
      <Footer
        onCategoryClick={setSelectedCategory}
        storeSettings={storeSettings}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          isWishlisted={wishlistIds.includes(quickViewProduct.id)}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          onRazorpayDirectPay={(items) => {
            handleOpenRazorpay({
              amount: quickViewProduct.price * (items[0]?.quantity || 1),
              items
            });
          }}
          onDirectCheckout={() => {
            setQuickViewProduct(null);
            setIsCartOpen(true);
          }}
        />
      )}

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        appliedPromo={appliedPromo}
        setAppliedPromo={setAppliedPromo}
        onRazorpayPay={handleOpenRazorpay}
        onCheckoutSuccess={() => {
          handleOpenRazorpay({
            amount: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
            items: cartItems
          });
        }}
      />

      {/* Slide-over Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistedProductList}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
        onAddAllToCart={handleAddAllWishlistToCart}
      />

      {/* Razorpay Interactive Test Mode Payment Gateway Modal */}
      {razorpayModalData && (
        <RazorpayModal
          isOpen={!!razorpayModalData}
          onClose={() => setRazorpayModalData(null)}
          amount={razorpayModalData.amount}
          orderDetails={razorpayModalData}
          onSuccess={handleRazorpaySuccess}
        />
      )}

      {/* Order Confirmation Receipt Modal */}
      {confirmedOrder && (
        <OrderSuccessModal
          orderDetails={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
        />
      )}
    </div>
  );
}

export default App;
