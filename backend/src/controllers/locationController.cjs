const { geocodeAddress, reverseGeocode, getLocationDistance, autocompleteAddress, calculateDistance } = require('../services/mapsService.cjs');
const User = require('../models/User.cjs');
const Store = require('../models/Store.cjs');
const Product = require('../models/Product.cjs');
const { sequelize } = require('../config/database.cjs');

// Update user location
exports.updateUserLocation = async (req, res) => {
    try {
        const { latitude, longitude, address } = req.body;
        const user_id = req.user.id;

        if (!latitude || !longitude) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        // Get address from coordinates if not provided
        let locationAddress = address;
        if (!locationAddress) {
            const geocodeResult = await reverseGeocode(latitude, longitude);
            if (geocodeResult.success) {
                locationAddress = geocodeResult.address;
            }
        }

        await User.update({
            latitude,
            longitude,
            location_address: locationAddress,
            location_updated_at: new Date()
        }, {
            where: { id: user_id }
        });

        res.json({
            message: 'Location updated successfully',
            location: { latitude, longitude, address: locationAddress }
        });

    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ error: 'Failed to update location' });
    }
};

// Get nearby products (within radius)
exports.getNearbyProducts = async (req, res) => {
    try {
        const { lat, lng, radius = 15, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const customerLat = parseFloat(lat);
        const customerLng = parseFloat(lng);

        // Get products with distance calculation
        const products = await Product.findAll({
            include: [{
                model: Store,
                as: 'store',
                where: {
                    latitude: { [sequelize.Op.ne]: null },
                    longitude: { [sequelize.Op.ne]: null }
                },
                attributes: ['id', 'store_name', 'latitude', 'longitude', 'address']
            }],
            where: { is_active: true },
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        // Calculate distance for each product and filter
        const productsWithDistance = products
            .map(product => {
                const storeLat = product.store?.latitude;
                const storeLng = product.store?.longitude;
                let distance = null;
                let withinRadius = false;

                if (storeLat && storeLng) {
                    distance = calculateDistance(customerLat, customerLng, storeLat, storeLng);
                    withinRadius = distance <= radius;
                }

                return {
                    ...product.toJSON(),
                    distance_km: distance ? Math.round(distance * 10) / 10 : null,
                    within_radius: withinRadius
                };
            })
            .filter(p => p.within_radius === true)
            .sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999));

        res.json({
            products: productsWithDistance,
            total: productsWithDistance.length,
            radius_km: radius,
            location: { lat: customerLat, lng: customerLng }
        });

    } catch (error) {
        console.error('Get nearby products error:', error);
        res.status(500).json({ error: 'Failed to fetch nearby products' });
    }
};

// Geocode address (convert address to coordinates)
exports.geocodeAddress = async (req, res) => {
    try {
        const { address } = req.body;

        if (!address) {
            return res.status(400).json({ error: 'Address is required' });
        }

        const result = await geocodeAddress(address);

        if (result.success) {
            res.json({
                address: result.formattedAddress,
                latitude: result.latitude,
                longitude: result.longitude,
                placeId: result.placeId
            });
        } else {
            res.status(400).json({ error: result.error || 'Geocoding failed' });
        }

    } catch (error) {
        console.error('Geocode error:', error);
        res.status(500).json({ error: 'Failed to geocode address' });
    }
};

// Reverse geocode (convert coordinates to address)
exports.reverseGeocode = async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const result = await reverseGeocode(lat, lng);

        if (result.success) {
            res.json({
                address: result.address,
                placeId: result.placeId,
                components: result.components
            });
        } else {
            res.status(400).json({ error: result.error || 'Reverse geocoding failed' });
        }

    } catch (error) {
        console.error('Reverse geocode error:', error);
        res.status(500).json({ error: 'Failed to reverse geocode' });
    }
};

// Get distance between two addresses
exports.getDistance = async (req, res) => {
    try {
        const { origin, destination } = req.body;

        if (!origin || !destination) {
            return res.status(400).json({ error: 'Origin and destination are required' });
        }

        const result = await getLocationDistance(origin, destination);

        if (result.success) {
            res.json({
                distance: result.distance,
                distance_meters: result.distanceMeters,
                duration: result.duration,
                duration_seconds: result.durationSeconds
            });
        } else {
            res.status(400).json({ error: result.error || 'Distance calculation failed' });
        }

    } catch (error) {
        console.error('Distance error:', error);
        res.status(500).json({ error: 'Failed to calculate distance' });
    }
};

// Autocomplete address
exports.autocompleteAddress = async (req, res) => {
    try {
        const { input } = req.body;

        if (!input || input.length < 2) {
            return res.status(400).json({ error: 'Input must be at least 2 characters' });
        }

        const result = await autocompleteAddress(input);

        if (result.success) {
            res.json({
                predictions: result.predictions
            });
        } else {
            res.status(400).json({ error: result.error || 'Autocomplete failed' });
        }

    } catch (error) {
        console.error('Autocomplete error:', error);
        res.status(500).json({ error: 'Failed to autocomplete address' });
    }
};

// Get user location
exports.getUserLocation = async (req, res) => {
    try {
        const user_id = req.user.id;

        const user = await User.findByPk(user_id, {
            attributes: ['latitude', 'longitude', 'location_address', 'location_updated_at']
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            location: {
                latitude: user.latitude,
                longitude: user.longitude,
                address: user.location_address,
                updated_at: user.location_updated_at
            }
        });

    } catch (error) {
        console.error('Get user location error:', error);
        res.status(500).json({ error: 'Failed to get user location' });
    }
};