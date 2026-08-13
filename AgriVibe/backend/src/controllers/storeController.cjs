const Store = require('../models/Store.cjs');

// Create Store
exports.createStore = async (req, res) => {
    try {
        const { store_name, description } = req.body;
        
        // Generate slug from store name
        const store_slug = store_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        const store = await Store.create({
            vendor_id: req.user.id,
            store_name,
            store_slug,
            description,
            is_approved: true // Auto-approve for testing
        });

        res.status(201).json({
            message: 'Store created successfully',
            store
        });

    } catch (error) {
        console.error('Create store error:', error);
        res.status(500).json({ error: 'Failed to create store' });
    }
};

// Get Store by Vendor ID
exports.getStoreByVendor = async (req, res) => {
    try {
        const store = await Store.findOne({
            where: { vendor_id: req.user.id }
        });

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        res.json({ store });
    } catch (error) {
        console.error('Get store error:', error);
        res.status(500).json({ error: 'Failed to fetch store' });
    }
};