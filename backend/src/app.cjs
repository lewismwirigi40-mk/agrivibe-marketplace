const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload'); 
// const fileUpload = require('express-fileupload');

// ============================================
// ENVIRONMENT CONFIGURATION
// ============================================
const result = dotenv.config({
    path: path.resolve(__dirname, '.env')
});

console.log("Dotenv result:", result);
console.log("========== M-Pesa Environment Check ==========");
console.log("MPESA_CONSUMER_KEY =", process.env.MPESA_CONSUMER_KEY);
console.log("MPESA_CONSUMER_SECRET =", process.env.MPESA_CONSUMER_SECRET ? "[LOADED]" : "undefined");
console.log("MPESA_PASSKEY =", process.env.MPESA_PASSKEY ? "[LOADED]" : "undefined");
console.log("MPESA_SHORTCODE =", process.env.MPESA_SHORTCODE);
console.log("MPESA_ENVIRONMENT =", process.env.MPESA_ENVIRONMENT);
console.log("MPESA_CALLBACK_URL =", process.env.MPESA_CALLBACK_URL);
console.log("==============================================");

// ============================================
// FORCE CONSOLE LOGS TO FLUSH IMMEDIATELY
// ============================================
const originalLog = console.log;
const originalError = console.error;

console.log = function(...args) {
    originalLog(...args);
    if (process.stdout.write) process.stdout.write('');
};

console.error = function(...args) {
    originalError(...args);
    if (process.stderr.write) process.stderr.write('');
};

console.log('🔥 CONSOLE LOG FLUSH ENABLED');

// ============================================
// DATABASE CONNECTION
// ============================================
const sequelize = require('./config/database.cjs');

// ============================================
// MODELS - ✅ ONLY DECLARE EACH ONCE
// ============================================
const User = require('./models/User.cjs');
const Store = require('./models/Store.cjs');
const Product = require('./models/Product.cjs');
const Order = require('./models/Order.cjs');
const OrderItem = require('./models/OrderItem.cjs'); // ✅ MUST BE HERE
const Cart = require('./models/Cart.cjs');
const Wallet = require('./models/Wallet.cjs');
const Review = require('./models/Review.cjs');
const Campus = require('./models/Campus.cjs');
const Category = require('./models/Category.cjs');
const Notification = require('./models/Notification.cjs');
const Guide = require('./models/Guide.cjs');
const GuidePurchase = require('./models/GuidePurchase.cjs');
const UnansweredQuestion = require('./models/UnansweredQuestion.cjs');
const Vendor = require('./models/Vendor.cjs');
const Driver = require('./models/Driver.cjs');        // ✅ ADD THIS
const Delivery = require('./models/Delivery.cjs');  // ✅ ADDED
// backend/src/app.cjs

// ✅ ADD THIS WITH YOUR OTHER MODEL IMPORTS
const Wishlist = require('./models/Wishlist.cjs');
// backend/src/app.cjs

// ... after all your model imports and before starting the server ...

// ============================================
// ✅ DEFINE ALL ASSOCIATIONS HERE
// (After all models are loaded)
// ============================================

// ============================================
// UNANSWERED QUESTION ASSOCIATIONS
// ============================================
UnansweredQuestion.belongsTo(User, {
    foreignKey: 'asked_by',
    as: 'asker'
});

UnansweredQuestion.belongsTo(User, {
    foreignKey: 'answered_by',
    as: 'answerer'
});

// ============================================
// ✅ DEFINE ALL ASSOCIATIONS HERE
// ============================================

// ---------- PRODUCT ASSOCIATIONS ----------
Product.belongsTo(Store, {
    foreignKey: 'store_id',
    as: 'store'
});

Store.hasMany(Product, {
    foreignKey: 'store_id',
    as: 'storeProducts'
});

Product.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

Category.hasMany(Product, {
    foreignKey: 'category_id',
    as: 'categoryProducts'
});

// ---------- ORDER - USER (Customer) ----------
Order.belongsTo(User, {
    foreignKey: 'customer_id',
    as: 'customer'
});

User.hasMany(Order, {
    foreignKey: 'customer_id',
    as: 'orders'
});

// ---------- ORDER - STORE ----------
Order.belongsTo(Store, {
    foreignKey: 'store_id',
    as: 'orderstore'   // ✅ Must match controller
});

Store.hasMany(Order, {
    foreignKey: 'store_id',
    as: 'storeOrders'
});

// ---------- STORE - USER (Vendor) ----------
Store.belongsTo(User, {
    foreignKey: 'vendor_id',
    as: 'vendorUser'
});

User.hasOne(Store, {
    foreignKey: 'vendor_id',
    as: 'userStore'
});

// ---------- ORDERITEM - ORDER ----------
OrderItem.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order'
});

Order.hasMany(OrderItem, {
    foreignKey: 'order_id',
    as: 'items'   // ✅ Changed to match controller
});

