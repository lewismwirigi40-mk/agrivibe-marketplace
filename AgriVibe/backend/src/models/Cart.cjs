const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.cjs');
const Product = require('./Product.cjs');

const Cart = sequelize.define('Cart', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    product_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'carts',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Define relationship
Cart.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(Cart, { foreignKey: 'product_id' });

module.exports = Cart;