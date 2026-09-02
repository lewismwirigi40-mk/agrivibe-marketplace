// backend/src/models/Vendor.cjs
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Vendor = sequelize.define('Vendor', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    business_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    business_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    business_address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    business_phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    business_email: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    business_website: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    business_logo: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0
    },
    total_sales: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    approved_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    rejected_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'vendors',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Vendor;