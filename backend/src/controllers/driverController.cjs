const Driver = require('../models/Driver.cjs');
const User = require('../models/User.cjs');
const Order = require('../models/Order.cjs');
const Delivery = require('../models/Delivery.cjs');
const Notification = require('../models/Notification.cjs');
const { Op } = require('sequelize');

// ============================================
// HELPER: Create Notification
// ============================================
async function createNotification(userId, type, title, message, data = {}, link = null) {
    try {
        const notification = await Notification.create({
            user_id: userId,
            type: type,
            title: title,
            message: message,
            data: data,
            link: link,
            sent_at: new Date()
        });
        return notification;
    } catch (error) {
        console.error('Create notification error:', error);
        return null;
    }
}

// ============================================
// REGISTER DRIVER - NO APPROVAL NEEDED
// ============================================
exports.registerDriver = async (req, res) => {
    try {
        const { 
            vehicle_type, 
            vehicle_plate, 
            vehicle_color,
            vehicle_model,
            phone,
            license_number,
            license_expiry,
            bio
        } = req.body;

        const userId = req.user.id;

        // Check if user already has a driver profile
        const existingDriver = await Driver.findOne({ where: { user_id: userId } });
        if (existingDriver) {
            return res.status(400).json({ 
                success: false, 
                error: 'Driver profile already exists for this user' 
            });
        }

        // ✅ Create driver profile - AUTO VERIFIED
        const driver = await Driver.create({
            user_id: userId,
            vehicle_type: vehicle_type || 'motorcycle',
            vehicle_plate: vehicle_plate || '',
            vehicle_color: vehicle_color || '',
            vehicle_model: vehicle_model || '',
            phone: phone || req.user.phone || '',
            license_number: license_number || '',
            license_expiry: license_expiry || null,
            bio: bio || '',
            is_available: true,
            is_verified: true,  // ✅ AUTO VERIFIED - No admin approval needed
            is_active: true,
            rating: 0,
            total_deliveries: 0,
            total_earnings: 0,
            acceptance_rate: 100
        });

        // Update user role to driver
        await User.update(
            { role: 'driver' },
            { where: { id: userId } }
        );

        // Get user data
        const user = await User.findByPk(userId, {
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        });

        // ✅ NOTIFICATION: Driver registered (to admin - just for info)
        const adminUsers = await User.findAll({ where: { role: 'admin' } });
        for (const admin of adminUsers) {
            await createNotification(
                admin.id,
                'driver_registered',
                '🚗 New Driver Registered',
                `${user.first_name} ${user.last_name} has registered as a driver`,
                { 
                    driver_id: driver.id,
                    user_id: userId,
                    vehicle_type: vehicle_type,
                    vehicle_plate: vehicle_plate
                },
                `/admin/drivers/${driver.id}`
            );
        }

        res.status(201).json({
            success: true,
            message: 'Driver registered successfully! You can now accept deliveries.',
            driver: {
                id: driver.id,
                vehicle_type: driver.vehicle_type,
                vehicle_plate: driver.vehicle_plate,
                is_verified: driver.is_verified,
                is_available: driver.is_available
            },
            redirectTo: '/driver/dashboard'
        });

    } catch (error) {
        console.error('Register driver error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to register driver',
            details: error.message
        });
    }
};

