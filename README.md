# 🌸 Durgesh Collection — Luxury Handcrafted Ethnic E-Commerce & CMS

A full-stack, luxury Indian ethnic wear e-commerce web application and Admin CMS for **Durgesh Collection**, Agra.

---

## 🌟 Key Features
- **👗 Luxury E-Commerce Storefront**: Handcrafted Jaipuri Mulmul, Chanderi Silk, and Chikankari catalog with rich filtering, quick view, size selectors, cart drawer, and wishlist.
- **⚡ Live Search & Autocomplete**: Real-time autocomplete dropdown with direct product preview and category jump.
- **🗄️ Full-Stack MongoDB Atlas Cloud DB**: Persistent storage for products, orders, coupons, reviews, lookbook, and landing page content with Mongoose.
- **🖼️ Zero-Cropping Adaptive Image Engine**: Head-to-toe full image display with ambient blurred mirror framing.
- **🛠️ Admin CMS Dashboard (`/admin`)**:
  - Live Product Creator & Editor with local device photo uploader
  - Orders & Payment Tracking (COD + Razorpay)
  - Customer Reviews Management
  - Promo Coupons Engine (`FESTIVE25`, `KURTI10`)
  - Dynamic Landing Page & Hero Banner Editor
  - Store & WhatsApp Contact Settings

---

## 🚀 Quick Start

### 1. Install & Run Backend Server
```bash
cd server
npm install
npm start
```
*Runs on `http://localhost:5000`*

### 2. Install & Run Frontend UI
```bash
cd kurti-ui
npm install
npm run dev
```
*Runs on `http://localhost:5174`*

---

## 🔑 Environment Setup (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-address>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

---

## 👑 Brand Identity
- **Brand**: Durgesh Collection
- **Tagline**: Ethnic Elegance
- **Origin**: Sanjay Place, Agra, Uttar Pradesh, India
- **Admin CMS URL**: `http://localhost:5174/admin`
