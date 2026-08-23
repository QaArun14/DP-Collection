import { PRODUCTS, TESTIMONIALS, PROMO_CODES } from '../data/products';

// Dynamic Backend URL: auto-detects host IP for mobile devices on local WiFi, or uses VITE_API_URL for production
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host && host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:5000/api`;
    }
  }
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Upload an image file to the Backend Multer Upload endpoint
 */
export async function uploadImageToBackend(file) {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      return data.url;
    }
  } catch (err) {
    console.warn('Backend upload server not reachable', err);
  }
  return null;
}

// ==========================================
// 1. PRODUCTS REST API
// ==========================================
export async function apiFetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {
    console.warn('Could not fetch products from backend, using local catalog fallback.', e);
  }
  return PRODUCTS;
}

export async function apiCreateProduct(product) {
  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Error creating product on backend', e);
  }
  return product;
}

export async function apiUpdateProduct(id, product) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Error updating product on backend', e);
  }
  return product;
}

export async function apiDeleteProduct(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch (e) {
    console.error('Error deleting product on backend', e);
    return false;
  }
}

// ==========================================
// 2. ORDERS REST API
// ==========================================
export async function apiFetchOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch orders from backend', e);
  }
  return [];
}

export async function apiCreateOrder(order) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Error saving order on backend', e);
  }
  return order;
}

export async function apiUpdateOrderStatus(orderId, status) {
  try {
    await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  } catch (e) {
    console.error('Error updating order status on backend', e);
  }
}

// ==========================================
// 3. REVIEWS REST API
// ==========================================
export async function apiFetchReviews() {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('Could not fetch reviews from backend, using fallback', e);
  }
  return TESTIMONIALS;
}

export async function apiCreateReview(review) {
  try {
    const res = await fetch(`${API_BASE_URL}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(review)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return review;
}

export async function apiDeleteReview(id) {
  try {
    await fetch(`${API_BASE_URL}/reviews/${id}`, { method: 'DELETE' });
  } catch (e) {}
}

// ==========================================
// 4. INSTAGRAM LOOKBOOK REST API
// ==========================================
export async function apiFetchInsta() {
  try {
    const res = await fetch(`${API_BASE_URL}/insta`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('Could not fetch insta posts from backend', e);
  }
  return [];
}

export async function apiCreateInsta(post) {
  try {
    const res = await fetch(`${API_BASE_URL}/insta`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return post;
}

export async function apiDeleteInsta(id) {
  try {
    await fetch(`${API_BASE_URL}/insta/${id}`, { method: 'DELETE' });
  } catch (e) {}
}

// ==========================================
// 5. PROMO COUPONS REST API
// ==========================================
export async function apiFetchCoupons() {
  try {
    const res = await fetch(`${API_BASE_URL}/coupons`);
    if (res.ok) {
      const data = await res.json();
      if (data && Object.keys(data).length > 0) return data;
    }
  } catch (e) {
    console.warn('Could not fetch coupons from backend', e);
  }
  return PROMO_CODES;
}

export async function apiCreateCoupon(coupon) {
  try {
    const res = await fetch(`${API_BASE_URL}/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(coupon)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return coupon;
}

export async function apiDeleteCoupon(code) {
  try {
    await fetch(`${API_BASE_URL}/coupons/${code}`, { method: 'DELETE' });
  } catch (e) {}
}

// ==========================================
// 6. STORE SETTINGS REST API
// ==========================================
export async function apiFetchSettings() {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch settings from backend', e);
  }
  return {
    storeName: 'Durgesh Collection',
    tagline: 'Ethnic Elegance',
    whatsappNumber: '919758999617',
    phone: '+91 97589 99617',
    email: 'care@durgeshcollection.in',
    address: 'Sanjay Place, Agra, Uttar Pradesh, India',
    announcementText: '🌸 FESTIVE UTSAV SALE: Get Flat 25% OFF with code FESTIVE25 | Free Delivery above ₹999 🚚',
    freeShippingThreshold: 999,
    instagramHandle: '@durgesh_collection'
  };
}

export async function apiUpdateSettings(settings) {
  try {
    const res = await fetch(`${API_BASE_URL}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return settings;
}

// ==========================================
// 7. ADMIN AUTH REST API
// ==========================================
export async function apiAdminLogin(username, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) return { success: true };
  } catch (e) {
    console.warn('Auth server not reachable', e);
  }

  // Local fallback
  const inputUser = (username || '').trim().toLowerCase();
  if ((inputUser === 'admin@durgeshcollection.in' || inputUser === 'admin') && password === 'admin@123') {
    return { success: true };
  }
  return { success: false, error: 'Invalid login credentials' };
}

export async function apiChangeAdminPassword(username, password) {
  try {
    await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  } catch (e) {}
}

// ==========================================
// 8. LANDING PAGE CONTENT REST API
// ==========================================
export async function apiFetchLanding() {
  try {
    const res = await fetch(`${API_BASE_URL}/landing`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Could not fetch landing content from backend', e);
  }
  return null;
}

export async function apiUpdateLanding(landingContent) {
  try {
    const res = await fetch(`${API_BASE_URL}/landing`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(landingContent)
    });
    if (res.ok) return await res.json();
  } catch (e) {
    console.error('Error saving landing content', e);
  }
  return landingContent;
}