// ============================================
// GET DRIVER PROFILE
// ============================================
exports.getDriverProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get user data
        const user = await User.findByPk(userId, {
            attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        });

        // Get driver data
        const driver = await Driver.findOne({ where: { user_id: userId } });

        if (!driver) {
            return res.status(404).json({ 
                success: false,
                error: 'Driver profile not found' 
            });
        }

        // Get delivery stats
        const totalDeliveries = await Delivery.count({ where: { driver_id: driver.id } });
        const completedDeliveries = await Delivery.count({ 
            where: { driver_id: driver.id, status: 'delivered' } 
        });
        const pendingDeliveries = await Delivery.count({ 
            where: { driver_id: driver.id, status: ['assigned', 'picked_up', 'in_transit'] } 
        });

        // Get recent deliveries
        const recentDeliveries = await Delivery.findAll({
            where: { driver_id: driver.id },
            limit: 5,
            order: [['created_at', 'DESC']],
            include: [
                { 
                    model: Order, 
                    as: 'order',
                    attributes: ['id', 'order_number', 'total', 'delivery_address']
                }
            ]
        });

        res.json({
            success: true,
            profile: {
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    profile_image: user.profile_image
                },
                driver: {
                    id: driver.id,
                    vehicle_type: driver.vehicle_type,
                    vehicle_plate: driver.vehicle_plate,
                    vehicle_color: driver.vehicle_color,
                    vehicle_model: driver.vehicle_model,
                    license_number: driver.license_number,
                    license_expiry: driver.license_expiry,
                    bio: driver.bio,
                    is_available: driver.is_available,
                    is_verified: driver.is_verified,
                    is_active: driver.is_active,
                    rating: driver.rating,
                    total_deliveries: driver.total_deliveries,
                    total_earnings: driver.total_earnings,
                    acceptance_rate: driver.acceptance_rate,
                    availability_schedule: driver.availability_schedule,
                    preferred_areas: driver.preferred_areas
                },
                stats: {
                    total: totalDeliveries,
                    completed: completedDeliveries,
                    pending: pendingDeliveries
                },
                recent_deliveries: recentDeliveries
            }
        });

    } catch (error) {
        console.error('Get driver profile error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch driver profile',
            details: error.message
        });
    }
};

// ============================================
// UPDATE DRIVER PROFILE
// ============================================
exports.updateDriverProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const {
            vehicle_type,
            vehicle_plate,
            vehicle_color,
            vehicle_model,
            phone,
            license_number,
            license_expiry,
            bio,
            availability_schedule,
            preferred_areas
        } = req.body;

        const driver = await Driver.findOne({ where: { user_id: userId } });

        if (!driver) {
            return res.status(404).json({ 
                success: false,
                error: 'Driver profile not found' 
            });
        }

        // Update driver
        const updates = {};
        if (vehicle_type !== undefined) updates.vehicle_type = vehicle_type;
        if (vehicle_plate !== undefined) updates.vehicle_plate = vehicle_plate;
        if (vehicle_color !== undefined) updates.vehicle_color = vehicle_color;
        if (vehicle_model !== undefined) updates.vehicle_model = vehicle_model;
        if (phone !== undefined) updates.phone = phone;
        if (license_number !== undefined) updates.license_number = license_number;
        if (license_expiry !== undefined) updates.license_expiry = license_expiry;
        if (bio !== undefined) updates.bio = bio;
        if (availability_schedule !== undefined) updates.availability_schedule = availability_schedule;
        if (preferred_areas !== undefined) updates.preferred_areas = preferred_areas;

        await driver.update(updates);

        // Update user phone if provided
        if (phone) {
            await User.update(
                { phone: phone },
                { where: { id: userId } }
            );
        }

        res.json({
            success: true,
            message: 'Driver profile updated successfully',
            driver: {
                id: driver.id,
                vehicle_type: driver.vehicle_type,
                vehicle_plate: driver.vehicle_plate,
                is_available: driver.is_available,
                is_verified: driver.is_verified
            }
        });

    } catch (error) {
        console.error('Update driver profile error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update driver profile',
            details: error.message
        });
    }
};

// ============================================
// TOGGLE AVAILABILITY
// ============================================
exports.toggleAvailability = async (req, res) => {
    try {
        const userId = req.user.id;
        const { is_available } = req.body;

        const driver = await Driver.findOne({ where: { user_id: userId } });

        if (!driver) {
            return res.status(404).json({ 
                success: false,
                error: 'Driver profile not found' 
            });
        }

        const newStatus = is_available !== undefined ? is_available : !driver.is_available;
        
        await driver.update({ is_available: newStatus });

        res.json({
            success: true,
            message: newStatus ? 'You are now available for deliveries' : 'You are now offline',
            is_available: newStatus
        });

    } catch (error) {
        console.error('Toggle availability error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update availability',
            details: error.message
        });
    }
};

