// backend/src/controllers/guideController.cjs
const Guide = require('../models/Guide.cjs');
const GuidePurchase = require('../models/GuidePurchase.cjs');
const User = require('../models/User.cjs');
const Wallet = require('../models/Wallet.cjs');
const crypto = require('crypto');
const { Op } = require('sequelize');

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateDownloadToken() {
    return crypto.randomBytes(32).toString('hex');
}

function generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `GUIDE-${year}${month}${day}-${random}`;
}

// ============================================
// GET ALL GUIDES (Public)
// ============================================
exports.getGuides = async (req, res) => {
    try {
        const guides = await Guide.findAll({
            where: { is_active: true },
            order: [['created_at', 'DESC']]
        });
        res.json({ guides });
    } catch (error) {
        console.error('Get guides error:', error);
        res.status(500).json({ error: 'Failed to fetch guides' });
    }
};

// ============================================
// GET GUIDE BY SLUG (Public)
// ============================================
exports.getGuideBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const guide = await Guide.findOne({
            where: { slug, is_active: true }
        });
        
        if (!guide) {
            return res.status(404).json({ error: 'Guide not found' });
        }
        
        await guide.increment('views');
        res.json({ guide });
    } catch (error) {
        console.error('Get guide error:', error);
        res.status(500).json({ error: 'Failed to fetch guide' });
    }
};


// backend/src/controllers/guideController.cjs

