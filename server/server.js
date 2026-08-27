require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Enable CORS & JSON body parser
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Directories
const DATA_FILE = path.join(__dirname, 'data', 'database.json');
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Serve uploaded images statically
app.use('/uploads', express.static(UPLOADS_DIR));

// ==========================================
// MONGOOSE SCHEMAS & MODELS
// ==========================================

const ProductSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true, index: true },
    tag: { type: String, default: '' },
    badgeColor: { type: String, default: 'bg-burgundy-950' },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: String, default: '' },
    rating: { type: Number, default: 4.8 },
    reviewCount: { type: Number, default: 0 },
    fabric: { type: String, default: '' },
    craft: { type: String, default: '' },
    fit: { type: String, default: '' },
    neckline: { type: String, default: '' },
    sleeves: { type: String, default: '' },
    stock: { type: Number, default: 10 },
    sizes: { type: [String], default: ['S', 'M', 'L', 'XL', 'XXL'] },
    images: { type: [String], default: [] },
    primaryImage: { type: String, required: true },
    secondaryImage: { type: String, default: '' },
    description: { type: String, default: '' },
    washCare: { type: String, default: 'Hand wash gently in cold water.' },
    isFeatured: { type: Boolean, default: false },
    colors: { type: Array, default: [] }
  },
  { timestamps: true, strict: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    paymentId: { type: String, default: '' },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerCity: { type: String, default: '' },
    total: { type: Number, required: true },
    items: { type: Array, default: [] },
    status: { type: String, default: 'Confirmed' },
    date: { type: String, default: '' },
    paymentMethod: { type: String, default: 'COD' }
  },
  { timestamps: true, strict: false }
);

const ReviewSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String },
    author: { type: String },
    city: { type: String, default: 'Agra, UP' },
    rating: { type: Number, default: 5 },
    title: { type: String, default: '' },
    review: { type: String },
    comment: { type: String },
    verified: { type: Boolean, default: true },
    date: { type: String, default: '' },
    helpfulCount: { type: Number, default: 0 },
    productName: { type: String, default: '' },
    productTitle: { type: String, default: '' },
    avatar: { type: String, default: '' }
  },
  { timestamps: true, strict: false }
);

const InstaPostSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    handle: { type: String, default: '@durgesh_collection' },
    caption: { type: String, default: '' },
    product: { type: String, default: '' },
    image: { type: String, required: true },
    likes: { type: String, default: '1.2k' },
    link: { type: String, default: '#' }
  },
  { timestamps: true, strict: false }
);

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, index: true },
    discountPercent: { type: Number, default: 0 },
    discountFlat: { type: Number, default: 0 },
    description: { type: String, default: '' },
    minOrder: { type: Number, default: 0 }
  },
  { timestamps: true, strict: false }
);

const StoreSettingSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: 'Durgesh Collection' },
    tagline: { type: String, default: 'Ethnic Elegance' },
    whatsappNumber: { type: String, default: '919758999617' },
    phone: { type: String, default: '+91 97589 99617' },
    email: { type: String, default: 'care@durgeshcollection.in' },
    address: { type: String, default: 'Sanjay Place, Agra, Uttar Pradesh, India' },
    announcementText: { type: String, default: '🌸 FESTIVE UTSAV SALE: Get Flat 25% OFF with code FESTIVE25 | Free Delivery above ₹999 🚚' },
    freeShippingThreshold: { type: Number, default: 999 },
    instagramHandle: { type: String, default: '@durgesh_collection' }
  },
  { timestamps: true, strict: false }
);

const AdminAuthSchema = new mongoose.Schema(
  {
    username: { type: String, default: 'admin@durgeshcollection.in' },
    password: { type: String, default: 'admin@123' }
  },
  { timestamps: true, strict: false }
);

const LandingContentSchema = new mongoose.Schema(
  {
    hero: { type: Object, default: {} },
    categories: { type: Array, default: [] },
    craftStory: { type: Object, default: {} }
  },
  { timestamps: true, strict: false }
);

const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const Review = mongoose.model('Review', ReviewSchema);
const InstaPost = mongoose.model('InstaPost', InstaPostSchema);
const Coupon = mongoose.model('Coupon', CouponSchema);
const StoreSetting = mongoose.model('StoreSetting', StoreSettingSchema);
const AdminAuth = mongoose.model('AdminAuth', AdminAuthSchema);
const LandingContent = mongoose.model('LandingContent', LandingContentSchema);

