const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Store = sequelize.define('Store', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    vendor_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    store_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    store_slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logo_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    banner_url: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    contact_email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    contact_phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    // ============================================
    // LOCATION FIELDS (Google Maps Integration)
    // ============================================
    address: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Store address'
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
        comment: 'Store latitude'
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
        comment: 'Store longitude'
    },
    // ============================================
    is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00
    },
    total_orders: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'stores',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Store;