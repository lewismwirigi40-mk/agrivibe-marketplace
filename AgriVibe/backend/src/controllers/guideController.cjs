const Guide = require('../models/Guide.cjs');
const GuidePurchase = require('../models/GuidePurchase.cjs');
const User = require('../models/User.cjs');
const crypto = require('crypto');

function generateDownloadToken() {
    return crypto.randomBytes(32).toString('hex');
}

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

exports.getGuideBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const guide = await Guide.findOne({
            where: { slug, is_active: true }
        });
        if (!guide) {
            return res.status(404).json({ error: 'Guide not found' });
        }
        res.json({ guide });
    } catch (error) {
        console.error('Get guide error:', error);
        res.status(500).json({ error: 'Failed to fetch guide' });
    }
};
exports.purchaseGuide = async (req, res) => {
    try {
        const { guide_id, payment_method, phone_number, card_number, card_expiry, card_cvv } = req.body;
        const user_id = req.user.id;
        
        const guide = await Guide.findByPk(guide_id);
        if (!guide) {
            return res.status(404).json({ error: 'Guide not found' });
        }

        // ✅ NO DUPLICATE CHECK - User can buy multiple times

        // Validate payment method
        if (payment_method === 'mpesa' && !phone_number) {
            return res.status(400).json({ error: 'Phone number is required for M-Pesa' });
        }

        if (payment_method === 'card' && (!card_number || !card_expiry || !card_cvv)) {
            return res.status(400).json({ error: 'Card details are required' });
        }

        // Generate download token
        const downloadToken = generateDownloadToken();
        
        // Create purchase record
        const purchase = await GuidePurchase.create({
            guide_id,
            user_id,
            amount: guide.price,
            payment_method,
            status: 'pending',
            download_token: downloadToken,
            transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
        });

        // If payment method is wallet, process immediately
        if (payment_method === 'wallet') {
            try {
                const Wallet = require('../models/Wallet.cjs');
                const wallet = await Wallet.findOne({ where: { user_id } });
                
                if (!wallet || parseFloat(wallet.balance) < parseFloat(guide.price)) {
                    purchase.status = 'failed';
                    await purchase.save();
                    return res.status(400).json({ error: 'Insufficient wallet balance' });
                }

                wallet.balance = parseFloat(wallet.balance) - parseFloat(guide.price);
                await wallet.save();

                purchase.status = 'completed';
                purchase.transaction_id = `WALLET-${Date.now()}`;
                await purchase.save();

                await Guide.increment('downloads', { where: { id: guide_id } });

                return res.json({
                    message: 'Purchase completed successfully!',
                    purchase_id: purchase.id,
                    download_token: purchase.download_token,
                    guide_title: guide.title,
                    amount: guide.price,
                    payment_method: 'wallet',
                    status: 'completed'
                });
            } catch (error) {
                console.error('Wallet payment error:', error);
                purchase.status = 'failed';
                await purchase.save();
                return res.status(500).json({ error: 'Wallet payment failed' });
            }
        }

        // For M-Pesa and Card, return pending status
        res.json({
            message: 'Purchase initiated',
            purchase_id: purchase.id,
            amount: guide.price,
            guide_title: guide.title,
            download_token: downloadToken,
            payment_method: payment_method,
            status: 'pending'
        });

    } catch (error) {
        console.error('Purchase guide error:', error);
        res.status(500).json({ error: 'Failed to purchase guide' });
    }
};
exports.confirmPurchase = async (req, res) => {
    try {
        const { purchase_id, transaction_id } = req.body;
        const user_id = req.user.id;
        
        const purchase = await GuidePurchase.findOne({
            where: { id: purchase_id, user_id }
        });
        
        if (!purchase) {
            return res.status(404).json({ error: 'Purchase not found' });
        }
        
        if (purchase.status === 'completed') {
            const guide = await Guide.findByPk(purchase.guide_id);
            return res.json({
                message: 'Already purchased',
                download_token: purchase.download_token,
                guide: guide
            });
        }
        
        purchase.status = 'completed';
    purchase.transaction_id = transaction_id || `TXN-${Date.now()}`;
        await purchase.save();
        
        await Guide.increment('downloads', { where: { id: purchase.guide_id } });
        
        const guide = await Guide.findByPk(purchase.guide_id);
        
        res.json({
            message: 'Purchase confirmed!',
            download_token: purchase.download_token,
            guide: guide
        });
    } catch (error) {
        console.error('Confirm purchase error:', error);
        res.status(500).json({ error: 'Failed to confirm purchase' });
    }
};