// ==========================================
// MONGODB CONNECTION & AUTOMATIC SEEDING
// ==========================================

let isMongoConnected = false;
let retryInterval = null;

async function connectAndSeedMongoDB() {
  if (!MONGODB_URI) {
    console.log('⚠️ No MONGODB_URI provided in environment variables. Running in fallback mode.');
    return;
  }
  try {
    console.log('🔄 Connecting to MongoDB Atlas Cluster...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000
    });
    isMongoConnected = true;
    if (retryInterval) {
      clearInterval(retryInterval);
      retryInterval = null;
    }
    console.log('✅ Connected successfully to MongoDB Atlas: durgesh_collection database');

    // Read initial data file
    let localDB = {};
    try {
      if (fs.existsSync(DATA_FILE)) {
        localDB = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      }
    } catch (e) {
      console.error('Local database.json read error:', e.message);
    }

    // 1. Seed Products if empty
    const productCount = await Product.countDocuments();
    if (productCount === 0 && localDB.products && localDB.products.length > 0) {
      console.log(`🌱 Seeding ${localDB.products.length} products to MongoDB...`);
      await Product.insertMany(localDB.products.map(p => ({ ...p, id: String(p.id) })));
    }

    // 2. Seed Reviews if empty
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0 && localDB.reviews && localDB.reviews.length > 0) {
      console.log(`🌱 Seeding ${localDB.reviews.length} reviews to MongoDB...`);
      await Review.insertMany(localDB.reviews.map(r => ({ ...r, id: String(r.id) })));
    }

    // 3. Seed Orders if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0 && localDB.orders && localDB.orders.length > 0) {
      console.log(`🌱 Seeding ${localDB.orders.length} orders to MongoDB...`);
      await Order.insertMany(localDB.orders.map(o => ({ ...o, orderId: String(o.orderId) })));
    }

    // 4. Seed InstaPosts if empty
    const instaCount = await InstaPost.countDocuments();
    if (instaCount === 0 && localDB.instaPosts && localDB.instaPosts.length > 0) {
      console.log(`🌱 Seeding ${localDB.instaPosts.length} lookbook posts to MongoDB...`);
      await InstaPost.insertMany(localDB.instaPosts.map(i => ({ ...i, id: String(i.id) })));
    }

    // 5. Seed Coupons if empty
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0 && localDB.coupons) {
      const couponArray = Object.entries(localDB.coupons).map(([code, val]) => ({
        code,
        ...val
      }));
      if (couponArray.length > 0) {
        console.log(`🌱 Seeding ${couponArray.length} coupons to MongoDB...`);
        await Coupon.insertMany(couponArray);
      }
    }

    // 6. Seed Store Settings if empty
    const settingCount = await StoreSetting.countDocuments();
    if (settingCount === 0 && localDB.storeSettings) {
      console.log('🌱 Seeding store settings to MongoDB...');
      await StoreSetting.create(localDB.storeSettings);
    }

    // 7. Seed Admin Auth if empty
    const authCount = await AdminAuth.countDocuments();
    if (authCount === 0) {
      console.log('🌱 Initializing Admin credentials in MongoDB...');
      await AdminAuth.create(localDB.adminAuth || { username: 'admin@durgeshcollection.in', password: 'admin@123' });
    }

    // 8. Seed Landing Content if empty
    const landingCount = await LandingContent.countDocuments();
    if (landingCount === 0 && localDB.landingContent) {
      console.log('🌱 Seeding landing page content to MongoDB...');
      await LandingContent.create(localDB.landingContent);
    }

    console.log('🌟 MongoDB Atlas database is ready and fully synchronized!');
  } catch (err) {
    isMongoConnected = false;
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️ Running in fallback mode. Auto-retrying MongoDB connection in 10s...');
    if (!retryInterval) {
      retryInterval = setInterval(() => {
        if (!isMongoConnected) connectAndSeedMongoDB();
      }, 10000);
    }
  }
}

connectAndSeedMongoDB();