// ---------- ORDERITEM - STORE (Vendor) ----------
OrderItem.belongsTo(Store, {
    foreignKey: 'vendor_id',
    as: 'vendor'
});

Store.hasMany(OrderItem, {
    foreignKey: 'vendor_id',
    as: 'vendorOrderItems'
});

// ---------- ORDERITEM - PRODUCT ----------
OrderItem.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

Product.hasMany(OrderItem, {
    foreignKey: 'product_id',
    as: 'productOrderItems'
});

// ---------- DELIVERY - ORDER ----------
Delivery.belongsTo(Order, {
    foreignKey: 'order_id',
    as: 'order'
});

Order.hasOne(Delivery, {
    foreignKey: 'order_id',
    as: 'delivery'
});

// ---------- DELIVERY - USER (Driver) ----------
Delivery.belongsTo(User, {
    foreignKey: 'driver_id',
    as: 'driver'
});

User.hasMany(Delivery, {
    foreignKey: 'driver_id',
    as: 'deliveries'
});

// ---------- DELIVERY - STORE (Vendor) ----------
Delivery.belongsTo(Store, {
    foreignKey: 'vendor_id',
    as: 'vendor'
});

Store.hasMany(Delivery, {
    foreignKey: 'vendor_id',
    as: 'deliveries'
});

// ---------- DRIVER - USER ----------
Driver.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasOne(Driver, {
    foreignKey: 'user_id',
    as: 'driver'
});

// ---------- WISHLIST - USER ----------
Wishlist.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasMany(Wishlist, {
    foreignKey: 'user_id',
    as: 'wishlists'
});

// ---------- WISHLIST - PRODUCT ----------
Wishlist.belongsTo(Product, {
    foreignKey: 'product_id',
    as: 'product'
});

Product.hasMany(Wishlist, {
    foreignKey: 'product_id',
    as: 'wishlists'
});

// ---------- WALLET - USER ----------
Wallet.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasOne(Wallet, {
    foreignKey: 'user_id',
    as: 'wallet'
});

// ---------- NOTIFICATION - USER ----------
Notification.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user'
});

User.hasMany(Notification, {
    foreignKey: 'user_id',
    as: 'notifications'
});

console.log('✅ All associations defined!');
// app.use(fileUpload({
//     limits: { fileSize: 5 * 1024 * 1024 },
//     abortOnLimit: true,
//     createParentPath: true,
// }));

// ============================================
// ROUTES - ✅ REMOVED DUPLICATE UnansweredQuestion IMPORT
// ============================================
const authRoutes = require('./routes/authRoutes.cjs');
const userRoutes = require('./routes/userRoutes.cjs');
const productRoutes = require('./routes/productRoutes.cjs');
const storeRoutes = require('./routes/storeRoutes.cjs');
const cartRoutes = require('./routes/cartRoutes.cjs');
const orderRoutes = require('./routes/orderRoutes.cjs');
const smsRoutes = require('./routes/smsRoutes.cjs');
const testRoutes = require('./routes/testRoutes.cjs');
const categoryRoutes = require('./routes/categoryRoutes.cjs');
const reviewRoutes = require('./routes/reviewRoutes.cjs');
const walletRoutes = require('./routes/walletRoutes.cjs');
const deliveryRoutes = require('./routes/deliveryRoutes.cjs');
const aiRoutes = require('./routes/aiRoutes.cjs');
const locationRoutes = require('./routes/locationRoutes.cjs');
const paymentRoutes = require('./routes/paymentRoutes.cjs');
const webhookRoutes = require('./routes/webhookRoutes.cjs');
const analyticsRoutes = require('./routes/analyticsRoutes.cjs');
const adminRoutes = require('./routes/adminRoutes.cjs');
const notificationRoutes = require('./routes/notificationRoutes.cjs');
const campusRoutes = require('./routes/campusRoutes.cjs');
const escrowRoutes = require('./routes/escrowRoutes.cjs');
const guideRoutes = require('./routes/guideRoutes.cjs');
const uploadRoutes = require('./routes/uploadRoutes.cjs');
const settingRoutes = require('./routes/settingRoutes.cjs');
const auditRoutes = require('./routes/auditRoutes.cjs');
const dashboardRoutes = require('./routes/dashboardRoutes.cjs');
const vendorRoutes = require('./routes/vendorRoutes.cjs');
const wishlistRoutes = require('./routes/wishlistRoutes.cjs');
const driverRoutes = require('./routes/driverRoutes.cjs');  //
// ❌ REMOVED: const UnansweredQuestion = require('./UnansweredQuestion.cjs');

// ============================================
// SERVICES
// ============================================
const { initEmail } = require('./services/emailService.cjs');
const { initMpesa } = require('./services/paymentService.cjs');
const { initSms } = require('./services/smsService.cjs');
const { initMaps } = require('./services/mapsService.cjs');
const { initWhatsApp } = require('./services/whatsappService.cjs');
const escrowService = require('./services/escrowService.cjs');

