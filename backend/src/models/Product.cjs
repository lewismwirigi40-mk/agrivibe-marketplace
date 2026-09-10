const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');
const OrderItem = require('./OrderItem.cjs');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    store_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    compare_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    cost_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    low_stock_threshold: {
        type: DataTypes.INTEGER,
        defaultValue: 5
    },
    unit: {
        type: DataTypes.STRING(50),
        defaultValue: 'piece'
    },
    images: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
    },
    category_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_digital: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    weight: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    weight_unit: {
        type: DataTypes.STRING(20),
        defaultValue: 'kg'
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    sales_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        defaultValue: 0.00
    },

    // ✅ ====== NEW DISCOUNT FIELDS ======

    original_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue: null,
        field: 'original_price',
        comment: 'Original price before discount (for crossed-out display)'
    },
    discount_percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'discount_percentage',
        comment: 'Discount percentage (e.g., 25 for 25% off)'
    },
    discount_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
        field: 'discount_expiry',
        comment: 'When the discount expires (for "2 days left" display)'
    },
    review_count: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: 'review_count',
        comment: 'Total number of reviews for this product'
    },

}, {
    tableName: 'products',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Product;