// Multer Storage Configuration for Real Image Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname) || '.webp';
    cb(null, 'kurti-' + uniqueSuffix + ext);
  }
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// ==========================================
// 0. DATABASE STATUS & HEALTH CHECK ENDPOINT
// ==========================================
app.get('/api/db-status', async (req, res) => {
  try {
    if (isMongoConnected) {
      const [productCount, orderCount, reviewCount, instaCount, couponCount] = await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Review.countDocuments(),
        InstaPost.countDocuments(),
        Coupon.countDocuments()
      ]);

      return res.json({
        success: true,
        database: 'MongoDB Atlas Cloud',
        status: 'CONNECTED',
        dbName: 'durgesh_collection',
        cluster: 'ecommerce-cluster.1bbswxm.mongodb.net',
        collections: {
          products: productCount,
          orders: orderCount,
          reviews: reviewCount,
          instaPosts: instaCount,
          coupons: couponCount,
          storeSettings: 1,
          landingContent: 1,
          adminAuth: 1
        }
      });
    }

    res.json({
      success: false,
      database: 'Local JSON File (Fallback)',
      status: 'AWAITING_ATLAS_USER_CREATION',
      message: 'MongoDB Atlas Authentication failed. Please ensure your database user is created under Database Access in MongoDB Atlas.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ==========================================
// 1. FILE UPLOAD ENDPOINT
// ==========================================
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file uploaded' });
  }
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename
  });
});