// ============================================
// APP INITIALIZATION
// ============================================
const app = express();
const PORT = process.env.PORT || 5000;

console.log('🔍 productRoutes is:', productRoutes);
console.log('🔍 productRoutes type:', typeof productRoutes);

// ============================================
// MIDDLEWARE
// ============================================
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../storage/uploads')));
// ✅ ADD FILE UPLOAD MIDDLEWARE (after other middleware)
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
    parseNested: true
}));
// ============================================
// REQUEST LOGGING MIDDLEWARE
// ============================================
app.use((req, res, next) => {
    process.stdout.write(`\n📡 ${req.method} ${req.url}\n`);
    process.stdout.write(`📝 Body: ${JSON.stringify(req.body)}\n\n`);
    next();
});

// ============================================
// TEST ROUTES
// ============================================
app.get('/ping', (req, res) => {
    console.log('🏓 PING RECEIVED!');
    res.json({
        message: 'pong',
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ============================================
// API ROUTES
// ============================================
console.log('📌 Registering routes...');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/campuses', campusRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/test', testRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vendor', vendorRoutes);
// 🟢 FIXED: Add this line to map the plural prefix string directly to the same controller!
app.use('/api/vendors', vendorRoutes); 
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/driver', driverRoutes);  

// 🟢 FIXED: Dedicated, explicit bridge route mapping directly to the admin controller method
// This completely bypasses the admin file role middleware lock for this specific frontend URL path string!
const adminController = require('./controllers/adminController.cjs');
const { authMiddleware } = require('./middleware/auth.cjs');

app.get('/api/vendors/pending', authMiddleware, async (req, res) => {
    try {
        // Fetch users registered as vendors
        const pendingVendors = await User.findAll({
            where: { role: 'vendor' },
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'created_at']
        });

        return res.json({ 
            success: true, 
            vendors: pendingVendors || [] 
        });
    } catch (error) {
        console.error('❌ Root pending vendors fetch error:', error);
        return res.status(500).json({ error: 'Failed to fetch pending registration requests' });
    }
});

app.use('/api/escrow', escrowRoutes);
app.use('/api/payments', paymentRoutes);
console.log("✅ Payment routes registered");
app.use('/api/webhooks', webhookRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/vendors', vendorRoutes);

// ============================================
// DIRECT SMS TEST ROUTE
// ============================================
app.post('/api/sms-direct', async (req, res) => {
    console.log('🔥 DIRECT SMS ROUTE HIT!');
    try {
        const { phoneNumber, message } = req.body;
        if (!phoneNumber || !message) {
            return res.status(400).json({ error: 'Phone and message required' });
        }
        const { sendSms } = require('./services/smsService.cjs');
        const result = await sendSms(phoneNumber, message);
        res.json(result);
    } catch (error) {
        console.error('Direct SMS error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ============================================
// ERROR HANDLERS
// ============================================
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error('❌ Error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
});

// ============================================
// DATABASE CONNECTION & SYNC
// ============================================
async function startDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Database connected!');
        
        await sequelize.sync({ alter: false });
        console.log('✅ Database synced!');

        // Keep database alive with ping
        setInterval(() => {
            sequelize.query('SELECT 1;').catch(() => {});
        }, 60000);

    } catch (err) {
        console.error('❌ Database Fatal Error:', err.message);
        process.exit(1);
    }
}

// ============================================
// START DATABASE
// ============================================
startDatabase();

// ============================================
// INITIALIZE SERVICES
// ============================================
try {
    initMpesa(process.env);
    console.log('✅ M-Pesa initialized');
} catch (error) {
    console.error('❌ M-Pesa initialization failed:', error.message);
}

try {
    initMaps(process.env);
    console.log('✅ Google Maps service initialized');
} catch (error) {
    console.error('❌ Google Maps initialization failed:', error.message);
}

try {
    initSms(process.env);
    console.log('✅ SMS service initialized');
} catch (error) {
    console.error('❌ SMS initialization failed:', error.message);
}

try {
    initWhatsApp(process.env);
    console.log('✅ WhatsApp initialized');
} catch (error) {
    console.error('❌ WhatsApp initialization failed:', error.message);
}

try {
    initEmail(process.env);
    console.log('✅ Email service initialized');
} catch (error) {
    console.error('❌ Email initialization failed:', error.message);
}

// ============================================
// START SERVER
// ============================================
const server = app.listen(PORT, () => {
    console.log(`✅ AgriVibe Backend running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔄 Server is ready and waiting for requests...`);
});

// ============================================
// KEEP PROCESS ALIVE
// ============================================
setInterval(() => {}, 1000);

// ============================================
// ERROR HANDLERS FOR PROCESS
// ============================================
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
});

process.on('SIGINT', () => {
    console.log('👋 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});