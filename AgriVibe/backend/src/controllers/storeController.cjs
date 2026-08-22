// backend/src/controllers/storeController.cjs
const Store = require('../models/Store.cjs');
const { geocodeAddress } = require('../services/mapsService.cjs');

// Create Store
exports.createStore = async (req, res) => {
    try {
        const { 
            store_name, 
            description, 
            category,
            addressLine1,
            addressLine2,
            city,
            county,
            storeAddress,
            paymentMethod,
            mpesaNumber,
            bankName,
            bankAccount
        } = req.body;
        
        // Generate slug from store name
        const store_slug = store_name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // ✅ NEW: Geocode the store address to get coordinates
        let latitude = null;
        let longitude = null;
        let formattedAddress = null;
        
        if (storeAddress) {
            try {
                const geocodeResult = await geocodeAddress(storeAddress);
                if (geocodeResult) {
                    latitude = geocodeResult.lat;
                    longitude = geocodeResult.lng;
                    formattedAddress = geocodeResult.formatted_address;
                }
            } catch (error) {
                console.error('Geocoding error:', error);
                // Continue without coordinates if geocoding fails
            }
        }

        const store = await Store.create({
            vendor_id: req.user.id,
            store_name,
            store_slug,
            description,
            store_category: category || null,
            address: formattedAddress || storeAddress || `${addressLine1}, ${city}, ${county}`,
            address_line1: addressLine1 || null,
            address_line2: addressLine2 || null,
            city: city || null,
            county: county || null,
            latitude: latitude,
            longitude: longitude,
            contact_email: req.user.email,
            contact_phone: req.user.phone,
            is_approved: false, // Changed to false - requires admin approval
            is_active: true
        });

        // Save payment details
        if (paymentMethod === 'mpesa') {
            await store.update({ mpesa_number: mpesaNumber });
        } else if (paymentMethod === 'bank') {
            await store.update({
                bank_name: bankName,
                bank_account: bankAccount,
            });
        }

        res.status(201).json({
            message: 'Store created successfully! Awaiting admin approval.',
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

// ✅ NEW: Update Store Location
exports.updateStoreLocation = async (req, res) => {
    try {
        const { address, latitude, longitude } = req.body;
        const vendorId = req.user.id;

        const store = await Store.findOne({
            where: { vendor_id: vendorId }
        });

        if (!store) {
            return res.status(404).json({ error: 'Store not found' });
        }

        let updateData = {};

        if (address) {
            try {
                const geocodeResult = await geocodeAddress(address);
                if (geocodeResult) {
                    updateData.address = geocodeResult.formatted_address;
                    updateData.latitude = geocodeResult.lat;
                    updateData.longitude = geocodeResult.lng;
                }
            } catch (error) {
                console.error('Geocoding error:', error);
            }
        }

        if (latitude !== undefined && longitude !== undefined) {
            updateData.latitude = latitude;
            updateData.longitude = longitude;
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ error: 'No valid location data provided' });
        }

        await store.update(updateData);

        res.json({
            message: 'Store location updated successfully',
            store
        });

    } catch (error) {
        console.error('Update store location error:', error);
        res.status(500).json({ error: 'Failed to update store location' });
    }
};