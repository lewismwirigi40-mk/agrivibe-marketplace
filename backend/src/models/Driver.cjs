const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Driver = sequelize.define('Driver', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    // ============================================
    // VEHICLE INFORMATION
    // ============================================
    vehicle_type: {
        type: DataTypes.ENUM('motorcycle', 'car', 'van', 'truck', 'bicycle'),
        defaultValue: 'motorcycle'
    },
    vehicle_plate: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    vehicle_color: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    vehicle_model: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    // ============================================
    // DRIVER STATUS
    // ============================================
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether driver is available for new deliveries'
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether driver has been verified by admin'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Whether driver account is active'
    },
    // ============================================
    // RATINGS & STATS
    // ============================================
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0,
        comment: 'Average rating from deliveries'
    },
    total_deliveries: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Total number of deliveries completed'
    },
    total_earnings: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        comment: 'Total money earned from deliveries'
    },
    acceptance_rate: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 100,
        comment: 'Percentage of deliveries accepted'
    },
    // ============================================
    // CURRENT LOCATION (Real-time)
    // ============================================
    current_lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
        comment: 'Driver\'s current latitude'
    },
    current_lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        comment: 'Driver\'s current longitude'
    },
    location_updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Last time location was updated'
    },
    // ============================================
    // LICENSE INFORMATION
    // ============================================
    license_number: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    license_expiry: {
        type: DataTypes.DATE,
        allowNull: true
    },
    license_image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    // ============================================
    // CONTACT INFORMATION
    // ============================================
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    emergency_contact: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    // ============================================
    // PROFILE
    // ============================================
    profile_image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // ============================================
    // AVAILABILITY SCHEDULE (JSON)
    // ============================================
    availability_schedule: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {
            monday: { start: '08:00', end: '18:00' },
            tuesday: { start: '08:00', end: '18:00' },
            wednesday: { start: '08:00', end: '18:00' },
            thursday: { start: '08:00', end: '18:00' },
            friday: { start: '08:00', end: '18:00' },
            saturday: { start: '09:00', end: '15:00' },
            sunday: { start: null, end: null }
        },
        comment: 'Weekly availability schedule'
    },
    // ============================================
    // PREFERRED AREAS (JSON)
    // ============================================
    preferred_areas: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [],
        comment: 'Areas where driver prefers to deliver'
    }
}, {
    tableName: 'drivers',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Driver;