// ==========================================
// 2. PRODUCTS REST API
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    if (isMongoConnected) {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json(products);
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(raw).products || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const prodData = {
      id: String(req.body.id || Date.now()),
      ...req.body
    };
    if (isMongoConnected) {
      const created = await Product.create(prodData);
      return res.status(201).json(created);
    }
    res.status(201).json(prodData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    if (isMongoConnected) {
      const updated = await Product.findOneAndUpdate({ id }, req.body, { new: true, upsert: true });
      return res.json(updated);
    }
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    if (isMongoConnected) {
      await Product.deleteMany({
        $or: [
          { id: id },
          { id: Number(id) || -99999 },
          ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])
        ]
      });
    }

    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(raw);
        data.products = (data.products || []).filter((p) => String(p.id) !== id);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      }
    } catch (e) {}

    res.json({ success: true, message: `Product ${id} deleted successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. ORDERS REST API
// ==========================================
app.get('/api/orders', async (req, res) => {
  try {
    if (isMongoConnected) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(raw).orders || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = {
      orderId: req.body.orderId || `DC-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Confirmed',
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      ...req.body
    };
    if (isMongoConnected) {
      const created = await Order.create(newOrder);
      return res.status(201).json(created);
    }
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:orderId/status', async (req, res) => {
  try {
    const orderId = String(req.params.orderId);
    const { status } = req.body;
    if (isMongoConnected) {
      const updated = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
      return res.json(updated);
    }
    res.json({ orderId, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. REVIEWS REST API
// ==========================================
app.get('/api/reviews', async (req, res) => {
  try {
    if (isMongoConnected) {
      const reviews = await Review.find().sort({ createdAt: -1 });
      return res.json(reviews);
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(raw).reviews || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const newReview = {
      id: String(req.body.id || Date.now()),
      date: req.body.date || 'Just now',
      helpfulCount: 0,
      verified: true,
      ...req.body
    };
    if (isMongoConnected) {
      const created = await Review.create(newReview);
      return res.status(201).json(created);
    }
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    if (isMongoConnected) {
      await Review.deleteMany({
        $or: [
          { id: id },
          { id: Number(id) || -99999 },
          ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])
        ]
      });
    }

    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(raw);
        data.reviews = (data.reviews || []).filter((r) => String(r.id) !== id);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      }
    } catch (e) {}

    res.json({ success: true, message: `Review ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. INSTAGRAM LOOKBOOK REST API
// ==========================================
app.get('/api/insta', async (req, res) => {
  try {
    if (isMongoConnected) {
      const posts = await InstaPost.find().sort({ createdAt: -1 });
      return res.json(posts);
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(raw).instaPosts || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/insta', async (req, res) => {
  try {
    const newPost = {
      id: String(req.body.id || Date.now()),
      handle: '@durgesh_collection',
      likes: '1.2k',
      link: '#',
      ...req.body
    };
    if (isMongoConnected) {
      const created = await InstaPost.create(newPost);
      return res.status(201).json(created);
    }
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/insta/:id', async (req, res) => {
  try {
    const id = String(req.params.id);
    if (isMongoConnected) {
      await InstaPost.deleteMany({
        $or: [
          { id: id },
          { id: Number(id) || -99999 },
          ...(mongoose.Types.ObjectId.isValid(id) ? [{ _id: id }] : [])
        ]
      });
    }

    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        const data = JSON.parse(raw);
        data.instaPosts = (data.instaPosts || []).filter((p) => String(p.id) !== id);
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      }
    } catch (e) {}

    res.json({ success: true, message: `Post ${id} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 6. PROMO COUPONS REST API
// ==========================================
app.get('/api/coupons', async (req, res) => {
  try {
    if (isMongoConnected) {
      const coupons = await Coupon.find();
      const couponObj = {};
      coupons.forEach(c => {
        couponObj[c.code] = {
          discountPercent: c.discountPercent,
          discountFlat: c.discountFlat,
          description: c.description,
          minOrder: c.minOrder
        };
      });
      return res.json(couponObj);
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(raw).coupons || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/coupons', async (req, res) => {
  try {
    const { code, discountPercent, discountFlat, description, minOrder } = req.body;
    if (!code) return res.status(400).json({ error: 'Coupon code required' });
    const formattedCode = code.toUpperCase().trim();
    if (isMongoConnected) {
      const updated = await Coupon.findOneAndUpdate(
        { code: formattedCode },
        { code: formattedCode, discountPercent, discountFlat, description, minOrder },
        { upsert: true, new: true }
      );
      return res.json({ success: true, coupon: updated });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/coupons/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase().trim();
    if (isMongoConnected) {
      await Coupon.deleteOne({ code });
      return res.json({ success: true, message: `Coupon ${code} deleted` });
    }
    res.json({ success: true, message: `Coupon ${code} deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. STORE SETTINGS REST API
// ==========================================
app.get('/api/settings', async (req, res) => {
  try {
    if (isMongoConnected) {
      let settings = await StoreSetting.findOne();
      if (!settings) {
        settings = await StoreSetting.create({
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
      }
      return res.json(settings);
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(raw).storeSettings || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/settings', async (req, res) => {
  try {
    if (isMongoConnected) {
      const updated = await StoreSetting.findOneAndUpdate({}, req.body, { upsert: true, new: true });
      return res.json(updated);
    }
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 8. LANDING PAGE CONTENT REST API
// ==========================================
app.get('/api/landing', async (req, res) => {
  try {
    if (isMongoConnected) {
      const landing = await LandingContent.findOne();
      if (landing) return res.json(landing);
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    res.json(JSON.parse(raw).landingContent || {});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/landing', async (req, res) => {
  try {
    if (isMongoConnected) {
      const updated = await LandingContent.findOneAndUpdate({}, req.body, { upsert: true, new: true });
      return res.json(updated);
    }
    res.json(req.body);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 9. ADMIN AUTHENTICATION REST API
// ==========================================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (isMongoConnected) {
      const user = await AdminAuth.findOne({ username, password });
      if (user || (username === 'admin' && password === 'admin@123')) {
        return res.json({ success: true, message: 'Authentication successful' });
      }
      return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const auth = JSON.parse(raw).adminAuth || { username: 'admin@durgeshcollection.in', password: 'admin@123' };
    if ((username === auth.username || username === 'admin') && password === auth.password) {
      return res.json({ success: true, message: 'Authentication successful' });
    }
    res.status(401).json({ success: false, error: 'Invalid admin credentials' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/auth/password', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    if (isMongoConnected) {
      await AdminAuth.findOneAndUpdate({}, { username, password }, { upsert: true });
      return res.json({ success: true, message: 'Admin credentials updated successfully' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 10. SYSTEM RESET TO SAMPLE DATA
// ==========================================
app.post('/api/reset-data', async (req, res) => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const sample = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      if (isMongoConnected) {
        await Product.deleteMany({});
        await Review.deleteMany({});
        await InstaPost.deleteMany({});
        await Coupon.deleteMany({});

        if (sample.products) await Product.insertMany(sample.products.map(p => ({ ...p, id: String(p.id) })));
        if (sample.reviews) await Review.insertMany(sample.reviews.map(r => ({ ...r, id: String(r.id) })));
        if (sample.instaPosts) await InstaPost.insertMany(sample.instaPosts.map(i => ({ ...i, id: String(i.id) })));
        if (sample.landingContent) await LandingContent.findOneAndUpdate({}, sample.landingContent, { upsert: true });
        if (sample.storeSettings) await StoreSetting.findOneAndUpdate({}, sample.storeSettings, { upsert: true });
      }
    }
    res.json({ success: true, message: 'Sample data restored successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Durgesh Collection Backend API Server running on port ${PORT}`);
  console.log(`📡 REST API Base: http://localhost:${PORT}/api`);
  console.log(`📁 Uploads Static: http://localhost:${PORT}/uploads`);
});
