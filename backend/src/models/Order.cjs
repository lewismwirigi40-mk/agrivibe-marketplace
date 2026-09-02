const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');
const OrderItem = require('./OrderItem.cjs');
const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    order_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    customer_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    store_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'pending'
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
        defaultValue: 'unpaid'
    },
    delivery_status: {
        type: DataTypes.ENUM('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'failed'),
        defaultValue: 'pending'
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    delivery_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    delivery_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    delivery_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    driver_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    scheduled_delivery: {
        type: DataTypes.DATE,
        allowNull: true
    },
    delivered_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    cancel_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    // ============================================
    // DELIVERY CODE FIELDS - CUSTOMER ONLY
    // ============================================
    delivery_code: {
        type: DataTypes.STRING(6),
        allowNull: true,
        comment: '6-digit code sent to customer only'
    },
    delivery_code_expires: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Code expires after 24 hours'
    },
    delivery_code_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Number of failed code attempts'
    },
    is_delivery_code_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'True when driver enters correct code'
    },
    // ============================================
    // ESCROW FIELDS
    // ============================================
    escrow_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        comment: 'Amount held in escrow'
    },
    escrow_status: {
        type: DataTypes.ENUM('pending', 'held', 'released', 'refunded'),
        defaultValue: 'pending',
        comment: 'Escrow status: pending, held, released, refunded'
    },
    escrow_released_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When escrow was released to vendor'
    },
    escrow_refunded_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'When escrow was refunded to customer'
    }
}, {
    tableName: 'orders',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Order;