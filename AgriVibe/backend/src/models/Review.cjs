const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    order_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    is_verified_purchase: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_approved: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    helpful_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Review;