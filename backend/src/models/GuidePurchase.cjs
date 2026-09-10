const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const GuidePurchase = sequelize.define('GuidePurchase', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    guide_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'guides',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_method: {
        type: DataTypes.ENUM('mpesa', 'card', 'wallet'),
        defaultValue: 'mpesa'
    },
    // ✅ CHANGE THIS: 'status' to 'payment_status'
    payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
        field: 'payment_status'
    },
    transaction_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    mpesa_code: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    download_token: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    download_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    downloaded_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    escrow_status: {
        type: DataTypes.ENUM('held', 'released', 'refunded'),
        defaultValue: 'held'
    },
    escrow_released_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    platform_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    vendor_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    vendor_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    order_number: {
        type: DataTypes.STRING(50),
        allowNull: true
    }
}, {
    tableName: 'guide_purchases',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = GuidePurchase;