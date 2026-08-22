const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Delivery = sequelize.define('Delivery', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
    },
    driver_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    pickup_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    delivery_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    pickup_lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    pickup_lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    delivery_lat: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },
    delivery_lng: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('assigned', 'picked_up', 'in_transit', 'delivered', 'failed', 'cancelled'),
        defaultValue: 'assigned'
    },
    distance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    delivery_fee: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    estimated_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Estimated time in minutes'
    },
    actual_time: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Actual time in minutes'
    },
    pickup_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    delivery_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    proof_image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    signature: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    driver_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    customer_notes: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'deliveries',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Delivery;