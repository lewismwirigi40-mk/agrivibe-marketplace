// backend/src/models/Notification.cjs
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Notification = sequelize.define('Notification', {
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
    // ============================================
    // ✅ REFERENCE TO RELATED ENTITIES
    // ============================================
    delivery_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'deliveries',
            key: 'id'
        },
        comment: 'Reference to delivery if notification is delivery-related'
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'orders',
            key: 'id'
        },
        comment: 'Reference to order if notification is order-related'
    },
    // ============================================
    // NOTIFICATION TYPE
    // ============================================
    type: {
        type: DataTypes.ENUM(
            'delivery_assigned',
            'delivery_picked_up',
            'delivery_in_transit',
            'delivery_delivered',
            'delivery_failed',
            'escrow_released',
            'order_placed',
            'order_processing',
            'order_completed',
            'order_cancelled',
            'payment_received',
            'payment_refunded',
            'vendor_approved',
            'driver_registered',
            'system',
            'info',
            'warning',
            'success'
        ),
        defaultValue: 'info',
        allowNull: false
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    // ============================================
    // ✅ ICON & COLOR (For UI Display)
    // ============================================
    icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: 'Bell',
        comment: 'Lucide icon name for UI'
    },
    color: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue: 'blue',
        comment: 'Color theme: blue, green, red, yellow, purple'
    },
    // ============================================
    // ✅ DATA PAYLOAD (JSON)
    // ============================================
    data: {
        type: DataTypes.JSONB,
        allowNull: true,
        comment: 'Additional data payload (order details, etc.)'
    },
    // ============================================
    // ✅ CHANNEL & STATUS
    // ============================================
    channel: {
        type: DataTypes.ENUM('in_app', 'email', 'sms', 'push'),
        defaultValue: 'in_app'
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    read_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    sent_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    // ============================================
    // ✅ ACTION LINK
    // ============================================
    link: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: 'URL to navigate to when notification is clicked'
    },
    // ============================================
    // ✅ ARCHIVE
    // ============================================
    is_archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Whether notification is archived'
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Notification;