exports.downloadGuide = async (req, res) => {
    try {
        const { token } = req.params;
        const user_id = req.user.id;
        
        const purchase = await GuidePurchase.findOne({
            where: { download_token: token, user_id, status: 'completed' }
        });
        
        if (!purchase) {
            return res.status(404).json({ error: 'Invalid download link' });
        }
        
        purchase.download_count += 1;
        purchase.downloaded_at = new Date();
        await purchase.save();
        
        const guide = await Guide.findByPk(purchase.guide_id);
        
        res.json({
            message: 'Download ready',
            guide: guide,
            license: {
                purchased_at: purchase.created_at
            }
        });
    } catch (error) {
        console.error('Download guide error:', error);
        res.status(500).json({ error: 'Failed to download guide' });
    }
};

// Get user's purchased guides
exports.getMyGuides = async (req, res) => {
    try {
        const user_id = req.user.id;
        const purchases = await GuidePurchase.findAll({
            where: { user_id, status: 'completed' },
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
                    created_at: purchase.created_at
                });
            }
        }
        
        res.json({ purchases: result });
    } catch (error) {
        console.error('Get my guides error:', error);
        res.status(500).json({ error: 'Failed to fetch your guides' });
    }
};
// Create guide (Admin)
exports.createGuide = async (req, res) => {
    try {
        console.log('📝 Creating guide...');
        console.log('User:', req.user);
        
        const { title, description, price, category, file_url, file_size, cover_image, is_featured } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        console.log('📝 Guide data:', { title, slug, price, category });
        
        const guideData = {
            title,
            slug,
            description,
            price,
            category,
            file_url,
            file_size,
            cover_image,
            is_featured: is_featured || false,
            created_by: req.user?.id || null
        };
        
        console.log('📝 Guide data to save:', guideData);
        
        const guide = await Guide.create(guideData);
        
        console.log('✅ Guide created:', guide.id);
        
        res.status(201).json({
            message: 'Guide created successfully',
            guide
        });
    } catch (error) {
        console.error('❌ Create guide error:', error);
        console.error('❌ Error details:', error.errors);
        res.status(500).json({ error: 'Failed to create guide', details: error.message });
    }
};
exports.updateGuide = async (req, res) => {
    try {
        const { id } = req.params;
        const guide = await Guide.findByPk(id);
        if (!guide) {
            return res.status(404).json({ error: 'Guide not found' });
        }
        await guide.update(req.body);
        res.json({
            message: 'Guide updated successfully',
            guide
        });
    } catch (error) {
        console.error('Update guide error:', error);
        res.status(500).json({ error: 'Failed to update guide' });
    }
};

exports.deleteGuide = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('🗑️ Attempting to delete guide:', id);
        
        const guide = await Guide.findByPk(id);
        if (!guide) {
            console.log('❌ Guide not found:', id);
            return res.status(404).json({ error: 'Guide not found' });
        }
        
        console.log('✅ Guide found:', guide.title);
        
        // ✅ First delete all purchase records
        const deletedPurchases = await GuidePurchase.destroy({
            where: { guide_id: id }
        });
        console.log(`✅ Deleted ${deletedPurchases} purchase records`);
        
        // ✅ Then delete the guide
        await guide.destroy();
        console.log('✅ Guide deleted successfully');
        
        res.json({ 
            message: 'Guide deleted successfully',
            purchases_deleted: deletedPurchases
        });
    } catch (error) {
        console.error('❌ Delete guide error:', error);
        res.status(500).json({ error: 'Failed to delete guide' });
    }
};