// ============================================
// UPDATE DRIVER LOCATION
// ============================================
exports.updateLocation = async (req, res) => {
    try {
        const userId = req.user.id;
        const { lat, lng } = req.body;

        if (!lat || !lng) {
            return res.status(400).json({ 
                success: false,
                error: 'Latitude and longitude are required' 
            });
        }

        const driver = await Driver.findOne({ where: { user_id: userId } });

        if (!driver) {
            return res.status(404).json({ 
                success: false,
                error: 'Driver profile not found' 
            });
        }

        await driver.update({
            current_lat: lat,
            current_lng: lng,
            location_updated_at: new Date()
        });

        res.json({
            success: true,
            message: 'Location updated successfully',
            location: {
                lat: driver.current_lat,
                lng: driver.current_lng,
                updated_at: driver.location_updated_at
            }
        });

    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to update location',
            details: error.message
        });
    }
};

// ============================================
// GET DRIVER STATS
// ============================================
exports.getDriverStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const driver = await Driver.findOne({ where: { user_id: userId } });

        if (!driver) {
            return res.status(404).json({ 
                success: false,
                error: 'Driver profile not found' 
            });
        }

        // Get delivery stats
        const totalDeliveries = await Delivery.count({ where: { driver_id: driver.id } });
        const completedDeliveries = await Delivery.count({ 
            where: { driver_id: driver.id, status: 'delivered' } 
        });
        const pendingDeliveries = await Delivery.count({ 
            where: { driver_id: driver.id, status: ['assigned', 'picked_up', 'in_transit'] } 
        });
        const failedDeliveries = await Delivery.count({ 
            where: { driver_id: driver.id, status: ['failed', 'cancelled'] } 
        });

        // Get earnings
        const totalEarnings = driver.total_earnings || 0;

        // Get today's deliveries
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayDeliveries = await Delivery.count({
            where: {
                driver_id: driver.id,
                created_at: { [Op.gte]: today }
            }
        });

        res.json({
            success: true,
            stats: {
                total_deliveries: totalDeliveries,
                completed_deliveries: completedDeliveries,
                pending_deliveries: pendingDeliveries,
                failed_deliveries: failedDeliveries,
                total_earnings: totalEarnings,
                today_deliveries: todayDeliveries,
                rating: driver.rating,
                acceptance_rate: driver.acceptance_rate,
                is_available: driver.is_available,
                is_verified: driver.is_verified
            }
        });

    } catch (error) {
        console.error('Get driver stats error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch driver stats',
            details: error.message
        });
    }
};

// ============================================
// GET ALL DRIVERS (Admin)
// ============================================
exports.getAllDrivers = async (req, res) => {
    try {
        const { is_available, is_verified, page = 1, limit = 20 } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (is_available !== undefined) where.is_available = is_available === 'true';
        if (is_verified !== undefined) where.is_verified = is_verified === 'true';

        const drivers = await Driver.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_image']
                }
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            total: drivers.count,
            pages: Math.ceil(drivers.count / limit),
            current_page: parseInt(page),
            drivers: drivers.rows
        });

    } catch (error) {
        console.error('Get all drivers error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch drivers',
            details: error.message
        });
    }
};

// ============================================
// VERIFY DRIVER (Admin)
// ============================================
exports.verifyDriver = async (req, res) => {
    try {
        const { id } = req.params;
        const { is_verified } = req.body;

        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ 
                success: false,
                error: 'Driver not found' 
            });
        }

        await driver.update({ is_verified: is_verified });

        // ✅ NOTIFICATION: Driver verification status
        await createNotification(
            driver.user_id,
            is_verified ? 'success' : 'warning',
            is_verified ? '✅ Driver Verified' : '❌ Driver Verification Failed',
            is_verified 
                ? 'Your driver account has been verified. You can now accept deliveries.'
                : 'Your driver account verification was not approved. Please contact support.',
            { driver_id: driver.id },
            '/driver/profile'
        );

        res.json({
            success: true,
            message: `Driver ${is_verified ? 'verified' : 'unverified'} successfully`,
            driver: {
                id: driver.id,
                user_id: driver.user_id,
                is_verified: driver.is_verified,
                is_available: driver.is_available
            }
        });

    } catch (error) {
        console.error('Verify driver error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to verify driver',
            details: error.message
        });
    }
};