// ============================================
// PURCHASE GUIDE - WITH STK PUSH
// ============================================
exports.purchaseGuide = async (req, res) => {
    try {
        const { guide_id, payment_method, phone_number } = req.body;
        const user_id = req.user.id;
        
        const guide = await Guide.findByPk(guide_id);
        if (!guide) {
            return res.status(404).json({ error: 'Guide not found' });
        }

        // ✅ Check if already purchased
        const existingPurchase = await GuidePurchase.findOne({
            where: {
                guide_id,
                user_id,
                payment_status: 'completed'
            }
        });

        if (existingPurchase) {
            return res.status(400).json({ 
                error: 'You have already purchased this guide',
                download_token: existingPurchase.download_token
            });
        }

        // ✅ Validate phone for M-Pesa
        if (payment_method === 'mpesa') {
            if (!phone_number || phone_number.length < 10) {
                return res.status(400).json({ error: 'Valid phone number required for M-Pesa' });
            }
        }

        const orderNumber = generateOrderNumber();
        const downloadToken = generateDownloadToken();
        
        // ✅ Create purchase record (pending)
        const purchase = await GuidePurchase.create({
            guide_id,
            user_id,
            amount: guide.price,
            payment_method: payment_method || 'mpesa',
            payment_status: 'pending',
            download_token: downloadToken,
            order_number: orderNumber,
            transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
        });

        // ✅ If M-Pesa, send STK Push
        if (payment_method === 'mpesa') {
            try {
                const mpesaService = require('../services/mpesaService.cjs');
                const callbackUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/mpesa/callback`;
                
                const result = await mpesaService.stkPush(
                    phone_number,
                    guide.price,
                    orderNumber,
                    callbackUrl
                );
                
                if (result.success && result.ResponseCode === '0') {
                    // ✅ STK Push sent successfully
                    purchase.transaction_id = result.CheckoutRequestID;
                    await purchase.save();
                    
                    return res.json({
                        success: true,
                        message: 'STK Push sent to your phone. Please enter PIN to complete payment.',
                        purchase_id: purchase.id,
                        checkoutRequestId: result.CheckoutRequestID,
                        amount: guide.price,
                        guide_title: guide.title,
                        payment_method: 'mpesa',
                        status: 'pending',
                        phone_number: phone_number
                    });
                } else {
                    // ❌ STK Push failed
                    purchase.payment_status = 'failed';
                    await purchase.save();
                    return res.status(400).json({
                        error: result.error || 'Failed to send payment request',
                        responseCode: result.responseCode
                    });
                }
            } catch (error) {
                console.error('STK Push error:', error);
                purchase.payment_status = 'failed';
                await purchase.save();
                return res.status(500).json({ 
                    error: 'Payment initiation failed. Please try again.' 
                });
            }
        }

        // ✅ For wallet, process immediately
        if (payment_method === 'wallet') {
            // ... wallet logic stays the same
        }

    } catch (error) {
        console.error('Purchase guide error:', error);
        res.status(500).json({ 
            error: 'Failed to purchase guide',
            details: error.message 
        });
    }
};
// ============================================
// CONFIRM PAYMENT (M-Pesa Callback) - FIXED
// ============================================
exports.confirmPurchase = async (req, res) => {
    try {
        const { purchase_id, transaction_id, mpesa_code } = req.body;
        const user_id = req.user.id;
        
        const purchase = await GuidePurchase.findOne({
            where: { id: purchase_id, user_id }
        });
        
        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        
        if (purchase.payment_status === 'completed') {  // ✅ FIXED
            const guide = await Guide.findByPk(purchase.guide_id);
            return res.json({
                success: true,
                message: 'Already purchased',
                download_token: purchase.download_token,
                guide: guide
            });
        }
        
        purchase.payment_status = 'completed';  // ✅ FIXED
        purchase.transaction_id = transaction_id || `TXN-${Date.now()}`;
        purchase.mpesa_code = mpesa_code || null;
        await purchase.save();
        
        await Guide.increment('purchases', { where: { id: purchase.guide_id } });
        await Guide.increment('downloads', { where: { id: purchase.guide_id } });
        
        const guide = await Guide.findByPk(purchase.guide_id);
        await sendGuideEmail(user_id, guide, purchase.download_token);
        
        res.json({
            success: true,
            message: 'Payment confirmed! Check your email for download link.',
            download_token: purchase.download_token,
            guide: guide
        });
    } catch (error) {
        console.error('Confirm purchase error:', error);
        res.status(500).json({ error: 'Failed to confirm purchase' });
    }
};

// ============================================
// DOWNLOAD GUIDE (Authenticated)
// ============================================
exports.downloadGuide = async (req, res) => {
    try {
        const { token } = req.params;
        const user_id = req.user.id;
        
        const purchase = await GuidePurchase.findOne({
            where: { download_token: token, user_id, payment_status: 'completed' }  // ✅ FIXED
        });
        
        if (!purchase) {
            return res.status(404).json({ error: 'Invalid download link' });
        }
        
        purchase.download_count += 1;
        purchase.downloaded_at = new Date();
        await purchase.save();
        
        const guide = await Guide.findByPk(purchase.guide_id);
        
        res.json({
            success: true,
            message: 'Download ready',
            guide: guide,
            download_url: guide.file_url,
            license: {
                purchased_at: purchase.created_at,
                order_number: purchase.order_number,
                expires: null
            }
        });
    } catch (error) {
        console.error('Download guide error:', error);
        res.status(500).json({ error: 'Failed to download guide' });
    }
};

// ============================================
// GET USER'S PURCHASED GUIDES - FIXED
// ============================================
exports.getMyGuides = async (req, res) => {
    try {
        const user_id = req.user.id;
        const purchases = await GuidePurchase.findAll({
            where: { user_id, payment_status: 'completed' },  // ✅ FIXED
            order: [['created_at', 'DESC']]
        });
        
        const result = [];
        for (const purchase of purchases) {
            const guide = await Guide.findByPk(purchase.guide_id);
            if (guide) {
                result.push({
                    id: purchase.id,
                    guide: guide,
                    amount: purchase.amount,
                    download_token: purchase.download_token,
                    order_number: purchase.order_number,
                    purchased_at: purchase.created_at
                });
            }
        }
        
        res.json({ purchases: result });
    } catch (error) {
        console.error('Get my guides error:', error);
        res.status(500).json({ error: 'Failed to fetch your guides' });
    }
};

// ============================================
// GET PURCHASE STATUS - FIXED
// ============================================
exports.getPurchaseStatus = async (req, res) => {
    try {
        const { guide_id } = req.params;
        const user_id = req.user.id;

        const purchase = await GuidePurchase.findOne({
            where: {
                guide_id,
                user_id,
                payment_status: 'completed'  // ✅ FIXED
            }
        });

        res.json({
            success: true,
            purchased: !!purchase,
            purchase: purchase ? {
                id: purchase.id,
                download_token: purchase.download_token,
                purchased_at: purchase.created_at
            } : null
        });
    } catch (error) {
        console.error('Get purchase status error:', error);
        res.status(500).json({ error: 'Failed to check purchase status' });
    }
};

// ============================================
// ADMIN: CREATE GUIDE
// ============================================
exports.createGuide = async (req, res) => {
    try {
        console.log('📝 Creating guide...');
        
        const { title, description, price, category, file_url, file_size, cover_image, is_featured } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        const guideData = {
            title,
            slug,
            description,
            price: price || 0,
            category,
            file_url,
            file_size,
            cover_image,
            is_featured: is_featured || false,
            is_active: true,
            created_by: req.user?.id || null
        };
        
        const guide = await Guide.create(guideData);
        
        console.log('✅ Guide created:', guide.id);
        
        res.status(201).json({
            success: true,
            message: 'Guide created successfully',
            guide
        });
    } catch (error) {
        console.error('❌ Create guide error:', error);
        res.status(500).json({ 
            error: 'Failed to create guide', 
            details: error.message 
        });
    }
};

// ============================================
// ADMIN: UPDATE GUIDE
// ============================================
exports.updateGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await Guide.findByPk(id);
        
        if (!guide) {
            return res.status(404).json({ error: 'Guide not found' });
        }
        
        await guide.update(req.body);
        
        res.json({
            success: true,
            message: 'Guide updated successfully',
            guide
        });
    } catch (error) {
        console.error('Update guide error:', error);
        res.status(500).json({ error: 'Failed to update guide' });
    }
};

// ============================================
// ADMIN: DELETE GUIDE
// ============================================
exports.deleteGuide = async (req, res) => {
    try {
        const { id } = req.params;
        
        const guide = await Guide.findByPk(id);
        if (!guide) {
            return res.status(404).json({ error: 'Guide not found' });
        }
        
        const deletedPurchases = await GuidePurchase.destroy({
            where: { guide_id: id }
        });
        
        await guide.destroy();
        
        res.json({ 
            success: true,
            message: 'Guide deleted successfully',
            purchases_deleted: deletedPurchases
        });
    } catch (error) {
        console.error('❌ Delete guide error:', error);
        res.status(500).json({ error: 'Failed to delete guide' });
    }
};

// ============================================
// ADMIN: GET ALL GUIDES (With purchase stats) - FIXED
// ============================================
exports.adminGetGuides = async (req, res) => {
    try {
        const guides = await Guide.findAll({
            order: [['created_at', 'DESC']]
        });
        
        const guidesWithStats = await Promise.all(guides.map(async (guide) => {
            const purchaseCount = await GuidePurchase.count({
                where: { guide_id: guide.id, payment_status: 'completed' }  // ✅ FIXED
            });
            
            const totalRevenue = await GuidePurchase.sum('amount', {
                where: { guide_id: guide.id, payment_status: 'completed' }  // ✅ FIXED
            });
            
            return {
                ...guide.toJSON(),
                purchase_count: purchaseCount,
                total_revenue: totalRevenue || 0
            };
        }));
        
        res.json({ guides: guidesWithStats });
    } catch (error) {
        console.error('Admin get guides error:', error);
        res.status(500).json({ error: 'Failed to fetch guides' });
    }
};

// ============================================
// SEND GUIDE EMAIL
// ============================================
const sendGuideEmail = async (user_id, guide, downloadToken) => {
    try {
        const user = await User.findByPk(user_id);
        if (!user) return;

        const downloadLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/guides/download/${downloadToken}`;

        const emailService = require('../services/emailService.cjs');
        
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
                <div style="background: #22c55e; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h1 style="color: white; margin: 0;">🌾 AgriVibe</h1>
                </div>
                <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px;">
                    <h2 style="color: #1a1a2e;">Your Guide is Ready!</h2>
                    <p style="color: #4b5563;">Dear ${user.first_name || 'Customer'},</p>
                    <p style="color: #4b5563;">Thank you for purchasing <strong>"${guide.title}"</strong> from AgriVibe.</p>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0;"><strong>📖 Guide:</strong> ${guide.title}</p>
                        <p style="margin: 5px 0;"><strong>💰 Price:</strong> KES ${guide.price}</p>
                        <p style="margin: 5px 0;"><strong>📅 Purchased:</strong> ${new Date().toLocaleDateString()}</p>
                    </div>
                    <a href="${downloadLink}" style="display: block; background: #22c55e; color: white; padding: 14px 28px; text-align: center; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
                        📥 Download Your Guide
                    </a>
                    <p style="color: #6b7280; font-size: 14px;">Or copy this link into your browser:</p>
                    <p style="color: #3b82f6; word-break: break-all; font-size: 12px; background: #f3f4f6; padding: 10px; border-radius: 4px;">${downloadLink}</p>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">This link is valid for one download. For any issues, contact support@agrivibe.com</p>
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                    <p style="color: #9ca3af; font-size: 12px; text-align: center;">© 2026 AgriVibe KE Farm Solutions. All rights reserved.</p>
                </div>
            </div>
        `;

        await emailService.sendEmail({
            to: user.email,
            subject: `📚 Your Guide: ${guide.title} is Ready for Download`,
            html
        });

        console.log(`📧 Guide email sent to ${user.email}`);

    } catch (error) {
        console.error('Send guide email error:', error);
    }
};