// ============================================
// GET AVAILABLE DRIVERS (For Vendor Assignment)
// ============================================
exports.getAvailableDrivers = async (req, res) => {
    try {
        const drivers = await Driver.findAll({
            where: { 
                is_available: true,
                is_verified: true,
                is_active: true
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_image']
                }
            ],
            order: [['rating', 'DESC']]
        });

        // Format for vendor view
        const formattedDrivers = drivers.map(driver => ({
            id: driver.id,
            user_id: driver.user_id,
            name: `${driver.user?.first_name || ''} ${driver.user?.last_name || ''}`.trim() || 'Unknown Driver',
            email: driver.user?.email || '',
            phone: driver.user?.phone || driver.phone || '',
            profile_image: driver.user?.profile_image || null,
            vehicle_type: driver.vehicle_type,
            vehicle_plate: driver.vehicle_plate,
            rating: driver.rating,
            total_deliveries: driver.total_deliveries,
            acceptance_rate: driver.acceptance_rate,
            current_lat: driver.current_lat,
            current_lng: driver.current_lng,
            location_updated_at: driver.location_updated_at
        }));

        res.json({
            success: true,
            drivers: formattedDrivers,
            count: formattedDrivers.length
        });

    } catch (error) {
        console.error('Get available drivers error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch available drivers',
            details: error.message
        });
    }
};

// ============================================
// GET DRIVER BY ID (Admin/Vendor)
// ============================================
exports.getDriverById = async (req, res) => {
    try {
        const { id } = req.params;

        const driver = await Driver.findByPk(id, {
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'profile_image']
                }
            ]
        });

        if (!driver) {
            return res.status(404).json({ 
                success: false,
                error: 'Driver not found' 
            });
        }

        // Get delivery stats
        const totalDeliveries = await Delivery.count({ where: { driver_id: driver.id } });
        const completedDeliveries = await Delivery.count({ 
            where: { driver_id: driver.id, status: 'delivered' } 
        });
        const pendingDeliveries = await Delivery.count({ 
            where: { driver_id: driver.id, status: ['assigned', 'picked_up', 'in_transit'] } 
        });

        res.json({
            success: true,
            driver: {
                id: driver.id,
                user_id: driver.user_id,
                user: driver.user,
                vehicle_type: driver.vehicle_type,
                vehicle_plate: driver.vehicle_plate,
                vehicle_color: driver.vehicle_color,
                vehicle_model: driver.vehicle_model,
                is_available: driver.is_available,
                is_verified: driver.is_verified,
                is_active: driver.is_active,
                rating: driver.rating,
                total_deliveries: driver.total_deliveries,
                total_earnings: driver.total_earnings,
                acceptance_rate: driver.acceptance_rate,
                current_lat: driver.current_lat,
                current_lng: driver.current_lng,
                stats: {
                    total: totalDeliveries,
                    completed: completedDeliveries,
                    pending: pendingDeliveries
                }
            }
        });

    } catch (error) {
        console.error('Get driver by ID error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch driver',
            details: error.message
        });
    }
};

// ============================================
// DELETE DRIVER (Admin)
// ============================================
exports.deleteDriver = async (req, res) => {
    try {
        const { id } = req.params;

        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ 
                success: false,
                error: 'Driver not found' 
            });
        }

        await driver.destroy();

        res.json({
            success: true,
            message: 'Driver deleted successfully'
        });

    } catch (error) {
        console.error('Delete driver error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to delete driver',
            details: error.message
        });
    }
};